import { ChangeEvent, FC, memo, useEffect, useState } from "react"
import Modal from "react-modal";
import { Employee } from "../../../types/Employee";
import { toast } from "react-toastify";

type Props = {
    employee: Employee | null;
    isOpen: boolean;
    onRequestClose: () => void;
    onSave: (updatedEmployee: Employee) => void;
}

export const EmployeeDetailModal: FC<Props> = (props) => {
    const { employee, isOpen, onRequestClose, onSave } = props;
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [maxOvertimehoursParDay, setmaxOvertimehoursParDay] = useState(0)
    const [maxOvertimehoursParMonth, setmaxOvertimehoursParMonth] = useState(0)
    const [workdaysParCycle, setWorkdaysParCycle] = useState(0);
    const [cycleStartDate, setCycleStartDate] = useState(new Date(2024, 4, 1));


    useEffect(() => {
        setId(employee?.employee_detail.id ?? "")
        setName(employee?.employee_detail.name ?? "")
        setmaxOvertimehoursParDay(employee?.employee_detail.max_overtime_hours_per_day ?? 0)
        setmaxOvertimehoursParMonth(employee?.employee_detail.max_overtime_hours_per_month ?? 0)
        setWorkdaysParCycle(employee?.employee_detail.work_days_per_cycle ?? 0)
        setCycleStartDate(employee?.employee_detail.cycle_start_date ?? new Date(2024, 4, 1))
    })

    const onChangeName = (e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)
    const onChangeMaxOvertimeParDay = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (isNaN(value)) {
            toast.error("一日の最大残業時間は整数を入力してください")
            return;
        }
        setmaxOvertimehoursParDay(value)
    }
    const onChangeMaxOvertimeParMonth = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (isNaN(value)) {
            toast.error("一カ月の最大残業時間は整数を入力してください")
            return;
        }
        setmaxOvertimehoursParMonth(value)
    }
    const onChangeWorkdaysParCycle = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (isNaN(value)) {
            toast.error("サイクル日数は整数を入力してください")
            return;
        }
        setWorkdaysParCycle(value)
    }
    const onChangeCycleStartDate = (e: ChangeEvent<HTMLInputElement>) => {
        const value: Date = new Date(e.target.value)
        if (isNaN(value.getTime())) {
            toast.error("サイクル開始日は有効な日付を入力してください")
            return;
        }
        setCycleStartDate(value)
    }


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
                    value={name}
                    onChange={onChangeName}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">1日の最大残業時間</label>
                <input
                    value={maxOvertimehoursParDay}
                    onChange={onChangeMaxOvertimeParDay}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">1ヶ月の最大残業時間</label>
                <input
                    value={maxOvertimehoursParMonth}
                    onChange={onChangeMaxOvertimeParMonth}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">サイクル日数</label>
                <input
                    value={workdaysParCycle}
                    onChange={onChangeWorkdaysParCycle}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <label className="block text-sm font-medium text-gray-700">サイクル開始日</label>
                <input
                    type="number"
                    name="employee_detail.cycle_start_date"
                    value={cycleStartDate.toLocaleDateString()}
                    onChange={onChangeCycleStartDate}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
                <div className="mt-4">
                    <h3 className="font-bold">有効なシフト</h3>
                    <ul>
                        {employee?.valid_shift.map((shift, index) => (
                            <li key={index}>シフトID: {shift.shift_id}</li>
                        ))}
                    </ul>
                </div>
                <div className="mt-4">
                    <h3 className="font-bold">有効なスキル</h3>
                    <ul>
                        {employee?.valid_skill.map((skill, index) => (
                            <li key={index}>スキルID: {skill.skill_id}, 効率: {skill.task_efficiency}</li>
                        ))}
                    </ul>
                </div>
                <button
                    onClick={onRequestClose}
                    className="mt-4 text-white bg-gray-400 border-0 py-2 px-4 focus:outline-none hover:bg-gray-500 rounded"
                >
                    閉じる
                </button>
            </div>
        </Modal>
    )
}