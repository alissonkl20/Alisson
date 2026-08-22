"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  /** Margem além do viewport para pré-montar antes de ficar visível. */
  rootMargin?: string;
}

/**
 * Monta a seção apenas quando ela se aproxima do viewport.
 * Evita que seções pesadas (ex.: WebGL do Experience) bloqueiem a
 * main-thread na montagem inicial logo após a intro.
 */
export function DeferredSection({
  children,
  fallback = null,
  rootMargin = "40% 0px",
}: DeferredSectionProps) {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const el = placeholderRef.current;
    if (!el || isNear) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setIsNear(true);
      },
      { rootMargin },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [isNear, rootMargin]);

  return <div ref={placeholderRef}>{isNear ? children : fallback}</div>;
}
