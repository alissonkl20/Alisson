"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { profile } from "@/lib/data";
import { useTypewriter } from "@/hooks/useTypewriter";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TechGrid } from "@/components/effects/TechGrid";

export function Hero() {
  const title = useTypewriter({ text: profile.title });

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-4 pt-[var(--nav-height)] sm:px-6"
    >
      <TechGrid />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div>
          <ScrollReveal>
              <p className="mb-2 text-sm tracking-wide text-[var(--text-secondary)]">
                Hello, I&apos;m
              </p>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="mb-4 font-[family-name:var(--font-space-grotesk)] text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Alisson{" "}
                <span className="text-neon-red-bright drop-shadow-[0_0_40px_rgba(220,38,38,0.15)]">
                  de Almeida
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="mb-5 flex min-h-[2.5rem] flex-wrap items-center gap-1">
                <span className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold sm:text-2xl md:text-3xl">
                  {title}
                </span>
                <span className="typewriter-cursor" aria-hidden="true" />
              </div>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border-neon)] bg-[rgba(220,38,38,0.08)] px-3.5 py-1.5 text-xs font-medium text-neon-red sm:text-sm">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-red-bright shadow-[0_0_6px_rgba(220,38,38,0.45)]" />
                {profile.experience}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <p className="mb-8 max-w-xl text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
                {profile.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-wrap gap-4">
                <NeonButton href={profile.cvUrl} variant="primary">
                  <Download size={16} />
                  Download CV
                </NeonButton>
                <NeonButton
                  variant="outline"
                  onClick={() =>
                    document.getElementById("stacks")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View Projects
                </NeonButton>
              </div>
            </ScrollReveal>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        aria-hidden="true"
      >
        <div className="h-10 w-px bg-gradient-to-b from-transparent via-neon-red/40 to-transparent" />
      </motion.div>
    </section>
  );
}
