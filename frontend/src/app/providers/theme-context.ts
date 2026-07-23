import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  /** The user's selected preference. */
  mode: ThemeMode;
  /** The resolved theme actually applied to the document. */
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  /** Convenience toggle between light and dark (used by the navbar button). */
  toggle: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export const THEME_STORAGE_KEY = 'theme';
