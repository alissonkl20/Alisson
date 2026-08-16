"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Download } from "lucide-react";
import { profile } from "@/lib/data";
import { useTypewriter } from "@/hooks/useTypewriter";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { NeonButton } from "@/components/ui/NeonButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { TechGrid } from "@/components/effects/TechGrid";

export function Hero() {
  const title = useTypewriter({ text: profile.title });
  const containerRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const backgroundBlur = useTransform(
    scrollYProgress,
    [0, 1],
    ["blur(0px)", "blur(20px)"],
  );
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75, 1], [1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative h-[200vh] max-md:h-auto max-md:min-h-[100dvh]"
    >
      <div className="sticky top-0 isolate flex h-[100dvh] items-center overflow-hidden pt-[var(--nav-height)] max-md:relative max-md:min-h-[100dvh]">
        <motion.div
          className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
          style={
            isDesktop
              ? {
                  scale: backgroundScale,
                  opacity: backgroundOpacity,
                  filter: backgroundBlur,
                  willChange: "transform, filter, opacity",
                }
              : { willChange: "transform" }
          }
          aria-hidden="true"
        >
          <Image
            src="/wallper.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            unoptimized
            className="object-cover object-center brightness-[1.05] contrast-[1.08] saturate-[1.05]"
          />
        </motion.div>

        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-black/35 to-black/70"
          aria-hidden="true"
        />

        <div className="pointer-events-none absolute inset-0 z-[2]">
          <TechGrid />
        </div>

        <motion.div
          className="page-container relative z-10 w-full"
          style={
            isDesktop
              ? { opacity: contentOpacity, y: contentY }
              : undefined
          }
        >
          <ScrollReveal>
              <p className="mb-2 text-sm tracking-wide text-[var(--text-secondary)]">
                Hello, I&apos;m
              </p>
            </ScrollReveal>

            <ScrollReveal delay={1}>
              <h1 className="mb-4 font-[family-name:var(--font-space-grotesk)] text-[clamp(2rem,8vw,4.5rem)] font-bold leading-[1.1] tracking-tight">
                Alisson{" "}
                <span className="text-neon-red-bright drop-shadow-[0_0_40px_rgba(220,38,38,0.15)]">
                  de Almeida
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="mb-5 flex min-h-[2.5rem] flex-wrap items-center gap-1">
                <span className="font-[family-name:var(--font-space-grotesk)] text-[clamp(1.125rem,4vw,1.875rem)] font-semibold">
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
              <p className="mb-8 max-w-xl text-sm leading-relaxed text-white sm:text-base [text-shadow:0_1px_8px_rgba(0,0,0,0.65)]">
                {profile.description}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <NeonButton href={profile.cvUrl} variant="primary" className="w-full sm:w-auto">
                  <Download size={16} />
                  Download CV
                </NeonButton>
                <NeonButton
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    document.getElementById("stacks")?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  View Projects
                </NeonButton>
              </div>
            </ScrollReveal>
        </motion.div>

        <motion.div
          className="absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-10 -translate-x-1/2 max-md:bottom-6"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <div className="h-10 w-px bg-gradient-to-b from-transparent via-neon-red/40 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
