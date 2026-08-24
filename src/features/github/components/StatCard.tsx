"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import styles from "./GitHubStats.module.css";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  accent?: "brand" | "highlight" | "neutral";
  index?: number;
}

export function StatCard({ icon: Icon, label, value, suffix, accent = "brand", index = 0 }: StatCardProps) {
  const { ref, value: display } = useCountUp(value);

  return (
    <motion.div
      className={`${styles.statCard} ${styles[`statCard--${accent}`]}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className={styles.statIcon} aria-hidden>
        <Icon size={16} strokeWidth={1.75} />
      </span>
      <span ref={ref} className={styles.statValue}>
        {display.toLocaleString("en-US")}
        {suffix && <span className={styles.statSuffix}>{suffix}</span>}
      </span>
      <span className={styles.statLabel}>{label}</span>
    </motion.div>
  );
}
