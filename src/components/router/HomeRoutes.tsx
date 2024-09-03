import { EmployeeSetting } from '../pages/EmployeeSetting';
import { Home } from '../pages/Home';
import { OptimizedSchedulePage } from '../pages/OptimizedSchedulePage';
import { OvertimeSetting } from '../pages/OvertimeSetting';
import { ShiftSetting } from '../pages/ShiftSetting';
import { SkillSetting } from '../pages/SkillSetting';
import { ManhourSetting } from '../pages/ManhourSetting';

export const homeRoutes = [
  { path: '/Home', children: <Home />, },
  { path: '/ShiftSetting', children: <ShiftSetting /> },
  { path: '/SkillSetting', children: <SkillSetting /> },
  { path: '/OvertimeSetting', children: <OvertimeSetting /> },
  { path: "/EmployeeSetting", children: <EmployeeSetting /> },
  { path: "/ManhourSetting", children: <ManhourSetting /> },
  { path: "/OptimizedSchedule", children: <OptimizedSchedulePage /> }
];
