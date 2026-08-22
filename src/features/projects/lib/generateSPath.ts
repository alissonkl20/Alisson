export interface PathPoint {
  x: number;
  y: number;
  side: "left" | "right";
}

function milestoneY(
  index: number,
  count: number,
  height: number,
  padTop: number,
  padBottom: number,
) {
  const usable = Math.max(1, height - padTop - padBottom);
  if (count <= 1) return padTop + usable / 2;
  return padTop + (index * usable) / (count - 1);
}

export function generateSPath(
  width: number,
  height: number,
  count: number,
  curvature = 0.85,
  padY = 0,
  padBottom = padY,
): string {
  if (count < 2) {
    const y0 = milestoneY(0, 1, height, padY, padBottom);
    return `M ${width / 2} ${y0} L ${width / 2} ${height - padBottom}`;
  }

  const cx = width / 2;
  const amplitude = width * 0.34 * curvature;
  const points: { x: number; y: number }[] = [];

  for (let i = 0; i < count; i++) {
    const y = milestoneY(i, count, height, padY, padBottom);
    const x =
      cx +
      (i % 2 === 0 ? -amplitude : amplitude) *
        (i === 0 || i === count - 1 ? 0.15 : 1);
    points.push({ x, y });
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cpY = (curr.y + next.y) / 2;
    d += ` C ${curr.x} ${cpY}, ${next.x} ${cpY}, ${next.x} ${next.y}`;
  }

  return d;
}

export function getPathPoints(
  width: number,
  height: number,
  count: number,
  curvature = 0.85,
  padY = 0,
  padBottom = padY,
): PathPoint[] {
  if (count < 1) return [];

  const cx = width / 2;
  const amplitude = width * 0.34 * curvature;

  return Array.from({ length: count }, (_, i) => {
    const y = milestoneY(i, count, height, padY, padBottom);
    const x =
      cx +
      (i % 2 === 0 ? -amplitude : amplitude) *
        (i === 0 || i === count - 1 ? 0.15 : 1);
    return { x, y, side: i % 2 === 0 ? "left" : "right" };
  });
}
