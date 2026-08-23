"use client";

import type { ComponentType, CSSProperties } from "react";
import {
  Activity,
  BarChart3,
  Cpu,
  FileCode2,
  LayoutTemplate,
  Monitor,
  Server,
  TestTube2,
} from "lucide-react";
import { motion } from "framer-motion";
import type { DataFlowSceneLayout } from "../lib/dataFlowLayout";
import { useDataFlowTheme } from "../context/DataFlowThemeProvider";
import type { DataFlowNodeLayout } from "../types";

const ICONS: Record<
  string,
  ComponentType<{ size?: number; className?: string; style?: CSSProperties }>
> = {
  sdd: FileCode2,
  tdd: TestTube2,
  design: LayoutTemplate,
  frontend: Monitor,
  backend: Cpu,
  server: Server,
  chart: BarChart3,
  core: Activity,
};

const NODE_ENTER = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1] as const,
};

function anchorBox(
  x: number,
  y: number,
  width: number,
  height: number = width,
): CSSProperties {
  return {
    left: x - width / 2,
    top: y - height / 2,
    width,
    height,
    transformOrigin: "center center",
  };
}

function UserFigure({
  color,
  labelColor,
  showLabel,
  scale = 1,
}: {
  color: string;
  labelColor: string;
  showLabel: boolean;
  scale?: number;
}) {
  const figureW = Math.round(52 * scale);
  const figureH = Math.round(68 * scale);

  return (
    <div className="data-flow-user">
      <svg
        className="data-flow-user__figure"
        viewBox="0 0 48 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        width={figureW}
        height={figureH}
        aria-hidden
      >
        <circle cx="24" cy="12" r="9" stroke={color} strokeWidth="2.5" fill={`${color}22`} />
        <path
          d="M10 58 C10 42 16 34 24 34 C32 34 38 42 38 58"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          fill={`${color}18`}
        />
        <path d="M16 46 L24 38 L32 46" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
      {showLabel && (
        <span className="data-flow-user__label" style={{ color: labelColor }}>
          User
        </span>
      )}
    </div>
  );
}

function FlowNode({
  node,
  size,
  showLabel,
  theme,
  active,
  reducedMotion,
  index,
}: {
  node: DataFlowNodeLayout;
  size: number;
  showLabel: boolean;
  theme: ReturnType<typeof useDataFlowTheme>["theme"];
  active: boolean;
  reducedMotion: boolean;
  index: number;
}) {
  const enterDelay = reducedMotion ? 0 : index * 0.045;

  if (node.type === "user") {
    const userW = Math.round(56 * size);
    const userH = Math.round((showLabel ? 92 : 68) * size);

    return (
      <motion.div
        className="data-flow-node data-flow-node--user"
        style={anchorBox(node.x, node.y, userW, userH)}
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: active ? 1 : 0,
          y: active ? 0 : 10,
        }}
        transition={{
          duration: reducedMotion ? 0.15 : NODE_ENTER.duration,
          delay: reducedMotion ? 0 : enterDelay + 0.2,
          ease: NODE_ENTER.ease,
        }}
      >
        <UserFigure
          color={theme.primary}
          labelColor={theme.textColor}
          showLabel={showLabel}
          scale={size}
        />
      </motion.div>
    );
  }

  const Icon = ICONS[node.icon] ?? Activity;
  const isProcessing = node.type === "center" || node.type === "server";
  const base = (node.type === "server" ? 92 : isProcessing ? 88 : 72) * size;
  const iconBase = node.type === "server" ? 40 : isProcessing ? 28 : 22;
  const iconSize = Math.round(iconBase * size);

  return (
    <motion.div
      className={`data-flow-node data-flow-node--${node.type}`}
      style={{
        ...anchorBox(node.x, node.y, base),
        borderColor: theme.nodeBorder,
        background: theme.nodeBg,
        color: theme.textColor,
        boxShadow: `0 0 32px ${theme.primary}22, inset 0 1px 0 rgba(255,255,255,0.1)`,
      }}
      initial={{ opacity: 0, scale: 0.72 }}
      animate={{
        opacity: active ? 1 : 0,
        scale: active ? [1, isProcessing ? 1.05 : 1.03, 1] : 0.72,
      }}
      transition={
        reducedMotion
          ? { duration: 0.2 }
          : {
              opacity: {
                duration: NODE_ENTER.duration,
                delay: enterDelay,
                ease: NODE_ENTER.ease,
              },
              scale: {
                duration: isProcessing ? 2.4 : 3,
                repeat: active ? Infinity : 0,
                ease: "easeInOut",
                delay: enterDelay,
              },
            }
      }
    >
      {isProcessing && (
        <>
          <motion.div
            className="data-flow-node__ring data-flow-node__ring--outer"
            style={{
              borderColor: theme.ring,
              boxShadow: `0 0 24px ${theme.ring}55`,
            }}
            animate={reducedMotion ? {} : { rotate: 360 }}
            transition={{
              duration: node.type === "server" ? 10 : 12,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="data-flow-node__ring data-flow-node__ring--inner"
            style={{ color: theme.primary }}
            animate={reducedMotion ? {} : { rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </>
      )}

      <div className="data-flow-node__content">
        <Icon
          size={iconSize}
          className="data-flow-node__icon"
          style={{ color: theme.primary }}
          aria-hidden
        />
        {showLabel && (
          <span
            className={`data-flow-node__label${node.label.length > 12 ? " data-flow-node__label--wide" : ""}`}
            style={{ color: theme.textColor }}
          >
            {node.label}
          </span>
        )}
      </div>
    </motion.div>
  );
}

export function DataFlowNodes({
  layout,
  active,
  reducedMotion,
}: {
  layout: DataFlowSceneLayout;
  active: boolean;
  reducedMotion: boolean;
}) {
  const { config, theme } = useDataFlowTheme();
  const { nodes, width, height, nodeSize } = layout;

  return (
    <div
      className="data-flow-nodes"
      style={{ width, height }}
      aria-hidden={!active}
    >
      {nodes.map((node, index) => (
        <FlowNode
          key={node.id}
          node={node}
          index={index}
          size={nodeSize}
          showLabel={config.showLabels}
          theme={theme}
          active={active}
          reducedMotion={reducedMotion}
        />
      ))}
    </div>
  );
}
