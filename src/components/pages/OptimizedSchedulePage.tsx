import React, { useEffect, useState } from 'react';
import { useOptimizeSchedule } from '../hooks/useOptimizeSchedule';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';
import { ScheduleTable, SelectedCell } from '../organisms/tables/SheduleTable';
import { SummaryScheduleTable } from '../organisms/tables/SummaryScheduleTable';
import { toast } from 'react-toastify';
import { useFixSchedule } from '../hooks/useFixSchedule';
import { FixedShift } from '../../types/FixedShift';
import { FixedOvertime } from '../../types/FixedOvertime';
import OptimizeModal from '../organisms/OptimizeModal';
import { OptimizeParameter } from '../../types/OptimizeParameter';
import { useLogin } from '../hooks/useLogin';
import { useManhours } from '../hooks/useManhours';
import Lottie from 'lottie-react';
import loadingEarthAnimation from '../../assets/loading_earth.json';

type Props = {
  date: string;
  employeeName: string;
  isFixShift: boolean;
  isFixOvertime: boolean;
}

export const OptimizedSchedulePage: React.FC = () => {
  const { databaseInfo } = useLogin();
  const { getSchedules, Optimize, schedules, loading, optimizeProgress } = useOptimizeSchedule();
  const { getFixedShifts, saveFixedShifts, deleteFixedShifts, getFixedOvertimes, saveFixedOvertimes, deleteFixedOvertimes, fixedShifts, fixedOvertimes } = useFixSchedule();
  const { getManhours, manhours } = useManhours();
  const [localSchedules, setLocalSchedules] = useState<OptimizedSchedule[]>([]);
  const [selectedCells, setSelectedCells] = useState<SelectedCell[]>([]);
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    getSchedules();
  }, [getSchedules]);

  useEffect(() => {
    getManhours()
  }, [getManhours]);

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
    assign_appropriate_shift_and_overtime_for_man_hours_min_tolerance: 30,
    assign_appropriate_shift_and_overtime_for_man_hours_max_tolerance: 30,
    dont_assign_too_much_overtime_in_month: true,
    equalize_employee_overtime: false,
    solver_time_limit_seconds: 60
  }

  const handleCellSelectionChange = (cells: SelectedCell[]) => {
    setSelectedCells(cells);
  };

  const handleFixShift = (fixType: 'shift' | 'overtime' | 'none') => {
    if (selectedCells.length === 0) {
      toast.error("セルを選択してください");
      return;
    }

    const updates: Array<Props> = selectedCells.map(cell => {
      const currentSchedule = localSchedules.find(s =>
        s.date.toString() === cell.date &&
        s.employee.employee_detail.name === cell.employeeName
      );

      if (!currentSchedule) {
        return null;
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
    }).filter((update): update is Props => update !== null);

    if (updates.length === 0) return;

    handleFixShiftUpdate(updates);
  };

  const handleFixShiftUpdate = (updates: Array<Props>) => {
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
            skill_id: schedule.primary_skill.id,
            shift_id: schedule.shift.id,
          });
        } else if (schedule.isFixShift && !update.isFixShift) {
          // true → false に変化した場合、削除対象
          delFixedShift.push({
            date: schedule.date,
            employee_id: schedule.employee.employee_detail.id,
            skill_id: schedule.primary_skill.id,
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

  if (loading && !optimizeProgress.isOptimizing) return <div>Loading...</div>;

  return (
    <>
      <div className='px-20 py-2 min-h-screen overflow-auto'>
        {/* ページトップボタン */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-40 transition-all duration-300"
          title="ページトップへ戻る"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

        {/* 最適化プログレス表示 */}
        {optimizeProgress.isOptimizing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold mb-4 text-center">シフト最適化中</h3>

              {/* プログレスバー */}
              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${optimizeProgress.progress}%` }}
                ></div>
              </div>

              {/* プログレス情報 */}
              <div className="text-center space-y-2">
                <p className="text-gray-700">{optimizeProgress.message}</p>
                <p className="text-sm text-gray-500">
                  進捗: {Math.round(optimizeProgress.progress)}%
                </p>
                {optimizeProgress.timeRemaining !== undefined && optimizeProgress.timeRemaining > 0 && (
                  <p className="text-sm text-gray-500">
                    残り時間: 約{optimizeProgress.timeRemaining}秒
                  </p>
                )}
              </div>

              {/* Lottie Animation */}
              <div className="flex justify-center mt-4">
                <Lottie
                  animationData={loadingEarthAnimation}
                  loop={true}
                  style={{ height: '240px', width: '240px' }}
                />
              </div>
            </div>
          </div>
        )}

        <div className='flex justify-end gap-1 mb-2'>
          <span className="cell-count mr-4 flex items-center">
            {selectedCells.length === 0
              ? 'セル未選択'
              : `選択されたセル: ${selectedCells.length}`}
          </span>
          <button
            onClick={() => handleFixShift('shift')}
            className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
            disabled={selectedCells.length === 0 || optimizeProgress.isOptimizing}
          >
            シフト固定
          </button>
          <button
            onClick={() => handleFixShift('overtime')}
            className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2"
            disabled={selectedCells.length === 0 || optimizeProgress.isOptimizing}
          >
            残業固定
          </button>
          <button
            onClick={() => handleFixShift('none')}
            className="text-white bg-red-500 hover:bg-red-600 rounded px-4 py-2"
            disabled={selectedCells.length === 0 || optimizeProgress.isOptimizing}
          >
            固定解除
          </button>
        </div>
        <div className="flex justify-end w-full gap-1">
          <button
            onClick={onClickOptimize}
            className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2 disabled:bg-gray-400"
            disabled={optimizeProgress.isOptimizing}
          >
            {optimizeProgress.isOptimizing ? '最適化中...' : 'シフト生成'}
          </button>
        </div>
        <ScheduleTable
          schedules={localSchedules}
          manhours={manhours}
          fixedShifts={fixedShifts}
          fixedOvertimes={fixedOvertimes}
          onCellSelectionChange={handleCellSelectionChange}
        />

        <SummaryScheduleTable schedules={localSchedules} manhours={manhours} />
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
