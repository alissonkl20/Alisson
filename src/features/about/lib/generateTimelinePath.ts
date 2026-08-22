import type { CareerCardSide } from "./careerFlow";

export interface TimelineAnchor {
  x: number;
  y: number;
  side?: CareerCardSide;
}

export interface TimelinePathOptions {
  extendPastLast?: boolean;
  leadIn?: number;
  tension?: number;
  /** Amplitude uniforme das curvas S (coords 0–1000) */
  curveSpread?: number;
}

function clampIndex(i: number, max: number) {
  return Math.max(0, Math.min(max, i));
}

/** Catmull-Rom + curva S com amplitude fixa em todos os segmentos */
function smoothCurveSegment(
  p0: TimelineAnchor,
  p1: TimelineAnchor,
  p2: TimelineAnchor,
  p3: TimelineAnchor,
  tension: number,
  curveSpread: number,
) {
  const alpha = 0.38 * tension;

  const sign =
    p2.side === "right" ? 1 : p2.side === "left" ? -1 : 0;
  const flowX = sign * curveSpread;

  const cp1x = p1.x + (p2.x - p0.x) * alpha + flowX * 0.52;
  const cp1y = p1.y + (p2.y - p0.y) * alpha;
  const cp2x = p2.x - (p3.x - p1.x) * alpha + flowX * 0.34;
  const cp2y = p2.y - (p3.y - p1.y) * alpha;

  return { cp1x, cp1y, cp2x, cp2y };
}

export function generateTimelinePath(
  anchors: TimelineAnchor[],
  totalHeight: number,
  options: TimelinePathOptions = {},
): string {
  const {
    extendPastLast = false,
    leadIn = 16,
    tension = 0.82,
    curveSpread = 175,
  } = options;

  if (anchors.length === 0) {
    return `M 500 0 L 500 ${totalHeight}`;
  }

  const startY = Math.max(0, anchors[0]!.y - leadIn);
  const points: TimelineAnchor[] = [
    { x: anchors[0]!.x, y: startY },
    ...anchors,
  ];

  if (extendPastLast) {
    const last = anchors[anchors.length - 1]!;
    points.push({ x: last.x, y: totalHeight });
  }

  if (points.length < 2) {
    return `M ${points[0]!.x} ${points[0]!.y}`;
  }

  const last = points.length - 1;
  let d = `M ${points[0]!.x} ${points[0]!.y}`;

  for (let i = 0; i < last; i++) {
    const p0 = points[clampIndex(i - 1, last)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[clampIndex(i + 2, last)]!;

    const { cp1x, cp1y, cp2x, cp2y } = smoothCurveSegment(
      p0,
      p1,
      p2,
      p3,
      tension,
      curveSpread,
    );

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }

  return d;
}