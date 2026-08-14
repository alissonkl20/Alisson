"use client";

import { Circle } from "lucide-react";
import { experiences } from "@/lib/data";
import { SectionTitle } from "@/components/ui/NeonText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export function Experience() {
  return (
    <section id="experience" className="relative px-4 py-20 sm:px-6 sm:py-28 md:py-32">
      <div className="mx-auto max-w-4xl">
        <SectionTitle label="Career">Experience</SectionTitle>
        <ScrollReveal>
          <p className="-mt-8 mb-10 max-w-2xl text-[var(--text-secondary)]">
            A timeline of roles where I built, optimized, and shipped production software.
          </p>
        </ScrollReveal>

        <div className="exp-timeline relative flex flex-col gap-6">
          {experiences.map((exp, i) => (
            <ScrollReveal key={exp.id} delay={(i % 3) as 0 | 1 | 2}>
              <article className="grid grid-cols-1 items-start gap-4 md:grid-cols-[40px_1fr]">
                <div
                  className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--border-neon)] bg-[#0a0a0a] shadow-[0_0_20px_rgba(220,38,38,0.08)] transition-shadow hover:shadow-[0_0_20px_rgba(220,38,38,0.2)] md:flex"
                  aria-hidden="true"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-neon-red shadow-[0_0_10px_rgba(220,38,38,0.45)]" />
                </div>

                <div className="glass-card rounded-xl p-5 transition-transform duration-300 hover:translate-x-1 sm:p-6">
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <div>
                      <h3 className="font-[family-name:var(--font-space-grotesk)] text-lg font-semibold text-white">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-medium text-neon-red">{exp.company}</p>
                    </div>
                    <time className="font-[family-name:var(--font-space-grotesk)] text-xs tracking-wide text-white/40">
                      {exp.period}
                    </time>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {exp.description}
                  </p>

                  <ul className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <li key={tech} className="tech-tag">
                        <Circle size={10} className="fill-neon-red text-neon-red" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
