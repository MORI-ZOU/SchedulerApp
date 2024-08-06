import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { EmployeeDetail } from '../../types/EmployeeDetail';
import { DateOnly } from '../../types/DateOnly';

const dataSource: Array<EmployeeDetail> = [
    {
        id: "3",
        name: "テスト三郎",
        max_overtime_hours_per_day: 4,
        max_overtime_hours_per_month: 30,
        work_days_per_cycle: 5,
        cycle_start_date: new DateOnly(2024, 9, 3),
        enable_prohibited_shift_transitions: false,

    },
    {
        id: "2",
        name: "テスト次郎",
        max_overtime_hours_per_day: 4,
        max_overtime_hours_per_month: 20,
        work_days_per_cycle: 4,
        cycle_start_date: new DateOnly(2024, 9, 2),
        enable_prohibited_shift_transitions: false,
    },
    {
        id: "3",
        name: "テスト三郎",
        max_overtime_hours_per_day: 4,
        max_overtime_hours_per_month: 30,
        work_days_per_cycle: 5,
        cycle_start_date: new DateOnly(2024, 9, 3),
        enable_prohibited_shift_transitions: false,
    },
];

export const useOptimizeSchedule = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [employeeDetails, setEmployeeDetails] = useState<Array<EmployeeDetail>>([]);

    const getEmployees = useCallback(() => {
        try {
            setLoading(true);

            setEmployeeDetails(dataSource)

            ////DB処理を後で記述
            toast.success("従業員詳細データを取得しました")
        } catch (e) {
            toast.error("従業員詳細データの取得に失敗しました");
        }
        finally {
            setLoading(false)
        }
    }, []);

    return { getEmployees, loading, Employees: employeeDetails };
};
