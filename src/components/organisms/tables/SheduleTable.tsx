import React, { useEffect, useRef, useState } from 'react';
import { RangeComponent, TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import { OptimizedSchedule } from '../../../types/OptimizedSchedule';
import { Icon } from '@iconify/react';
import { createRoot } from 'react-dom/client';
import { Manhour } from '../../../types/Manhour';
import { FixedShift } from '../../../types/FixedShift';
import { FixedOvertime } from '../../../types/FixedOvertime';

interface ScheduleTableProps {
  schedules: OptimizedSchedule[];
  manhours: Manhour[];
  fixedShifts: FixedShift[];
  fixedOvertimes: FixedOvertime[];
  onCellSelectionChange: (selectedCells: SelectedCell[]) => void;
}

// 選択されたセルの情報を管理するための型
export type SelectedCell = {
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


export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, manhours, fixedShifts, fixedOvertimes, onCellSelectionChange }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  const [localSchedules, setLocalSchedules] = useState<OptimizedSchedule[]>(schedules);
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [selectedCellCount, setSelectedCellCount] = useState<number>(0);

  useEffect(() => {
    setLocalSchedules(schedules);
  }, [schedules]);

  useEffect(() => {
    if (!tableRef.current) return;

    // 日付の一覧を取得
    const dates = Array.from(new Set(localSchedules.map(s => s.date.toString())));

    // テーブルに表示するデータを作る
    const tableData: TransformedRow[] = Array.from(new Set(localSchedules.map(s => s.employee.employee_detail.name))).map(employeeName => {
      const employeeSchedules = localSchedules.filter(s => s.employee.employee_detail.name === employeeName);
      const row: any = {
        employeeName: employeeName,
        totalWorkhours: employeeSchedules.reduce((sum, row) => sum + row.totalWorktimeHours, 0),
        totalOvertimes: employeeSchedules.reduce((sum, row) => sum + row.overtimeHours, 0),
      };

      employeeSchedules.forEach(schedule => {
        row[schedule.date.toString()] = {
          shiftName: schedule.shift.name,
          skillName: schedule.skill.name,
          overtimeHours: schedule.overtime.overtime_hours,
          isFixShift: schedule.isFixShift,
          isFixOvertime: schedule.isFixOvertime
        };
      });

      return row;
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
        onCellSelectionChange(newSelectedCells);
        console.log("setSelectedCells!", newSelectedCells);
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      table.destroy();
    };
  }, [localSchedules]);


  return (
    <div className="schedule-table-container">
      <span className='text-xl font-bold mb-5 block'>
        シフト表
      </span>
      <div ref={tableRef} className="w-full" />
    </div>
  );
};