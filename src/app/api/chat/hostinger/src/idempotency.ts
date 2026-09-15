import { config } from "./config.js";

const store = new Map<string, { reply: string; expiresAt: number }>();

export function getIdempotentReply(key: string): string | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return entry.reply;
}

export function setIdempotentReply(key: string, reply: string) {
  store.set(key, { reply, expiresAt: Date.now() + config.idempotencyTtlMs });
}
