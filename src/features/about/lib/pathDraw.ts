/** Progresso normalizado 0–1 ao longo do path SVG */
export function clampPathProgress(p: number): number {
  return Math.max(0, Math.min(1, p));
}