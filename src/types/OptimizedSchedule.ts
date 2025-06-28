import { DateOnly } from "./DateOnly";
import { Employee } from "./Employee";
import { Overtime } from "./Overtime";
import { ShiftType } from "./ShiftType";
import { Skill } from "./Skill";
import { SkillTime } from "./SkillTime";

/**
 * 最適化されたスケジュール
 * @param date - 日付
 * @param employee - 作業者情報
 * @param shift - シフト
 * @param primary_skill - プライマリスキル
 * @param skill_times - スキル別割り当て時間
 * @param overtime - 残業
 * @param defaultWorktimeHour - デフォルトの労働時間
 * @param overtimeHours - 残業時間
 * @param totalWorktimeHours - 合計労働時間
 * @param isFixShift - 固定シフトかどうか
 * @param isFixOvertime - 固定残業かどうか
 */
export type OptimizedSchedule = {
    date: DateOnly;
    employee: Employee
    shift: ShiftType;
    primary_skill: Skill;
    skill_times: SkillTime[];
    overtime: Overtime;
    defaultWorktimeHour: number;
    overtimeHours: number;
    totalWorktimeHours: number;
    isFixShift: boolean;
    isFixOvertime: boolean;
}