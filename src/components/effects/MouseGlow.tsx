"use client";

import { useMousePosition } from "@/hooks/useMousePosition";

export function MouseGlow() {
  const { x, y } = useMousePosition();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-300"
      aria-hidden="true"
      style={{
        background: `radial-gradient(500px circle at ${x}px ${y}px, rgba(0, 229, 255, 0.035), transparent 40%)`,
      }}
    />
  );
}
