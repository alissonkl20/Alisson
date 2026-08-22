"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  const n = parseInt(c, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
}

function lerpColor(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

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
  const [theme, setThemeState] = useState<DataFlowTheme>(targetTheme);
  const animRef = useRef<number | null>(null);
  const fromRef = useRef<DataFlowTheme>(targetTheme);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Primeira montagem: aplica tema sem lerp (evita ~450ms de re-renders na árvore).
    if (!mountedRef.current) {
      mountedRef.current = true;
      fromRef.current = targetTheme;
      setThemeState(targetTheme);
      return;
    }

    const from = fromRef.current;
    const to = targetTheme;
    if (from.id === to.id && from.primary === to.primary) {
      fromRef.current = to;
      setThemeState(to);
      return;
    }

    const start = performance.now();
    const duration = 450;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - (1 - t) ** 3;

      setThemeState({
        ...to,
        primary: lerpColor(from.primary, to.primary, ease),
        secondary: lerpColor(from.secondary, to.secondary, ease),
        particle: lerpColor(from.particle, to.particle, ease),
        ring: lerpColor(from.ring, to.ring, ease),
        cardAccent: lerpColor(from.cardAccent, to.cardAccent, ease),
        nodeBorder: to.nodeBorder,
        nodeBg: to.nodeBg,
        cardBg: to.cardBg,
        cardBorder: to.cardBorder,
        textColor: to.textColor,
        background: to.background,
        id: to.id,
        label: to.label,
      });

      if (t < 1) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [targetTheme]);

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
