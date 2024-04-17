import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import DashboardLayout from 'src/layouts/dashboard';

export const NotFoundPage = lazy(
  () => import('src/pages/shared/page-not-found'),
);
export const IndexPage = lazy(() => import('src/pages/admin/app'));

export const UsersList = lazy(() => import('src/pages/admin/users/usersList'));
export const CreateUserPage = lazy(
  () => import('src/pages/admin/users/userForm'),
);

export const BotsList = lazy(() => import('src/pages/admin/bots/botsList'));
export const CreateBotPage = lazy(() => import('src/pages/admin/bots/botForm'));

export const GroupsList = lazy(
  () => import('src/pages/admin/groups/groupsList'),
);
export const CreateGroupPage = lazy(
  () => import('src/pages/admin/groups/groupForm'),
);

import Loader from 'src/components/loader';

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout section="admin">
          <Suspense fallback={<Loader />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { element: <IndexPage />, index: true },
        { path: '/users', element: <UsersList /> },
        { path: '/users/new', element: <CreateUserPage /> },
        { path: '/users/:userId', element: <CreateUserPage /> },
        { path: '/bots', element: <BotsList /> },
        { path: '/bots/new', element: <CreateBotPage /> },
        { path: '/bots/:botId', element: <CreateBotPage /> },
        { path: '/groups', element: <GroupsList /> },
        { path: '/groups/new', element: <CreateGroupPage /> },
        { path: '/groups/:groupId', element: <CreateGroupPage /> },
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
