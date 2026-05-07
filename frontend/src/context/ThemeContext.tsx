import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Colors as StaticColors } from '../constants/colors';

// Light theme mapping
export const LightColors = {
  primary: '#FFFFFF', // Light background for primary areas
  secondary: '#F1F5F9', // Light grayish-blue for secondary
  accent: '#2979FF', // Keep accent the same
  background: '#F8FAFC', // Very light background
  card: '#FFFFFF', // White cards
  text: '#020817', // Dark text
  mutedText: '#64748B', // Gray text
  border: '#E2E8F0', // Light border
  inputBg: '#F1F5F9', // Light input
  error: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
};

// Dark theme is the original Colors
export const DarkColors = StaticColors;

export type ThemeColors = typeof DarkColors;

interface ThemeContextType {
  colors: ThemeColors;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const colors = isDarkMode ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ colors, isDarkMode, toggleTheme }}>
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
