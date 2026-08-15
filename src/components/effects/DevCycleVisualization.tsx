"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Brain,
  Database,
  GitBranch,
  ArrowRight,
  Monitor,
  Server,
  Workflow,
} from "lucide-react";

const SMOOTH_EASE = [0.45, 0, 0.55, 1] as const;

const PLANNING_NODES = [
  { label: "Spec-driven", color: "#e8c547" },
  { label: "TDD", color: "#5eb8ff" },
  { label: "SDD", color: "#c77dff" },
  { label: "Agent Skills", color: "#6ee7a0" },
  { label: "Architecture", color: "#ff8c5a" },
  { label: "Definitions", color: "#ff6b9d" },
  { label: "Modeling", color: "#b8a9ff" },
  { label: "Structure", color: "#5eead4" },
];

const SYSTEM_NODES = {
  frontend: {
    title: "Frontend",
    icon: Monitor,
    color: "#5eb8ff",
    techs: ["React", "Next.js", "Vue.js", "TypeScript", "HTML", "CSS"],
  },
  backend: {
    title: "Backend",
    icon: Server,
    color: "#6ee7a0",
    techs: ["Laravel", "PHP", "Flask", "Python", "NestJS"],
  },
  database: {
    title: "Database",
    icon: Database,
    color: "#ff8c5a",
    techs: ["MySQL", "PostgreSQL"],
  },
  git: {
    title: "Git",
    icon: GitBranch,
    color: "#c77dff",
    techs: ["Version Control", "CI/CD"],
  },
};

function polarToPercent(angleDeg: number, radius = 40) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: 50 + radius * Math.cos(rad),
    y: 50 + radius * Math.sin(rad),
  };
}

function PanelShell({
  children,
  step,
  accent,
}: {
  children: React.ReactNode;
  step: string;
  accent: string;
}) {
  return (
    <div className="relative px-2 py-4 sm:px-4 sm:py-6">
      <span
        className="mb-4 block font-[family-name:var(--font-space-grotesk)] text-[10px] font-bold uppercase tracking-[0.25em] text-neon-red"
      >
        {step}
      </span>
      <div
        className="mb-6 h-px w-12"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  accent,
}: {
  icon: typeof Brain;
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="mb-3 flex items-center gap-3">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-transparent"
          style={{ color: accent }}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold tracking-tight led-sign-red sm:text-lg">
          {title}
        </h3>
      </div>
      <p className="max-w-sm text-sm leading-relaxed text-white/80">{subtitle}</p>
    </header>
  );
}

function AnimatedLine({
  x1,
  y1,
  x2,
  y2,
  color,
  dashed = false,
  particle = true,
  reverse = false,
  duration = 3.8,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  dashed?: boolean;
  particle?: boolean;
  reverse?: boolean;
  duration?: number;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="0.8"
        strokeOpacity="0.08"
        strokeLinecap="round"
      />
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="0.35"
        strokeOpacity={dashed ? 0.2 : 0.35}
        strokeDasharray={dashed ? "2.5 3" : "4 6"}
        strokeLinecap="round"
        className={dashed ? "" : "dev-cycle-dash"}
      />
      {particle && (
        <motion.circle
          r="0.9"
          fill={color}
          fillOpacity={0.9}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
          animate={{
            cx: reverse ? [x2, x1] : [x1, x2],
            cy: reverse ? [y2, y1] : [y1, y2],
          }}
          transition={{
            duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </g>
  );
}

function PlanningMind() {
  const reduceMotion = useReducedMotion();
  const nodePositions = PLANNING_NODES.map((_, i) =>
    polarToPercent((i / PLANNING_NODES.length) * 360 - 90)
  );

  return (
    <PanelShell step="01 — Ideation" accent="#ff6b9d">
      <SectionHeader
        icon={Brain}
        title="Planning & Design"
        subtitle="Specs, tests, architecture, and definitions that structure each project before implementation."
        accent="#ff6b9d"
      />

      <div className="relative mx-auto aspect-square w-full max-w-[320px] sm:max-w-[360px]">
        {!reduceMotion && (
          <>
            <motion.div
              className="absolute inset-[12%] rounded-full border border-white/[0.06]"
              animate={{ opacity: [0.4, 0.15, 0.4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
            <motion.div
              className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ff6b9d]/[0.06]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.15, 0.5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          </>
        )}

        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {nodePositions.map((pos, i) => (
            <AnimatedLine
              key={PLANNING_NODES[i].label}
              x1={50}
              y1={50}
              x2={pos.x}
              y2={pos.y}
              color={PLANNING_NODES[i].color}
              duration={4 + i * 0.15}
            />
          ))}
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center">
          <motion.div
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-transparent sm:h-16 sm:w-16"
            style={{
              boxShadow: "0 0 40px rgba(255,107,157,0.15)",
            }}
            animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Brain className="h-7 w-7 text-[#ff6b9d] sm:h-8 sm:w-8" strokeWidth={1.5} />
          </motion.div>
          <p
            className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-xs"
            style={{ color: "#ff6b9d" }}
          >
            Ideation
          </p>
        </div>

        {PLANNING_NODES.map((node, i) => {
          const pos = nodePositions[i];
          return (
            <motion.div
              key={node.label}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
              transition={
                reduceMotion
                  ? { delay: i * 0.05, duration: 0.6, ease: SMOOTH_EASE }
                  : {
                      opacity: { delay: i * 0.05, duration: 0.6, ease: SMOOTH_EASE },
                      y: {
                        duration: 3.5 + i * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1,
                      },
                    }
              }
            >
              <div className="flex items-center gap-1.5 rounded-full bg-transparent px-2.5 py-1.5 sm:px-3 sm:py-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: node.color }}
                />
                <span
                  className="text-[10px] font-medium sm:text-[11px]"
                  style={{ color: node.color }}
                >
                  {node.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </PanelShell>
  );
}

function SystemCard({
  title,
  icon: Icon,
  color,
  techs,
}: {
  title: string;
  icon: typeof Monitor;
  color: string;
  techs: string[];
}) {
  return (
    <motion.div
      className="group relative rounded-xl bg-transparent p-3.5 sm:p-4"
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 140, damping: 22 }}
    >
      <div
        className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full opacity-60 transition-opacity group-hover:opacity-100"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />

      <div className="mb-3 flex items-center justify-between gap-2 pl-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-transparent"
            style={{ color }}
          >
            <Icon className="h-4 w-4" strokeWidth={1.75} />
          </span>
          <span
            className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold"
            style={{ color }}
          >
            {title}
          </span>
        </div>
        <span className="flex items-center gap-1.5 text-[9px] font-medium uppercase tracking-wider">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-emerald-400/80"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span style={{ color: "#6ee7a0" }}>live</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1 pl-3">
        {techs.map((t) => (
          <span
            key={t}
            className="rounded-md bg-transparent px-2 py-0.5 text-[10px] sm:text-[11px]"
            style={{ color }}
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function RestApiBridge() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center self-center px-1 sm:px-2">
      <motion.div
        className="h-4 w-px bg-gradient-to-b from-transparent via-[#5eb8ff]/40 to-[#5eb8ff]/20 sm:h-5"
        animate={reduceMotion ? undefined : { opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <motion.div
        className="relative my-1"
        animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        data-node="rest-api"
      >
        {/* Glow do servidor */}
        <div
          className="pointer-events-none absolute -inset-1 rounded-lg bg-[#5eb8ff]/10 blur-sm"
          aria-hidden="true"
        />

        {/* Chassis — mini server rack */}
        <div
          className="relative w-[40px] rounded-md border border-[#5eb8ff]/25 bg-transparent p-1 sm:w-[44px]"
          style={{ boxShadow: "0 0 14px rgba(94,184,255,0.1)" }}
        >
          {/* Topo — LEDs de status */}
          <div className="mb-1 flex items-center justify-between px-0.5">
            <div className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-0.5 w-0.5 rounded-full sm:h-1 sm:w-1"
                  style={{
                    backgroundColor: i === 0 ? "#6ee7a0" : i === 1 ? "#5eb8ff" : "#ffd700",
                  }}
                  animate={
                    reduceMotion
                      ? undefined
                      : { opacity: [0.35, 1, 0.35] }
                  }
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.35,
                  }}
                />
              ))}
            </div>
            <span
              className="text-[6px] font-bold sm:text-[7px]"
              style={{ color: "#5eb8ff" }}
            >
              SRV
            </span>
          </div>

          {/* Slots de servidor */}
          <div className="mb-1 space-y-0.5">
            {[0, 1].map((slot) => (
              <div
                key={slot}
                className="flex items-center gap-0.5 rounded border border-white/[0.06] bg-transparent px-0.5 py-px"
              >
                <motion.span
                  className="h-0.5 w-0.5 shrink-0 rounded-full bg-[#5eb8ff]/70"
                  animate={
                    reduceMotion
                      ? undefined
                      : { opacity: slot === 1 ? [0.3, 1, 0.3] : 0.4 }
                  }
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: slot * 0.25,
                  }}
                />
                <div className="h-px flex-1 bg-white/[0.08]" />
              </div>
            ))}
          </div>

          {/* Label REST API na frente do servidor */}
          <div className="rounded border border-[#5eb8ff]/20 bg-transparent px-0.5 py-0.5 text-center">
            <Server
              className="mx-auto mb-px h-2.5 w-2.5 text-[#5eb8ff]/80 sm:h-3 sm:w-3"
              strokeWidth={1.75}
            />
            <p
              className="text-[7px] font-bold uppercase leading-none tracking-[0.1em]"
              style={{ color: "#5eb8ff" }}
            >
              REST
            </p>
            <p
              className="text-[6px] font-semibold uppercase tracking-[0.08em] sm:text-[7px]"
              style={{ color: "#5eb8ff" }}
            >
              API
            </p>
          </div>

          {/* Base / pés do rack */}
          <div className="mt-1 flex justify-center gap-1.5" aria-hidden="true">
            <span className="h-px w-1.5 rounded-full bg-white/10" />
            <span className="h-px w-1.5 rounded-full bg-white/10" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="h-4 w-px bg-gradient-to-b from-[#6ee7a0]/20 via-[#6ee7a0]/40 to-transparent sm:h-5"
        animate={reduceMotion ? undefined : { opacity: [0.25, 0.6, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        aria-hidden="true"
      />
    </div>
  );
}

function SystemArchitecture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{
    fe: { x: number; y: number };
    be: { x: number; y: number };
    db: { x: number; y: number };
    git: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      const toSvg = (el: HTMLElement | null) => {
        if (!el || !rect.width) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left + r.width / 2 - rect.left) / rect.width) * 100,
          y: ((r.top + r.height / 2 - rect.top) / rect.height) * 100,
        };
      };

      setPaths({
        fe: toSvg(container.querySelector("[data-node='frontend']")),
        be: toSvg(container.querySelector("[data-node='backend']")),
        db: toSvg(container.querySelector("[data-node='database']")),
        git: toSvg(container.querySelector("[data-node='git']")),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  return (
    <PanelShell step="02 — Execution" accent="#5eb8ff">
      <SectionHeader
        icon={Workflow}
        title="System in Production"
        subtitle="Frontend, backend, database, and tooling integrated like a real production environment."
        accent="#5eb8ff"
      />

      <div ref={containerRef} className="relative space-y-3 sm:space-y-4">
        {paths && (
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <AnimatedLine
              x1={paths.fe.x}
              y1={paths.fe.y}
              x2={paths.be.x}
              y2={paths.be.y}
              color="#5eb8ff"
              duration={3.5}
            />
            <AnimatedLine
              x1={paths.fe.x}
              y1={paths.fe.y}
              x2={paths.be.x}
              y2={paths.be.y}
              color="#6ee7a0"
              reverse
              duration={3.5}
            />
            <AnimatedLine
              x1={paths.be.x}
              y1={paths.be.y}
              x2={paths.db.x}
              y2={paths.db.y}
              color="#ff8c5a"
              duration={4}
            />
            <AnimatedLine
              x1={paths.fe.x}
              y1={paths.fe.y}
              x2={paths.db.x}
              y2={paths.db.y}
              color="#ff8c5a"
              reverse
              duration={4.2}
            />
            <AnimatedLine
              x1={paths.git.x}
              y1={paths.git.y}
              x2={paths.fe.x}
              y2={paths.fe.y}
              color="#c77dff"
              dashed
              particle={false}
            />
            <AnimatedLine
              x1={paths.git.x}
              y1={paths.git.y}
              x2={paths.be.x}
              y2={paths.be.y}
              color="#c77dff"
              dashed
              particle={false}
            />
          </svg>
        )}

        {/* Git */}
        <div data-node="git" className="relative z-10 mx-auto max-w-[200px]">
          <SystemCard
            title={SYSTEM_NODES.git.title}
            icon={SYSTEM_NODES.git.icon}
            color={SYSTEM_NODES.git.color}
            techs={SYSTEM_NODES.git.techs}
          />
        </div>

        {/* Frontend ↔ Backend */}
        <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3">
          <div data-node="frontend">
            <SystemCard
              title={SYSTEM_NODES.frontend.title}
              icon={SYSTEM_NODES.frontend.icon}
              color={SYSTEM_NODES.frontend.color}
              techs={SYSTEM_NODES.frontend.techs}
            />
          </div>
          <RestApiBridge />
          <div data-node="backend">
            <SystemCard
              title={SYSTEM_NODES.backend.title}
              icon={SYSTEM_NODES.backend.icon}
              color={SYSTEM_NODES.backend.color}
              techs={SYSTEM_NODES.backend.techs}
            />
          </div>
        </div>

        {/* Fluxo de dados */}
        <div className="relative z-10 grid grid-cols-2 gap-4 px-2 py-1">
          <p
            className="text-center text-[10px] font-medium uppercase tracking-wider sm:text-[11px]"
            style={{ color: "#ff8c5a" }}
          >
            fetch data
          </p>
          <p
            className="text-center text-[10px] font-medium uppercase tracking-wider sm:text-[11px]"
            style={{ color: "#ff8c5a" }}
          >
            sql query
          </p>
        </div>

        {/* Database */}
        <div data-node="database" className="relative z-10 mx-auto max-w-[220px]">
          <SystemCard
            title={SYSTEM_NODES.database.title}
            icon={SYSTEM_NODES.database.icon}
            color={SYSTEM_NODES.database.color}
            techs={SYSTEM_NODES.database.techs}
          />
        </div>
      </div>
    </PanelShell>
  );
}

function FlowBridge({ vertical = false }: { vertical?: boolean }) {
  const reduceMotion = useReducedMotion();

  if (vertical) {
    return (
      <div
        className="flex flex-col items-center gap-3 py-4 lg:hidden"
        aria-hidden="true"
      >
        <motion.div
          className="h-8 w-px bg-gradient-to-b from-white/10 to-white/20"
          animate={reduceMotion ? undefined : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-red-bright drop-shadow-[0_0_16px_rgba(220,38,38,0.3)]">
          idea → build
        </span>
        <motion.div
          animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowRight className="h-4 w-4 rotate-90 text-neon-red/70" strokeWidth={1.5} />
        </motion.div>
        <motion.div
          className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent"
          animate={reduceMotion ? undefined : { opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
        />
      </div>
    );
  }

  return (
    <div
      className="hidden flex-col items-center justify-center gap-3 self-center px-2 lg:flex"
      aria-hidden="true"
    >
      <motion.div
        className="h-px w-12 bg-gradient-to-r from-transparent to-white/15"
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neon-red-bright drop-shadow-[0_0_16px_rgba(220,38,38,0.3)]">
        idea → build
      </span>
      <motion.div
        animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowRight className="h-4 w-4 text-neon-red/70" strokeWidth={1.5} />
      </motion.div>
      <motion.div
        className="h-px w-12 bg-gradient-to-r from-white/15 to-transparent"
        animate={reduceMotion ? undefined : { opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />
    </div>
  );
}

export function DevCycleVisualization() {
  return (
    <div className="relative">
      <div className="grid items-start gap-2 lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
        <PlanningMind />
        <FlowBridge vertical />
        <FlowBridge />
        <SystemArchitecture />
      </div>
    </div>
  );
}
