export type ShapeKind = "frame" | "line" | "cursor";

export function buildTerminalShape(
  width: number,
  height: number,
): { x: number; y: number; kind: ShapeKind }[] {
  const pts: { x: number; y: number; kind: ShapeKind }[] = [];
  const pad = 18;
  const W = width - pad * 2;
  const H = height - pad * 2;
  const R = 12;
  const step = 4.6;
  const push = (x: number, y: number, kind: ShapeKind = "frame") =>
    pts.push({ x: pad + x, y: pad + y, kind });

  for (let x = R; x <= W - R; x += step) {
    push(x, 0);
    push(x, H);
  }
  for (let y = R; y <= H - R; y += step) {
    push(0, y);
    push(W, y);
  }
  const corners: [number, number, number, number][] = [
    [W - R, R, -Math.PI / 2, 0],
    [R, R, Math.PI, (3 * Math.PI) / 2],
    [R, H - R, Math.PI / 2, Math.PI],
    [W - R, H - R, 0, Math.PI / 2],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let a = a0; a <= a1; a += 0.16) {
      push(cx + R * Math.cos(a), cy + R * Math.sin(a));
    }
  }

  const titleY = 34;
  for (let x = 10; x <= W - 10; x += step) push(x, titleY);
  for (let i = 0; i < 3; i++) {
    const dx = 24 + i * 20;
    for (let a = 0; a < Math.PI * 2; a += 0.55) {
      push(dx + 5.5 * Math.cos(a), 17 + 5.5 * Math.sin(a));
    }
  }

  const lineWidths = [0.62, 0.45, 0.7, 0.3, 0.55, 0.38];
  const startY = titleY + 30;
  const lineStep = Math.max(22, (H - 60) / 7);
  lineWidths.forEach((ratio, li) => {
    const y = startY + li * lineStep;
    if (y > H - 16) return;
    const indent = li === 2 || li === 4 ? 30 : 0;
    const x0 = 22 + indent;
    const x1 = 22 + ratio * (W - 44);
    let x = x0;
    while (x < x1) {
      const wordLen = 18 + Math.random() * 40;
      const end = Math.min(x + wordLen, x1);
      for (let wx = x; wx < end; wx += 4.4) push(wx, y, "line");
      x += wordLen + 12;
    }
  });

  const cursorY = startY + 5 * lineStep;
  const cursorX = 22 + 0.38 * (W - 44) + 18;
  if (cursorY <= H - 16) {
    for (let dy = -7; dy <= 7; dy += 3) push(cursorX, cursorY + dy, "cursor");
  }

  return pts;
}
