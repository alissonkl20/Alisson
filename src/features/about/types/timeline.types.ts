import type { ReactNode } from "react";

export interface TimelineContentBlock {
  title: string;
  description?: string;
}

export interface TimelineStackCategory {
  area: string;
  items: string[];
}

export interface TimelineMilestone {
  year: string;
  text: string;
  /** Liga o marco ao card correspondente em #experience */
  experienceId?: number;
}

export interface TimelineHighlight {
  number: string;
  title: string;
}

export interface TimelineItem {
  id: string;
  number: string;
  title: string;
  subtitle?: string;
  /** Texto simples ou conteúdo customizado */
  description?: string | ReactNode;
  contentBlocks?: TimelineContentBlock[];
  stackCategories?: TimelineStackCategory[];
  milestones?: TimelineMilestone[];
  highlightsTitle?: string;
  highlights?: TimelineHighlight[];
  /** Texto de ligação para a próxima seção (ex: Experiência) */
  bridgeText?: string;
  bridgeHref?: string;
}

export const DEFAULT_PREMIUM_TIMELINE_PROPS = {
  lineColor: "var(--timeline-line)",
  lineGlowColor: "var(--timeline-glow)",
  accentColor: "var(--timeline-accent)",
  cardBackground: "var(--card-surface-bg)",
  scrollLength: 200,
  animationDuration: 0.6,
  eyebrow: "",
  heading: "Experiência",
} as const;
