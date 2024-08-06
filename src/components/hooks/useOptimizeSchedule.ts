import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Employee } from '../../types/Employee';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';
import { DateOnly } from '../../types/DateOnly';

const dataSource: Array<OptimizedSchedule> = [
    {
        date: new Date(2024, 9, 1),
        employee: {
            employee_detail: {
                id: "3",
                name: "テスト三郎",
                max_overtime_hours_per_day: 4,
                max_overtime_hours_per_month: 30,
                work_days_per_cycle: 5,
                cycle_start_date: new DateOnly(2024, 9, 3),
                enable_prohibited_shift_transitions: false,
            },
            valid_shift: [{ employee_id: "3", shift_id: "SHIFT1" }],
            valid_skill: [{ employee_id: "3", skill_id: "SKILL1", task_efficiency: 1.5 }]
        },
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
            cycle_start_date: new DateOnly(2024, 9, 3),
            enable_prohibited_shift_transitions: false,
        },
        valid_shift: [{ employee_id: "3", shift_id: "SHIFT1" }],
        valid_skill: [{ employee_id: "3", skill_id: "SKILL1", task_efficiency: 1.5 }]
    },
];

export const useOptimizeSchedule = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [Employees, setEmployees] = useState<Array<Employee>>([]);

    const getEmployees = useCallback(() => {
        try {
            setLoading(true);

            setEmployees(dataSource)

            ////DB処理を後で記述
            toast.success("最適化したスケジュールデータを取得しました")
        } catch (e) {
            toast.error("最適化したスケジュールデータ取得に失敗しました");
        }
        finally {
            setLoading(false)
        }
    }, []);

    return { getEmployees, loading, Employees };
};
