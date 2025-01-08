import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Employee } from '../../types/Employee';
import { DateOnly } from '../../types/DateOnly';
import DatabaseAPI from '../api/DatabaseAPI';
import { useLogin } from './useLogin';


const dataSource: Array<Employee> = [
    {
        employee_detail: {
            id: "1",
            name: "テスト太郎",
            max_overtime_hours_per_day: 4,
            max_overtime_hours_per_month: 80,
            work_days_per_cycle: 5,
            cycle_start_date: new DateOnly(2024, 9, 1),
            enable_prohibited_shift_transitions: false,
        },
        valid_shifts: [{ employee_id: "1", shift_id: "日勤" }, { employee_id: "1", shift_id: "夜勤" }],
        valid_skills: [{ employee_id: "1", skill_id: "SKILL1", task_efficiency: 1.0 }]
    },
    {
        employee_detail: {
            id: "2",
            name: "テスト次郎",
            max_overtime_hours_per_day: 4,
            max_overtime_hours_per_month: 20,
            work_days_per_cycle: 4,
            cycle_start_date: new DateOnly(2024, 9, 2),
            enable_prohibited_shift_transitions: false,
        },
        valid_shifts: [{ employee_id: "2", shift_id: "SHIFT1" }],
        valid_skills: [{ employee_id: "2", skill_id: "SKILL1", task_efficiency: 0.9 }, { employee_id: "2", skill_id: "SKILL1", task_efficiency: 1.2 }]
    },
    {
        employee_detail: {
            id: "3",
            name: "テスト三郎",
            max_overtime_hours_per_day: 4,
            max_overtime_hours_per_month: 30,
            work_days_per_cycle: 5,
            cycle_start_date: new DateOnly(2024, 9, 3),
            enable_prohibited_shift_transitions: false,
        },
        valid_shifts: [{ employee_id: "3", shift_id: "SHIFT1" }],
        valid_skills: [{ employee_id: "3", skill_id: "SKILL1", task_efficiency: 1.5 }]
    },
    {
        employee_detail: {
            id: "4",
            name: "テスト四郎",
            max_overtime_hours_per_day: 4,
            max_overtime_hours_per_month: 40,
            work_days_per_cycle: 5,
            cycle_start_date: new DateOnly(2024, 9, 4),
            enable_prohibited_shift_transitions: false,
        },
        valid_shifts: [{ employee_id: "4", shift_id: "SHIFT1" }],
        valid_skills: [{ employee_id: "4", skill_id: "SKILL1", task_efficiency: 1.05 }]
    },
];

export const useEmployees = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [employees, setEmployees] = useState<Array<Employee>>([]);
    const { databaseInfo } = useLogin();

    const getEmployees = useCallback(() => {
        setLoading(true);

        ////データ取得
        DatabaseAPI.post("/get-employees/", { database_id: databaseInfo?.id }).then((res) => {

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("res", res)

            const values: Array<Employee> = res.data.map((val: any) => ({
                employee_detail: {
                    id: val.id,
                    name: val.name,
                    max_overtime_hours_per_day: val.max_overtime_hours_per_day,
                    max_overtime_hours_per_month: val.max_overtime_hours_per_month,
                    work_days_per_cycle: val.work_days_per_cycle,
                    cycle_start_date: DateOnly.fromString(val.cycle_start_date),
                    enable_prohibited_shift_transitions: val.enable_prohibited_shift_transitions
                },
                valid_shifts: val.valid_shifts.map((shift: any) => ({
                    employee_id: shift.employee_id,
                    shift_id: shift.shift_id
                })),
                valid_skills: val.valid_skills.map((skill: any) => ({
                    employee_id: skill.employee_id,
                    skill_id: skill.skill_id,
                    task_efficiency: skill.task_efficiency
                }))
            }));

            ////loading
            setEmployees(values)

            ////DB処理を後で記述
            toast.success("作業者情報を取得しました")
        })
            .catch(() => toast.error("作業者情報の取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const
        saveEmployees = useCallback((employees: Employee[]) => {
            const data = {
                database_id: databaseInfo?.id,
                employees: employees.map(employee => ({
                    id: employee.employee_detail.id,
                    name: employee.employee_detail.name,
                    max_overtime_hours_per_day: employee.employee_detail.max_overtime_hours_per_day,
                    max_overtime_hours_per_month: employee.employee_detail.max_overtime_hours_per_month,
                    work_days_per_cycle: employee.employee_detail.work_days_per_cycle,
                    cycle_start_date: employee.employee_detail.cycle_start_date.toString(),
                    enable_prohibited_shift_transitions: employee.employee_detail.enable_prohibited_shift_transitions,
                    valid_shifts: employee.valid_shifts.map((shift: any) => ({
                        employee_id: shift.employee_id,
                        shift_id: shift.shift_id
                    })),
                    valid_skills: employee.valid_skills.map((skill: any) => ({
                        employee_id: skill.employee_id,
                        skill_id: skill.skill_id,
                        task_efficiency: skill.task_efficiency
                    }))
                }))
            };

            console.log(`seveEmployees: ${JSON.stringify(data, null, 2)}`);

            DatabaseAPI.post("/set-employees/", data).then(res => {
                setLoading(true);

                if (res.status !== 200) {
                    throw new Error(res.statusText);
                }

                getEmployees();
                toast.success("作業者情報をデータベースに保存しました");
            })
                .catch((e) => toast.error("作業者情報の保存に失敗しました" + e))
                .finally(() => setLoading(false));
        }, []);

    const deleteEmployees = useCallback((employee_ids: string[]) => {
        const data = {
            database_id: databaseInfo?.id,
            employee_ids: employee_ids
        };

        console.log(data)

        DatabaseAPI.post("/delete-employees/", data).then(res => {
            setLoading(true);

            if (res.status !== 200) {
                throw new Error(res.statusText);
            }

            getEmployees();
            toast.success("作業者情報をデータベースから削除しました");
        })
            .catch((e) => toast.error("作業者情報の削除に失敗しました" + e))
            .finally(() => setLoading(false));
    }, []);

    return { getEmployees, saveEmployees, deleteEmployees, loading, employees };
};
