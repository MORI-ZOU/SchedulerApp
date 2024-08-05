import { Home } from '../pages/Home';
import { ShiftSetting } from '../pages/ShiftSetting';

export const homeRoutes = [
  {
    path: '/home',
    children: <Home />,
  },
  { path: '/ShiftSetting', children: <ShiftSetting /> },
];
