import { Home } from '../pages/Home';
import { OvertimeSetting } from '../pages/OvertimeSetting';
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
];
