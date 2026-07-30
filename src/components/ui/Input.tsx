"use client";

import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white",
      "placeholder:text-white/30 backdrop-blur-sm",
      "transition-all duration-300",
      "focus:border-neon-blue/50 focus:outline-none focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white",
      "placeholder:text-white/30 backdrop-blur-sm",
      "transition-all duration-300",
      "focus:border-neon-blue/50 focus:outline-none focus:shadow-[0_0_20px_rgba(0,212,255,0.1)]",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
