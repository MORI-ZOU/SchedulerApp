import React, { useEffect, useState, useMemo } from 'react';
import { OptimizedSchedule } from '../../../types/OptimizedSchedule';
import { Manhour } from '../../../types/Manhour';

interface SummaryScheduleTableProps {
  schedules: OptimizedSchedule[];
  manhours: Manhour[];
}

type SummaryData = {
  totalWorkhours: number;
  totalOvertimes: number;
  totalRequiredHours: number;
  totalDifference: number;
  dailySummary: Array<{
    date: string;
    totalWorkhours: number;
    totalOvertimes: number;
    requiredHours: number;
    difference: number;
  }>;
};

export const SummaryScheduleTable: React.FC<SummaryScheduleTableProps> = ({ schedules, manhours }) => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    totalWorkhours: 0,
    totalOvertimes: 0,
    totalRequiredHours: 0,
    totalDifference: 0,
    dailySummary: []
  });

  // 集計データの計算用useEffect
  useEffect(() => {
    if (schedules.length === 0) return;

    const dates = Array.from(new Set(schedules.map(s => s.date.toString())));

    // 従業員別データの作成
    const employeeData = Array.from(new Set(schedules.map(s => s.employee.employee_detail.name))).map(employeeName => {
      const employeeSchedules = schedules.filter(s => s.employee.employee_detail.name === employeeName);
      return {
        employeeName,
        totalWorkhours: employeeSchedules.reduce((sum, row) => sum + row.totalWorktimeHours, 0),
        totalOvertimes: employeeSchedules.reduce((sum, row) => sum + row.overtimeHours, 0)
      };
    });

    // 全体の集計データを計算
    const totalWorkhours = employeeData.reduce((sum, employee) => sum + employee.totalWorkhours, 0);
    const totalOvertimes = employeeData.reduce((sum, employee) => sum + employee.totalOvertimes, 0);

    // 各日付毎の集計データを計算
    const dailySummary = dates.map(date => {
      const dateSchedules = schedules.filter(s => s.date.toString() === date);
      const totalWorkhoursForDate = dateSchedules.reduce((sum, s) => sum + s.totalWorktimeHours, 0);
      const totalOvertimesForDate = dateSchedules.reduce((sum, s) => sum + s.overtimeHours, 0);

      // 該当日の必要工数を計算
      const requiredHoursForDate = manhours
        .filter(m => m.date.toString() === date)
        .reduce((sum, m) => sum + m.required_hours, 0);

      const differenceFromRequired = totalWorkhoursForDate - requiredHoursForDate;

      return {
        date,
        totalWorkhours: totalWorkhoursForDate,
        totalOvertimes: totalOvertimesForDate,
        requiredHours: requiredHoursForDate,
        difference: differenceFromRequired
      };
    });

    // 全期間の必要工数合計を計算
    const totalRequiredHours = manhours.reduce((sum, m) => sum + m.required_hours, 0);
    const totalDifference = totalWorkhours - totalRequiredHours;

    // 集計データをステートに保存
    setSummaryData({
      totalWorkhours,
      totalOvertimes,
      totalRequiredHours,
      totalDifference,
      dailySummary
    });
  }, [schedules, manhours]);

  return (
    <div className="mt-6">
      <span className='text-xl font-bold mb-3 block'>
        集計
      </span>

      {/* 全体集計 */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-semibold mb-2">全体集計</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-600">合計労働時間</div>
            <div className="text-xl font-bold text-blue-600">{summaryData.totalWorkhours.toFixed(1)}h</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-600">合計残業時間</div>
            <div className="text-xl font-bold text-green-600">{summaryData.totalOvertimes.toFixed(1)}h</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-600">必要工数合計</div>
            <div className="text-xl font-bold text-purple-600">{summaryData.totalRequiredHours.toFixed(1)}h</div>
          </div>
          <div className="bg-white p-3 rounded shadow">
            <div className="text-sm text-gray-600">工数差分</div>
            <div className={`text-xl font-bold ${summaryData.totalDifference >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
              {summaryData.totalDifference >= 0 ? '+' : ''}{summaryData.totalDifference.toFixed(1)}h
            </div>
          </div>
        </div>
      </div>

      {/* 日別集計 */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">日別集計</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">日付</th>
                <th className="px-4 py-2 text-right">実働時間</th>
                <th className="px-4 py-2 text-right">残業時間</th>
                <th className="px-4 py-2 text-right">必要工数</th>
                <th className="px-4 py-2 text-right">工数差分</th>
              </tr>
            </thead>
            <tbody>
              {summaryData.dailySummary.map((summary, index) => (
                <tr key={summary.date} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-4 py-2 font-medium">{summary.date}</td>
                  <td className="px-4 py-2 text-right">{summary.totalWorkhours.toFixed(1)}h</td>
                  <td className="px-4 py-2 text-right">{summary.totalOvertimes.toFixed(1)}h</td>
                  <td className="px-4 py-2 text-right">{summary.requiredHours.toFixed(1)}h</td>
                  <td className={`px-4 py-2 text-right font-semibold ${summary.difference >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {summary.difference >= 0 ? '+' : ''}{summary.difference.toFixed(1)}h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};