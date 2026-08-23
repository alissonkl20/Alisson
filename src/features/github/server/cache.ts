import { unstable_cache } from "next/cache";
import type { GitHubStats } from "../lib/types";
import { REVALIDATE_SECONDS } from "./config";
import { fetchGitHubStats } from "./fetch-stats";

const REVALIDATE_MS = REVALIDATE_SECONDS * 1000;

/**
 * Data Cache da Vercel/Next: no máximo 1 ida ao GitHub a cada 6h,
 * compartilhada entre todos os visitantes.
 */
const readFromDataCache = unstable_cache(
  async () => fetchGitHubStats(),
  ["github-stats"],
  { revalidate: REVALIDATE_SECONDS, tags: ["github-stats"] },
);

/** Cache em memória da instância — cobre bursts no mesmo isolate quente. */
let memory: GitHubStats | null = null;

function isFresh(snapshot: GitHubStats): boolean {
  const at = Date.parse(snapshot.updatedAt);
  if (Number.isNaN(at)) return false;
  return Date.now() - at < REVALIDATE_MS;
}

export async function getCachedGitHubStats(): Promise<GitHubStats> {
  if (memory && isFresh(memory)) return memory;

  try {
    const snapshot = await readFromDataCache();
    memory = snapshot;
    return snapshot;
  } catch (error) {
    if (memory) return memory;
    throw error;
  }
}
