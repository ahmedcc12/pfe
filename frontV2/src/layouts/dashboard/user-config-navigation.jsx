import SvgColor from 'src/components/svg-color';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor
    src={`/assets/icons/navbar/${name}.svg`}
    sx={{ width: 1, height: 1 }}
  />
);

const userNavConfig = () => {
  const { auth } = useAuth();

  let navConfig = [
    {
      title: 'HomePage',
      path: '/',
      icon: icon('ic_home'),
    },
    {
      title: 'Bots',
      path: '/bots',
      icon: icon('ic_bot'),
    },
    {
      title: 'Activity',
      path: '/activity',
      icon: icon('ic_history'),
    },
  ];

  if (auth.user.role === 'admin') {
    navConfig.push({
      title: 'Admin',
      path: '/admin',
      icon: icon('ic_admin'),
    });
  }

  return navConfig;
};

export default userNavConfig;
