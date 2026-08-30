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
export const LazyGitHubSection = lazy(() =>
  import("@/features/github").then((m) => ({ default: m.GitHubSection })),
);
export const LazyPromptSection = lazy(() =>
  import("@/features/prompt").then((m) => ({
    default: m.PromptSection,
  })),
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
      if (cancelled) return;
      await idle();
      if (cancelled) return;
      await import("@/features/prompt");
      if (cancelled) return;
      await idle();
      if (cancelled) return;
      await import("@/features/github");
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled]);
}
