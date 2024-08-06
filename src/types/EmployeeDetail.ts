import { DateOnly } from "./DateOnly";

export type EmployeeDetail = {
    id: string;
    name: string;
    max_overtime_hours_per_day: number;
    max_overtime_hours_per_month: number;
    work_days_per_cycle: number;
    cycle_start_date: DateOnly;
    enable_prohibited_shift_transitions: boolean;
};
