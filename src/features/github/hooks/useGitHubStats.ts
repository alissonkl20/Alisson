"use client";

import { useEffect, useState } from "react";
import type { GitHubStats } from "../lib/types";

interface UseGitHubStatsResult {
  data: GitHubStats | null;
  loading: boolean;
  error: string | null;
}

/** Busca /api/github-stats com estados de loading/erro e proteção contra race/unmount. */
export function useGitHubStats(): UseGitHubStatsResult {
  const [data, setData] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    void (async () => {
      try {
        const res = await fetch("/api/github-stats", { signal: controller.signal });
        const json = (await res.json()) as GitHubStats & { error?: string };
        if (!res.ok) throw new Error(json.error ?? `Erro ${res.status}`);
        setData(json);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Falha ao carregar estatísticas.");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  return { data, loading, error };
}
