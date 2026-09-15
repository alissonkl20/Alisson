import { config } from "./config.js";

type Counter = { count: number; resetAt: number };
const ipCounters = new Map<string, Counter>();
const sessionCounters = new Map<string, Counter>();

function prune(map: Map<string, Counter>, now: number) {
  for (const [key, value] of map) {
    if (value.resetAt <= now) map.delete(key);
  }
}

function getCounter(map: Map<string, Counter>, key: string, now: number): Counter {
  const existing = map.get(key);
  if (existing && existing.resetAt > now) return existing;
  const next = { count: 0, resetAt: now + config.rateLimitWindowMs };
  map.set(key, next);
  return next;
}

export function extractClientIp(forwarded: string | undefined, fallback = "unknown"): string {
  if (!forwarded) return fallback;
  const first = forwarded.split(",")[0]?.trim();
  return first || fallback;
}

export function isLlmQuotaAvailable(ip: string, sessionId: string): boolean {
  const now = Date.now();
  prune(ipCounters, now);
  prune(sessionCounters, now);
  return (
    getCounter(ipCounters, ip, now).count < config.rateLimitMax &&
    getCounter(sessionCounters, sessionId, now).count < config.rateLimitMax
  );
}

export function consumeLlmQuota(ip: string, sessionId: string): void {
  const now = Date.now();
  getCounter(ipCounters, ip, now).count += 1;
  getCounter(sessionCounters, sessionId, now).count += 1;
}
