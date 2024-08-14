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

    const getSchedules = useCallback(() => {
        try {
            setLoading(true);

            setSchedules(dataSource)

            ////DB処理を後で記述
            toast.success("最適化したスケジュールデータを取得しました")
        } catch (e) {
            toast.error("最適化したスケジュールデータ取得に失敗しました");
        }
        finally {
            setLoading(false)
        }
    }, []);

    return { getSchedules, loading, schedules };
};
