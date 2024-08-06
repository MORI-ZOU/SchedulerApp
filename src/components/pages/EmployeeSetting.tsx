import { useState } from "react";
import { Employee } from "../../types/Employee";
import { EmployeeCard } from "../organisms/employee/EmployeeCard";
import { EmployeeDetailModal } from "../organisms/employee/EmployeeDetailModal";
import { useAllUsers } from "../hooks/useEmployees";

const dataSource: Array<Employee> = [
    {
        employee_detail: {
            id: "1",
            name: "テスト太郎",
            max_overtime_hours_per_day: 4,
            max_overtime_hours_per_month: 80,
            work_days_per_cycle: 5,
            cycle_start_date: new Date(2024, 9, 1),
            enable_prohibited_shift_transitions: false,
        },
        valid_shift: [{ employee_id: "1", shift_id: "日勤" }, { employee_id: "1", shift_id: "夜勤" }],
        valid_skill: [{ employee_id: "1", skill_id: "SKILL1", task_efficiency: 1.0 }]
    },
    {
        employee_detail: {
            id: "2",
            name: "テスト次郎",
            max_overtime_hours_per_day: 4,
            max_overtime_hours_per_month: 20,
            work_days_per_cycle: 4,
            cycle_start_date: new Date(2024, 9, 2),
            enable_prohibited_shift_transitions: false,
        },
        valid_shift: [{ employee_id: "2", shift_id: "SHIFT1" }],
        valid_skill: [{ employee_id: "2", skill_id: "SKILL1", task_efficiency: 0.9 }, { employee_id: "2", skill_id: "SKILL1", task_efficiency: 1.2 }]
    },
    {
        employee_detail: {
            id: "3",
            name: "テスト三郎",
            max_overtime_hours_per_day: 4,
            max_overtime_hours_per_month: 30,
            work_days_per_cycle: 5,
            cycle_start_date: new Date(2024, 9, 3),
            enable_prohibited_shift_transitions: false,
        },
        valid_shift: [{ employee_id: "3", shift_id: "SHIFT1" }],
        valid_skill: [{ employee_id: "3", skill_id: "SKILL1", task_efficiency: 1.5 }]
    },
];

export const EmployeeSetting = () => {
    const { getUsers, users, loading } = useAllUsers();
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" >
                        {dataSource.map((user) => (
                            <EmployeeCard
                                key={user.employee_detail.id}
                                employee_detail={user.employee_detail}
                                valid_shift={user.valid_shift}
                                valid_skill={user.valid_skill}
                            />
                        ))}
                    </div>
                </div>
            </section>
            <EmployeeDetailModal employee={ } />
        </>
    );
};



