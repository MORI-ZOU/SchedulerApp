import React, { useEffect, useState } from 'react';
import { useOptimizeSchedule } from '../hooks/useOptimizeSchedule';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';
import { ScheduleTable } from '../organisms/tables/SheduleTable';
import { toast } from 'react-toastify';
import { useFixSchedule } from '../hooks/useFixSchedule';
import { FixedShift } from '../../types/FixedShift';
import { FixedOvertime } from '../../types/FixedOvertime';
import OptimizeModal from '../organisms/OptimizeModal';
import { OptimizeParameter } from '../../types/OptimizeParameter';
import { useLogin } from '../hooks/useLogin';

type Props = {
  date: string;
  employeeName: string;
  isFixShift: boolean;
  isFixOvertime: boolean;
}

export const OptimizedSchedulePage: React.FC = () => {
  const { databaseInfo } = useLogin();
  const { getSchedules, Optimize, schedules, loading } = useOptimizeSchedule();
  const { getFixedShifts, saveFixedShifts, deleteFixedShifts, getFixedOvertimes, saveFixedOvertimes, deleteFixedOvertimes, loading: fixScheduleLoading, fixedShifts, fixedOvertimes } = useFixSchedule();
  const [localSchedules, setLocalSchedules] = useState<OptimizedSchedule[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

  useEffect(() => {
    getFixedShifts();
    getFixedOvertimes();
  }, [getFixedShifts, getFixedOvertimes])

  useEffect(() => {
    if (schedules) {
      setLocalSchedules(schedules);
    }
  }, [schedules]);

  const initialOptimizeParam: OptimizeParameter = {
    database_id: databaseInfo!.id,
    dont_assign_too_much_overtime_in_day: true,
    dont_assign_off_shift_if_work_day: true,
    assign_fix_schedule_if_exists: true,
    dont_assign_invalid_shift: true,
    dont_assign_invalid_skill: true,
    assign_only_one_kind_of_shift_and_skill_in_cycle: true,
    dont_assign_prohibited_shift_transition: true,
    assign_off_shift_at_least_one_in_cycle: true,
    assign_appropriate_shift_and_overtime_for_man_hours: true,
    assign_appropriate_shift_and_overtime_for_man_hours_min: true,
    assign_appropriate_shift_and_overtime_for_man_hours_max: true,
    assign_appropriate_shift_and_overtime_for_man_hours_min_tolerance: 0,
    assign_appropriate_shift_and_overtime_for_man_hours_max_tolerance: 0,
    dont_assign_too_much_overtime_in_month: true
  }

  const handleFixShift = (updates: Array<Props>) => {
    toast.success("選択されたセルを固定しました。")
    const newFixedShift: FixedShift[] = [];
    const delFixedShift: FixedShift[] = [];
    const newFixedOvertime: FixedOvertime[] = [];
    const delFixedOvertime: FixedOvertime[] = [];

    // スケジュールを更新し、状態変化を検出
    const newSchedules = localSchedules.map(schedule => {
      const update = updates.find(up => up.date === schedule.date.toString() && up.employeeName === schedule.employee.employee_detail.name);

      if (update) {
        // isFixShift の状態変化を検出
        if (!schedule.isFixShift && update.isFixShift) {
          // false → true に変化した場合、追加対象
          newFixedShift.push({
            date: schedule.date,
            employee_id: schedule.employee.employee_detail.id,
            skill_id: schedule.skill.id,
            shift_id: schedule.shift.id,
          });
        } else if (schedule.isFixShift && !update.isFixShift) {
          // true → false に変化した場合、削除対象
          delFixedShift.push({
            date: schedule.date,
            employee_id: schedule.employee.employee_detail.id,
            skill_id: schedule.skill.id,
            shift_id: schedule.shift.id,
          });
        }

        // isFixOvertime の状態変化を検出
        if (!schedule.isFixOvertime && update.isFixOvertime) {
          // false → true に変化した場合、追加対象
          newFixedOvertime.push({
            date: schedule.date,
            employee_id: schedule.employee.employee_detail.id,
            overtime_id: schedule.overtime.id,
          });
        } else if (schedule.isFixOvertime && !update.isFixOvertime) {
          // true → false に変化した場合、削除対象
          delFixedOvertime.push({
            date: schedule.date,
            employee_id: schedule.employee.employee_detail.id,
            overtime_id: schedule.overtime.id,
          });
        }

        // スケジュールを更新
        return { ...schedule, isFixShift: update.isFixShift, isFixOvertime: update.isFixOvertime };
      }

      return schedule;
    });

    console.log("updateLocalSchedules", newSchedules);
    setLocalSchedules(newSchedules);

    // fixedShift を更新（追加）
    if (newFixedShift.length > 0) {
      console.log("saveFixedShift", newFixedShift);
      saveFixedShifts(newFixedShift);
    }

    // 必要なくなった fixedShift を削除
    if (delFixedShift.length > 0) {
      console.log("deleteFixedShift", delFixedShift);
      deleteFixedShifts(delFixedShift);
    }

    // fixedOvertime を更新（追加）
    if (newFixedOvertime.length > 0) {
      console.log("saveFixedOvertime", newFixedOvertime);
      saveFixedOvertimes(newFixedOvertime);
    }

    // 必要なくなった fixedOvertime を削除
    if (delFixedOvertime.length > 0) {
      console.log("deleteFixedOvertime", delFixedOvertime);
      deleteFixedOvertimes(delFixedOvertime);
    }
  };

  const onClickOptimize = () => {
    openModal();
  }

  const onClickSaveModal = ((value: OptimizeParameter) => {
    Optimize(value);
  })

  if (loading) return <div>Loading...</div>;

  return (
    <>
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
      <OptimizeModal
        isOpen={isModalOpen}
        initialOptimizeParam={initialOptimizeParam}
        onRequestClose={closeModal}
        onSave={onClickSaveModal}
      />
    </>
  );
};
