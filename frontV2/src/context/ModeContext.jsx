import React, { createContext, useContext, useState } from 'react';

const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem('theme') || 'light',
  );

  const toggleThemeMode = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    localStorage.setItem('theme', themeMode === 'light' ? 'dark' : 'light');
  };

  return (
    <ModeContext.Provider value={{ themeMode, toggleThemeMode }}>
      {children}
    </ModeContext.Provider>
  );
};

export const useModeContext = () => useContext(ModeContext);
