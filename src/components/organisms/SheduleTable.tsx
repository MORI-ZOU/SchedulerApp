// ShiftTable.tsx
import React from 'react';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';
import { DateOnly } from '../../types/DateOnly';

interface Props {
    optimizedSchedules: OptimizedSchedule[];
}

// 文字列表現を用いてDateOnlyをユニークにするための関数
const getUniqueDates = (dates: DateOnly[]): DateOnly[] => {
    // 日付の文字列表現のSetを作成
    const uniqueDateStrings = new Set(dates.map(date => date.toString()));
    // 日付の文字列表現からDateOnlyオブジェクトを生成
    const uniqueDates = Array.from(uniqueDateStrings).map(dateStr => DateOnly.fromString(dateStr));
    return uniqueDates;
}

export const ScheduleTable: React.FC<Props> = ({ optimizedSchedules }) => {
    // 日付のリストをユニークにする
    // const dates = Array.from(new Set(optimizedSchedules.map(schedule => schedule.date))).sort();
    const dates = getUniqueDates(optimizedSchedules.map((s) => s.date))
    const employees = Array.from(new Set(optimizedSchedules.map(schedule => schedule.employee)));
    console.log(dates)
    console.log(employees)

    // シフトを従業員IDと日付でマッピング
    const shiftMap = new Map<string, Map<string, OptimizedSchedule>>();
    optimizedSchedules.forEach(schedule => {
        const { employee, date } = schedule;
        if (!shiftMap.has(employee.employee_detail.id)) {
            shiftMap.set(employee.employee_detail.id, new Map());
        }
        shiftMap.get(employee.employee_detail.id)?.set(date.toString(), schedule);
    });

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                        {dates.map(date => (
                            <th key={date.toString()} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {date.toString()}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map(employee => (
                        <tr key={employee.employee_detail.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{employee.employee_detail.name}</td>
                            {dates.map(date => {
                                const schedule = shiftMap.get(employee.employee_detail.id)?.get(date.toString());
                                return (
                                    <td key={date.toString()} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {schedule ? (
                                            <>
                                                <div style={{ color: schedule.shift.color.toString() }}>{schedule.shift.name}</div>
                                                <div style={{ color: schedule.overtime.color.toString() }}>{schedule.overtimeHours} hours</div>
                                            </>
                                        ) : (
                                            <div>No shift</div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
