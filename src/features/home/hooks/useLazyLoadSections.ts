"use client";

import { lazy, useEffect } from "react";

export const LazyAboutSection = lazy(() =>
  import("@/features/about").then((m) => ({ default: m.AboutSection })),
);
export const LazyExperienceSection = lazy(() =>
  import("@/features/experience").then((m) => ({
    default: m.ExperienceSection,
  })),
);
export const LazyProjectsSection = lazy(() =>
  import("@/features/projects").then((m) => ({ default: m.ProjectsSection })),
);

function idle(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(() => resolve(), { timeout: 1200 });
    } else {
      setTimeout(resolve, 300);
    }
  });
}

/**
 * Preload progressivo e sequencial dos chunks das sections:
 * About (prioridade) → Experience → Projects, com uma pausa em idle
 * entre cada um para a main-thread respirar.
 *
 * Começa assim que `enabled` vira true (início da intro): como a animação
 * de partículas é leve e propositalmente lenta, os chunks chegam prontos
 * antes do fim da intro — sem gargalo na montagem.
 */
export function useLazyLoadSections(enabled: boolean): void {
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    void (async () => {
      await import("@/features/about");
      if (cancelled) return;
      await idle();
      if (cancelled) return;
      await import("@/features/experience");
      if (cancelled) return;
      await idle();
      if (cancelled) return;
      await import("@/features/projects");
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
