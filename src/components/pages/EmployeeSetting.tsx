import { useCallback, useEffect, useState } from "react";
import { EmployeeCard } from "../organisms/employee/EmployeeCard";
import { EmployeeDetailModal } from "../organisms/employee/EmployeeDetailModal";
import { useEmployees } from "../hooks/useEmployees";
import { useSelectEmployee } from "../hooks/useSelectedEmployee";


export const EmployeeSetting = () => {
    const { getEmployees, Employees, loading } = useEmployees();
    const { onSelectEmployee, selectedEmployee } = useSelectEmployee();
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const onClickUser = useCallback((id: string) => {
        onSelectEmployee({ id: id, users: Employees, onOpen: openModal })
    }, [Employees, onSelectEmployee, openModal])

    useEffect(() => getEmployees(), []);

    console.log({ Employees })

    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" >
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
            <EmployeeDetailModal employee={selectedEmployee} isOpen={isModalOpen}
                onRequestClose={closeModal} onSave={() => console.log("se-bu")} />
        </>
    );
};



