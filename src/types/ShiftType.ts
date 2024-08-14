import { HexColor } from "./HexColor";
import { Time } from "./Time";

export type ShiftType = {
  id: string;
  name: string;
  color: HexColor;
  startTime: Time;
  endTime: Time;
};
