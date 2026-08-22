import type { ThemeMode } from "@/shared/config/theme";
import type { GlowTheme, GlowThemeKey } from "../types";

export const GLOW_THEMES: Record<GlowThemeKey, GlowTheme> = {
  brand: {
    id: "brand",
    label: "Portfolio",
    primary: "#ffd000",
    secondary: "#ffffff",
    glow: "#ffd000",
  },
  sapphire: {
    id: "sapphire",
    label: "Sapphire",
    primary: "#0ea5e9",
    secondary: "#38bdf8",
    glow: "#0ea5e9",
  },
  emerald: {
    id: "emerald",
    label: "Emerald",
    primary: "#10b981",
    secondary: "#34d399",
    glow: "#10b981",
  },
  amethyst: {
    id: "amethyst",
    label: "Amethyst",
    primary: "#8b5cf6",
    secondary: "#a78bfa",
    glow: "#8b5cf6",
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    primary: "#f59e0b",
    secondary: "#fbbf24",
    glow: "#f59e0b",
  },
  platinum: {
    id: "platinum",
    label: "Platinum",
    primary: "#94a3b8",
    secondary: "#cbd5e1",
    glow: "#94a3b8",
  },
};

/** Paleta da linha neon alinhada ao tema global do site */
export function resolveGlowTheme(key: GlowThemeKey, mode: ThemeMode): GlowTheme {
  if (key !== "brand") return GLOW_THEMES[key];

  if (mode === "light") {
    return {
      id: "brand",
      label: "Portfolio",
      primary: "#ff6a00",
      secondary: "#22c55e",
      glow: "#ff6a00",
    };
  }

  return GLOW_THEMES.brand;
}
