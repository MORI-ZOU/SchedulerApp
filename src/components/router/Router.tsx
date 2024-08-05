import { FC, memo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from '../pages/Login';
import { Page404 } from '../pages/Page404';
import { homeRoutes } from './HomeRoutes';
import { HeaderLayout } from '../templates/HeaderLayout';
import { DatabaseProvider } from '../providers/DatabaseProvider';

export const Router: FC = memo(() => {
  return (
    <DatabaseProvider>
      <Routes>
        <Route path="/" element={<Login />}>
          {homeRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<HeaderLayout>{route.children}</HeaderLayout>}
            ></Route>
          ))}
        </Route>

        <Route path="*" element={<Page404 />} />
      </Routes>
    </DatabaseProvider>
  );
});
