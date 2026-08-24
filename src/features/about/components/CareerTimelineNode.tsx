"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  getLineReachIndex,
  getNodePercussionScale,
  PATH_HIT_EPSILON,
} from "../lib/mapPathProgress";

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

interface CareerTimelineNodeProps {
  index: number;
  label: string;
  pathProgress: MotionValue<number>;
  focusPathProgress: number[];
}

export function CareerTimelineNode({
  index,
  label,
  pathProgress,
  focusPathProgress,
}: CareerTimelineNodeProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const prevPathP = useRef(0);
  const pulseTimeoutRef = useRef<number | null>(null);
  const [pulsing, setPulsing] = useState(false);

  useEffect(
    () => () => {
      if (pulseTimeoutRef.current != null) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
    },
    [],
  );

  const scale = useTransform(pathProgress, (pathP) =>
    reducedMotion
      ? getLineReachIndex(pathP, focusPathProgress) === index
        ? 1.4
        : index <= getLineReachIndex(pathP, focusPathProgress)
          ? 1.12
          : 1
      : getNodePercussionScale(index, pathP, focusPathProgress),
  );

  const leadOpacity = useTransform(scale, (s) => clamp01((s - 1.15) / 0.25));

  const passedOpacity = useTransform(scale, (s) => {
    const lead = clamp01((s - 1.15) / 0.25);
    const passed = clamp01((s - 1.02) / 0.1);
    return Math.max(0, passed * (1 - lead));
  });

  const baseOpacity = useTransform(scale, (s) => {
    const lead = clamp01((s - 1.15) / 0.25);
    const passed = clamp01((s - 1.02) / 0.1);
    return Math.max(0, 1 - Math.max(lead, passed));
  });

  useMotionValueEvent(pathProgress, "change", (pathP) => {
    const anchor = focusPathProgress[index];
    if (anchor == null || reducedMotion) {
      prevPathP.current = pathP;
      return;
    }

    const crossedForward =
      prevPathP.current < anchor - PATH_HIT_EPSILON &&
      pathP >= anchor - PATH_HIT_EPSILON;

    if (crossedForward) {
      if (pulseTimeoutRef.current != null) {
        window.clearTimeout(pulseTimeoutRef.current);
      }
      setPulsing(true);
      pulseTimeoutRef.current = window.setTimeout(() => {
        pulseTimeoutRef.current = null;
        setPulsing(false);
      }, 460);
    }

    prevPathP.current = pathP;
  });

  return (
    <div className="career-narrative__line-anchor" aria-hidden>
      <span className="career-narrative__node-wrap">
        {pulsing && !reducedMotion && (
          <motion.span
            className="career-narrative__node-ring"
            initial={{ scale: 1, opacity: 0.85 }}
            animate={{ scale: 2.35, opacity: 0 }}
            transition={{
              duration: 0.46,
              ease: [0.36, 0, 0.66, 1],
            }}
          />
        )}
        <motion.span
          className="career-narrative__node"
          data-career-anchor
          style={{ scale }}
        >
          <motion.span
            className="career-narrative__node-face career-narrative__node-face--base"
            style={{ opacity: baseOpacity }}
          />
          <motion.span
            className="career-narrative__node-face career-narrative__node-face--passed"
            style={{ opacity: passedOpacity }}
          />
          <motion.span
            className="career-narrative__node-face career-narrative__node-face--lead"
            style={{ opacity: leadOpacity }}
          />
        </motion.span>
      </span>
      <span className="career-narrative__node-label">{label}</span>
    </div>
  );
}
