"use client";

import { useRef } from "react";
import { Briefcase, Calendar, Sparkles } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from "framer-motion";
import { experiences, type Experience as ExperienceItem } from "@/lib/data";
import { NeonText } from "@/components/ui/NeonText";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

const SMOOTH_EASE = [0.45, 0, 0.55, 1] as const;

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 72,
    scale: 0.94,
    filter: "blur(10px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 62,
      damping: 17,
      mass: 0.85,
    },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: SMOOTH_EASE },
  },
};

function TimelineNode({
  index,
  active,
  reduceMotion,
}: {
  index: number;
  active: boolean;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative hidden md:flex md:justify-center">
      {active && !reduceMotion && (
        <motion.span
          className="absolute inset-0 rounded-full bg-neon-red/25 blur-md"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1.8, opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}

      <motion.div
        className={cn(
          "relative z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-[#0a0a0a]",
          active
            ? "border-neon-red/70 shadow-[0_0_32px_rgba(220,38,38,0.45)]"
            : "border-neon-red/25 shadow-[0_0_16px_rgba(220,38,38,0.12)]",
        )}
        animate={
          reduceMotion
            ? undefined
            : active
              ? {
                  boxShadow: [
                    "0 0 20px rgba(220,38,38,0.25)",
                    "0 0 40px rgba(220,38,38,0.55)",
                    "0 0 20px rgba(220,38,38,0.25)",
                  ],
                  scale: [1, 1.06, 1],
                }
              : { scale: 1 }
        }
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          className={cn(
            "font-[family-name:var(--font-space-grotesk)] text-[10px] font-bold tracking-wider",
            active ? "text-neon-red-bright" : "text-neon-red",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>
    </div>
  );
}

function ExperienceCard({
  exp,
  index,
  reduceMotion,
}: {
  exp: ExperienceItem;
  index: number;
  reduceMotion: boolean | null;
}) {
  const cardRef = useRef<HTMLLIElement>(null);
  const isInView = useInView(cardRef, { margin: "-30% 0px -30% 0px", amount: 0.35 });

  return (
    <motion.li
      ref={cardRef}
      className={cn(
        "relative grid items-start gap-5 md:grid-cols-[44px_1fr] md:gap-7",
        index % 2 === 1 && "md:translate-x-2",
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={cardVariants}
    >
      <TimelineNode index={index} active={isInView} reduceMotion={reduceMotion} />

      <motion.article
        className={cn(
          "glass-card group relative overflow-hidden rounded-2xl transition-shadow duration-500",
          isInView && "shadow-[0_0_48px_rgba(220,38,38,0.18),0_16px_48px_rgba(0,0,0,0.45)]",
        )}
        whileHover={reduceMotion ? undefined : { y: -8, transition: { type: "spring", stiffness: 280, damping: 22 } }}
      >
        <motion.div
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-neon-red-bright to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.9, ease: SMOOTH_EASE }}
          aria-hidden="true"
        />

        <div
          className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-neon-red/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
          aria-hidden="true"
        />

        <div className="exp-card-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" aria-hidden="true" />

        <div className="relative border-l-2 border-neon-red/50 pl-5 pr-5 pt-5 pb-5 sm:pl-6 sm:pr-6 sm:pt-6 sm:pb-6 md:border-l-0 md:pl-7 md:pr-7 md:pt-7 md:pb-7">
          <motion.span
            className="pointer-events-none absolute -right-1 top-1 font-[family-name:var(--font-space-grotesk)] text-7xl font-bold leading-none text-white/[0.04] sm:text-8xl"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.7, ease: SMOOTH_EASE }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          <motion.div
            className="relative"
            variants={contentVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-40px" }}
          >
            <motion.div
              className="mb-4 flex flex-col gap-4 sm:mb-5 sm:flex-row sm:items-start sm:justify-between"
              variants={itemVariants}
            >
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-2 md:hidden">
                  <span className="rounded-full border border-neon-red/30 bg-neon-red/10 px-2.5 py-0.5 font-[family-name:var(--font-space-grotesk)] text-[10px] font-bold tracking-wider text-neon-red">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {index === 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-neon-red/20 bg-neon-red/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-neon-red/90">
                      <Sparkles className="h-3 w-3" />
                      Latest
                    </span>
                  )}
                </div>

                <h3 className="font-[family-name:var(--font-space-grotesk)] text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {exp.role}
                </h3>

                <p className="flex items-center gap-2 text-sm font-medium text-neon-red">
                  <Briefcase className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                  {exp.company}
                </p>
              </div>

              <motion.div
                className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium tracking-wide text-white/75 backdrop-blur-sm"
                whileHover={reduceMotion ? undefined : { scale: 1.04 }}
              >
                <Calendar className="h-3.5 w-3.5 text-neon-red/90" strokeWidth={1.75} />
                <time dateTime={exp.period}>{exp.period}</time>
              </motion.div>
            </motion.div>

            <motion.p
              className="mb-5 max-w-3xl text-sm leading-relaxed text-[var(--text-secondary)] sm:mb-6 sm:text-[0.9375rem]"
              variants={itemVariants}
            >
              {exp.description}
            </motion.p>

            <motion.ul className="flex flex-wrap gap-2" variants={itemVariants}>
              {exp.technologies.map((tech, techIndex) => (
                <motion.li
                  key={tech}
                  className="tech-tag"
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.25 + techIndex * 0.05,
                    duration: 0.4,
                    ease: SMOOTH_EASE,
                  }}
                  whileHover={reduceMotion ? undefined : { scale: 1.06, y: -2 }}
                >
                  {tech}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </motion.article>
    </motion.li>
  );
}

function ExperienceBackground({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <>
      <div className="exp-grid pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true" />

      <motion.div
        className="pointer-events-none absolute -right-[12%] top-[8%] h-96 w-96 rounded-full bg-[#dc2626]/12 blur-[130px]"
        animate={reduceMotion ? undefined : { scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pointer-events-none absolute -left-[10%] bottom-[10%] h-80 w-80 rounded-full bg-[#ff3366]/10 blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 24, 0], y: [0, -16, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      {!reduceMotion &&
        [12, 28, 44, 62, 78].map((top, i) => (
          <motion.span
            key={top}
            className="pointer-events-none absolute left-[8%] h-1 w-1 rounded-full bg-neon-red/40 sm:left-[12%]"
            style={{ top: `${top}%` }}
            animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.6, 1.2, 0.6] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            aria-hidden="true"
          />
        ))}
    </>
  );
}

function AnimatedTimelineRail({ reduceMotion }: { reduceMotion: boolean | null }) {
  const railRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 0.75", "end 0.35"],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const beamTop = useTransform(scrollYProgress, [0, 1], ["0%", "98%"]);

  return (
    <div ref={railRef} className="absolute bottom-0 left-[21px] top-0 hidden md:block" aria-hidden="true">
      <div className="absolute inset-y-0 w-px bg-white/[0.06]" />

      <motion.div
        className="absolute left-0 top-0 w-px origin-top bg-gradient-to-b from-neon-red-bright via-neon-red to-neon-red/10"
        style={{
          height: progressHeight,
          boxShadow: "0 0 14px rgba(220,38,38,0.65), 0 0 28px rgba(255,0,0,0.25)",
        }}
      />

      {!reduceMotion && (
        <motion.div
          className="absolute left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-neon-red-bright shadow-[0_0_18px_#ff0000,0_0_36px_rgba(220,38,38,0.5)]"
          style={{ top: beamTop }}
        >
          <motion.span
            className="absolute inset-0 rounded-full bg-neon-red-bright/50"
            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </div>
  );
}

export function Experience() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      id="experience"
      className="relative overflow-hidden py-20 sm:py-28 md:py-32"
    >
      <ExperienceBackground reduceMotion={reduceMotion} />

      <div className="relative mx-auto w-[92vw] max-w-5xl px-4 sm:px-0">
        <ScrollReveal className="mb-12 text-center sm:mb-14 md:mb-16">
          <p className="section-label justify-center mb-5">Career</p>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <NeonText color="red" ledSign as="span">
              Experience
            </NeonText>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-base">
            A timeline of roles where I{" "}
            <span className="font-medium text-neon-red-bright drop-shadow-[0_0_20px_rgba(220,38,38,0.25)]">
              built, optimized, and shipped
            </span>{" "}
            production software.
          </p>
        </ScrollReveal>

        <div className="relative">
          <AnimatedTimelineRail reduceMotion={reduceMotion} />

          <ol className="relative flex flex-col gap-10 sm:gap-12">
            {experiences.map((exp, i) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={i}
                reduceMotion={reduceMotion}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
