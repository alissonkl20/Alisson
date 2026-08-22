"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Progresso 0→1 de revelação por índice de letra */
export function getLetterReveal(
  scrollProgress: number,
  index: number,
  total: number,
  stagger = 0.88,
): number {
  if (total <= 1) return scrollProgress;
  const span = stagger / total;
  const start = (index / total) * (1 - span);
  const end = start + span;
  return clamp((scrollProgress - start) / Math.max(end - start, 0.0001), 0, 1);
}

/**
 * Revelação guiada pelo scroll sem setState por frame.
 * O consumidor atualiza transform/opacity via refs (main-thread leve).
 */
export function useScrambleTextReveal(
  containerRef: RefObject<HTMLElement | null>,
  text: string,
) {
  const reducedMotion = useReducedMotion() ?? false;
  const letters = useMemo(() => Array.from(text), [text]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const progressRef = useRef(0);
  const onProgressRef = useRef<((value: number) => void) | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    progressRef.current = scrollYProgress.get();
    setScrollProgress(progressRef.current);
  }, [scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    progressRef.current = value;
    onProgressRef.current?.(value);
    // Hint de scroll: atualiza React só em passos grosseiros (~4%).
    setScrollProgress((prev) =>
      Math.abs(prev - value) > 0.04 || value <= 0.01 || value >= 0.99
        ? value
        : prev,
    );
  });

  return {
    letters,
    scrollProgress,
    reducedMotion,
    progressRef,
    onProgressRef,
  };
}
