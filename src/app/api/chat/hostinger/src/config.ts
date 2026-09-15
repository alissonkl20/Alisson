function readInt(name: string, fallback: number): number {
  const raw = process.env[name]?.trim();
  if (!raw) return fallback;
  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export const config = {
  port: readInt("PORT", 3100),
  token: process.env.PORTFOLIO_API_TOKEN?.trim() ?? "",
  ollamaBaseUrl: (process.env.OLLAMA_BASE_URL?.trim() || "http://127.0.0.1:11434").replace(/\/+$/, ""),
  ollamaModel: process.env.OLLAMA_MODEL?.trim() || "llama3.2:3b",
  ollamaTimeoutMs: readInt("OLLAMA_TIMEOUT_MS", 120_000),
  rateLimitMax: readInt("RATE_LIMIT_MAX", 5),
  rateLimitWindowMs: readInt("RATE_LIMIT_WINDOW_MS", 86_400_000),
  cacheTtlMs: readInt("CACHE_TTL_MS", 86_400_000),
  cacheMaxEntries: readInt("CACHE_MAX_ENTRIES", 500),
  idempotencyTtlMs: readInt("IDEMPOTENCY_TTL_MS", 300_000),
} as const;
