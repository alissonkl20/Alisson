"use client";

import { motion } from "framer-motion";
import { Code2, FileDiff, GitCommitHorizontal, Minus, Plus } from "lucide-react";
import { useGitHubStats } from "../hooks/useGitHubStats";
import { GitHubPerformanceChart } from "./GitHubPerformanceChart";
import { AsciiVideo } from "./AsciiVideo";
import { StatCard } from "./StatCard";
import styles from "./GitHubStats.module.css";

export function GitHubSection() {
  const { data, loading, error } = useGitHubStats();

  return (
    <section id="github" className={styles.section} aria-label="GitHub statistics">
      <header className="section-header">
        <p className="section-eyebrow">Open Source</p>
        <h2 className="section-title">GitHub Activity</h2>
      </header>

      <div className={styles.body}>
        {loading && <div className={styles.skeletonBar} aria-hidden />}

        {error && !loading && (
          <div className={styles.stateBox} role="status">
            Unable to load stats right now. Please try again in a moment.
          </div>
        )}

        {data && !loading && (
          <>
            <div className={styles.statsGrid}>
              <StatCard icon={GitCommitHorizontal} label="Commits · 30 days" value={data.totals.totalCommits} index={0} />
              <StatCard icon={Plus} label="Lines added" value={data.totals.totalAdditions} accent="neutral" index={1} />
              <StatCard icon={Minus} label="Lines removed" value={data.totals.totalDeletions} accent="highlight" index={2} />
              <StatCard
                icon={FileDiff}
                label="Files changed"
                value={data.days.reduce((sum, d) => sum + (d.filesChanged ?? 0), 0)}
                accent="neutral"
                index={3}
              />
            </div>

            <div className={styles.chartBlock}>
              <GitHubPerformanceChart data={data.days} />

              {data.languages.length > 0 && (
                <motion.div
                  className={styles.languagesRow}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Code2 size={16} strokeWidth={1.75} aria-hidden />
                  {data.languages.map((lang) => (
                    <span key={lang.language} className={styles.languageChip}>
                      {lang.language}
                      <span className={styles.languageCount}>{lang.count}</span>
                    </span>
                  ))}
                </motion.div>
              )}
            </div>
          </>
        )}

        <AsciiVideo />
      </div>
    </section>
  );
}
