import type { DayData, GitHubStats } from "../lib/types";
import {
  DAYS_WINDOW,
  DETAIL_DAYS,
  GITHUB_API,
  GITHUB_GRAPHQL,
  MAX_DETAIL_COMMITS,
  getGitHubLogin,
  getGitHubToken,
  githubHeaders,
} from "./config";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

interface GraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks: { contributionDays: ContributionDay[] }[];
        };
        commitContributionsByRepository?: {
          repository: {
            primaryLanguage: { name: string } | null;
          };
        }[];
      };
    };
  };
  errors?: { message: string }[];
}

interface SearchCommitItem {
  sha: string;
  repository: { full_name: string };
  commit: { author: { date: string } };
}

const COMMIT_DETAIL_CONCURRENCY = 5;

function isoDaysAgo(days: number): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function emptyWindow(): Map<string, DayData> {
  const dayMap = new Map<string, DayData>();
  for (let i = DAYS_WINDOW; i >= 0; i--) {
    const key = isoDaysAgo(i).toISOString().slice(0, 10);
    dayMap.set(key, { date: key, commits: 0, additions: 0, deletions: 0, filesChanged: 0 });
  }
  return dayMap;
}

function toPayload(days: DayData[], languages: GitHubStats["languages"]): GitHubStats {
  return {
    days,
    languages,
    totals: {
      totalCommits: days.reduce((sum, d) => sum + d.commits, 0),
      totalAdditions: days.reduce((sum, d) => sum + (d.additions ?? 0), 0),
      totalDeletions: days.reduce((sum, d) => sum + (d.deletions ?? 0), 0),
    },
    updatedAt: new Date().toISOString(),
  };
}

async function fetchGraphQL(token: string, login: string, from: Date) {
  const query = `
    query ($login: String!, $from: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from) {
          contributionCalendar {
            totalContributions
            weeks { contributionDays { date contributionCount } }
          }
          commitContributionsByRepository(maxRepositories: 100) {
            repository { primaryLanguage { name } }
          }
        }
      }
    }
  `;

  const res = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...githubHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { login, from: from.toISOString() },
    }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("github_graphql_failed");

  const json = (await res.json()) as GraphQLResponse;
  if (json.errors?.length) throw new Error("github_graphql_failed");
  return json.data;
}

async function fetchRecentCommits(token: string, login: string, since: Date) {
  const q = `author:${login} committer-date:>=${since.toISOString().slice(0, 10)}`;
  const res = await fetch(
    `${GITHUB_API}/search/commits?q=${encodeURIComponent(q)}&per_page=${MAX_DETAIL_COMMITS}&sort=committer-date&order=desc`,
    { headers: githubHeaders(token), cache: "no-store" },
  );
  if (!res.ok) throw new Error("github_commit_search_failed");
  const json = (await res.json()) as { items?: SearchCommitItem[] };
  return json.items ?? [];
}

async function fetchCommitDetail(token: string, fullName: string, sha: string) {
  const res = await fetch(`${GITHUB_API}/repos/${fullName}/commits/${sha}`, {
    headers: githubHeaders(token),
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("github_commit_detail_failed");
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

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  task: (item: T) => Promise<R>,
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await task(items[index]!);
    }
  };

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, items.length) },
      () => worker(),
    ),
  );
  return results;
}

/** Agrega stats autenticadas. Falhas internas não vazam mensagem da API. */
export async function fetchGitHubStats(): Promise<GitHubStats> {
  const token = getGitHubToken();
  const login = getGitHubLogin();
  const from = isoDaysAgo(DAYS_WINDOW);
  const data = await fetchGraphQL(token, login, from);
  const collection = data?.user?.contributionsCollection;
  const dayMap = emptyWindow();

  for (const week of collection?.contributionCalendar?.weeks ?? []) {
    for (const day of week.contributionDays) {
      const slot = dayMap.get(day.date);
      if (slot) slot.commits = day.contributionCount;
    }
  }

  const langCount = new Map<string, number>();
  for (const entry of collection?.commitContributionsByRepository ?? []) {
    const name = entry.repository.primaryLanguage?.name;
    if (name) langCount.set(name, (langCount.get(name) ?? 0) + 1);
  }
  const languages = [...langCount.entries()]
    .map(([language, count]) => ({ language, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  const recentCommits = await fetchRecentCommits(
    token,
    login,
    isoDaysAgo(DETAIL_DAYS),
  );
  const commitsWithDetails = recentCommits.slice(0, MAX_DETAIL_COMMITS);
  const details = await mapWithConcurrency(
    commitsWithDetails,
    COMMIT_DETAIL_CONCURRENCY,
    (commit) =>
      fetchCommitDetail(token, commit.repository.full_name, commit.sha),
  );

  commitsWithDetails.forEach((commit, i) => {
    const detail = details[i];
    if (!detail) return;
    const key = commit.commit.author.date.slice(0, 10);
    const slot = dayMap.get(key);
    if (!slot) return;
    slot.additions = (slot.additions ?? 0) + detail.additions;
    slot.deletions = (slot.deletions ?? 0) + detail.deletions;
    slot.filesChanged = (slot.filesChanged ?? 0) + detail.filesChanged;
  });

  return toPayload([...dayMap.values()], languages);
}
