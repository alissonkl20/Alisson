import { config } from "./config.js";

type CacheEntry = { reply: string; expiresAt: number };

const store = new Map<string, CacheEntry>();

export function purgeExpiredCache(now = Date.now()) {
  for (const [key, entry] of store) {
    if (entry.expiresAt <= now) store.delete(key);
  }
}

export function getCachedReply(key: string): string | null {
  purgeExpiredCache();
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.reply;
}

export function setCachedReply(key: string, reply: string) {
  purgeExpiredCache();
  if (store.size >= config.cacheMaxEntries) {
    const oldest = store.keys().next().value;
    if (oldest) store.delete(oldest);
  }
  store.set(key, { reply, expiresAt: Date.now() + config.cacheTtlMs });
}
