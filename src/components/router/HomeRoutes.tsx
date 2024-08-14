import { EmployeeSetting } from '../pages/EmployeeSetting';
import { Home } from '../pages/Home';
import { OptimizedSchedulePage } from '../pages/OptimizedSchedulePage';
import { OvertimeSetting } from '../pages/OvertimeSetting';
import TestApp from '../pages/SampleDatagrid';
import { ShiftSetting } from '../pages/ShiftSetting';
import { SkillSetting } from '../pages/SkillSetting';

export const homeRoutes = [
  {
    path: '/Home',
    children: <Home />,
  },
  { path: '/ShiftSetting', children: <ShiftSetting /> },
  { path: '/SkillSetting', children: <SkillSetting /> },
  { path: '/OvertimeSetting', children: <OvertimeSetting /> },
  { path: "/EmployeeSetting", children: <EmployeeSetting /> },
  { path: "/OptimizedSchedule", children: <OptimizedSchedulePage /> }
];
