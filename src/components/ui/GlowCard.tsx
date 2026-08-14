"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef, useState, type MouseEvent, type ReactNode } from "react";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}

export function GlowCard({ children, className, tilt = true }: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || !tilt) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setRotate({
      x: ((y - centerY) / centerY) * -12,
      y: ((x - centerX) / centerX) * 12,
    });
    setGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlow({ x: 50, y: 50 });
  };

  return (
    <motion.div
      ref={ref}
      className={cn(
        "glass-card group relative overflow-hidden rounded-2xl p-6",
        "hover:shadow-[0_0_32px_rgba(220,38,38,0.15),0_8px_32px_rgba(0,0,0,0.4)]",
        className,
      )}
      style={{
        transform: tilt
          ? `perspective(800px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          : undefined,
        transition: "transform 0.15s ease-out, border-color 0.35s ease, box-shadow 0.35s ease",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor-hover
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(220,38,38,0.12), transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
      <div
        className="pointer-events-none absolute bottom-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-0 transition-opacity duration-350 group-hover:opacity-100"
        aria-hidden="true"
      />
    </motion.div>
  );
}
