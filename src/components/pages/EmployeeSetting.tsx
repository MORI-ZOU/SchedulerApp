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
        id: `NewEmployee`,
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
    const { getEmployees, saveEmployees, deleteEmployees, employees, loading } = useEmployees();
    const [data, setData] = useState<Employee[]>(employees)
    const { onSelectEmployee, selectedEmployee } = useSelectEmployee();
    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const onClickUser = useCallback((id: string) => {
        onSelectEmployee({ id: id, users: data, onOpen: openModal })
    }, [data, onSelectEmployee, openModal])

    useEffect(() => getEmployees(), [getEmployees]);
    useEffect(() => setData(employees), [employees])

    const onClickAdd = () => {
        setData([...employees, defaultEmployee]);
        toast.success(`新しい作業者を追加しました。内容を編集して「保存」ボタンで保存してください`);
    }

    const onClickDelete = (id: string) => {
        const deleteEmp = employees.filter((val) => val.employee_detail.id == id)

        console.log("delteEmployee", deleteEmp);
        if (deleteEmp.length > 0) {
            ////DBにIDがあれば削除
            deleteEmployees([id])
        }
        else {
            ////DBにIDが無ければローカル情報を削除
            setData((prev) => {
                const updateValue = prev.filter((val) => val.employee_detail.id != id)
                return updateValue;
            })
            toast.success(`作業者(id:${id})を削除しました`);
        }
    };

    const onClickSaveModal = (updatedEmployee: Employee) => {
        const id = updatedEmployee.employee_detail.id;
        const members = [...data];
        const index = members.findIndex(emp => emp.employee_detail.id === id);

        if (index !== -1) {
            members[index] = updatedEmployee;
            setData(members);

            // 更新成功を通知（例えば、トースト通知を使用するなど）
            toast.success(`作業者 ${id} のデータが更新されました。「保存」ボタンで保存してください`);
        } else {
            toast.error(`作業者 ${id} が見つかりませんでした`);
        }
    };

    const onClickSave = (() => {
        saveEmployees(data);
        console.log("Data saved:", data)
    })

    console.log({ employees })

    return (
        <>
            <section className="text-gray-600 body-font overflow-hidden">
                <div className="container px-5 py-24 mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {data.map((user) => (
                            <EmployeeCard
                                key={user.employee_detail.id}
                                employee={user}
                                onClick={() => onClickUser(user.employee_detail.id)}
                                onDelete={() => onClickDelete(user.employee_detail.id)}
                            />
                        ))}
                    </div>
                    <div className="flex justify-end mt-4 gap-1">
                        <button
                            onClick={() => onClickAdd()}
                            className="text-white bg-green-500 hover:bg-green-600 rounded px-4 py-2"
                        >
                            作業者追加
                        </button>
                        <button
                            onClick={onClickSave}
                            className="text-white bg-blue-500 hover:bg-blue-600 rounded px-4 py-2"
                        >
                            保存
                        </button>
                    </div>
                </div>
            </section>
            <EmployeeDetailModal
                employee={selectedEmployee}
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                onSave={onClickSaveModal}
            />
        </>
    );
};



