"use client";

import { Suspense } from "react";
import { Navbar } from "@/shared/ui/Navbar";
import { CustomCursor } from "@/shared/ui/CustomCursor";
import { ChatWidget } from "@/shared/ui/ChatWidget";
import { DeferredSection } from "@/shared/ui/DeferredSection";
import {
  LazyAboutSection,
  LazyExperienceSection,
  LazyGitHubSection,
  LazyProjectsSection,
} from "../hooks/useLazyLoadSections";

function SectionFallback() {
  return (
    <div
      className="flex min-h-[50vh] items-center justify-center text-theme-text-muted"
      aria-hidden
    />
  );
}

export function MainPortfolio() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main>
        {/* About é o primeiro conteúdo visível: monta imediatamente. */}
        <Suspense fallback={<SectionFallback />}>
          <LazyAboutSection />
        </Suspense>
        {/* Seções pesadas (WebGL/timelines) montam só perto do viewport. */}
        <DeferredSection rootMargin="35% 0px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <LazyExperienceSection />
          </Suspense>
        </DeferredSection>
        <DeferredSection rootMargin="35% 0px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <LazyProjectsSection />
          </Suspense>
        </DeferredSection>
        <DeferredSection rootMargin="35% 0px" fallback={<SectionFallback />}>
          <Suspense fallback={<SectionFallback />}>
            <LazyGitHubSection />
          </Suspense>
        </DeferredSection>
      </main>
      <ChatWidget />
    </>
  );
}
