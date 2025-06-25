import React, { useEffect, useRef, useState } from 'react';
import { RangeComponent, TabulatorFull as Tabulator } from 'tabulator-tables';
import "tabulator-tables/dist/css/tabulator.min.css";
import { OptimizedSchedule } from '../../../types/OptimizedSchedule';
import { Icon } from '@iconify/react';
import { createRoot } from 'react-dom/client';
import { Manhour } from '../../../types/Manhour';
import { FixedShift } from '../../../types/FixedShift';
import { FixedOvertime } from '../../../types/FixedOvertime';
import { HeaderLayout } from '../../templates/HeaderLayout';

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
        // fixedShiftsから該当するエントリを検索
        const isFixedShift = fixedShifts.some(fixedShift =>
          fixedShift.date.toString() === schedule.date.toString() &&
          fixedShift.employee_id === schedule.employee.employee_detail.id &&
          fixedShift.skill_id === schedule.skill.id &&
          fixedShift.shift_id === schedule.shift.id
        );

        // fixedOvertimesから該当するエントリを検索
        const isFixedOvertime = fixedOvertimes.some(fixedOvertime =>
          fixedOvertime.date.toString() === schedule.date.toString() &&
          fixedOvertime.employee_id === schedule.employee.employee_detail.id &&
          fixedOvertime.overtime_id === schedule.overtime.id
        );

        row[schedule.date.toString()] = {
          shiftName: schedule.shift.name,
          skillName: schedule.skill.name,
          overtimeHours: schedule.overtime.overtime_hours,
          isFixShift: schedule.isFixShift || isFixedShift,
          isFixOvertime: schedule.isFixOvertime || isFixedOvertime,
          shiftColor: schedule.shift.color.toString(),
          skillColor: schedule.skill.color.toString(),
          overtimeColor: schedule.overtime.color.toString()
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
        headerSort: false,
        headerVertical: true,
        titleFormatter: "html",
        titleFormatterParams: { style: "text-align: center;" }
      },
      {
        title: "合計労働時間",
        field: "totalWorkhours",
        headerSort: false,
        headerVertical: true,
        titleFormatter: "html",
        titleFormatterParams: { style: "text-align: center;" }
      },
      {
        title: "合計残業時間",
        field: "totalOvertimes",
        headerSort: false,
        headerVertical: true,
        titleFormatter: "html",
        titleFormatterParams: { style: "text-align: center;" }
      },
      ...dates.map(date => ({
        title: date,
        field: date,
        // frozen: true,
        clipboard: true,
        headerSort: false,
        headerHozAlign: "center",
        headerVertAlign: "middle",

        formatter: function (cell: any) {
          const cellValue = cell.getValue();
          // HTML要素を作成
          const div = document.createElement('div');
          div.className = 'flex items-center gap-1 p-2 rounded';

          // ShiftTypeの色で縁取りを設定
          if (cellValue.shiftColor) {
            div.style.border = `3px solid ${cellValue.shiftColor}`;
            div.style.margin = '1px';
            div.style.height = '100%';
            div.style.boxSizing = 'border-box';
          }

          // Shift名のスパン（Shiftの色）
          const shiftSpan = document.createElement('span');
          shiftSpan.textContent = cellValue.shiftName;
          shiftSpan.style.color = cellValue.shiftColor;
          shiftSpan.style.fontWeight = 'bold';
          div.appendChild(shiftSpan);

          // 括弧開始
          const openParen = document.createElement('span');
          openParen.textContent = '(';
          div.appendChild(openParen);

          // Skill名のスパン（Skillの色）
          const skillSpan = document.createElement('span');
          skillSpan.textContent = cellValue.skillName;
          skillSpan.style.color = cellValue.skillColor;
          skillSpan.style.fontWeight = 'bold';
          div.appendChild(skillSpan);

          // 括弧閉じとスラッシュ
          const closeParen = document.createElement('span');
          closeParen.textContent = ')/';
          div.appendChild(closeParen);

          // Overtime時間のスパン（Overtimeの色）
          const overtimeSpan = document.createElement('span');
          overtimeSpan.textContent = cellValue.overtimeHours.toString();
          overtimeSpan.style.color = cellValue.overtimeColor;
          overtimeSpan.style.fontWeight = 'bold';
          div.appendChild(overtimeSpan);

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
  }, [localSchedules, fixedShifts, fixedOvertimes]);


  return (
    <div className="schedule-table-container">
      <span className='text-xl font-bold mb-5 block'>
        シフト表
      </span>
      <div ref={tableRef} className="w-full" />
    </div>
  );
};