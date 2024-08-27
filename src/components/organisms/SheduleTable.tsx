import React, { useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';

interface RowType {
  employeeName: string;
  schedules: { [key: string]: { shiftName: string; overtimeHours: number; isFixShift?: boolean; isFixOvertime?: boolean } };
}

interface ScheduleTableProps {
  schedules: OptimizedSchedule[];
  onFixShift: (updates: { date: string; employeeName: string; isFixShift: boolean; isFixOvertime: boolean }[]) => void;
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
        return schedule ? `${schedule.shiftName} / ${schedule.overtimeHours} ${schedule.isFixShift ? "(Fixed Shift)" : ""} ${schedule.isFixOvertime ? "(Fixed OT)" : ""}` : '';
      }
    }))
  ];

  const rows: RowType[] = Array.from(new Set(schedules.map(s => s.employee.employee_detail.name))).map(employeeName => {
    const employeeSchedules = schedules.filter(s => s.employee.employee_detail.name === employeeName);
    const scheduleMap = employeeSchedules.reduce((acc, schedule) => {
      acc[schedule.date.toString()] = {
        shiftName: schedule.shift.name,
        overtimeHours: schedule.overtime.overtime_hours,
        isFixShift: schedule.isFixShift,
        isFixOvertime: schedule.isFixOvertime
      };
      return acc;
    }, {} as { [key: string]: { shiftName: string; overtimeHours: number; isFixShift?: boolean; isFixOvertime?: boolean } });

    return {
      employeeName,
      schedules: scheduleMap
    };
  });

  const handleFixShift = (fixType: 'shift' | 'overtime' | 'none') => {
    console.log('cellSelection:', cellSelection);

    const updates = Object.keys(cellSelection).filter(key => cellSelection[key]).map(key => {
      const [employeeName, date] = key.split(',');
      const isFixShift = (fixType === 'shift') ? true : (fixType === 'none') ? false : rows.find(row => row.employeeName === employeeName)?.schedules[date].isFixShift || false;
      const isFixOvertime = (fixType === 'overtime') ? true : (fixType === 'none') ? false : rows.find(row => row.employeeName === employeeName)?.schedules[date].isFixOvertime || false;


      console.log("key", key)
      console.log("cellcelection", cellSelection[key])
      console.log("isFixShift", isFixShift)

      if (employeeName && date) {
        return { date, employeeName, isFixShift, isFixOvertime };
      } else {
        return null;
      }
    }).filter(update => update !== null);

    console.log('updates:', updates);
    if (updates.length > 0) {
      onFixShift(updates as { date: string; employeeName: string; isFixShift: boolean; isFixOvertime: boolean }[]);
    } else {
      console.log('No valid cell selections for fixing shift/overtime');
    }
  };

  const handleCellSelectionChange = (selection: { [key: string]: boolean }) => {

    console.log('newSelection:', selection);
    setCellSelection(selection);
    setSelectedCells(Object.keys(selection).filter(key => selection[key]));
  };

  return (
    <div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        <span style={{ margin: '10px' }}>
          {selectedCells.length === 0
            ? 'セル未選択'
            : `選択されたセル: ${selectedCells.length}`}
        </span>
        <button onClick={() => handleFixShift('shift')} className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2">シフト固定</button>
        <button onClick={() => handleFixShift('overtime')} className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2">残業固定</button>
        <button onClick={() => handleFixShift('none')} className="text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2">固定解除</button>
      </div>
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
