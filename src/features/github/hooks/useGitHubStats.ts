"use client";

import { useEffect, useState } from "react";
import type { GitHubStats } from "../lib/types";

interface UseGitHubStatsResult {
  data: GitHubStats | null;
  loading: boolean;
  error: boolean;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOptionalFiniteNumber(value: unknown): boolean {
  return value === undefined || isFiniteNumber(value);
}

function isValidStats(value: unknown): value is GitHubStats {
  if (!isRecord(value) || !isRecord(value.totals)) return false;

  const validDays =
    Array.isArray(value.days) &&
    value.days.every(
      (day) =>
        isRecord(day) &&
        typeof day.date === "string" &&
        isFiniteNumber(day.commits) &&
        isOptionalFiniteNumber(day.additions) &&
        isOptionalFiniteNumber(day.deletions) &&
        isOptionalFiniteNumber(day.filesChanged),
    );
  const validLanguages =
    Array.isArray(value.languages) &&
    value.languages.every(
      (language) =>
        isRecord(language) &&
        typeof language.language === "string" &&
        isFiniteNumber(language.count),
    );
  const validTotals =
    isFiniteNumber(value.totals.totalCommits) &&
    isFiniteNumber(value.totals.totalAdditions) &&
    isFiniteNumber(value.totals.totalDeletions);
  const validTimestamp =
    typeof value.updatedAt === "string" &&
    !Number.isNaN(Date.parse(value.updatedAt));

  return validDays && validLanguages && validTotals && validTimestamp;
}

/** Pede o snapshot em /api/github-stats (cache de 6h no servidor/CDN). */
export function useGitHubStats(): UseGitHubStatsResult {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetch("/api/github-stats", { signal: controller.signal });
        if (!res.ok) {
          setError(true);
          return;
        }
        const json = (await res.json()) as unknown;
        if (!isValidStats(json)) {
          setError(true);
          return;
        }
        setData(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(true);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
