"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NeonText } from "@/components/ui/NeonText";
import { ProjectsCarousel } from "@/components/sections/ProjectsCarousel";

export function Stacks() {
  return (
    <section id="stacks" className="relative overflow-hidden py-20 sm:py-28 md:py-32">
      <div
        className="pointer-events-none absolute -left-[10%] top-[15%] h-72 w-72 rounded-full bg-[#dc2626]/10 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[8%] bottom-[20%] h-80 w-80 rounded-full bg-[#7c3aed]/8 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="projects-section-grid pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-[92vw] max-w-7xl">
        <ScrollReveal className="mb-10 sm:mb-12 md:mb-14">
          <p className="section-label mb-5">Portfolio</p>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <NeonText color="red" ledSign as="span">
              Projects
            </NeonText>
          </h2>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            Selected work spanning{" "}
            <span className="font-medium text-neon-red-bright drop-shadow-[0_0_20px_rgba(220,38,38,0.25)]">
              AI, automation, and full-stack
            </span>{" "}
            product development.
          </p>
        </ScrollReveal>

        <ProjectsCarousel />
      </div>
    </section>
  );
}
