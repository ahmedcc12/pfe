import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

import Loader from 'src/components/loader';

const HomePage = lazy(() => import('src/pages/employee/app'));

export const NotFoundPage = lazy(
  () => import('src/pages/shared/page-not-found'),
);

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout section="employee">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [{ element: <HomePage />, index: true }],
    },
    {
      path: '/404',
      element: <NotFoundPage />,
    },
    {
      path: '/*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
