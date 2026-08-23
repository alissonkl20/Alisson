import type { DataFlowNodeLayout } from "../types";

export type FlowLayoutMode = "mobile" | "tablet" | "desktop";

/** Node + icon scale on mobile portrait pipeline */
export const MOBILE_NODE_SCALE = 0.82;

export function getEffectiveNodeSize(
  layoutMode: FlowLayoutMode,
  nodeSize: number,
): number {
  return layoutMode === "mobile" ? nodeSize * MOBILE_NODE_SCALE : nodeSize;
}

export interface FlowPath {
  id: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
  c1: { x: number; y: number };
  c2: { x: number; y: number };
}

const INPUT_TARGET: Record<string, string> = {
  sdd: "frontend",
  tdd: "frontend",
  design: "backend",
  analytics: "backend",
};

const INPUT_ITEMS: Array<Pick<DataFlowNodeLayout, "id" | "label" | "icon">> = [
  { id: "sdd", label: "SDD", icon: "sdd" },
  { id: "tdd", label: "TDD", icon: "tdd" },
  { id: "design", label: "System Design", icon: "design" },
  { id: "analytics", label: "Analytics", icon: "chart" },
];

/** Altura visual do nó + label abaixo (alinha com DataFlowNodes / CSS) */
function inputNodeExtents(nodeSize: number, label: string) {
  const nodeH = 72 * nodeSize;
  const half = nodeH / 2;
  const labelGap = 8;
  const labelH = label.length > 12 ? 34 : 17;

  return { half, labelGap, labelH, footprint: nodeH + labelGap + labelH };
}

function nodeVerticalExtents(
  item: Pick<DataFlowNodeLayout, "type" | "label">,
  nodeSize: number,
) {
  const labelGap = 8;
  const labelH = item.label.length > 12 ? 34 : 17;

  if (item.type === "user") {
    const nodeH = 68;
    const half = nodeH / 2;
    return { half, labelGap, labelH, footprint: nodeH + labelGap + labelH };
  }

  const nodeH =
    item.type === "server"
      ? 92 * nodeSize
      : item.type === "center"
        ? 88 * nodeSize
        : 72 * nodeSize;
  const half = nodeH / 2;

  return { half, labelGap, labelH, footprint: nodeH + labelGap + labelH };
}

/** Stacks nodes top → bottom with even spacing inside the band */
function layoutVerticalPipeline(
  x: number,
  bandTop: number,
  bandBottom: number,
  items: Array<Omit<DataFlowNodeLayout, "x" | "y">>,
  nodeSize: number,
  minGap = 14,
): DataFlowNodeLayout[] {
  const extents = items.map((item) => nodeVerticalExtents(item, nodeSize));

  const buildCenters = (gap: number) => {
    const centers = [0];
    for (let i = 0; i < items.length - 1; i++) {
      const current = extents[i];
      const next = extents[i + 1];
      const step =
        current.half + current.labelGap + current.labelH + gap + next.half;
      centers.push(centers[i] + step);
    }
    return centers;
  };

  const columnHeight = (centers: number[]) => {
    const last = items.length - 1;
    const top = centers[0] - extents[0].half;
    const bottom =
      centers[last] +
      extents[last].half +
      extents[last].labelGap +
      extents[last].labelH;
    return bottom - top;
  };

  let gap = minGap;
  let centers = buildCenters(gap);
  const bandHeight = bandBottom - bandTop;
  let height = columnHeight(centers);

  if (height > bandHeight && items.length > 1) {
    gap = Math.max(
      8,
      minGap - (height - bandHeight) / (items.length - 1),
    );
    centers = buildCenters(gap);
    height = columnHeight(centers);
  }

  const top = centers[0] - extents[0].half;
  const offsetY = bandTop + Math.max(0, (bandHeight - height) / 2) - top;

  return items.map((item, index) => ({
    ...item,
    x,
    y: centers[index] + offsetY,
  }));
}

/** Empilha SDD → TDD → System Design → Analytics com gap livre entre ícone e texto */
function layoutVerticalInputStack(
  x: number,
  bandTop: number,
  bandBottom: number,
  nodeSize: number,
  minGap = 18,
): DataFlowNodeLayout[] {
  const extents = INPUT_ITEMS.map((item) => inputNodeExtents(nodeSize, item.label));

  const buildCenters = (gap: number) => {
    const centers = [0];
    for (let i = 0; i < INPUT_ITEMS.length - 1; i++) {
      const current = extents[i];
      const next = extents[i + 1];
      const step =
        current.half + current.labelGap + current.labelH + gap + next.half;
      centers.push(centers[i] + step);
    }
    return centers;
  };

  const columnHeight = (centers: number[]) => {
    const last = INPUT_ITEMS.length - 1;
    const top = centers[0] - extents[0].half;
    const bottom =
      centers[last] +
      extents[last].half +
      extents[last].labelGap +
      extents[last].labelH;
    return bottom - top;
  };

  let gap = minGap;
  let centers = buildCenters(gap);
  const bandHeight = bandBottom - bandTop;
  let height = columnHeight(centers);

  if (height > bandHeight && INPUT_ITEMS.length > 1) {
    gap = Math.max(
      10,
      minGap - (height - bandHeight) / (INPUT_ITEMS.length - 1),
    );
    centers = buildCenters(gap);
    height = columnHeight(centers);
  }

  const top = centers[0] - extents[0].half;
  const offsetY = bandTop + Math.max(0, (bandHeight - height) / 2) - top;

  return INPUT_ITEMS.map((item, index) => ({
    ...item,
    x,
    y: centers[index] + offsetY,
    type: "input" as const,
  }));
}

function inputNodesById(nodes: DataFlowNodeLayout[]) {
  return Object.fromEntries(
    nodes.filter((node) => node.type === "input").map((node) => [node.id, node]),
  ) as Record<string, DataFlowNodeLayout>;
}

/** Breakpoints — mobile uses a portrait, top-to-bottom pipeline */
export function getFlowLayoutMode(width: number, height?: number): FlowLayoutMode {
  if (width < 640) return "mobile";

  const isLandscape = height != null && height > 0 && width / height >= 1.35;
  if (isLandscape && width >= 640) {
    if (width < 1024) return "tablet";
    return "desktop";
  }

  if (width < 1024) return "tablet";
  return "desktop";
}

/** Raio visual real dos nós HTML — deve coincidir com DataFlowNodes */
export function getVisualNodeRadius(
  type: DataFlowNodeLayout["type"],
  nodeSize: number,
): number {
  switch (type) {
    case "server":
      return (92 * nodeSize) / 2;
    case "center":
      return (88 * nodeSize) / 2;
    case "user":
      return 26;
    default:
      return (72 * nodeSize) / 2;
  }
}

export interface DataFlowSceneLayout {
  nodes: DataFlowNodeLayout[];
  paths: FlowPath[];
  width: number;
  height: number;
  layoutMode: FlowLayoutMode;
  nodeSize: number;
}

/** Layout único — nós, paths e partículas compartilham as mesmas coordenadas */
export function createDataFlowSceneLayout(
  width: number,
  height: number,
  nodeSize: number,
): DataFlowSceneLayout | null {
  if (width <= 0 || height <= 0) return null;

  const layoutMode = getFlowLayoutMode(width, height);
  const effectiveNodeSize = getEffectiveNodeSize(layoutMode, nodeSize);
  const nodes = getNodeLayouts(width, height, layoutMode, effectiveNodeSize);
  const paths = buildFlowPaths(nodes, layoutMode, effectiveNodeSize);

  return { nodes, paths, width, height, layoutMode, nodeSize: effectiveNodeSize };
}

function safeBox(w: number, h: number) {
  const padX = Math.max(20, w * 0.05);
  const padY = Math.max(24, h * 0.06);
  return {
    padX,
    padY,
    innerW: Math.max(200, w - padX * 2),
    innerH: Math.max(220, h - padY * 2),
    cx: w * 0.5,
    cy: h * 0.5,
  };
}

/** Centraliza o grafo no meio do viewport (x e y) */
function centerNodesInViewport(
  nodes: DataFlowNodeLayout[],
  w: number,
  h: number,
): DataFlowNodeLayout[] {
  if (nodes.length === 0) return nodes;

  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const graphCx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const graphCy = (Math.min(...ys) + Math.max(...ys)) / 2;
  const dx = w * 0.5 - graphCx;
  const dy = h * 0.5 - graphCy;

  return nodes.map((node) => ({
    ...node,
    x: node.x + dx,
    y: node.y + dy,
  }));
}

export function getNodeLayouts(
  w: number,
  h: number,
  mode: FlowLayoutMode,
  nodeSize = 1,
): DataFlowNodeLayout[] {
  const { padY, innerW, innerH, cx } = safeBox(w, h);
  const y = (t: number) => padY + innerH * t;

  if (mode === "mobile") {
    const pipeline: Array<Omit<DataFlowNodeLayout, "x" | "y">> = [
      ...INPUT_ITEMS.map((item) => ({ ...item, type: "input" as const })),
      {
        id: "frontend",
        label: "Frontend",
        type: "center",
        icon: "frontend",
      },
      {
        id: "backend",
        label: "Backend",
        type: "center",
        icon: "backend",
      },
      { id: "server", label: "Server", type: "server", icon: "server" },
      { id: "user", label: "User", type: "user", icon: "user" },
    ];

    return centerNodesInViewport(
      layoutVerticalPipeline(
        cx,
        padY + innerH * 0.02,
        padY + innerH * 0.98,
        pipeline,
        nodeSize,
        12,
      ),
      w,
      h,
    );
  }

  if (mode === "tablet") {
    const spread = innerW * 0.36;
    const inputs = layoutVerticalInputStack(
      cx - spread,
      padY + innerH * 0.04,
      padY + innerH * 0.56,
      nodeSize,
    );
    const byId = inputNodesById(inputs);
    const frontendY = (byId.sdd.y + byId.tdd.y) / 2;
    const backendY = (byId.design.y + byId.analytics.y) / 2;

    return centerNodesInViewport(
      [
        ...inputs,
        { id: "frontend", label: "Frontend", x: cx - spread * 0.35, y: frontendY, type: "center", icon: "frontend" },
        { id: "backend", label: "Backend", x: cx + spread * 0.68, y: backendY, type: "center", icon: "backend" },
        { id: "server", label: "Server", x: cx, y: y(0.66), type: "server", icon: "server" },
        { id: "user", label: "User", x: cx, y: y(0.88), type: "user", icon: "user" },
      ],
      w,
      h,
    );
  }

  const spread = Math.min(innerW * 0.44, 400);
  const col = {
    inputs: cx - spread * 1.35,
    cores: cx - spread * 0.08,
    server: cx + spread * 0.62,
    user: cx + spread * 1.18,
  };

  const inputs = layoutVerticalInputStack(
    col.inputs,
    padY + innerH * 0.06,
    padY + innerH * 0.94,
    nodeSize,
  );
  const byId = inputNodesById(inputs);
  const frontendY = (byId.sdd.y + byId.tdd.y) / 2;
  const backendY = (byId.design.y + byId.analytics.y) / 2;
  const pipelineY = (frontendY + backendY) / 2;

  return centerNodesInViewport(
    [
      ...inputs,
      { id: "frontend", label: "Frontend", x: col.cores, y: frontendY, type: "center", icon: "frontend" },
      { id: "backend", label: "Backend", x: col.cores, y: backendY, type: "center", icon: "backend" },
      { id: "server", label: "Server", x: col.server, y: pipelineY, type: "server", icon: "server" },
      { id: "user", label: "User", x: col.user, y: pipelineY, type: "user", icon: "user" },
    ],
    w,
    h,
  );
}

function boundaryAnchor(
  node: DataFlowNodeLayout,
  peer: DataFlowNodeLayout,
  nodeSize: number,
): { x: number; y: number } {
  const r = getVisualNodeRadius(node.type, nodeSize);
  const dx = peer.x - node.x;
  const dy = peer.y - node.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: node.x + (dx / len) * r, y: node.y + (dy / len) * r };
}

export function buildFlowPaths(
  nodes: DataFlowNodeLayout[],
  mode: FlowLayoutMode,
  nodeSize: number,
): FlowPath[] {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const centers = nodes.filter((n) => n.type === "center");
  const inputs = nodes.filter((n) => n.type === "input");
  const server = nodes.find((n) => n.type === "server");
  const user = nodes.find((n) => n.type === "user");
  const paths: FlowPath[] = [];
  const verticalCurves = mode !== "desktop";

  for (const input of inputs) {
    const targetId = INPUT_TARGET[input.id];
    const center = targetId ? byId[targetId] : centers[0];
    if (!center) continue;

    paths.push(
      makeBezierPath(
        `in-${input.id}-${center.id}`,
        boundaryAnchor(input, center, nodeSize),
        boundaryAnchor(center, input, nodeSize),
        verticalCurves,
      ),
    );
  }

  if (server) {
    for (const center of centers) {
      paths.push(
        makeBezierPath(
          `core-${center.id}-server`,
          boundaryAnchor(center, server, nodeSize),
          boundaryAnchor(server, center, nodeSize),
          verticalCurves,
        ),
      );
    }

    if (user) {
      paths.push(
        makeBezierPath(
          "server-user",
          boundaryAnchor(server, user, nodeSize),
          boundaryAnchor(user, server, nodeSize),
          verticalCurves,
        ),
      );
    }
  }

  return paths;
}

function makeBezierPath(
  id: string,
  from: { x: number; y: number },
  to: { x: number; y: number },
  vertical: boolean,
): FlowPath {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (vertical || Math.abs(dy) >= Math.abs(dx)) {
    const midY = (from.y + to.y) / 2;
    return { id, from, to, c1: { x: from.x, y: midY }, c2: { x: to.x, y: midY } };
  }

  const midX = (from.x + to.x) / 2;
  return { id, from, to, c1: { x: midX, y: from.y }, c2: { x: midX, y: to.y } };
}

export function pointOnCubic(t: number, p: FlowPath): { x: number; y: number } {
  const u = 1 - t;
  return {
    x: u ** 3 * p.from.x + 3 * u ** 2 * t * p.c1.x + 3 * u * t ** 2 * p.c2.x + t ** 3 * p.to.x,
    y: u ** 3 * p.from.y + 3 * u ** 2 * t * p.c1.y + 3 * u * t ** 2 * p.c2.y + t ** 3 * p.to.y,
  };
}