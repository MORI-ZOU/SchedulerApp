import { Time } from "./Time";

export type ShiftType = {
  id: string;
  name: string;
  color: string;
  startTime: Time;
  endTime: Time;
};
