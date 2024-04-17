import { useMemo } from 'react';
import PropTypes from 'prop-types';

import CssBaseline from '@mui/material/CssBaseline';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
} from '@mui/material/styles';

import palette from './palette';
import shadows, { customShadows } from './shadows';
import { overrides } from './overrides';
import { typography } from './typography';
//import { customShadows } from './custom-shadows';

import { useModeContext } from '../context/ModeContext';
// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {
  const { themeMode } = useModeContext();

  const memoizedValue = useMemo(
    () => ({
      palette: themeMode === 'light' ? palette.light : palette.dark,
      typography,
      shadows: themeMode === 'light' ? shadows.light : shadows.dark,
      //customShadows: customShadows(),
      customShadows:
        themeMode === 'light' ? customShadows.light : customShadows.dark,
      shape: { borderRadius: 8 },
    }),
    [themeMode],
  );

  const theme = createTheme(memoizedValue);

  theme.components = overrides(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
};
