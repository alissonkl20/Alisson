"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useChatLauncherScroll(locked: boolean): { tucked: boolean } {
  const reduceMotion = useReducedMotion() ?? false;
  const [tucked, setTucked] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    let lastY = window.scrollY;
    let frame = 0;
    let idle = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        const delta = y - lastY;
        lastY = y;

        if (locked || y < 48) {
          setTucked(false);
          return;
        }
        if (delta > 10) setTucked(true);
        else if (delta < -8) setTucked(false);
      });
    };

    const onIdle = () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        if (!locked) setTucked(false);
      }, 1400);
    };

    const onMove = () => {
      onScroll();
      onIdle();
    };

    window.addEventListener("scroll", onMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onMove);
      window.clearTimeout(idle);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [locked, reduceMotion]);

  return { tucked: tucked && !locked && !reduceMotion };
}
