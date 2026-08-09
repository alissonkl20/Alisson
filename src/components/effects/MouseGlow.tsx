"use client";

import { useEffect, useState } from "react";
import { useMousePosition } from "@/hooks/useMousePosition";

export function MouseGlow() {
  const { x, y } = useMousePosition();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    setEnabled(!prefersReduced && isFinePointer);
  }, []);

  if (!enabled) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300 max-md:hidden"
      aria-hidden="true"
      style={{
        background: `radial-gradient(500px circle at ${x}px ${y}px, rgba(0, 229, 255, 0.035), transparent 40%)`,
      }}
    />
  );
}
