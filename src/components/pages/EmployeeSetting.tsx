import { useCallback, useEffect, useState } from "react";
import { EmployeeCard } from "../organisms/employee/EmployeeCard";
import { EmployeeDetailModal } from "../organisms/employee/EmployeeDetailModal";
import { useEmployees } from "../hooks/useEmployees";
import { useSelectEmployee } from "../hooks/useSelectedEmployee";
import { Employee } from "../../types/Employee";
import { toast } from "react-toastify";


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
                            />
                        ))}
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



