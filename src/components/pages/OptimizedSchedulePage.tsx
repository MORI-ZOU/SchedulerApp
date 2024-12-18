import React, { useEffect, useState } from 'react';
import { useOptimizeSchedule } from '../hooks/useOptimizeSchedule';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';
import { ScheduleTable } from '../organisms/SheduleTable';
import { toast } from 'react-toastify';

type Props = {
  date: string;
  employeeName: string;
  isFixShift: boolean;
}

export const OptimizedSchedulePage: React.FC = () => {
  const { getSchedules, Optimize, schedules, loading } = useOptimizeSchedule();
  const [localSchedules, setLocalSchedules] = useState<OptimizedSchedule[]>([]);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

  useEffect(() => {
    if (schedules) {
      setLocalSchedules(schedules);
    }
  }, [schedules]);

  const handleFixShift = (updates: Array<Props>) => {
    toast.success("選択されたセルのシフトを固定しました。")

    const updatedSchedules = localSchedules.map(schedule => {
      const update = updates.find(u => u.date === schedule.date.toString() && u.employeeName === schedule.employee.employee_detail.name);
      if (update) {
        return { ...schedule, isFixShift: update.isFixShift };
      }
      return schedule;
    });
    setLocalSchedules(updatedSchedules);
    // ここでバックエンドに更新を送信するコードを追加する(今度)


  };

  const onClickOptimize = () => {
    Optimize();
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className='px-20 py-2'>
      <ScheduleTable schedules={localSchedules} onFixShift={handleFixShift} />
      <div className="flex justify-end w-full px-4 py-4 gap-1">
        <button
          onClick={onClickOptimize}
          className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
        >
          シフト生成
        </button>
      </div>
    </div>

  );
};
