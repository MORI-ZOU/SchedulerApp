import { FC, useEffect, useState } from "react"
import Modal from "react-modal";
import { Employee } from "../../../types/Employee";
import { DateOnly } from "../../../types/DateOnly";
import { ShiftType } from "../../../types/ShiftType";
import { Skill } from "../../../types/Skill";
import { ShiftSelector } from "./ShiftSelector";
import { SkillSelector } from "./SkillSelector";

type Props = {
    employee: Employee;
    shifts: Array<ShiftType>;
    skills: Array<Skill>;
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
        cycle_start_date: new DateOnly(2024, 9, 1),
        enable_prohibited_shift_transitions: true
    },
    valid_shifts: [],
    valid_skills: []
};

export const EmployeeDetailModal: FC<Props> = (props) => {
    const { employee, shifts, skills, isOpen, onRequestClose, onSave } = props;
    const [updatedEmployee, setUpdatedEmployee] = useState<Employee>(defaultEmployee);

    useEffect(() => {
        setUpdatedEmployee(employee);
    }, [employee]);

    // const onChangeField = <T extends keyof EmployeeDetail>(field: T, value: EmployeeDetail[T]) => {
    //     setUpdatedEmployee(prevState => ({
    //         ...prevState,
    //         employee_detail: {
    //             ...prevState.employee_detail,
    //             [field]: value,
    //         }
    //     }));
    // };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setUpdatedEmployee(prev => ({
            ...prev,
            employee_detail: {
                ...prev.employee_detail,
                [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
            },
        }));
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedEmployee(prev => ({
            ...prev,
            employee_detail: {
                ...prev.employee_detail,
                cycle_start_date: DateOnly.fromString(e.target.value),
            },
        }));
    };

    const handleSave = () => {
        onSave(updatedEmployee);
        onRequestClose();
    };

    console.log(updatedEmployee)

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} ariaHideApp={false}>
            <div className="relative p-4 container">
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
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">名前</label>
                    <input
                        type="text"
                        name="name"
                        value={updatedEmployee.employee_detail.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="従業員名"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">1日の最大残業時間</label>
                    <input
                        type="number"
                        name="max_overtime_hours_per_day"
                        value={updatedEmployee.employee_detail.max_overtime_hours_per_day}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        min="0"
                        step="0.5"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">1ヶ月の最大残業時間</label>
                    <input
                        type="number"
                        name="max_overtime_hours_per_month"
                        value={updatedEmployee.employee_detail.max_overtime_hours_per_month}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        min="0"
                        step="0.5"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">サイクル日数</label>
                    <input
                        type="number"
                        name="work_days_per_cycle"
                        value={updatedEmployee.employee_detail.work_days_per_cycle}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        min="1"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">サイクル開始日</label>
                    <input
                        type="date"
                        name="cycle_start_date"
                        value={updatedEmployee.employee_detail.cycle_start_date.toString()}
                        onChange={handleStartDateChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="enable_prohibited_shift_transitions"
                        name="enable_prohibited_shift_transitions"
                        checked={updatedEmployee.employee_detail.enable_prohibited_shift_transitions}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <label
                        htmlFor="enable_prohibited_shift_transitions"
                        className="ml-2 text-sm text-gray-700"
                    >
                        禁止されたシフト遷移を守る
                    </label>
                </div>

                <ShiftSelector
                    availableShifts={shifts}
                    selectedShifts={updatedEmployee.valid_shifts}
                    employeeId={updatedEmployee.employee_detail.id}
                    onChange={(shifts) => setUpdatedEmployee(prev => ({ ...prev, valid_shifts: shifts }))}
                />

                <SkillSelector
                    availableSkills={skills}
                    selectedSkills={updatedEmployee.valid_skills}
                    employeeId={updatedEmployee.employee_detail.id}
                    onChange={(skills) => setUpdatedEmployee(prev => ({ ...prev, valid_skills: skills }))}
                />
            </div>


            <div className="flex justify-end mt-6 pt-4 border-t">
                <button
                    onClick={handleSave}
                    className="text-white bg-blue-500 hover:bg-blue-600 border-0 py-2 px-6 focus:outline-none rounded-md transition-colors"
                >
                    保存
                </button>
            </div>
        </Modal >
    )
}