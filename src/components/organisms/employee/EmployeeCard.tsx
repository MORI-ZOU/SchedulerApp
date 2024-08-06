import React, { FC } from 'react';
import { Employee } from '../../../types/Employee';
import { Icon } from "@iconify/react"

type Props = {
    employee: Employee;
    onClick: (id: string) => void;
}

export const EmployeeCard: FC<Props> = (props) => {
    const { employee, onClick } = props;

    return (
        <div className="w-[360px] h-[260px]] p-4 bg-slate-100">
            <div className="h-full p-6 rounded-lg border-2 border-gray-300 flex flex-col">
                <h2 className="text-sm tracking-widest title-font mb-1 font-medium">ID: {employee.employee_detail.id}</h2>
                <h1 className="text-2xl text-gray-900 pb-4 mb-4 border-b border-gray-200 leading-none">{employee.employee_detail.name}</h1>
                <p className="text-gray-600 mb-2">1日の最大残業時間: {employee.employee_detail.max_overtime_hours_per_day} 時間</p>
                <p className="text-gray-600 mb-2">1ヶ月の最大残業時間: {employee.employee_detail.max_overtime_hours_per_month} 時間</p>
                <p className="text-gray-600 mb-2">サイクル日数: {employee.employee_detail.work_days_per_cycle}日</p>
                <p className="text-gray-600 mb-2">サイクル開始日: {employee.employee_detail.cycle_start_date.toDateString()}から</p>
                <div className="text-gray-600 mb-2">
                    <h3 className="font-medium">有効なシフト:</h3>
                    <ul>
                        {employee.valid_shift.map((shift, index) => (
                            <li key={index}>シフトID: {shift.shift_id}</li>
                        ))}
                    </ul>
                </div>
                <div className="text-gray-600 mb-2">
                    <h3 className="font-medium">有効なスキル:</h3>
                    <ul>
                        {employee.valid_skill.map((skill, index) => (
                            <li key={index}>
                                スキルID: {skill.skill_id}, 効率: {skill.task_efficiency}
                            </li>
                        ))}
                    </ul>
                </div>
                <button className="mt-auto text-white bg-gray-400 border-0 py-2 px-4 focus:outline-none hover:bg-gray-500 rounded flex items-center justify-center"
                    onClick={() => onClick(employee.employee_detail.id)}>
                    <Icon icon="uiw:setting" className='mr-2' />設定</button>
                <p className="text-xs text-gray-500 mt-3">Sample Card Component.</p>

            </div>
        </div>
    );
};