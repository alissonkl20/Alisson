"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTheme } from "@/shared/context/ThemeContext";
import { resolveGlowTheme } from "../lib/themes";
import type {
  GlowTheme,
  GlowThemeKey,
  PinStyle,
  ProjectsTimelineConfig,
} from "../types";

const TimelineContext = createContext<{
  config: ProjectsTimelineConfig;
  setGlowTheme: (t: GlowThemeKey) => void;
  setGlowIntensity: (n: number) => void;
  setPinStyle: (s: PinStyle) => void;
  setCurveShape: (n: number) => void;
  theme: GlowTheme;
} | null>(null);

export function TimelineProvider({
  children,
  initial,
}: {
  children: ReactNode;
  initial: Partial<ProjectsTimelineConfig>;
}) {
  const { theme: siteTheme } = useTheme();
  const [glowTheme, setGlowTheme] = useState<GlowThemeKey>(
    initial.glowTheme ?? "brand",
  );
  const [glowIntensity, setGlowIntensity] = useState(
    initial.glowIntensity ?? 72,
  );
  const [pinStyle, setPinStyle] = useState<PinStyle>(
    initial.pinStyle ?? "glass-orb",
  );
  const [curveShape, setCurveShape] = useState(initial.curveShape ?? 0.85);

  const config: ProjectsTimelineConfig = useMemo(
    () => ({
      glowTheme,
      glowIntensity,
      pinStyle,
      curveShape,
      timelineItemHeight: initial.timelineItemHeight ?? 620,
      panelWidth: initial.panelWidth ?? 380,
      pinSize: initial.pinSize ?? 22,
      demo: initial.demo ?? true,
    }),
    [
      glowTheme,
      glowIntensity,
      pinStyle,
      curveShape,
      initial.timelineItemHeight,
      initial.panelWidth,
      initial.pinSize,
      initial.demo,
    ],
  );

  const theme = useMemo(
    () => resolveGlowTheme(glowTheme, siteTheme),
    [glowTheme, siteTheme],
  );

  return (
    <TimelineContext.Provider
      value={{
        config,
        setGlowTheme,
        setGlowIntensity,
        setPinStyle,
        setCurveShape,
        theme,
      }}
    >
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimelineContext() {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error("useTimelineContext requires TimelineProvider");
  return ctx;
}
