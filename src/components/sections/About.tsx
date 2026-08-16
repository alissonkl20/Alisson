"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { NeonText } from "@/components/ui/NeonText";
import { DevCycleVisualization } from "@/components/effects/DevCycleVisualization";

export function About() {
  return (
    <section
      id="about"
      className="section-spacing relative overflow-x-hidden"
    >
      <div
        className="pointer-events-none absolute -left-[10%] top-[18%] h-72 w-72 rounded-full bg-[#00d4ff]/8 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-[8%] top-[30%] h-80 w-80 rounded-full bg-[#e056fd]/8 blur-[110px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[55%] h-64 w-96 -translate-x-1/2 rounded-full bg-[#ff3366]/6 blur-[90px]"
        aria-hidden="true"
      />

      <div className="page-container relative">
        <ScrollReveal className="mb-8 text-center sm:mb-12 md:mb-14">
          <p className="section-label justify-center mb-5">Tech Stack</p>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-[clamp(1.75rem,5vw,3.75rem)] font-bold tracking-tight">
            <NeonText color="red" ledSign as="span">
              Skills &amp; Tools
            </NeonText>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
            <span className="font-medium text-neon-red-bright drop-shadow-[0_0_20px_rgba(220,38,38,0.25)]">
              From planning to execution
            </span>
            {" "}— a complete view of the development lifecycle.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <DevCycleVisualization />
        </ScrollReveal>
      </div>
    </section>
  );
}
