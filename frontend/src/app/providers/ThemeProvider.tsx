import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeContext, THEME_STORAGE_KEY, type ThemeMode } from './theme-context';

function getStoredMode(): ThemeMode {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light' || stored === 'system') return stored;
  } catch {
    /* localStorage unavailable — fall through to system */
  }
  return 'dark';
}

function systemPrefersDark(): boolean {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(resolved: 'light' | 'dark'): void {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

/**
 * Central theme provider. Replaces the duplicated inline dark-mode <script> in
 * every source template with a single source of truth: persists the choice to
 * localStorage (`theme`) and reacts to OS changes when in "system" mode.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(getStoredMode);

  const resolvedTheme: 'light' | 'dark' = useMemo(() => {
    if (mode === 'system') return systemPrefersDark() ? 'dark' : 'light';
    return mode;
  }, [mode]);

  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  // When following the system, respond to OS-level changes live.
  useEffect(() => {
    if (mode !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme(mql.matches ? 'dark' : 'light');
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore persistence failures */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(resolvedTheme === 'dark' ? 'light' : 'dark');
  }, [resolvedTheme, setMode]);

  const value = useMemo(
    () => ({ mode, resolvedTheme, setMode, toggle }),
    [mode, resolvedTheme, setMode, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
