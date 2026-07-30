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
    "bg-white/5 border border-white/10 hover:border-neon-blue/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]",
  outline:
    "bg-transparent border border-white/20 hover:border-neon-blue/60 hover:shadow-[0_0_20px_rgba(0,212,255,0.15)]",
  ghost: "bg-transparent border border-transparent hover:bg-white/5",
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
      "glow-button relative inline-flex items-center justify-center gap-2 rounded-full font-medium text-white transition-all duration-300 cursor-pointer",
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
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
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
        whileHover={{ scale: disabled ? 1 : 1.03 }}
        whileTap={{ scale: disabled ? 1 : 0.97 }}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </motion.button>
    );
  },
);

NeonButton.displayName = "NeonButton";
