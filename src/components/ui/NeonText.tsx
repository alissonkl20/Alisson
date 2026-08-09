"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NeonTextProps {
  children: React.ReactNode;
  className?: string;
  color?: "white" | "blue" | "purple" | "orange";
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
    orange: "neon-text-orange",
  }[color];

  const ledClass =
    ledSign && color === "orange"
      ? "led-sign-orange"
      : ledSign
        ? "led-sign"
        : undefined;

  return (
    <Tag
      className={cn(
        colorClass,
        ledClass,
        flicker && !ledSign && "led-pulse led-flicker",
        flicker && ledSign && color !== "orange" && "led-sign-flicker",
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

/** Títulos de seção com destaque neon laranja */
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
        <span className="mb-4 block text-sm font-mono uppercase tracking-[0.3em] text-neon-orange/80">
          {subtitle}
        </span>
      )}
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
        <NeonText color="orange">{children}</NeonText>
      </h2>
    </motion.div>
  );
}
