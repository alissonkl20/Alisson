"use client";

import { Suspense } from "react";
import { Navbar } from "@/shared/ui/Navbar";
import { ChatWidget } from "@/shared/ui/ChatWidget";
import { DeferredSection } from "@/shared/ui/DeferredSection";
import {
  LazyAboutSection,
  LazyExperienceSection,
  LazyGitHubSection,
  LazyPromptSection,
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
      <Navbar />
      <main>
        <Suspense fallback={<SectionFallback />}>
          <LazyAboutSection />
        </Suspense>
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
        <div id="skills">
          <DeferredSection rootMargin="35% 0px" fallback={<SectionFallback />}>
            <Suspense fallback={<SectionFallback />}>
              <LazyPromptSection />
            </Suspense>
          </DeferredSection>
        </div>
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
