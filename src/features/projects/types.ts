export type GlowThemeKey =
  | "brand"
  | "sapphire"
  | "emerald"
  | "amethyst"
  | "sunset"
  | "platinum";

export type PinStyle = "glass-orb" | "diamond-facets";

export interface GlowTheme {
  id: GlowThemeKey;
  label: string;
  primary: string;
  secondary: string;
  glow: string;
}

export interface TimelineProject {
  id: string | number;
  title: string;
  category: string;
  date?: string;
  description: string;
  image?: string;
  video?: string;
  link?: string;
  linkLabel?: string;
  initials?: string;
  featured?: boolean;
}

export interface ProjectsTimelineConfig {
  glowTheme: GlowThemeKey;
  glowIntensity: number;
  pinStyle: PinStyle;
  curveShape: number;
  timelineItemHeight: number;
  panelWidth: number;
  pinSize: number;
  demo: boolean;
}

export interface ProjectsTimelineProps {
  projects?: TimelineProject[];
  demo?: boolean;
  glowTheme?: GlowThemeKey;
  glowIntensity?: number;
  pinStyle?: PinStyle;
  curveShape?: number;
  timelineItemHeight?: number;
  panelWidth?: number;
  pinSize?: number;
  showControls?: boolean;
}
