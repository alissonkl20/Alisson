import { NextResponse } from "next/server";

/**
 * GET /api/github-stats
 *
 * Agrega estatísticas do GitHub dos últimos 30 dias:
 *  - GraphQL: contributionCalendar (commits/dia) + linguagens primárias
 *    dos repositórios com commits no período.
 *  - REST: para commits dos últimos 7 dias, busca additions/deletions/
 *    files changed por commit e agrega por dia.
 *
 * O token (GITHUB_TOKEN) só existe no servidor — nunca vai ao client.
 */

const GITHUB_LOGIN = "alissonkl20";
const DAYS_WINDOW = 30;
const DETAIL_DAYS = 7; // janela para stats detalhadas via REST (custo de rate limit)
const MAX_DETAIL_COMMITS = 25; // teto de chamadas REST por request

export const dynamic = "force-dynamic";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: { contributionDays: ContributionDay[] }[];
        };
        commitContributionsByRepository?: {
          repository: {
            nameWithOwner: string;
            primaryLanguage: { name: string } | null;
          };
        }[];
      };
    };
  };
  errors?: { message: string }[];
}

export interface DayStats {
  date: string;
  commits: number;
  additions: number;
  deletions: number;
  filesChanged: number;
}

export interface GitHubStatsPayload {
  days: DayStats[];
  languages: { language: string; count: number }[];
  totals: {
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
  };
}

function isoDaysAgo(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

async function fetchGraphQL(token: string, from: Date): Promise<GraphQLResponse["data"]> {
  // contributionCalendar aceita janela máxima de 1 ano; 30 dias é tranquilo.
  const query = `
    query ($login: String!, $from: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from) {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            repository {
              nameWithOwner
              primaryLanguage { name }
            }
          }
        }
      }
    }
  `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-github-stats",
    },
    body: JSON.stringify({
      query,
      variables: { login: GITHUB_LOGIN, from: from.toISOString() },
    }),
  });

  if (!res.ok) {
    throw new Error(`GitHub GraphQL respondeu ${res.status}`);
  }

  const json = (await res.json()) as GraphQLResponse;
  if (json.errors?.length) {
    throw new Error(`GitHub GraphQL: ${json.errors[0].message}`);
  }
  return json.data;
}

interface SearchCommitItem {
  sha: string;
  repository: { full_name: string };
  commit: { author: { date: string } };
}

/** Lista commits do autor nos últimos N dias via Search API (1 chamada). */
async function fetchRecentCommits(token: string, since: Date): Promise<SearchCommitItem[]> {
  const q = `author:${GITHUB_LOGIN} committer-date:>=${since.toISOString().slice(0, 10)}`;
  const res = await fetch(
    `https://api.github.com/search/commits?q=${encodeURIComponent(q)}&per_page=${MAX_DETAIL_COMMITS}&sort=committer-date&order=desc`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "portfolio-github-stats",
      },
    },
  );
  if (!res.ok) return []; // search pode falhar por rate limit — degrada graciosamente
  const json = (await res.json()) as { items?: SearchCommitItem[] };
  return json.items ?? [];
}

/** Busca additions/deletions/files de um commit individual. */
async function fetchCommitDetail(
  token: string,
  fullName: string,
  sha: string,
): Promise<{ additions: number; deletions: number; filesChanged: number } | null> {
  const res = await fetch(`https://api.github.com/repos/${fullName}/commits/${sha}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-github-stats",
    },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    stats?: { additions?: number; deletions?: number };
    files?: unknown[];
  };
  return {
    additions: json.stats?.additions ?? 0,
    deletions: json.stats?.deletions ?? 0,
    filesChanged: json.files?.length ?? 0,
  };
}

/** Fallback sem token: usa a API pública de eventos (rate limit 60 req/h). */
async function fetchPublicStats(): Promise<GitHubStatsPayload> {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-github-stats",
  };

  const dayMap = new Map<string, DayStats>();
  for (let i = DAYS_WINDOW; i >= 0; i--) {
    const key = isoDaysAgo(i).toISOString().slice(0, 10);
    dayMap.set(key, { date: key, commits: 0, additions: 0, deletions: 0, filesChanged: 0 });
  }

  interface PublicEvent {
    type: string;
    created_at: string;
    repo: { name: string };
    payload?: { before?: string; head?: string };
  }

  interface CompareResult {
    total_commits?: number;
    files?: { additions?: number; deletions?: number }[];
  }

  const events: PublicEvent[] = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_LOGIN}/events/public?per_page=100&page=${page}`,
      { headers },
    );
    if (!res.ok) break;
    const batch = (await res.json()) as PublicEvent[];
    events.push(...batch);
    if (batch.length < 100) break;
  }

  const fromKey = isoDaysAgo(DAYS_WINDOW).toISOString().slice(0, 10);
  const repoNames = new Set<string>();

  // A API de eventos não expõe mais a lista de commits do push — usamos
  // before/head com a Compare API para obter commits e stats de cada push.
  const pushes = events.filter((event) => {
    if (event.type !== "PushEvent") return false;
    const key = event.created_at.slice(0, 10);
    if (key < fromKey || !event.payload?.before || !event.payload?.head) return false;
    repoNames.add(event.repo.name);
    return true;
  });

  const MAX_COMPARES = 15; // rate limit anônimo: 60 req/h
  const compares = await Promise.all(
    pushes.slice(0, MAX_COMPARES).map(async (event) => {
      const { before, head } = event.payload as { before: string; head: string };
      const res = await fetch(
        `https://api.github.com/repos/${event.repo.name}/compare/${before}...${head}`,
        { headers },
      );
      if (!res.ok) return null;
      return (await res.json()) as CompareResult;
    }),
  );

  pushes.slice(0, MAX_COMPARES).forEach((event, i) => {
    const compare = compares[i];
    if (!compare) return;
    const slot = dayMap.get(event.created_at.slice(0, 10));
    if (!slot) return;
    slot.commits += compare.total_commits ?? 0;
    for (const file of compare.files ?? []) {
      slot.additions += file.additions ?? 0;
      slot.deletions += file.deletions ?? 0;
      slot.filesChanged += 1;
    }
  });

  // Linguagens primárias dos repos com atividade (1 chamada por repo, limitado).
  const langCount = new Map<string, number>();
  const repos = [...repoNames].slice(0, 10);
  const repoDetails = await Promise.all(
    repos.map(async (name) => {
      const res = await fetch(`https://api.github.com/repos/${name}`, { headers });
      if (!res.ok) return null;
      return ((await res.json()) as { language?: string | null }).language ?? null;
    }),
  );
  for (const lang of repoDetails) {
    if (lang) langCount.set(lang, (langCount.get(lang) ?? 0) + 1);
  }

  const days = [...dayMap.values()];
  return {
    days,
    languages: [...langCount.entries()]
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    totals: {
      totalCommits: days.reduce((sum, d) => sum + d.commits, 0),
      totalAdditions: days.reduce((sum, d) => sum + d.additions, 0),
      totalDeletions: days.reduce((sum, d) => sum + d.deletions, 0),
    },
  };
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    // Sem token: degrada para a API pública de eventos (sem additions/deletions).
    try {
      const payload = await fetchPublicStats();
      return NextResponse.json(payload, {
        headers: { "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600" },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro desconhecido";
      return NextResponse.json({ error: message }, { status: 502 });
    }
  }

  try {
    const from = isoDaysAgo(DAYS_WINDOW);
    const data = await fetchGraphQL(token, from);
    const collection = data?.user?.contributionsCollection;

    // Mapa base: um slot por dia na janela de 30 dias.
    const dayMap = new Map<string, DayStats>();
    for (let i = DAYS_WINDOW; i >= 0; i--) {
      const key = isoDaysAgo(i).toISOString().slice(0, 10);
      dayMap.set(key, { date: key, commits: 0, additions: 0, deletions: 0, filesChanged: 0 });
    }

    for (const week of collection?.contributionCalendar?.weeks ?? []) {
      for (const day of week.contributionDays) {
        const slot = dayMap.get(day.date);
        if (slot) slot.commits = day.contributionCount;
      }
    }

    // Linguagens: conta repositórios com commits no período por linguagem primária.
    const langCount = new Map<string, number>();
    for (const entry of collection?.commitContributionsByRepository ?? []) {
      const name = entry.repository.primaryLanguage?.name;
      if (name) langCount.set(name, (langCount.get(name) ?? 0) + 1);
    }
    const languages = [...langCount.entries()]
      .map(([language, count]) => ({ language, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Detalhes (additions/deletions/files) para commits dos últimos 7 dias.
    const detailSince = isoDaysAgo(DETAIL_DAYS);
    const recentCommits = await fetchRecentCommits(token, detailSince);
    const details = await Promise.all(
      recentCommits
        .slice(0, MAX_DETAIL_COMMITS)
        .map((c) => fetchCommitDetail(token, c.repository.full_name, c.sha)),
    );

    recentCommits.slice(0, MAX_DETAIL_COMMITS).forEach((commit, i) => {
      const detail = details[i];
      if (!detail) return;
      const key = commit.commit.author.date.slice(0, 10);
      const slot = dayMap.get(key);
      if (!slot) return;
      slot.additions += detail.additions;
      slot.deletions += detail.deletions;
      slot.filesChanged += detail.filesChanged;
    });

    const days = [...dayMap.values()];
    const payload: GitHubStatsPayload = {
      days,
      languages,
      totals: {
        totalCommits: days.reduce((sum, d) => sum + d.commits, 0),
        totalAdditions: days.reduce((sum, d) => sum + d.additions, 0),
        totalDeletions: days.reduce((sum, d) => sum + d.deletions, 0),
      },
    };

    // Cache na CDN da Vercel: 10min fresh, serve stale por até 1h enquanto revalida.
    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erro desconhecido";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
