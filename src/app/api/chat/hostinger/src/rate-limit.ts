import { config } from "./config.js";

type Counter = { count: number; resetAt: number };
const ipCounters = new Map<string, Counter>();

function prune(now: number) {
  for (const [key, value] of ipCounters) {
    if (value.resetAt <= now) ipCounters.delete(key);
  }
}

function getCounter(key: string, now: number): Counter {
  const existing = ipCounters.get(key);
  if (existing && existing.resetAt > now) return existing;
  const next = { count: 0, resetAt: now + config.rateLimitWindowMs };
  ipCounters.set(key, next);
  return next;
}

export function extractClientIp(forwarded: string | undefined, fallback = "unknown"): string {
  if (!forwarded) return fallback;
  const first = forwarded.split(",")[0]?.trim();
  return first || fallback;
}

/** True when this IP may still ask the LLM (does not increment). */
export function isLlmQuotaAvailable(ip: string): boolean {
  const now = Date.now();
  prune(now);
  return getCounter(ip, now).count < config.rateLimitMax;
}

/** Increment after a successful LLM call (not cache/idempotency). */
export function consumeLlmQuota(ip: string): void {
  const now = Date.now();
  getCounter(ip, now).count += 1;
}

export function remainingQuota(ip: string): number {
  const now = Date.now();
  prune(now);
  return Math.max(0, config.rateLimitMax - getCounter(ip, now).count);
}
