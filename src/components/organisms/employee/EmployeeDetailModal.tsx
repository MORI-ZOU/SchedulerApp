import { ChangeEvent, FC, memo, useEffect, useState } from "react"
import Modal from "react-modal";
import { Employee } from "../../../types/Employee";
import { toast } from "react-toastify";
import { EmployeeDetail } from "../../../types/EmployeeDetail";
import { valid_shift } from "../../../types/valid_shift";
import { valid_skill } from "../../../types/valid_skill";

type Props = {
    employee: Employee | null;
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: (updatedEmployee: Employee) => void;
}

const defaultEmployee: Employee = {
    employee_detail: {
        id: '',
        name: '',
        max_overtime_hours_per_day: 0,
        max_overtime_hours_per_month: 0,
        work_days_per_cycle: 0,
        cycle_start_date: new Date(),
        enable_prohibited_shift_transitions: true
    },
    valid_shift: [],
    valid_skill: []
};

export const EmployeeDetailModal: FC<Props> = (props) => {
    const { employee, isOpen, onRequestClose, onSave } = props;
    const [updatedEmployee, setUpdatedEmployee] = useState<Employee>(defaultEmployee);

    useEffect(() => {
        if (!employee) {
            return;
        }
        setUpdatedEmployee(employee);
    }, [employee]);

    const onChangeField = <T extends keyof EmployeeDetail>(field: T, value: EmployeeDetail[T]) => {
        setUpdatedEmployee(prevState => ({
            ...prevState,
            employee_detail: {
                ...prevState.employee_detail,
                [field]: value,
            }
        }));
    };

    const onChangeValidShift = (index: number, field: keyof valid_shift, value: any) => {
        setUpdatedEmployee(prevState => {
            const newValidShifts = [...prevState.valid_shift];
            newValidShifts[index] = { ...newValidShifts[index], [field]: value };
            return { ...prevState, valid_shift: newValidShifts };
        });
    };

    const addValidShift = () => {
        setUpdatedEmployee(prevState => ({
            ...prevState,
            valid_shift: [...prevState.valid_shift, { employee_id: '', shift_id: '' }],
        }));
    };

    const removeValidShift = (index: number) => {
        setUpdatedEmployee(prevState => {
            const newValidShifts = prevState.valid_shift.filter((_, i) => i !== index);
            return { ...prevState, valid_shift: newValidShifts };
        });
    };

    const onChangeValidSkill = (index: number, field: keyof valid_skill, value: any) => {
        setUpdatedEmployee(prevState => {
            const newValidSkills = [...prevState.valid_skill];
            newValidSkills[index] = { ...newValidSkills[index], [field]: value };
            return { ...prevState, valid_skill: newValidSkills };
        });
    };

    const addValidSkill = () => {
        setUpdatedEmployee(prevState => ({
            ...prevState,
            valid_skill: [...prevState.valid_skill, { employee_id: '', skill_id: '', task_efficiency: 0 }],
        }));
    };

    const removeValidSkill = (index: number) => {
        setUpdatedEmployee(prevState => {
            const newValidSkills = prevState.valid_skill.filter((_, i) => i !== index);
            return { ...prevState, valid_skill: newValidSkills };
        });
    };


    const handleSave = () => {
        onSave(updatedEmployee);
        onRequestClose();
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
            <div className="relative p-4">
                <button
                    onClick={onRequestClose}
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 focus:outline-none"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold mb-4">従業員詳細</h1>
                <label className="block text-sm font-medium text-gray-700">名前</label>
                <input
                    value={updatedEmployee.employee_detail.name}
                    onChange={(e) => onChangeField('name', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">1日の最大残業時間</label>
                <input
                    value={updatedEmployee.employee_detail.max_overtime_hours_per_day}
                    onChange={(e) => onChangeField("max_overtime_hours_per_day", parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">1ヶ月の最大残業時間</label>
                <input
                    value={updatedEmployee.employee_detail.max_overtime_hours_per_month}
                    onChange={(e) => onChangeField("max_overtime_hours_per_month", parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">サイクル日数</label>
                <input
                    value={updatedEmployee.employee_detail.work_days_per_cycle}
                    onChange={(e) => onChangeField("work_days_per_cycle", parseFloat(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">サイクル開始日</label>
                <input
                    value={updatedEmployee.employee_detail.cycle_start_date.toLocaleDateString()}
                    onChange={(e) => onChangeField("cycle_start_date", new Date(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <div className="mt-4">
                    <h3 className="font-bold">有効なシフト</h3>
                    {updatedEmployee.valid_shift.map((shift, index) => (
                        <div key={index} className="mb-4 border p-2 rounded">
                            <label className="block text-sm font-medium text-gray-700">シフトID</label>
                            <input
                                type="text"
                                value={shift.shift_id}
                                onChange={(e) => onChangeValidShift(index, 'shift_id', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <label className="block text-sm font-medium text-gray-700">社員ID</label>
                            <input
                                type="text"
                                value={shift.employee_id}
                                onChange={(e) => onChangeValidShift(index, 'employee_id', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <button onClick={() => removeValidShift(index)} className="mt-2 text-white bg-red-500 hover:bg-red-600 rounded px-2 py-1">削除</button>
                        </div>
                    ))}
                    <button onClick={addValidShift} className="mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded px-2 py-1">シフトを追加</button>
                </div>
                <div className="mt-4">
                    <h3 className="font-bold">有効なスキル</h3>
                    {updatedEmployee.valid_skill.map((skill, index) => (
                        <div key={index} className="mb-4 border p-2 rounded">
                            <label className="block text-sm font-medium text-gray-700">スキルID</label>
                            <input
                                type="text"
                                value={skill.skill_id}
                                onChange={(e) => onChangeValidSkill(index, 'skill_id', e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <label className="block text-sm font-medium text-gray-700">効率</label>
                            <input
                                type="number"
                                value={skill.task_efficiency}
                                onChange={(e) => onChangeValidSkill(index, 'task_efficiency', parseFloat(e.target.value))}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                            <button onClick={() => removeValidSkill(index)} className="mt-2 text-white bg-red-500 hover:bg-red-600 rounded px-2 py-1">削除</button>
                        </div>
                    ))}
                    <button onClick={addValidSkill} className="mt-2 text-white bg-blue-500 hover:bg-blue-600 rounded px-2 py-1">スキルを追加</button>
                </div>
                <button
                    onClick={handleSave}
                    className="mt-4 text-white bg-gray-400 border-0 py-2 px-4 focus:outline-none hover:bg-gray-500 rounded"
                >
                    保存
                </button>
            </div>
        </Modal>
    )
}