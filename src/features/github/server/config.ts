import { profile } from "@/shared/config/data";

/**
 * Configuração só de servidor. Nada daqui pode ser importado por
 * componentes "use client" — o token nunca entra no bundle do browser.
 */

export const DAYS_WINDOW = 30;
export const DETAIL_DAYS = 7;
export const MAX_DETAIL_COMMITS = 25;
/** Snapshot compartilhado: 1 consulta ao GitHub a cada 6h, o resto lê cache. */
export const REVALIDATE_SECONDS = 6 * 60 * 60;
export const STALE_WHILE_REVALIDATE_SECONDS = 24 * 60 * 60;
export const GITHUB_API = "https://api.github.com";
export const GITHUB_GRAPHQL = "https://api.github.com/graphql";

function loginFromProfile(): string {
  const match = profile.social.github.match(/github\.com\/([^/?#]+)/i);
  return match?.[1] ?? "";
}

export function getGitHubLogin(): string {
  return process.env.GITHUB_LOGIN?.trim() || loginFromProfile();
}

export function getGitHubToken(): string {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) return token;
  throw new Error("missing_github_token");
}

export function githubHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-github-stats",
  };
}
