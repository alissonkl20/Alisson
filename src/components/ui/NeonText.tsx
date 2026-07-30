"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonTextProps {
  children: React.ReactNode;
  className?: string;
  color?: "white" | "blue" | "purple";
  flicker?: boolean;
  ledSign?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function NeonText({
  children,
  className,
  color = "white",
  flicker = false,
  ledSign = false,
  as: Tag = "span",
}: NeonTextProps) {
  const colorClass = {
    white: "neon-text",
    blue: "neon-text-blue",
    purple: "neon-text-purple",
  }[color];

  return (
    <Tag
      className={cn(
        colorClass,
        ledSign && "led-sign",
        flicker && !ledSign && "led-pulse led-flicker",
        flicker && ledSign && "led-sign-flicker",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface SectionTitleProps {
  children: React.ReactNode;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, subtitle, className }: SectionTitleProps) {
  return (
    <motion.div
      className={cn("mb-16 md:mb-20", className)}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {subtitle && (
        <span className="mb-4 block text-sm font-mono uppercase tracking-[0.3em] text-neon-blue/80">
          {subtitle}
        </span>
      )}
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        <NeonText color="blue">{children}</NeonText>
      </h2>
    </motion.div>
  );
}
