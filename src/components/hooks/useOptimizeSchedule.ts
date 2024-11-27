import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { Employee } from '../../types/Employee';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';
import { DateOnly } from '../../types/DateOnly';
import { Time } from '../../types/Time';
import { ShiftType } from '../../types/ShiftType';
import { Skill } from '../../types/Skill';
import { HexColor } from '../../types/HexColor';
import { Overtime } from '../../types/Overtime';
import { useLogin } from './useLogin';
import DatabaseAPI from '../api/DatabaseAPI';

const emps: Array<Employee> = [
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
            cycle_start_date: new DateOnly(2024, 9, 2),
            enable_prohibited_shift_transitions: false,
        },
        valid_shift: [{ employee_id: "2", shift_id: "SHIFT1" }],
        valid_skill: [{ employee_id: "2", skill_id: "SKILL1", task_efficiency: 0.9 }, { employee_id: "2", skill_id: "SKILL1", task_efficiency: 1.2 }]
    },]


const sft: Array<ShiftType> = [
    {
        id: "a",
        name: "日勤",
        color: new HexColor("#ea3e3e"),
        startTime: new Time(8, 0, 0),
        endTime: new Time(17, 0, 0),
    },
    {
        id: "b",
        name: "夜勤",
        color: new HexColor("#18d115"),
        startTime: new Time(21, 0, 0),
        endTime: new Time(6, 0, 0),
    },
];

const skl: Array<Skill> = [
    {
        id: "a",
        name: "TaskA",
        color: new HexColor("#ec1818"),
    },
    {
        id: "b",
        name: "TaskB",
        color: new HexColor("#2adf4e"),
    },
    {
        id: "c",
        name: "TaskC",
        color: new HexColor("#0a18e6"),
    },]

const ot: Array<Overtime> = [
    {
        id: '1',
        color: new HexColor('#FF5733'),
        overtime_hours: 1
    },
    {
        id: '2',
        color: new HexColor('#33FF57'),
        overtime_hours: 2
    },
    {
        id: '3',
        color: new HexColor('#3357FF'),
        overtime_hours: 4
    },
];

const dataSource: Array<OptimizedSchedule> = [
    {
        date: new DateOnly(2024, 9, 1),
        employee: emps[0],
        shift: sft[0]
        ,
        skill: skl[0],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 2),
        employee: emps[0],
        shift: sft[0],
        skill: skl[0],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 3),
        employee: emps[0],
        shift: sft[0],
        skill: skl[0],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 4),
        employee: emps[0],
        shift: sft[0],
        skill: skl[0],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 5),
        employee: emps[0],
        shift: sft[0],
        skill: skl[0],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 1),
        employee: emps[1],
        shift: sft[1]
        ,
        skill: skl[1],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 2),
        employee: emps[1],
        shift: sft[1],
        skill: skl[1],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[2],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 3),
        employee: emps[1],
        shift: sft[1],
        skill: skl[1],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 4),
        employee: emps[1],
        shift: sft[1],
        skill: skl[1],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[0],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
    {
        date: new DateOnly(2024, 9, 5),
        employee: emps[1],
        shift: sft[1],
        skill: skl[1],
        defaultWorktimeHour: 8,
        isFixOvertime: false,
        isFixShift: false,
        overtime: ot[1],
        overtimeHours: 1,
        totalWorktimeHours: 9
    },
];

export const useOptimizeSchedule = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [schedules, setSchedules] = useState<Array<OptimizedSchedule>>([]);
    const { databaseInfo } = useLogin();

    const getSchedules = useCallback(() => {
        setLoading(true);

        ////データ取得
        DatabaseAPI.post("/get-optimized-schedule/", { database_id: databaseInfo?.id }).then((res) => {

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("res", res)

            const values: Array<OptimizedSchedule> = res.data.map((val: any) => ({
                date: val.date,
                employee: {
                    employee_detail: {
                        id: val.employee.id,
                        name: val.employee.name,
                        max_overtime_hours_per_day: val.employee.max_overtime_hours_per_day,
                        max_overtime_hours_per_month: val.employee.max_overtime_hours_per_month,
                        work_days_per_cycle: val.employee.work_days_per_cycle,
                        cycle_start_date: val.employee.cycle_start_date,
                        enable_prohibited_shift_transitions: val.employee.enable_prohibited_shift_transitions
                    },
                    valid_shift: val.employee.valid_shifts.map((shift: any) => ({
                        employee_id: shift.employee_id,
                        shift_id: shift.shift_id
                    })),
                    valid_skill: val.employee.valid_skills.map((skill: any) => ({
                        employee_id: skill.employee_id,
                        skill_id: skill.skill_id,
                        task_efficiency: skill.task_efficiency
                    }))
                },
                skill: {
                    id: val.skill.id,
                    name: val.skill.name,
                    color: new HexColor(val.skill.color)
                },
                shift: {
                    id: val.shift.id,
                    name: val.shift.name,
                    color: new HexColor(val.shift.color),
                    startTime: Time.fromString(val.shift.start_time),
                    endTime: Time.fromString(val.shift.end_time)
                },
                overtime: {
                    id: val.overtime.id,
                    color: new HexColor(val.overtime.color),
                    overtime_hours: val.overtime.overtime_hours
                },
                default_worktime_hours: val.default_worktime_hours,
                overtime_hours: val.overtime_hours,
                total_worktime_hours: val.total_worktime_hours,
                is_fixed_shift: val.is_fixed_shift,
                is_fixed_overtime: val.is_fixed_overtime
            }));


            ////loading
            setSchedules(values)

            ////DB処理を後で記述
            toast.success("シフトデータを取得しました")
        })
            .catch(() => toast.error("シフトデータ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const Optimize = useCallback(() => {
        setLoading(true);

        const optimizeParam = {
            database_id: databaseInfo?.id,
            dont_assign_too_much_overtime_in_day: true,
            dont_assign_off_shift_if_work_day: true,
            assign_fix_schedule_if_exists: true,
            dont_assign_invalid_shift: true,
            dont_assign_invalid_skill: true,
            assign_only_one_kind_of_shift_and_skill_in_cycle: true,
            dont_assign_prohibited_shift_transition: true,
            assign_off_shift_at_least_one_in_cycle: true,
            assign_appropriate_shift_and_overtime_for_man_hours: true,
            assign_appropriate_shift_and_overtime_for_man_hours_min: true,
            assign_appropriate_shift_and_overtime_for_man_hours_max: true,
            assign_appropriate_shift_and_overtime_for_man_hours_min_tolerance: 10,
            assign_appropriate_shift_and_overtime_for_man_hours_max_tolerance: 10,
            dont_assign_too_much_overtime_in_month: true
        }

        ////データ取得
        DatabaseAPI.post("/optimize/", optimizeParam).then((res) => {

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("res", res)

            ////loading
            getSchedules();

            ////DB処理を後で記述
            toast.success("シフト最適化を実行しました")
        })
            .catch((e) => toast.error("シフト最適化に失敗しました" + e))
            .finally(() => setLoading(false))
    }, []);

    return { getSchedules, Optimize, loading, schedules };
};
