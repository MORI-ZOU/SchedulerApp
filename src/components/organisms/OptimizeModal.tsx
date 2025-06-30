import React, { useState } from 'react';
import Modal from 'react-modal';
import { OptimizeParameter } from '../../types/OptimizeParameter';


type OptimizeModalProps = {
    isOpen: boolean;
    initialOptimizeParam: OptimizeParameter;
    onRequestClose: () => void;
    onSave: (param: OptimizeParameter) => void;
}

const OptimizeModal: React.FC<OptimizeModalProps> = ({
    isOpen,
    onRequestClose,
    initialOptimizeParam,
    onSave,
}) => {
    const [optimizeParam, setOptimizeParam] = useState<OptimizeParameter>(initialOptimizeParam);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;

        setOptimizeParam((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setOptimizeParam((prev) => ({
            ...prev,
            [name]: Number(value),
        }));
    };

    const handleSave = () => {
        console.log("optimized_param:", optimizeParam);

        onSave(optimizeParam);
        onRequestClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Optimize Parameters"
            className="flex justify-center items-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
            <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
                <h2 className="text-2xl font-semibold mb-4">最適化パラメータ</h2>
                <form>
                    <div className="grid grid-cols-1 gap-4">
                        {/* 各パラメータの項目をループで生成 */}
                        {[
                            {
                                label: 'サイクル内で1種類のシフトとスキルのみを割り当てる',
                                name: 'assign_only_one_kind_of_shift_and_skill_in_cycle',
                                type: 'checkbox',
                                value: optimizeParam.assign_only_one_kind_of_shift_and_skill_in_cycle,
                            },
                            {
                                label: 'サイクル内で最低1回はオフシフトを割り当てる',
                                name: 'assign_off_shift_at_least_one_in_cycle',
                                type: 'checkbox',
                                value: optimizeParam.assign_off_shift_at_least_one_in_cycle,
                            },
                            {
                                label: '既存のスケジュールがあれば固定で割り当てる',
                                name: 'assign_fix_schedule_if_exists',
                                type: 'checkbox',
                                value: optimizeParam.assign_fix_schedule_if_exists,
                            },
                            {
                                label: '禁止されたシフト遷移を割り当てない',
                                name: 'dont_assign_prohibited_shift_transition',
                                type: 'checkbox',
                                value: optimizeParam.dont_assign_prohibited_shift_transition,
                            },
                            {
                                label: '月間の最大残業時間を設定する',
                                name: 'dont_assign_too_much_overtime_in_month',
                                type: 'checkbox',
                                value: optimizeParam.dont_assign_too_much_overtime_in_month,
                            },
                            {
                                label: '日間の最大残業時間を設定する',
                                name: 'dont_assign_too_much_overtime_in_day',
                                type: 'checkbox',
                                value: optimizeParam.dont_assign_too_much_overtime_in_day,
                            },
                            {
                                label: '作業日にオフシフトを割り当てない',
                                name: 'dont_assign_off_shift_if_work_day',
                                type: 'checkbox',
                                value: optimizeParam.dont_assign_off_shift_if_work_day,
                            },
                            {
                                label: '無効なシフトを割り当てない',
                                name: 'dont_assign_invalid_shift',
                                type: 'checkbox',
                                value: optimizeParam.dont_assign_invalid_shift,
                            },
                            {
                                label: '無効なスキルを割り当てない',
                                name: 'dont_assign_invalid_skill',
                                type: 'checkbox',
                                value: optimizeParam.dont_assign_invalid_skill,
                            },
                            {
                                label: '必要労働時間に適切なシフトと残業を割り当てる',
                                name: 'assign_appropriate_shift_and_overtime_for_man_hours',
                                type: 'checkbox',
                                value: optimizeParam.assign_appropriate_shift_and_overtime_for_man_hours,
                            },
                            {
                                label: '最小必要労働時間に適切なシフトと残業を割り当てる',
                                name: 'assign_appropriate_shift_and_overtime_for_man_hours_min',
                                type: 'checkbox',
                                value: optimizeParam.assign_appropriate_shift_and_overtime_for_man_hours_min,
                            },
                            {
                                label: '最小必要労働時間の許容範囲',
                                name: 'assign_appropriate_shift_and_overtime_for_man_hours_min_tolerance',
                                type: 'number',
                                value: optimizeParam.assign_appropriate_shift_and_overtime_for_man_hours_min_tolerance,
                            },
                            {
                                label: '最大必要労働時間に適切なシフトと残業を割り当てる',
                                name: 'assign_appropriate_shift_and_overtime_for_man_hours_max',
                                type: 'checkbox',
                                value: optimizeParam.assign_appropriate_shift_and_overtime_for_man_hours_max,
                            },
                            {
                                label: '最大必要労働時間の許容範囲',
                                name: 'assign_appropriate_shift_and_overtime_for_man_hours_max_tolerance',
                                type: 'number',
                                value: optimizeParam.assign_appropriate_shift_and_overtime_for_man_hours_max_tolerance,
                            },
                            {
                                label: '従業員間の残業時間を均等化する',
                                name: 'equalize_employee_overtime',
                                type: 'checkbox',
                                value: optimizeParam.equalize_employee_overtime,
                            },
                            {
                                label: 'ソルバー実行時間制限(秒)',
                                name: 'solver_time_limit_seconds',
                                type: 'number',
                                value: optimizeParam.solver_time_limit_seconds,
                            },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center">
                                {item.type === 'checkbox' ? (
                                    <>
                                        <input
                                            id={item.name}
                                            type="checkbox"
                                            name={item.name}
                                            checked={item.value as boolean}
                                            onChange={handleChange}
                                            className="mr-2"
                                        />
                                        <label htmlFor={item.name}>{item.label}</label>
                                    </>
                                ) : (
                                    <>
                                        <label htmlFor={item.name} className="mr-2 w-64">
                                            {item.label}:
                                        </label>
                                        <input
                                            type="number"
                                            name={item.name}
                                            id={item.name}
                                            value={item.value as number}
                                            onChange={handleNumberChange}
                                            className="border border-gray-300 rounded-md p-2 w-full"
                                        />
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={onRequestClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-gray-600"
                        >
                            キャンセル
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            実行
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};


export default OptimizeModal;