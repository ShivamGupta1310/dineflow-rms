import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors } from '@theme/colors';
import { typography, spacing } from '@theme/theme';
import { AppTheme } from '@theme/types';

interface ThemeContextType extends AppTheme {}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme();
  
  const isDark = useMemo(() => {
    return systemTheme === 'dark';
  }, [systemTheme]);

  const theme: AppTheme = useMemo(() => ({
    colors: isDark ? darkColors : lightColors,
    typography,
    spacing,
    isDark,
  }), [isDark]);

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
