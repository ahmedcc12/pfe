import SvgColor from 'src/components/svg-color';
import { Icon } from '@iconify/react';
import { Children } from 'react';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const adminNavConfig = [
  {
    title: 'Dashboard',
    path: '/admin',
    icon: icon('ic_analytics'),
  },
  {
    title: 'Users',
    path: '/admin/users',
    icon: icon('ic_user'),
    children: [
      {
        title: 'Add User',
        path: '/admin/users/new',
        icon: icon('ic_plus'),
      },
    ],
  },
  {
    title: 'Bots',
    path: '/admin/bots',
    icon: icon('ic_bot'),
    children: [
      {
        title: 'Add Bot',
        path: '/admin/bots/new',
        icon: icon('ic_plus'),
      },
    ],
  },
  {
    title: 'Groups',
    path: '/admin/groups',
    icon: icon('ic_group'),
    children: [
      {
        title: 'Add Group',
        path: '/admin/groups/new',
        icon: icon('ic_plus'),
      },
    ],
  },
  {
    title: 'HomePage',
    path: '/',
    icon: icon('ic_home'),
  },
];

export default adminNavConfig;
