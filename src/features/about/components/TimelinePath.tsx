"use client";

import { useEffect, useId, useLayoutEffect, useRef } from "react";
import {
  useSpring,
  type MotionValue,
} from "framer-motion";
import { CAREER_FLOW } from "../lib/careerFlow";
import { clampPathProgress } from "../lib/pathDraw";

interface TimelinePathProps {
  pathD: string;
  progress: MotionValue<number>;
  lineColor: string;
  lineGlowColor: string;
  accentColor: string;
  reducedMotion: boolean;
  syncScroll?: boolean;
}

export function TimelinePath({
  pathD,
  progress,
  lineColor,
  lineGlowColor,
  accentColor,
  reducedMotion,
  syncScroll = false,
}: TimelinePathProps) {
  const uid = useId().replace(/:/g, "");
  const gradientId = `pt-grad-${uid}`;
  const glowId = `pt-glow-${uid}`;
  const tipGradId = `pt-tip-${uid}`;
  const pathRef = useRef<SVGPathElement>(null);
  const tipRef = useRef<SVGCircleElement>(null);
  const pathLengthRef = useRef(1);

  const viewBox = `0 0 ${CAREER_FLOW.pathHeight} ${CAREER_FLOW.pathHeight}`;

  const smoothProgress = useSpring(progress, {
    stiffness: 420,
    damping: 44,
    mass: 0.28,
  });

  const activeProgress =
    reducedMotion || syncScroll ? progress : smoothProgress;

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !pathD) return;

    const total = path.getTotalLength();
    if (total > 0) pathLengthRef.current = total;
  }, [pathD]);

  useEffect(() => {
    const path = pathRef.current;
    const tip = tipRef.current;
    if (!path || !pathD) return;

    const paint = (p: number) => {
      const total = pathLengthRef.current;
      if (total <= 0) return;

      const clamped = clampPathProgress(p);
      const drawn = total * clamped;
      const offset = total - drawn;

      path.style.strokeDasharray = `${total}`;
      path.style.strokeDashoffset = reducedMotion ? "0" : `${offset}`;

      if (tip && !reducedMotion) {
        const point = path.getPointAtLength(drawn);
        tip.setAttribute("cx", String(point.x));
        tip.setAttribute("cy", String(point.y));
        tip.style.opacity = clamped > 0.002 ? "0.92" : "0";
      }
    };

    paint(activeProgress.get());
    return activeProgress.on("change", paint);
  }, [activeProgress, pathD, reducedMotion]);

  return (
    <svg
      className="premium-timeline__svg"
      aria-hidden
      viewBox={viewBox}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={lineGlowColor} />
          <stop offset="45%" stopColor={lineColor} />
          <stop offset="100%" stopColor={accentColor} />
        </linearGradient>

        <radialGradient id={tipGradId}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="35%" stopColor={lineGlowColor} stopOpacity="0.95" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0" />
        </radialGradient>

        <filter id={glowId} x="-100%" y="-20%" width="300%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path
        d={pathD}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${glowId})`}
      />

      {!reducedMotion && (
        <circle
          ref={tipRef}
          r="12"
          fill={`url(#${tipGradId})`}
          filter={`url(#${glowId})`}
          opacity={0}
        />
      )}
    </svg>
  );
}
