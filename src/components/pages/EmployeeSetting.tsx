import { useCallback, useEffect, useState } from "react";
import { EmployeeCard } from "../organisms/employee/EmployeeCard";
import { EmployeeDetailModal } from "../organisms/employee/EmployeeDetailModal";
import { useEmployees } from "../hooks/useEmployees";
import { useSelectEmployee } from "../hooks/useSelectedEmployee";
import { Employee } from "../../types/Employee";
import { toast } from "react-toastify";
import { DateOnly } from "../../types/DateOnly";

const defaultEmployee: Employee = {
    employee_detail: {
        id: `新しいID`,
        name: '新しい従業員',
        max_overtime_hours_per_day: 0,
        max_overtime_hours_per_month: 0,
        work_days_per_cycle: 0,
        cycle_start_date: new DateOnly(2024, 4, 1),
        enable_prohibited_shift_transitions: true
    },
    valid_shift: [],
    valid_skill: []
};

export const EmployeeSetting = () => {
    const { getEmployees, setEmployees, Employees, loading } = useEmployees();
    const { onSelectEmployee, selectedEmployee } = useSelectEmployee();
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const onClickUser = useCallback((id: string) => {
        onSelectEmployee({ id: id, users: Employees, onOpen: openModal })
    }, [Employees, onSelectEmployee, openModal])

    useEffect(() => getEmployees(), []);

    const onAddEmployee = () => {
        setEmployees([...Employees, defaultEmployee]);
        toast.success(`新しい従業員を追加しました`);
    }

    const onDeleteEmployee = (id: string) => {
        const updatedEmployees = Employees.filter(emp => emp.employee_detail.id !== id);
        setEmployees(updatedEmployees);
        toast.success(`従業員 ${id} が削除されました`);
    };

    const onSaveClick = (updatedEmployee: Employee) => {
        const id = updatedEmployee.employee_detail.id;
        const members = [...Employees];
        const index = members.findIndex(emp => emp.employee_detail.id === id);

        if (index !== -1) {
            members[index] = updatedEmployee;
            setEmployees(members);

            // 更新成功を通知（例えば、トースト通知を使用するなど）
            toast.success(`従業員 ${id} のデータが更新されました`);
        } else {
            toast.error(`従業員 ${id} が見つかりませんでした`);
        }
    };

    console.log({ Employees })

    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Employees.map((user) => (
                            <EmployeeCard
                                key={user.employee_detail.id}
                                employee={user}
                                onClick={() => onClickUser(user.employee_detail.id)}
                                onDelete={() => onDeleteEmployee(user.employee_detail.id)}
                            />
                        ))}
                    </div>
                    {/* ボタンをボタン用のフレックスボックスコンテナで囲み右端に配置 */}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={() => onAddEmployee()}
                            className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2"
                        >
                            作業者追加
                        </button>
                    </div>
                </div>
            </section>
            <EmployeeDetailModal
                employee={selectedEmployee}
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                onSave={onSaveClick}
            />
        </>
    );
};



