import React, { useEffect, useRef, useState } from 'react';
import { RangeComponent, TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import { OptimizedSchedule } from '../../../types/OptimizedSchedule';
import { Icon } from '@iconify/react';
import { createRoot } from 'react-dom/client';


interface ScheduleTableProps {
  schedules: OptimizedSchedule[];
  onFixShift: (updates: { date: string; employeeName: string; isFixShift: boolean; isFixOvertime: boolean }[]) => void;
}

// 選択されたセルの情報を管理するための型
type SelectedCell = {
  employeeName: string;
  date: string;
}

type TransformedRow = {
  shiftName: string;
  overtimeHours: number;
  isFixShift: boolean;
  isFixOvertime: boolean;
  [date: string]: any; // 動的な日付フィールド
}


export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onFixShift }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [localSchedules, setLocalSchedules] = useState<OptimizedSchedule[]>(schedules);
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [selectedCellCount, setSelectedCellCount] = useState<number>(0);

  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules])


  useEffect(() => {
    if (!tableRef.current) return;

    // 日付の一覧を取得
    const dates = Array.from(new Set(schedules.map(s => s.date.toString())));

    // テーブルに表示するデータを作る
    const tableData: TransformedRow[] = Array.from(new Set(localSchedules.map(s => s.employee.employee_detail.name))).map(employeeName => {
      const employeeSchedules = localSchedules.filter(s => s.employee.employee_detail.name === employeeName);
      const row: any = {
        employeeName: employeeName,
        totalWorkhours: employeeSchedules.reduce((sum, row) => sum + row.totalWorktimeHours, 0),
        totalOvertimes: employeeSchedules.reduce((sum, row) => sum + row.overtimeHours, 0),
      };
      console.log("schedule", localSchedules)

      employeeSchedules.forEach(schedule => {
        row[schedule.date.toString()] = {
          shiftName: schedule.shift.name,
          skillName: schedule.skill.name,
          overtimeHours: schedule.overtime.overtime_hours,
          isFixShift: schedule.isFixShift,
          isFixOvertime: schedule.isFixOvertime
        };
      });

      console.log("rows", row)
      return row;
    });

    //各日付の勤務時間合計と残業合計のデータを追加
    dates.forEach(date => {
      const dateColumn = tableData.filter(s => s[date] != null);
      console.log(`${date}日の勤務情報`, dateColumn);

    });


    const columns = [
      {
        title: "従業員名",
        field: "employeeName",
        width: 150,
        frozen: true,
        headerSort: false
      },
      {
        title: "合計労働時間",
        field: "totalWorkhours",
        headerSort: false
      },
      {
        title: "合計残業時間",
        field: "totalOvertimes",
        headerSort: false

      },
      ...dates.map(date => ({
        title: date,
        field: date,
        // frozen: true,
        clipboard: true,
        headerSort: false,
        formatter: function (cell: any) {
          const cellValue = cell.getValue();

          // HTML要素を作成
          const div = document.createElement('div');
          div.className = 'flex items-center gap-1';

          const shiftSpan = document.createElement('span');
          shiftSpan.textContent = `${cellValue.shiftName}(${cellValue.skillName})/${cellValue.overtimeHours}`;
          div.appendChild(shiftSpan);

          if (cellValue.isFixShift) {
            const iconContainer = document.createElement('div');
            createRoot(iconContainer).render(
              <Icon icon="mdi:lock" className="text-blue-500" width="14" height="14" />
            );
            div.appendChild(iconContainer);
          }

          if (cellValue.isFixOvertime) {
            const iconContainer = document.createElement('div');
            createRoot(iconContainer).render(
              <Icon icon="mdi:lock" className="text-green-500" width="14" height="14" />
            );
            div.appendChild(iconContainer);
          }

          return div;
        }
      })),
    ]

    const table = new Tabulator(tableRef.current, {
      height: "40vh",
      // selectable: true,
      selectableRange: true,
      selectableRangeColumns: true,
      data: tableData,
      columns: columns,
    });

    // セル選択イベントのハンドリング
    table.on("rangeChanged", function (range) {
      try {
        console.log("range changed!!");

        const cells = range.getCells().flat();
        console.log("Flattened cells array:", cells);

        const newSelectedCells: SelectedCell[] = cells.map(cell => {
          if (cell.getRow && cell.getRow().getData) {
            const field = cell.getField();
            const rowData = cell.getRow().getData();
            return {
              employeeName: rowData.employeeName,
              date: field,
            };
          }
          return null;
        }).filter((item): item is SelectedCell => item !== null);

        setSelectedCellCount(cells.length);
        setSelectedCells(newSelectedCells);
        console.log("setSelectedCells!", newSelectedCells);
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      table.destroy();
      console.log("table destroyed")
    };
  }, [localSchedules]);

  const handleFixShift = (fixType: 'shift' | 'overtime' | 'none') => {
    if (selectedCellCount < 1) {
      return;
    }

    console.log("fixed:", fixType, selectedCells)

    const updates = selectedCells.map(cell => {
      const currentSchedule = localSchedules.find(s =>
        s.date.toString() === cell.date &&
        s.employee.employee_detail.name === cell.employeeName
      );

      if (!currentSchedule) {
        return null; // スケジュールが見つからない場合のエラーハンドリング
      }

      // fixType に基づいてフラグを設定
      const isFixShift = fixType === 'shift' ? true
        : fixType === 'none' ? false
          : currentSchedule.isFixShift;

      const isFixOvertime = fixType === 'overtime' ? true
        : fixType === 'none' ? false
          : currentSchedule.isFixOvertime;

      return {
        date: cell.date,
        employeeName: cell.employeeName,
        isFixShift: isFixShift,
        isFixOvertime: isFixOvertime
      };
    }).filter(update => update !== null); // null のエントリを削除

    console.log(updates);

    if (updates.length > 0) {
      onFixShift(updates);
    }
  };

  return (
    <div className="schedule-table-container">
      <div className='flex justify-end gap-1 mb-1'>
        <span className="cell-count">
          {selectedCellCount === 0
            ? 'セル未選択'
            : `選択されたセル: ${selectedCells.length}`}
        </span>
        <button
          onClick={() => handleFixShift('shift')}
          className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
        >
          シフト固定
        </button>
        <button
          onClick={() => handleFixShift('overtime')}
          className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2"
        >
          残業固定
        </button>
        <button
          onClick={() => handleFixShift('none')}
          className="text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2"
        >
          固定解除
        </button>
      </div>
      <span className='text-xl font-bold mb-5'>
        シフト表
      </span>
      <div ref={tableRef} className="w-full" />
      <span className='text-xl font-bold mb-5'>
        集計
      </span>
    </div>
  );
};

// import React, { useCallback, useState } from 'react';
// import { TabulatorFull as Tabulator } from 'tabulator-tables';
// import "tabulator-tables/dist/css/tabulator.min.css";
// import { OptimizedSchedule } from '../../types/OptimizedSchedule';

// interface RowType {
//   employeeName: string;
//   schedules: { [key: string]: { shiftName: string; overtimeHours: number; isFixShift?: boolean; isFixOvertime?: boolean } };
// }

// interface ScheduleTableProps {
//   schedules: OptimizedSchedule[];
//   onFixShift: (updates: { date: string; employeeName: string; isFixShift: boolean; isFixOvertime: boolean }[]) => void;
// }

// export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onFixShift }) => {
//   const [cellSelection, setCellSelection] = useState<{ [key: string]: boolean }>({});
//   const [selectedCells, setSelectedCells] = useState<string[]>([]);

//   const dates = Array.from(new Set(schedules.map(s => s.date.toString())));

//   const columns = [
//     { name: 'employeeName', header: 'Employee', defaultFlex: 1 },
//     ...dates.map(date => ({
//       name: date,
//       header: date,
//       defaultFlex: 2,
//       render: ({ data }: { data: RowType }) => {
//         const schedule = data.schedules[date];
//         return schedule ? `${schedule.shiftName} / ${schedule.overtimeHours} ${schedule.isFixShift ? "(Fixed Shift)" : ""} ${schedule.isFixOvertime ? "(Fixed OT)" : ""}` : '';
//       }
//     }))
//   ];

//   const rows: RowType[] = Array.from(new Set(schedules.map(s => s.employee.employee_detail.name))).map(employeeName => {
//     const employeeSchedules = schedules.filter(s => s.employee.employee_detail.name === employeeName);
//     const scheduleMap = employeeSchedules.reduce((acc, schedule) => {
//       acc[schedule.date.toString()] = {
//         shiftName: schedule.shift.name,
//         overtimeHours: schedule.overtime.overtime_hours,
//         isFixShift: schedule.isFixShift,
//         isFixOvertime: schedule.isFixOvertime
//       };
//       return acc;
//     }, {} as { [key: string]: { shiftName: string; overtimeHours: number; isFixShift?: boolean; isFixOvertime?: boolean } });

//     return {
//       employeeName,
//       schedules: scheduleMap
//     };
//   });

//   const handleFixShift = (fixType: 'shift' | 'overtime' | 'none') => {
//     console.log('cellSelection:', cellSelection);

//     const updates = Object.keys(cellSelection).filter(key => cellSelection[key]).map(key => {
//       const [employeeName, date] = key.split(',');
//       const isFixShift = (fixType === 'shift') ? true : (fixType === 'none') ? false : rows.find(row => row.employeeName === employeeName)?.schedules[date].isFixShift || false;
//       const isFixOvertime = (fixType === 'overtime') ? true : (fixType === 'none') ? false : rows.find(row => row.employeeName === employeeName)?.schedules[date].isFixOvertime || false;


//       console.log("key", key)
//       console.log("cellcelection", cellSelection[key])
//       console.log("isFixShift", isFixShift)

//       if (employeeName && date) {
//         return { date, employeeName, isFixShift, isFixOvertime };
//       } else {
//         return null;
//       }
//     }).filter(update => update !== null);

//     console.log('updates:', updates);
//     if (updates.length > 0) {
//       onFixShift(updates as { date: string; employeeName: string; isFixShift: boolean; isFixOvertime: boolean; }[]);
//     } else {
//       console.log('No valid cell selections for fixing shift/overtime');
//     }
//   };

//   const handleCellSelectionChange = useCallback((selection: { [key: string]: boolean }) => {

//     console.log('newSelection:', selection);
//     setCellSelection(selection);
//     setSelectedCells(Object.keys(selection).filter(key => selection[key]));
//   }, []);

//   return (
//     <div>
//       <div className='flex justify-end gap-1 mb-1'>
//         <span className='m-1'>
//           {selectedCells.length === 0
//             ? 'セル未選択'
//             : `選択されたセル: ${selectedCells.length}`}
//         </span>
//         <button onClick={() => handleFixShift('shift')} className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2">シフト固定</button>
//         <button onClick={() => handleFixShift('overtime')} className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2">残業固定</button>
//         <button onClick={() => handleFixShift('none')} className="text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2">固定解除</button>
//       </div>
//       <ReactDataGrid
//         idProperty="employeeName"
//         columns={columns}
//         style={{ minHeight: 800 }}
//         dataSource={rows}
//         cellSelection={cellSelection}
//         onCellSelectionChange={handleCellSelectionChange}
//         columnMinWidth={130}
//       />
//     </div>
//   );
// };
