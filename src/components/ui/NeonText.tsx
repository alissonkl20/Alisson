"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

interface NeonTextProps {
  children: React.ReactNode;
  className?: string;
  color?: "white" | "red" | "orange";
  ledSign?: boolean;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

export function NeonText({
  children,
  className,
  color = "white",
  ledSign = false,
  as: Tag = "span",
}: NeonTextProps) {
  const colorClass = {
    white: "neon-text",
    red: "neon-text-red",
    orange: "neon-text-red",
  }[color];

  const ledClass = ledSign && color !== "white" ? "led-sign-red" : ledSign ? "neon-text" : undefined;

  return <Tag className={cn(colorClass, ledClass, className)}>{children}</Tag>;
}

interface SectionTitleProps {
  children: React.ReactNode;
  label?: string;
  subtitle?: string;
  className?: string;
}

export function SectionTitle({ children, label, subtitle, className }: SectionTitleProps) {
  const displayLabel = label ?? subtitle;

  return (
    <ScrollReveal className={cn("mb-12 md:mb-16", className)}>
      {displayLabel && <p className="section-label">{displayLabel}</p>}
      <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
        <NeonText color="red" ledSign>
          {children}
        </NeonText>
      </h2>
    </ScrollReveal>
  );
}
