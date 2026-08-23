"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DayData } from "../lib/types";
import styles from "./GitHubStats.module.css";

interface GitHubPerformanceChartProps {
  data: DayData[];
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function formatDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]}`;
}

interface TooltipPayloadItem {
  value?: number | string;
  dataKey?: string | number;
  payload?: DayData;
}

function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const day = payload[0]?.payload;
  if (!day) return null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipDate}>{formatDate(day.date)}</p>
      <p className={styles.tooltipRow}>
        <span className={styles.tooltipDot} data-kind="commits" />
        {day.commits} commits
      </p>
      {typeof day.additions === "number" && day.additions > 0 && (
        <p className={styles.tooltipRow}>
          <span className={styles.tooltipDot} data-kind="additions" />+{day.additions.toLocaleString("pt-BR")} linhas
        </p>
      )}
      {typeof day.deletions === "number" && day.deletions > 0 && (
        <p className={styles.tooltipRow}>
          <span className={styles.tooltipDot} data-kind="deletions" />−{day.deletions.toLocaleString("pt-BR")} linhas
        </p>
      )}
    </div>
  );
}

/** Ponto com halo pulsante — só renderiza no ponto ativo (hover). */
function PulsingDot(props: {
  cx?: number;
  cy?: number;
  stroke?: string;
}) {
  const { cx = 0, cy = 0, stroke = "#ffd000" } = props;
  return (
    <g>
      <circle cx={cx} cy={cy} r={10} fill={stroke} opacity={0.18}>
        <animate attributeName="r" values="6;14;6" dur="1.6s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.35;0.05;0.35" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={4} fill={stroke} stroke="var(--theme-bg)" strokeWidth={2} />
    </g>
  );
}

export function GitHubPerformanceChart({ data }: GitHubPerformanceChartProps) {
  return (
    <motion.div
      className={styles.chartShell}
      initial={{ opacity: 0, y: 32, scale: 0.985 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className={styles.chartGlow} aria-hidden />
      <div className={styles.chartResponsive}>
        <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 16, right: 12, bottom: 0, left: -14 }}>
          <defs>
            {/* Gradiente da linha: brand → highlight, seguindo o tema do portfólio */}
            <linearGradient id="ghLineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--theme-brand)" />
              <stop offset="100%" stopColor="var(--theme-highlight)" />
            </linearGradient>
            <linearGradient id="ghAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--theme-brand)" stopOpacity={0.32} />
              <stop offset="60%" stopColor="var(--theme-highlight)" stopOpacity={0.08} />
              <stop offset="100%" stopColor="var(--theme-highlight)" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid vertical={false} stroke="var(--theme-border)" strokeOpacity={0.35} strokeDasharray="2 8" />

          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tickLine={false}
            axisLine={false}
            minTickGap={24}
            tick={{ fill: "var(--theme-text-muted)", fontSize: 11 }}
            dy={10}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--theme-text-muted)", fontSize: 11 }}
            width={40}
          />

          <Tooltip
            content={<ChartTooltip />}
            cursor={{
              stroke: "var(--theme-brand)",
              strokeWidth: 1,
              strokeOpacity: 0.5,
              strokeDasharray: "3 4",
            }}
          />

          <Area
            type="monotone"
            dataKey="commits"
            stroke="url(#ghLineGradient)"
            strokeWidth={2.5}
            fill="url(#ghAreaGradient)"
            dot={false}
            activeDot={<PulsingDot />}
            isAnimationActive
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
