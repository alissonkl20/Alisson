export interface DayData {
  date: string;
  commits: number;
  additions?: number;
  deletions?: number;
  filesChanged?: number;
}

export interface LanguageStat {
  language: string;
  count: number;
}

export interface GitHubStats {
  days: DayData[];
  languages: LanguageStat[];
  totals: {
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
  };
  /** ISO do snapshot no servidor — o gráfico só reconsulta o GitHub a cada 6h. */
  updatedAt: string;
}
