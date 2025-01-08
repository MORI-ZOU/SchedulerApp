import { EmployeeDetail } from "./EmployeeDetail"
import { valid_shift } from "./valid_shift";
import { valid_skill } from "./valid_skill";

export type Employee = {
    employee_detail: EmployeeDetail;
    valid_shifts: Array<valid_shift>;
    valid_skills: Array<valid_skill>;
}