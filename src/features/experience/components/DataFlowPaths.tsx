"use client";

import { motion } from "framer-motion";
import type { DataFlowSceneLayout } from "../lib/dataFlowLayout";
import { useDataFlowTheme } from "../context/DataFlowThemeProvider";

const PATH_ENTER = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1] as const,
};

interface DataFlowPathsProps {
  layout: DataFlowSceneLayout;
  active: boolean;
}

export function DataFlowPaths({ layout, active }: DataFlowPathsProps) {
  const { theme } = useDataFlowTheme();
  const { paths, width, height } = layout;

  if (!active || paths.length === 0) return null;

  return (
    <svg
      className="data-flow-paths"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {paths.map((p, index) => {
        const d = `M ${p.from.x} ${p.from.y} C ${p.c1.x} ${p.c1.y}, ${p.c2.x} ${p.c2.y}, ${p.to.x} ${p.to.y}`;
        const delay = index * 0.05;

        return (
          <g key={p.id}>
            <motion.path
              d={d}
              fill="none"
              stroke={theme.primary}
              strokeWidth={5}
              strokeLinecap="round"
              initial={{ strokeOpacity: 0 }}
              animate={{ strokeOpacity: active ? [0.08, 0.28, 0.08] : 0 }}
              transition={{
                strokeOpacity: {
                  duration: 2.4,
                  repeat: active ? Infinity : 0,
                  ease: [0.25, 0.46, 0.45, 0.94],
                  delay: delay + PATH_ENTER.duration * 0.5,
                },
              }}
            />
            <motion.path
              d={d}
              fill="none"
              stroke={theme.secondary}
              strokeWidth={2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                pathLength: active ? 1 : 0,
                opacity: active ? 0.45 : 0,
              }}
              transition={{
                pathLength: {
                  duration: PATH_ENTER.duration,
                  delay,
                  ease: PATH_ENTER.ease,
                },
                opacity: {
                  duration: PATH_ENTER.duration * 0.5,
                  delay,
                },
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}
