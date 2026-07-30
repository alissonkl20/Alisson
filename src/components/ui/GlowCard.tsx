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
      x: ((y - centerY) / centerY) * -8,
      y: ((x - centerX) / centerX) * 8,
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
        "glass-card group relative overflow-hidden rounded-2xl p-6 transition-shadow duration-500",
        "hover:shadow-[0_0_40px_rgba(0,212,255,0.1)]",
        className,
      )}
      style={{
        transform: tilt
          ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`
          : undefined,
        transition: "transform 0.15s ease-out",
      }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at ${glow.x}% ${glow.y}%, rgba(0,212,255,0.08), transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
