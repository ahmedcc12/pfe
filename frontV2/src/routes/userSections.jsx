import { lazy, Suspense, useEffect } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const NotFoundPage = lazy(
  () => import('src/pages/shared/page-not-found'),
);
export const IndexPage = lazy(() => import('src/pages/user/app'));

export const UserBotsList = lazy(() => import('src/pages/user/bots/botsList'));

export const UserActivityList = lazy(
  () => import('src/pages/user/activity/activityList'),
);

import Loader from 'src/components/loader';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout section="user">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: '/bots', element: <UserBotsList /> },
        { path: '/activity', element: <UserActivityList /> },
      ],
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
