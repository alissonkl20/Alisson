"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  deleteSpeed?: number;
  pauseMs?: number;
  loop?: boolean;
  startDelay?: number;
}

export function useTypewriter({
  text,
  speed = 80,
  deleteSpeed = 40,
  pauseMs = 2200,
  loop = true,
  startDelay = 800,
}: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;
    let isDeleting = false;
    let timeout: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!isDeleting) {
        index = Math.min(index + 1, text.length);
        setDisplayed(text.slice(0, index));

        if (index === text.length) {
          if (!loop) return;
          timeout = setTimeout(() => {
            isDeleting = true;
            tick();
          }, pauseMs);
          return;
        }
        timeout = setTimeout(tick, speed);
      } else {
        index = Math.max(index - 1, 0);
        setDisplayed(text.slice(0, index));

        if (index === 0) {
          isDeleting = false;
          timeout = setTimeout(tick, 600);
          return;
        }
        timeout = setTimeout(tick, deleteSpeed);
      }
    };

    timeout = setTimeout(tick, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, deleteSpeed, pauseMs, loop, startDelay]);

  return displayed;
}
