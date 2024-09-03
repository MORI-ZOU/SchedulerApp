import { DateOnly } from "./DateOnly"
import { ShiftType } from "./ShiftType";
import { Skill } from "./Skill";

export type Manhour = {
    date: DateOnly;
    skill: Skill;
    shift: ShiftType;
    required_hours: number;
}