"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { type ThemeMode, THEME_STORAGE_KEY } from "@/shared/config/theme";
import {
  readLocalStorage,
  writeLocalStorage,
} from "@/shared/lib/safeStorage";

const THEME_CHANGE_EVENT = "portfolio-theme-change";
let fallbackTheme: ThemeMode = "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyTheme(mode: ThemeMode) {
  document.documentElement.setAttribute("data-theme", mode);
}

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  const stored = readLocalStorage(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") fallbackTheme = stored;
  return fallbackTheme;
}

function subscribeTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getInitialTheme,
    () => "dark" as ThemeMode,
  );

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    fallbackTheme = mode;
    writeLocalStorage(THEME_STORAGE_KEY, mode);
    applyTheme(mode);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
