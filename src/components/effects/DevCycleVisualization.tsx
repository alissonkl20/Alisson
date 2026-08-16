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
  className = "",
}: {
  children: React.ReactNode;
  step: string;
  accent: string;
  className?: string;
}) {
  return (
    <div className={`relative px-2 py-4 sm:px-4 sm:py-6 ${className}`}>
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

/* ─── Mobile layout ─── */

function MobileStepLabel({ step, accent }: { step: string; accent: string }) {
  return (
    <div className="mb-4">
      <span
        className="block font-[family-name:var(--font-space-grotesk)] text-[10px] font-bold uppercase tracking-[0.22em] text-neon-red"
      >
        {step}
      </span>
      <div
        className="mt-3 h-px w-10"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
        aria-hidden="true"
      />
    </div>
  );
}

function MobilePlanningCard() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hubPos, setHubPos] = useState<{ x: number; y: number } | null>(null);
  const [chipPositions, setChipPositions] = useState<
    Array<{ x: number; y: number }> | null
  >(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      const toPct = (el: HTMLElement | null) => {
        if (!el || !rect.width || !rect.height) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left + r.width / 2 - rect.left) / rect.width) * 100,
          y: ((r.top + r.height / 2 - rect.top) / rect.height) * 100,
        };
      };

      setHubPos(toPct(container.querySelector("[data-node='ideation-hub']")));
      setChipPositions(
        PLANNING_NODES.map((_, i) =>
          toPct(container.querySelector(`[data-node='planning-${i}']`)),
        ),
      );
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const showLines = hubPos && chipPositions;

  return (
    <motion.article
      className="card-transparent overflow-hidden rounded-2xl p-5"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: SMOOTH_EASE }}
    >
      <MobileStepLabel step="01 — Ideation" accent="#ff6b9d" />

      <div className="mb-5 flex items-start gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ff6b9d]/30 bg-[#ff6b9d]/10 text-[#ff6b9d]"
        >
          <Brain className="h-5 w-5" strokeWidth={1.75} />
        </span>
        <div>
          <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-white">
            Planning &amp; Design
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-white/65">
            Specs, tests, and architecture before code.
          </p>
        </div>
      </div>

      <div ref={containerRef} className="relative">
        {showLines && (
          <svg
            className="pointer-events-none absolute inset-0 z-0 h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {PLANNING_NODES.map((node, i) => (
              <AnimatedLine
                key={node.label}
                x1={hubPos.x}
                y1={hubPos.y}
                x2={chipPositions[i].x}
                y2={chipPositions[i].y}
                color={node.color}
                duration={4 + i * 0.15}
              />
            ))}
          </svg>
        )}

        <div className="relative z-10 mb-4 flex flex-col items-center" data-node="ideation-hub">
          <motion.div
            className="flex h-16 w-16 items-center justify-center rounded-2xl border border-[#ff6b9d]/25 bg-[#ff6b9d]/[0.06]"
            animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ boxShadow: "0 0 32px rgba(255,107,157,0.12)" }}
          >
            <Brain className="h-8 w-8 text-[#ff6b9d]" strokeWidth={1.5} />
          </motion.div>
          <p
            className="mt-2 text-[10px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: "#ff6b9d" }}
          >
            Ideation hub
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-2">
          {PLANNING_NODES.map((node, i) => (
            <motion.span
              key={node.label}
              data-node={`planning-${i}`}
              className="flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium"
              style={{
                color: node.color,
                borderColor: `${node.color}35`,
                backgroundColor: `${node.color}10`,
              }}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : i * 0.04, duration: 0.4, ease: SMOOTH_EASE }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: node.color }}
              />
              <span className="leading-tight">{node.label}</span>
            </motion.span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function MobileLayerCard({
  title,
  icon: Icon,
  color,
  techs,
  index,
  nodeId,
}: {
  title: string;
  icon: typeof Monitor;
  color: string;
  techs: string[];
  index: number;
  nodeId: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      data-node={nodeId}
      className="relative z-10 card-transparent overflow-hidden rounded-2xl p-4"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        delay: reduceMotion ? 0 : index * 0.06,
        duration: 0.5,
        ease: SMOOTH_EASE,
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
            style={{
              color,
              borderColor: `${color}35`,
              backgroundColor: `${color}12`,
            }}
          >
            <Icon className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <span
            className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold"
            style={{ color }}
          >
            {title}
          </span>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-emerald-400/80"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span style={{ color: "#6ee7a0" }}>live</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {techs.map((tech) => (
          <span
            key={tech}
            className="rounded-md border px-2.5 py-1 text-xs font-medium"
            style={{
              color,
              borderColor: `${color}30`,
              backgroundColor: `${color}08`,
            }}
          >
            {tech}
          </span>
        ))}
      </div>
    </motion.article>
  );
}

function MobileFlowConnector({
  label,
  color = "#5eb8ff",
  dual,
  nodeId,
}: {
  label?: string;
  color?: string;
  dual?: { left: string; right: string };
  nodeId?: string;
}) {
  return (
    <div
      className="relative z-10 flex flex-col items-center py-1"
      data-node={nodeId}
      aria-hidden={!label && !dual}
    >
      {label && (
        <span
          className="my-1.5 flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{
            color,
            borderColor: `${color}40`,
            backgroundColor: `${color}10`,
          }}
        >
          <Server className="h-3 w-3" strokeWidth={2} />
          {label}
        </span>
      )}
      {dual && (
        <div className="my-1.5 grid w-full grid-cols-2 gap-2 px-1">
          <span
            className="text-center text-[10px] font-medium uppercase tracking-wide"
            style={{ color: "#ff8c5a" }}
          >
            {dual.left}
          </span>
          <span
            className="text-center text-[10px] font-medium uppercase tracking-wide"
            style={{ color: "#ff8c5a" }}
          >
            {dual.right}
          </span>
        </div>
      )}
      {!label && !dual && (
        <div className="h-4 w-px" aria-hidden="true" />
      )}
    </div>
  );
}

function MobileSectionBridge() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex items-center gap-3 py-5" aria-hidden="true">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon-red/35 to-transparent" />
      <motion.span
        className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-neon-red-bright"
        animate={reduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        idea → build
      </motion.span>
      <ArrowRight className="h-4 w-4 shrink-0 text-neon-red/60" strokeWidth={1.5} />
      <div className="h-px flex-1 bg-gradient-to-l from-transparent via-neon-red/35 to-transparent" />
    </div>
  );
}

function MobileExecutionPipeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<{
    git: { x: number; y: number };
    frontend: { x: number; y: number };
    backend: { x: number; y: number };
    database: { x: number; y: number };
    restApi: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      const toPct = (el: HTMLElement | null) => {
        if (!el || !rect.width || !rect.height) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left + r.width / 2 - rect.left) / rect.width) * 100,
          y: ((r.top + r.height / 2 - rect.top) / rect.height) * 100,
        };
      };

      setPaths({
        git: toPct(container.querySelector("[data-node='mobile-git']")),
        frontend: toPct(container.querySelector("[data-node='mobile-frontend']")),
        backend: toPct(container.querySelector("[data-node='mobile-backend']")),
        database: toPct(container.querySelector("[data-node='mobile-database']")),
        restApi: toPct(container.querySelector("[data-node='mobile-rest-api']")),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  const layers = [
    { key: "git", nodeId: "mobile-git", ...SYSTEM_NODES.git },
    { key: "frontend", nodeId: "mobile-frontend", ...SYSTEM_NODES.frontend },
    { key: "backend", nodeId: "mobile-backend", ...SYSTEM_NODES.backend },
    { key: "database", nodeId: "mobile-database", ...SYSTEM_NODES.database },
  ] as const;

  return (
    <div ref={containerRef} className="relative space-y-0">
      {paths && (
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Git → Frontend / Backend (CI/CD) */}
          <AnimatedLine
            x1={paths.git.x}
            y1={paths.git.y}
            x2={paths.frontend.x}
            y2={paths.frontend.y}
            color={SYSTEM_NODES.git.color}
            dashed
            particle={false}
          />
          <AnimatedLine
            x1={paths.git.x}
            y1={paths.git.y}
            x2={paths.backend.x}
            y2={paths.backend.y}
            color={SYSTEM_NODES.git.color}
            dashed
            particle={false}
          />

          {/* Frontend ↔ Backend via REST */}
          <AnimatedLine
            x1={paths.frontend.x}
            y1={paths.frontend.y}
            x2={paths.restApi.x}
            y2={paths.restApi.y}
            color={SYSTEM_NODES.frontend.color}
            duration={3.2}
          />
          <AnimatedLine
            x1={paths.restApi.x}
            y1={paths.restApi.y}
            x2={paths.backend.x}
            y2={paths.backend.y}
            color={SYSTEM_NODES.backend.color}
            duration={3.2}
          />
          <AnimatedLine
            x1={paths.backend.x}
            y1={paths.backend.y}
            x2={paths.restApi.x}
            y2={paths.restApi.y}
            color={SYSTEM_NODES.backend.color}
            reverse
            duration={3.4}
          />
          <AnimatedLine
            x1={paths.restApi.x}
            y1={paths.restApi.y}
            x2={paths.frontend.x}
            y2={paths.frontend.y}
            color={SYSTEM_NODES.frontend.color}
            reverse
            duration={3.4}
          />

          {/* Data flow to database */}
          <AnimatedLine
            x1={paths.backend.x}
            y1={paths.backend.y}
            x2={paths.database.x}
            y2={paths.database.y}
            color={SYSTEM_NODES.database.color}
            duration={4}
          />
          <AnimatedLine
            x1={paths.frontend.x}
            y1={paths.frontend.y}
            x2={paths.database.x}
            y2={paths.database.y}
            color={SYSTEM_NODES.database.color}
            reverse
            duration={4.2}
          />
        </svg>
      )}

      <MobileLayerCard
        title={layers[0].title}
        icon={layers[0].icon}
        color={layers[0].color}
        techs={layers[0].techs}
        index={0}
        nodeId={layers[0].nodeId}
      />

      <MobileFlowConnector color={SYSTEM_NODES.git.color} nodeId="mobile-conn-git-fe" />

      <MobileLayerCard
        title={layers[1].title}
        icon={layers[1].icon}
        color={layers[1].color}
        techs={layers[1].techs}
        index={1}
        nodeId={layers[1].nodeId}
      />

      <MobileFlowConnector label="REST API" color="#5eb8ff" nodeId="mobile-rest-api" />

      <MobileLayerCard
        title={layers[2].title}
        icon={layers[2].icon}
        color={layers[2].color}
        techs={layers[2].techs}
        index={2}
        nodeId={layers[2].nodeId}
      />

      <MobileFlowConnector
        dual={{ left: "fetch data", right: "sql query" }}
        nodeId="mobile-conn-data"
      />

      <MobileLayerCard
        title={layers[3].title}
        icon={layers[3].icon}
        color={layers[3].color}
        techs={layers[3].techs}
        index={3}
        nodeId={layers[3].nodeId}
      />
    </div>
  );
}

function MobileDevCycle() {
  const mobileRootRef = useRef<HTMLDivElement>(null);
  const [bridgePaths, setBridgePaths] = useState<{
    ideation: { x: number; y: number };
    git: { x: number; y: number };
  } | null>(null);

  useEffect(() => {
    const root = mobileRootRef.current;
    if (!root) return;

    const measure = () => {
      const rect = root.getBoundingClientRect();
      const toPct = (el: HTMLElement | null) => {
        if (!el || !rect.width || !rect.height) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left + r.width / 2 - rect.left) / rect.width) * 100,
          y: ((r.top + r.height / 2 - rect.top) / rect.height) * 100,
        };
      };

      setBridgePaths({
        ideation: toPct(root.querySelector("[data-node='ideation-hub']")),
        git: toPct(root.querySelector("[data-node='mobile-git']")),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={mobileRootRef} className="relative space-y-0">
      {bridgePaths && (
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <AnimatedLine
            x1={bridgePaths.ideation.x}
            y1={bridgePaths.ideation.y}
            x2={bridgePaths.git.x}
            y2={bridgePaths.git.y}
            color="#ff6b9d"
            duration={5}
          />
          <AnimatedLine
            x1={bridgePaths.ideation.x}
            y1={bridgePaths.ideation.y}
            x2={bridgePaths.git.x}
            y2={bridgePaths.git.y}
            color="#5eb8ff"
            reverse
            duration={5.2}
          />
        </svg>
      )}

      <MobilePlanningCard />
      <MobileSectionBridge />

      <motion.article
        className="relative z-10 card-transparent overflow-hidden rounded-2xl p-5"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, ease: SMOOTH_EASE }}
      >
        <MobileStepLabel step="02 — Execution" accent="#5eb8ff" />

        <div className="mb-5 flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#5eb8ff]/30 bg-[#5eb8ff]/10 text-[#5eb8ff]"
          >
            <Workflow className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <h3 className="font-[family-name:var(--font-space-grotesk)] text-base font-semibold text-white">
              System in Production
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/65">
              Frontend, backend, database, and tooling working together.
            </p>
          </div>
        </div>

        <MobileExecutionPipeline />
      </motion.article>
    </div>
  );
}

/* ─── Desktop layout ─── */

function PlanningMind() {
  const reduceMotion = useReducedMotion();
  const nodePositions = PLANNING_NODES.map((_, i) =>
    polarToPercent((i / PLANNING_NODES.length) * 360 - 90),
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
            style={{ boxShadow: "0 0 40px rgba(255,107,157,0.15)" }}
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
        <div
          className="pointer-events-none absolute -inset-1 rounded-lg bg-[#5eb8ff]/10 blur-sm"
          aria-hidden="true"
        />

        <div
          className="relative w-[40px] rounded-md border border-[#5eb8ff]/25 bg-transparent p-1 sm:w-[44px]"
          style={{ boxShadow: "0 0 14px rgba(94,184,255,0.1)" }}
        >
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
                    reduceMotion ? undefined : { opacity: [0.35, 1, 0.35] }
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
            <span className="text-[6px] font-bold sm:text-[7px]" style={{ color: "#5eb8ff" }}>
              SRV
            </span>
          </div>

          <div className="mb-1 space-y-0.5">
            {[0, 1].map((slot) => (
              <div
                key={slot}
                className="flex items-center gap-0.5 rounded border border-white/[0.06] bg-transparent px-0.5 py-px"
              >
                <motion.span
                  className="h-0.5 w-0.5 shrink-0 rounded-full bg-[#5eb8ff]/70"
                  animate={
                    reduceMotion ? undefined : { opacity: slot === 1 ? [0.3, 1, 0.3] : 0.4 }
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

        <div data-node="git" className="relative z-10 mx-auto max-w-[200px]">
          <SystemCard
            title={SYSTEM_NODES.git.title}
            icon={SYSTEM_NODES.git.icon}
            color={SYSTEM_NODES.git.color}
            techs={SYSTEM_NODES.git.techs}
          />
        </div>

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

function FlowBridge() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 self-center px-2"
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

function DesktopDevCycle() {
  return (
    <div className="grid items-start lg:grid-cols-[1fr_auto_1fr] lg:gap-0">
      <PlanningMind />
      <FlowBridge />
      <SystemArchitecture />
    </div>
  );
}

export function DevCycleVisualization() {
  return (
    <div className="relative">
      <div className="lg:hidden">
        <MobileDevCycle />
      </div>
      <div className="hidden lg:block">
        <DesktopDevCycle />
      </div>
    </div>
  );
}
