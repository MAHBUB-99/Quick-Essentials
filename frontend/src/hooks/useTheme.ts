import { useContext } from 'react';
import { ThemeContext, type ThemeContextValue } from '@/app/providers/theme-context';

/** Access the current theme and toggles. Must be used within <ThemeProvider>. */
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
