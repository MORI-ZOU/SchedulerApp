import { Home } from '../pages/Home';
import { ShiftSetting } from '../pages/ShiftSetting';

export const homeRoutes = [
  {
    path: '/Home',
    children: <Home />,
  },
  { path: '/ShiftSetting', children: <ShiftSetting /> },
];
