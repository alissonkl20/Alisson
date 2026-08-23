"use client";

import { useEffect, useState } from "react";
import type { GitHubStats } from "../lib/types";

interface UseGitHubStatsResult {
  data: GitHubStats | null;
  loading: boolean;
  error: boolean;
}

function isValidStats(value: unknown): value is GitHubStats {
  if (!value || typeof value !== "object") return false;
  const stats = value as GitHubStats;
  return Array.isArray(stats.days) && Boolean(stats.totals) && typeof stats.updatedAt === "string";
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
