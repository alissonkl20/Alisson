import type { TimelineAnchor } from "./generateTimelinePath";

/**
 * Amostragem do path — 240 pontos cobrem bem um S-path com ~8 âncoras.
 * Antes: 800 × N âncoras × 2 passes = ~12k getPointAtLength síncronos (freeze ~1–2s).
 * Agora: 1 sample + lookup O(1) por âncora.
 */
const SAMPLE_STEPS = 240;
/** Margem para cruzar um marco — deve ser igual na linha e nos nós */
export const PATH_HIT_EPSILON = 0.003;

/** Offsets do useScroll — devem coincidir com useCareerPathScroll */
export const CAREER_SCROLL_OFFSET = {
  start: 0.82,
  end: 0.05,
  /** Onde o nó deve alinhar na viewport quando o card está “ativo” */
  trigger: 0.48,
} as const;

export interface ScrollKeyframe {
  scrollT: number;
  pathT: number;
  rowIndex?: number;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

/** Scroll progress (0–1) quando o nó atinge a linha de trigger na viewport */
export function computeScrollTForNode(
  trackHeight: number,
  nodeOffsetY: number,
  viewportHeight: number,
): number {
  const { start, end, trigger } = CAREER_SCROLL_OFFSET;
  const vh = viewportHeight;
  const scrollRange = start * vh + trackHeight - end * vh;
  if (scrollRange <= 0) return 0;

  const p = (start * vh + nodeOffsetY - trigger * vh) / scrollRange;
  return clamp(p, 0, 1);
}

function getNodeOffsetY(
  trackEl: HTMLElement,
  row: HTMLElement,
  anchorSelector: string,
): number {
  const trackTop = trackEl.getBoundingClientRect().top;
  const anchor = row.querySelector<HTMLElement>(anchorSelector);

  if (!anchor) {
    const rowRect = row.getBoundingClientRect();
    return rowRect.top - trackTop + rowRect.height * 0.45;
  }

  const anchorRect = anchor.getBoundingClientRect();
  return anchorRect.top - trackTop + anchorRect.height / 2;
}

interface PathSample {
  xs: Float64Array;
  ys: Float64Array;
  total: number;
}

/** Amostra o path uma vez — reutilizado por todas as âncoras. */
function samplePath(pathD: string): PathSample | null {
  if (typeof document === "undefined" || !pathD) return null;

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);
  const total = path.getTotalLength();
  if (total <= 0) return null;

  const count = SAMPLE_STEPS + 1;
  const xs = new Float64Array(count);
  const ys = new Float64Array(count);

  for (let i = 0; i < count; i++) {
    const pt = path.getPointAtLength((i / SAMPLE_STEPS) * total);
    xs[i] = pt.x;
    ys[i] = pt.y;
  }

  return { xs, ys, total };
}

function nearestProgress(
  sample: PathSample,
  path: SVGPathElement,
  anchor: TimelineAnchor,
): number {
  const { xs, ys, total } = sample;
  let bestI = 0;
  let bestDist = Infinity;

  for (let i = 0; i < xs.length; i++) {
    const dx = xs[i]! - anchor.x;
    const dy = ys[i]! - anchor.y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      bestI = i;
    }
  }

  const step = total / SAMPLE_STEPS;
  let lo = Math.max(0, bestI * step - step);
  let hi = Math.min(total, bestI * step + step);

  for (let i = 0; i < 8; i++) {
    const mid = (lo + hi) / 2;
    const pt = path.getPointAtLength(mid);
    const dist =
      (pt.x - anchor.x) ** 2 + (pt.y - anchor.y) ** 2;
    const ptLo = path.getPointAtLength(lo);
    const dLo =
      (ptLo.x - anchor.x) ** 2 + (ptLo.y - anchor.y) ** 2;
    if (dist < dLo) lo = mid;
    else hi = mid;
  }

  return ((lo + hi) / 2) / total;
}

/** Posição normalizada (0–1) de cada âncora ao longo do comprimento do path */
export function getAnchorProgressOnPath(
  pathD: string,
  anchors: TimelineAnchor[],
): number[] {
  if (typeof document === "undefined" || !pathD || anchors.length === 0) {
    return [];
  }

  const sample = samplePath(pathD);
  if (!sample) return [];

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);

  return anchors.map((anchor) => nearestProgress(sample, path, anchor));
}

/**
 * Mede progresso de path + focus em um único sample (evita amostrar 2×).
 */
export function getPathProgressMaps(
  pathD: string,
  pathAnchors: TimelineAnchor[],
  focusAnchors: TimelineAnchor[],
): { allPathProgress: number[]; focusPathProgress: number[] } {
  if (typeof document === "undefined" || !pathD) {
    return { allPathProgress: [], focusPathProgress: [] };
  }

  const sample = samplePath(pathD);
  if (!sample) {
    return { allPathProgress: [], focusPathProgress: [] };
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathD);

  return {
    allPathProgress: pathAnchors.map((a) => nearestProgress(sample, path, a)),
    focusPathProgress: focusAnchors.map((a) => nearestProgress(sample, path, a)),
  };
}

export interface BuildKeyframesOptions {
  trackEl: HTMLElement;
  rowSelector: string;
  headerSelector: string;
  bridgeSelector: string;
  anchorSelector: string;
  allPathProgress: number[];
  focusPathProgress: number[];
}

/**
 * Keyframes scroll → path sincronizados com a posição de cada nó.
 * Sequência: 01 → 02 → 03 → 04 → ponte → 2026 → 2025 → 2024
 */
export function buildScrollKeyframes(
  options: BuildKeyframesOptions,
): ScrollKeyframe[] {
  const {
    trackEl,
    rowSelector,
    headerSelector,
    bridgeSelector,
    anchorSelector,
    allPathProgress,
    focusPathProgress,
  } = options;

  const trackH = trackEl.offsetHeight || 1;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  const keyframes: ScrollKeyframe[] = [{ scrollT: 0, pathT: 0 }];
  let anchorIdx = 0;
  let focusIdx = 0;

  for (const child of Array.from(trackEl.children)) {
    if (!(child instanceof HTMLElement)) continue;

    if (child.matches(rowSelector)) {
      const nodeOffsetY = getNodeOffsetY(trackEl, child, anchorSelector);
      const scrollT = computeScrollTForNode(trackH, nodeOffsetY, vh);

      keyframes.push({
        scrollT,
        pathT: focusPathProgress[focusIdx] ?? allPathProgress[anchorIdx] ?? scrollT,
        rowIndex: focusIdx,
      });
      anchorIdx += 1;
      focusIdx += 1;
      continue;
    }

    if (child.matches(headerSelector)) {
      const bridge = child.querySelector<HTMLElement>(bridgeSelector);
      if (bridge && allPathProgress[anchorIdx] != null) {
        const trackTop = trackEl.getBoundingClientRect().top;
        const bridgeRect = bridge.getBoundingClientRect();
        const bridgeY = bridgeRect.top - trackTop + bridgeRect.height / 2;
        keyframes.push({
          scrollT: computeScrollTForNode(trackH, bridgeY, vh),
          pathT: allPathProgress[anchorIdx]!,
        });
        anchorIdx += 1;
      }
    }
  }

  const lastPathT = allPathProgress[allPathProgress.length - 1] ?? 1;
  keyframes.push({ scrollT: 1, pathT: lastPathT });

  return keyframes
    .sort((a, b) => a.scrollT - b.scrollT)
    .filter(
      (kf, i, arr) => i === 0 || kf.scrollT > arr[i - 1]!.scrollT + 0.0005,
    );
}

/** Interpolação linear — scroll e traço avançam juntos entre cada nó */
export function interpolateScrollToPath(
  scrollP: number,
  keyframes: ScrollKeyframe[],
): number {
  if (keyframes.length === 0) return clamp(scrollP, 0, 1);

  const p = clamp(scrollP, 0, 1);
  if (p <= keyframes[0]!.scrollT) return keyframes[0]!.pathT;

  for (let i = 1; i < keyframes.length; i++) {
    const prev = keyframes[i - 1]!;
    const next = keyframes[i]!;
    if (p <= next.scrollT) {
      const range = next.scrollT - prev.scrollT || 0.001;
      const t = (p - prev.scrollT) / range;
      return prev.pathT + (next.pathT - prev.pathT) * t;
    }
  }

  return keyframes[keyframes.length - 1]!.pathT;
}

/** Índice do último nó alcançado pela linha (percussão progressiva) */
export function getLineReachIndex(
  pathP: number,
  focusPathProgress: number[],
): number {
  let reached = -1;
  for (let i = 0; i < focusPathProgress.length; i++) {
    if (pathP >= focusPathProgress[i]! - PATH_HIT_EPSILON) reached = i;
  }
  return reached;
}

/**
 * Escala do nó — interpolação linear no pathP (mesma base da ponta da linha).
 * Pico no marco; transição proporcional entre vizinhos.
 */
export function getNodePercussionScale(
  index: number,
  pathP: number,
  focusPathProgress: number[],
): number {
  const anchors = focusPathProgress;
  const n = anchors.length;
  if (n === 0) return 1;

  const p = clamp(pathP, 0, 1);
  const peak = 1.4;
  const passed = 1.12;

  const prev = index > 0 ? anchors[index - 1]! : 0;
  const center = anchors[index]!;
  const next = index < n - 1 ? anchors[index + 1]! : 1;

  if (p < prev - PATH_HIT_EPSILON) {
    return 1;
  }

  if (p >= prev - PATH_HIT_EPSILON && p <= center + PATH_HIT_EPSILON) {
    const range = center - prev || 0.001;
    const t = clamp((p - prev) / range, 0, 1);
    return 1 + (peak - 1) * t;
  }

  if (p > center + PATH_HIT_EPSILON && p <= next + PATH_HIT_EPSILON) {
    const range = next - center || 0.001;
    const t = clamp((p - center) / range, 0, 1);
    return peak - (peak - passed) * t;
  }

  if (p > next + PATH_HIT_EPSILON) {
    return passed;
  }

  return p >= center - PATH_HIT_EPSILON ? peak : 1;
}
