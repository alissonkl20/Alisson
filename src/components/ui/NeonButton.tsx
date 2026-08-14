"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef, type ReactNode } from "react";

interface NeonButtonProps {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
  children?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}

const variants = {
  primary:
    "bg-neon-red border border-neon-red text-white hover:bg-neon-red-bright hover:border-neon-red-bright hover:shadow-[0_0_24px_rgba(220,38,38,0.45),0_0_48px_rgba(220,38,38,0.15)]",
  outline:
    "bg-transparent border border-[var(--border-neon)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--border-neon-hover)] hover:shadow-[0_0_20px_rgba(220,38,38,0.15)]",
  ghost:
    "bg-transparent border border-transparent text-[var(--text-secondary)] hover:bg-white/5 hover:border-[var(--border-neon)]",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      children,
      href,
      type = "button",
      disabled,
      onClick,
    },
    ref,
  ) => {
    const classes = cn(
      "glow-button relative inline-flex items-center justify-center gap-2 rounded-lg font-[family-name:var(--font-space-grotesk)] font-semibold transition-all duration-300",
      variants[variant],
      sizes[size],
      disabled && "pointer-events-none opacity-50",
      className,
    );

    if (href) {
      return (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          data-cursor-hover
        >
          {children}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        className={classes}
        whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        onClick={onClick}
        disabled={disabled}
        data-cursor-hover
      >
        {children}
      </motion.button>
    );
  },
);

NeonButton.displayName = "NeonButton";
