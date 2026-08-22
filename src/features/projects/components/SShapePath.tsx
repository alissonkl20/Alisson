"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { GlowFilter } from "./GlowFilter";
import type { GlowTheme } from "../types";

interface SShapePathProps {
  pathD: string;
  theme: GlowTheme;
  glowIntensity: number;
  progress: MotionValue<number>;
  reducedMotion: boolean;
}

export function SShapePath({
  pathD,
  theme,
  glowIntensity,
  progress,
  reducedMotion,
}: SShapePathProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(1);
  const filterId = useId().replace(/:/g, "");

  useEffect(() => {
    if (!pathRef.current) return;
    setPathLength(pathRef.current.getTotalLength() || 1);
  }, [pathD]);

  const dashOffset = useTransform(progress, (p) => {
    const clamped = Math.max(0, Math.min(1, p));
    return pathLength * (1 - clamped);
  });

  const strokeW = 2.5 + (glowIntensity / 100) * 2;

  return (
    <svg
      className="timeline-svg"
      aria-hidden
      preserveAspectRatio="none"
    >
      <GlowFilter
        theme={theme}
        intensity={glowIntensity}
        filterId={filterId}
      />

      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={strokeW}
        strokeLinecap="round"
      />

      <motion.path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={`url(#${filterId}-stroke)`}
        strokeWidth={strokeW}
        strokeLinecap="round"
        filter={`url(#${filterId}-neon)`}
        style={{
          strokeDasharray: pathLength,
          strokeDashoffset: reducedMotion ? 0 : dashOffset,
        }}
      />
    </svg>
  );
}
