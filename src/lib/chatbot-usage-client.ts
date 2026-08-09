import {
  CHAT_COOLDOWN_MS,
  CHAT_USAGE_STORAGE_KEY,
  createFreshUsageSession,
  getRemainingQuestions,
  isLimitReached,
  MAX_CHAT_QUESTIONS,
  normalizeUsageSession,
  type ChatUsageSession,
} from "@/lib/chatbot-limits";

export function readClientUsage(): ChatUsageSession {
  if (typeof window === "undefined") {
    return createFreshUsageSession();
  }

  try {
    const raw = localStorage.getItem(CHAT_USAGE_STORAGE_KEY);
    if (!raw) return createFreshUsageSession();

    return normalizeUsageSession(JSON.parse(raw) as ChatUsageSession);
  } catch {
    return createFreshUsageSession();
  }
}

export function writeClientUsage(session: ChatUsageSession): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CHAT_USAGE_STORAGE_KEY, JSON.stringify(session));
}

/** Incrementa contador local após envio bem-sucedido */
export function incrementClientUsage(): ChatUsageSession {
  const session = readClientUsage();
  const updated: ChatUsageSession = {
    windowStart: session.windowStart,
    count: session.count + 1,
  };
  writeClientUsage(updated);
  return updated;
}

export function syncClientUsage(session: ChatUsageSession): ChatUsageSession {
  const normalized = normalizeUsageSession(session);
  writeClientUsage(normalized);
  return normalized;
}

export function getClientUsageSummary() {
  const session = readClientUsage();
  return {
    session,
    remaining: getRemainingQuestions(session),
    limitReached: isLimitReached(session),
    max: MAX_CHAT_QUESTIONS,
    cooldownMs: CHAT_COOLDOWN_MS,
  };
}
