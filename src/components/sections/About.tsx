"use client";

import { Database, Code, Server, Wrench } from "lucide-react";
import { techCategories } from "@/lib/data";
import { SectionTitle } from "@/components/ui/NeonText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const categoryIcons: Record<string, React.ReactNode> = {
  "Back-end": <Server className="h-4 w-4 text-neon-red" strokeWidth={1.8} />,
  "Front-end": <Code className="h-4 w-4 text-neon-red" strokeWidth={1.8} />,
  "Banco de Dados": <Database className="h-4 w-4 text-neon-red" strokeWidth={1.8} />,
  Ferramentas: <Wrench className="h-4 w-4 text-neon-red" strokeWidth={1.8} />,
};

export function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-28 md:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionTitle label="Tech Stack">Skills &amp; Tools</SectionTitle>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {techCategories.map((cat, i) => (
            <ScrollReveal key={cat.title} delay={(i % 4) as 0 | 1 | 2 | 3}>
              <article className="glass-card group h-full rounded-xl p-5 transition-transform duration-300 hover:-translate-y-1">
                <h3 className="mb-3 flex items-center gap-2 font-[family-name:var(--font-space-grotesk)] text-xs font-semibold uppercase tracking-widest text-neon-red">
                  <span className="transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    {categoryIcons[cat.title]}
                  </span>
                  {cat.title}
                </h3>
                <ul className="flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-white/6 bg-white/4 px-2.5 py-1 text-xs text-[var(--text-secondary)] transition-colors group-hover:border-[rgba(220,38,38,0.2)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
