"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DATA_FLOW_THEMES, applySiteLightDataFlowTheme } from "../lib/themes";
import type { DataFlowConfig, DataFlowTheme, DataFlowThemeKey } from "../types";
import { useTheme } from "@/shared/context/ThemeContext";
import type { ThemeMode } from "@/shared/config/theme";

const defaultConfig: DataFlowConfig = {
  theme: "dark",
  /** 1800 + trail travava a main-thread; 220 mantém o visual fluido. */
  particleCount: 220,
  speed: 1.2,
  nodeSize: 1,
  showLabels: true,
};

function resolveTheme(config: DataFlowConfig, siteMode: ThemeMode): DataFlowTheme {
  const base = DATA_FLOW_THEMES[config.theme];
  const resolved: DataFlowTheme = {
    ...base,
    primary: config.primaryColor ?? base.primary,
    secondary: config.secondaryColor ?? base.secondary,
    particle: config.primaryColor ?? base.particle,
    ring: config.secondaryColor ?? base.ring,
    cardAccent: config.primaryColor ?? base.cardAccent,
    cardBorder: config.primaryColor
      ? `${config.primaryColor}40`
      : base.cardBorder,
  };

  if (siteMode === "light") {
    return applySiteLightDataFlowTheme(resolved);
  }

  return resolved;
}

interface DataFlowContextValue {
  config: DataFlowConfig;
  theme: DataFlowTheme;
  setTheme: (t: DataFlowThemeKey) => void;
  setParticleCount: (n: number) => void;
  setSpeed: (n: number) => void;
  setNodeSize: (n: number) => void;
  setShowLabels: (v: boolean) => void;
  setCustomColors: (primary?: string, secondary?: string) => void;
}

const DataFlowContext = createContext<DataFlowContextValue | null>(null);

export function DataFlowThemeProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial?: Partial<DataFlowConfig>;
}) {
  const { theme: siteTheme } = useTheme();
  const [config, setConfig] = useState<DataFlowConfig>({ ...defaultConfig, ...initial });
  const targetTheme = useMemo(
    () => resolveTheme(config, siteTheme),
    [config, siteTheme],
  );
  const theme = targetTheme;

  const setTheme = useCallback((t: DataFlowThemeKey) => {
    setConfig((c) => ({ ...c, theme: t, primaryColor: undefined, secondaryColor: undefined }));
  }, []);

  const setCustomColors = useCallback((primary?: string, secondary?: string) => {
    setConfig((c) => ({ ...c, primaryColor: primary, secondaryColor: secondary }));
  }, []);

  const value = useMemo<DataFlowContextValue>(
    () => ({
      config,
      theme,
      setTheme,
      setParticleCount: (n) => setConfig((c) => ({ ...c, particleCount: n })),
      setSpeed: (n) => setConfig((c) => ({ ...c, speed: n })),
      setNodeSize: (n) => setConfig((c) => ({ ...c, nodeSize: n })),
      setShowLabels: (v) => setConfig((c) => ({ ...c, showLabels: v })),
      setCustomColors,
    }),
    [config, theme, setTheme, setCustomColors],
  );

  return (
    <DataFlowContext.Provider value={value}>{children}</DataFlowContext.Provider>
  );
}

export function useDataFlowTheme() {
  const ctx = useContext(DataFlowContext);
  if (!ctx) throw new Error("useDataFlowTheme requires DataFlowThemeProvider");
  return ctx;
}
