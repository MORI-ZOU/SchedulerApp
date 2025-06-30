import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { OptimizedSchedule } from '../../types/OptimizedSchedule';
import { DateOnly } from '../../types/DateOnly';
import { Time } from '../../types/Time';
import { HexColor } from '../../types/HexColor';
import { useLogin } from './useLogin';
import DatabaseAPI, { setAPITimeout } from '../api/DatabaseAPI';
import { OptimizeParameter } from '../../types/OptimizeParameter';

// const emps: Array<Employee> = [
//     {
//         employee_detail: {
//             id: "1",
//             name: "テスト太郎",
//             max_overtime_hours_per_day: 4,
//             max_overtime_hours_per_month: 80,
//             work_days_per_cycle: 5,
//             cycle_start_date: new DateOnly(2024, 9, 1),
//             enable_prohibited_shift_transitions: false,
//         },
//         valid_shifts: [{ employee_id: "1", shift_id: "日勤" }, { employee_id: "1", shift_id: "夜勤" }],
//         valid_skills: [{ employee_id: "1", skill_id: "SKILL1", task_efficiency: 1.0 }]
//     },
//     {
//         employee_detail: {
//             id: "2",
//             name: "テスト次郎",
//             max_overtime_hours_per_day: 4,
//             max_overtime_hours_per_month: 20,
//             work_days_per_cycle: 4,
//             cycle_start_date: new DateOnly(2024, 9, 2),
//             enable_prohibited_shift_transitions: false,
//         },
//         valid_shifts: [{ employee_id: "2", shift_id: "SHIFT1" }],
//         valid_skills: [{ employee_id: "2", skill_id: "SKILL1", task_efficiency: 0.9 }, { employee_id: "2", skill_id: "SKILL1", task_efficiency: 1.2 }]
//     },]


// const sft: Array<ShiftType> = [
//     {
//         id: "a",
//         name: "日勤",
//         color: new HexColor("#ea3e3e"),
//         startTime: new Time(8, 0, 0),
//         endTime: new Time(17, 0, 0),
//     },
//     {
//         id: "b",
//         name: "夜勤",
//         color: new HexColor("#18d115"),
//         startTime: new Time(21, 0, 0),
//         endTime: new Time(6, 0, 0),
//     },
// ];

// const skl: Array<Skill> = [
//     {
//         id: "a",
//         name: "TaskA",
//         color: new HexColor("#ec1818"),
//     },
//     {
//         id: "b",
//         name: "TaskB",
//         color: new HexColor("#2adf4e"),
//     },
//     {
//         id: "c",
//         name: "TaskC",
//         color: new HexColor("#0a18e6"),
//     },]

// const ot: Array<Overtime> = [
//     {
//         id: '1',
//         color: new HexColor('#FF5733'),
//         overtime_hours: 1
//     },
//     {
//         id: '2',
//         color: new HexColor('#33FF57'),
//         overtime_hours: 2
//     },
//     {
//         id: '3',
//         color: new HexColor('#3357FF'),
//         overtime_hours: 4
//     },
// ];

// const dataSource: Array<OptimizedSchedule> = [
//     {
//         date: new DateOnly(2024, 9, 1),
//         employee: emps[0],
//         shift: sft[0]
//         ,
//         skill: skl[0],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 2),
//         employee: emps[0],
//         shift: sft[0],
//         skill: skl[0],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 3),
//         employee: emps[0],
//         shift: sft[0],
//         skill: skl[0],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 4),
//         employee: emps[0],
//         shift: sft[0],
//         skill: skl[0],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 5),
//         employee: emps[0],
//         shift: sft[0],
//         skill: skl[0],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 1),
//         employee: emps[1],
//         shift: sft[1]
//         ,
//         skill: skl[1],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 2),
//         employee: emps[1],
//         shift: sft[1],
//         skill: skl[1],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[2],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 3),
//         employee: emps[1],
//         shift: sft[1],
//         skill: skl[1],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 4),
//         employee: emps[1],
//         shift: sft[1],
//         skill: skl[1],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[0],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
//     {
//         date: new DateOnly(2024, 9, 5),
//         employee: emps[1],
//         shift: sft[1],
//         skill: skl[1],
//         defaultWorktimeHour: 8,
//         isFixOvertime: false,
//         isFixShift: false,
//         overtime: ot[1],
//         overtimeHours: 1,
//         totalWorktimeHours: 9
//     },
// ];

export const useOptimizeSchedule = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [schedules, setSchedules] = useState<Array<OptimizedSchedule>>([]);
    const [optimizeProgress, setOptimizeProgress] = useState<{
        isOptimizing: boolean;
        progress: number;
        message: string;
        timeRemaining?: number;
    }>({
        isOptimizing: false,
        progress: 0,
        message: '',
        timeRemaining: undefined
    });
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
                        cycle_start_date: DateOnly.fromString(val.employee.cycle_start_date),
                        enable_prohibited_shift_transitions: val.employee.enable_prohibited_shift_transitions
                    },
                    valid_shifts: val.employee.valid_shifts.map((shift: any) => ({
                        employee_id: shift.employee_id,
                        shift_id: shift.shift_id
                    })),
                    valid_skills: val.employee.valid_skills.map((skill: any) => ({
                        employee_id: skill.employee_id,
                        skill_id: skill.skill_id,
                        task_efficiency: skill.task_efficiency
                    }))
                },
                primary_skill: {
                    id: val.primary_skill.id,
                    name: val.primary_skill.name,
                    color: new HexColor(val.primary_skill.color)
                },
                skill_times: val.skill_times.map((skillTime: any) => ({
                    skill_id: skillTime.skill_id,
                    skill_name: skillTime.skill_name,
                    skill_color: skillTime.skill_color,
                    allocated_hours: skillTime.allocated_hours
                })),
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
                defaultWorktimeHour: val.default_worktime_hours,
                overtimeHours: val.overtime_hours,
                totalWorktimeHours: val.total_worktime_hours,
                isFixShift: val.is_fixed_shift,
                isFixOvertime: val.is_fixed_overtime
            }));


            ////loading
            setSchedules(values)

            ////DB処理を後で記述
            toast.success("シフトデータを取得しました")
        })
            .catch(() => toast.error("シフトデータ取得に失敗しました"))
            .finally(() => setLoading(false))
    }, []);

    const Optimize = useCallback((props: OptimizeParameter) => {
        // プログレス状態を先に設定
        setOptimizeProgress({
            isOptimizing: true,
            progress: 0,
            message: '最適化を開始しています...',
            timeRemaining: props.solver_time_limit_seconds
        });

        // ソルバー実行時間制限に基づいてAPIタイムアウトを設定（余裕を持って+30秒）
        const timeoutMs = (props.solver_time_limit_seconds + 30) * 1000;
        setAPITimeout(timeoutMs);

        // プログレス更新のインターバル
        const startTime = Date.now();
        const totalTime = props.solver_time_limit_seconds * 1000;
        
        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min((elapsed / totalTime) * 100, 95); // 95%まで
            const remaining = Math.max(0, Math.ceil((totalTime - elapsed) / 1000));
            
            setOptimizeProgress(prev => ({
                ...prev,
                progress,
                message: progress < 20 ? '制約を設定しています...' 
                      : progress < 60 ? 'ソルバーを実行中...' 
                      : '結果を処理しています...',
                timeRemaining: remaining
            }));
        }, 500); // 500msごとに更新してよりスムーズに

        // loadingは少し遅らせて設定（プログレス表示が優先されるように）
        setTimeout(() => setLoading(true), 100);

        ////データ取得
        DatabaseAPI.post("/optimize/", props).then((res) => {

            if (res.status != 200) {
                throw new Error(res.statusText)
            }

            console.log("res", res)

            // プログレスを100%に設定
            setOptimizeProgress(prev => ({
                ...prev,
                progress: 100,
                message: 'スケジュールを取得しています...',
                timeRemaining: 0
            }));

            ////loading
            getSchedules();

            ////DB処理を後で記述
            toast.success("シフト最適化を実行しました")
        })
            .catch((e) => toast.error("シフト最適化に失敗しました" + e))
            .finally(() => {
                clearInterval(progressInterval);
                setLoading(false);
                setOptimizeProgress({
                    isOptimizing: false,
                    progress: 0,
                    message: '',
                    timeRemaining: undefined
                });
                // 最適化後はデフォルトのタイムアウトに戻す
                setAPITimeout(10000);
            })
    }, [getSchedules]);

    return { getSchedules, Optimize, loading, schedules, optimizeProgress };
};
