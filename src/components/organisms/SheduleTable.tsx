import React, { useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';

interface RowType {
  employeeName: string;
  schedules: { [key: string]: { shiftName: string; overtimeHours: number; isFixShift?: boolean } };
}

interface ScheduleTableProps {
  schedules: OptimizedSchedule[];
  onFixShift: (updates: { date: string; employeeName: string; isFixShift: boolean }[]) => void;
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedules, onFixShift }) => {
  const [cellSelection, setCellSelection] = useState<{ [key: string]: boolean }>({});
  const [selectedCells, setSelectedCells] = useState<string[]>([]);

  const dates = Array.from(new Set(schedules.map(s => s.date.toString())));

  const columns = [
    { name: 'employeeName', header: 'Employee', defaultFlex: 1 },
    ...dates.map(date => ({
      name: date,
      header: date,
      defaultFlex: 1,
      render: ({ data }: { data: RowType }) => {
        const schedule = data.schedules[date];
        return schedule ? `${schedule.shiftName} / ${schedule.overtimeHours} ${schedule.isFixShift ? "(Fixed)" : ""}` : '';
      }
    }))
  ];

  const rows: RowType[] = Array.from(new Set(schedules.map(s => s.employee.employee_detail.name))).map(employeeName => {
    const employeeSchedules = schedules.filter(s => s.employee.employee_detail.name === employeeName);
    const scheduleMap = employeeSchedules.reduce((acc, schedule) => {
      acc[schedule.date.toString()] = {
        shiftName: schedule.shift.name,
        overtimeHours: schedule.overtime.overtime_hours,
        isFixShift: schedule.isFixShift
      };
      return acc;
    }, {} as { [key: string]: { shiftName: string; overtimeHours: number; isFixShift?: boolean } });

    return {
      employeeName,
      schedules: scheduleMap
    };
  });

  const handleFixShift = () => {
    const updates = Object.keys(cellSelection).map(key => {
      const [row, col] = key.split(',');
      const date = col;
      const employeeName = rows[parseInt(row)].employeeName;
      return { date, employeeName, isFixShift: true };
    });

    console.log(updates)
    onFixShift(updates);
  };

  const handleCellSelectionChange = (selection: { [key: string]: boolean }) => {
    setCellSelection(selection);
    setSelectedCells(Object.keys(selection).filter(key => selection[key]));
  };

  return (
    <div>
        <span style={{ margin: '10px' }}>
        {selectedCells.length === 0
          ? 'セル未選択'
          : `選択されたセル: ${selectedCells.length}`}
      </span>
      <button onClick={handleFixShift} className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2">シフト固定</button>
      <ReactDataGrid
        idProperty="employeeName"
        columns={columns}
        dataSource={rows}
        style={{ minHeight: 500 }}
        cellSelection={cellSelection}
        onCellSelectionChange={handleCellSelectionChange}
      />
    </div>
  );
};
