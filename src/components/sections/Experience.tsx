"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experiences } from "@/lib/data";
import { SectionTitle } from "@/components/ui/NeonText";
import { GlowCard } from "@/components/ui/GlowCard";

gsap.registerPlugin(ScrollTrigger);

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!section || !timeline) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { filter: "brightness(0.3)" },
        {
          filter: "brightness(1)",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 1,
          },
        },
      );

      const items = timeline.querySelectorAll("[data-exp-item]");
      items.forEach((item, i) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: i % 2 === 0 ? -60 : 60,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            x: 0,
            filter: "blur(0px)",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          },
        );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="relative overflow-hidden px-6 py-32 md:py-40"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-neon-purple/5 to-transparent" />

      <motion.div
        className="pointer-events-none absolute inset-0 z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 1, 0] }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(0,212,255,0.05), transparent)",
        }}
      />

      <div className="relative z-20 mx-auto max-w-4xl">
        <SectionTitle subtitle="02 — Experiência">Experiência</SectionTitle>

        <div ref={timelineRef} className="relative">
          <div className="absolute left-6 top-0 h-full w-[1px] bg-gradient-to-b from-neon-blue/50 via-neon-purple/30 to-transparent md:left-1/2 md:-translate-x-1/2" />

          {experiences.map((exp, i) => (
            <div
              key={exp.id}
              data-exp-item
              className={`relative mb-16 flex ${
                i % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <div
                className={`ml-12 w-full md:ml-0 md:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "md:pr-8" : "md:pl-8"
                }`}
              >
                <GlowCard>
                  <span className="mb-2 block font-mono text-xs text-neon-blue/70">
                    {exp.period}
                  </span>
                  <h3 className="mb-1 text-xl font-semibold text-white">
                    {exp.role}
                  </h3>
                  <p className="mb-4 text-sm text-neon-purple/80">
                    {exp.company}
                  </p>
                  <p className="mb-4 text-sm leading-relaxed text-white/40">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/50"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </GlowCard>
              </div>

              <div className="absolute left-6 top-6 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-neon-blue bg-black shadow-[0_0_15px_rgba(0,212,255,0.5)] md:left-1/2" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
