const RATE_LIMIT_MAX = Number.parseInt(process.env.CHAT_RATE_LIMIT_MAX ?? "5", 10) || 5;
const RATE_LIMIT_WINDOW_MS =
  Number.parseInt(process.env.CHAT_RATE_LIMIT_WINDOW_MS ?? "86400000", 10) || 86_400_000;

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
  const next = { count: 0, resetAt: now + RATE_LIMIT_WINDOW_MS };
  map.set(key, next);
  return next;
}

export function extractClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/** Returns true when LLM quota is available (does not increment). */
export function hasLlmQuota(ip: string, sessionId: string): boolean {
  const now = Date.now();
  prune(ipCounters, now);
  prune(sessionCounters, now);
  const ipCounter = getCounter(ipCounters, ip, now);
  const sessionCounter = getCounter(sessionCounters, sessionId, now);
  return ipCounter.count < RATE_LIMIT_MAX && sessionCounter.count < RATE_LIMIT_MAX;
}

/** Increment after a successful LLM call (not cache/idempotency on VPS). */
export function consumeLlmQuota(ip: string, sessionId: string): void {
  const now = Date.now();
  getCounter(ipCounters, ip, now).count += 1;
  getCounter(sessionCounters, sessionId, now).count += 1;
}
