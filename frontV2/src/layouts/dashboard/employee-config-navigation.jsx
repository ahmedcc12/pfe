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

const employeeNavConfig = [
  {
    title: 'HomePage',
    path: '/employee',
    icon: icon('ic_home'),
  },
];

export default employeeNavConfig;
