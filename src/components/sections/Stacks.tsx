"use client";

import { SectionTitle } from "@/components/ui/NeonText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ProjectsCarousel } from "@/components/sections/ProjectsCarousel";

export function Stacks() {
  return (
    <section id="stacks" className="relative py-20 sm:py-28 md:py-32">
      <div className="mx-auto w-[90vw]">
        <SectionTitle label="Portfolio">Projects</SectionTitle>
        <ScrollReveal>
          <p className="-mt-8 mb-10 max-w-3xl text-[var(--text-secondary)]">
            Selected work spanning AI, automation, and full-stack product development.
          </p>
        </ScrollReveal>

        <ProjectsCarousel />
      </div>
    </section>
  );
}
