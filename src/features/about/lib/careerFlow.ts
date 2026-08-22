import { experienceData } from "./experienceData";
import { timelineData } from "./timelineData";

/** Layout da timeline — cores vêm de --timeline-* em globals.css */
export const CAREER_FLOW = {
  pathHeight: 1000,
  /** Largura da coluna central da linha (desktop) */
  lineColumnWidth: "5.5rem",
} as const;

export const CAREER_SKILL_COUNT = timelineData.length;
export const CAREER_EXPERIENCE_COUNT = experienceData.length;
export const CAREER_ROW_COUNT = CAREER_SKILL_COUNT + CAREER_EXPERIENCE_COUNT;

export type CareerCardSide = "left" | "right";

/**
 * Sequência zigzag: 01 direita, 02 esquerda, 03 direita…
 * Continua em 2026, 2025, 2024 sem reiniciar o índice.
 */
export function getCareerCardSide(
  globalIndex: number,
  isMobile = false,
): CareerCardSide {
  if (isMobile) return "right";
  return globalIndex % 2 === 0 ? "right" : "left";
}

export function experienceAnchorId(id: number) {
  return `experience-${id}`;
}
