export type OptimizeParameter = {
    database_id: string,
    dont_assign_too_much_overtime_in_day: boolean,
    dont_assign_off_shift_if_work_day: boolean,
    assign_fix_schedule_if_exists: boolean,
    dont_assign_invalid_shift: boolean,
    dont_assign_invalid_skill: boolean,
    assign_only_one_kind_of_shift_and_skill_in_cycle: boolean,
    dont_assign_prohibited_shift_transition: boolean,
    assign_off_shift_at_least_one_in_cycle: boolean,
    assign_appropriate_shift_and_overtime_for_man_hours: boolean,
    assign_appropriate_shift_and_overtime_for_man_hours_min: boolean,
    assign_appropriate_shift_and_overtime_for_man_hours_max: boolean,
    assign_appropriate_shift_and_overtime_for_man_hours_min_tolerance: number,
    assign_appropriate_shift_and_overtime_for_man_hours_max_tolerance: number,
    dont_assign_too_much_overtime_in_month: boolean,
    equalize_employee_overtime: boolean,
    solver_time_limit_seconds: number
}