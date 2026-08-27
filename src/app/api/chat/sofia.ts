/**
 * Cliente HTTP da SOFIA — só no servidor.
 * SOFIA_TOKEN nunca deve ser importado por componentes "use client".
 */

const STATUS_TIMEOUT_MS = 8_000;
const CHAT_TIMEOUT_MS = 45_000;
const POLL_TIMEOUT_MS = 6_000;
const POLL_INTERVAL_MS = 1_500;
const POLL_MAX_ATTEMPTS = 3;

export type SofiaChatSuccess = {
  reply: string;
  status: "ok" | "queued";
};

type SofiaConfig = {
  url: string;
  token: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function readTrimmedString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function getSofiaConfig(): SofiaConfig | null {
  const url = process.env.SOFIA_URL?.trim().replace(/\/+$/, "");
  const token = process.env.SOFIA_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

function sofiaHeaders(token: string, hasJsonBody: boolean): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
  if (hasJsonBody) headers["Content-Type"] = "application/json";
  return headers;
}

function isAbortError(error: unknown): boolean {
  return error instanceof Error && (error.name === "AbortError" || error.name === "TimeoutError");
}

async function sofiaFetch(
  config: SofiaConfig,
  path: string,
  init: RequestInit & { timeoutMs: number },
): Promise<Response> {
  const { timeoutMs, headers, ...rest } = init;
  return fetch(`${config.url}${path}`, {
    ...rest,
    headers: { ...sofiaHeaders(config.token, Boolean(rest.body)), ...headers },
    signal: AbortSignal.timeout(timeoutMs),
    cache: "no-store",
  });
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function getPortfolioStatus(config: SofiaConfig): Promise<"ready" | "unavailable"> {
  try {
    const response = await sofiaFetch(config, "/api/portfolio/status", {
      method: "GET",
      timeoutMs: STATUS_TIMEOUT_MS,
    });

    if (response.status === 503 || !response.ok) return "unavailable";

    const body = await readJson(response);
    if (!isRecord(body) || body.online !== true) return "unavailable";
    return "ready";
  } catch {
    return "unavailable";
  }
}

function readReply(body: unknown): SofiaChatSuccess | null {
  if (!isRecord(body)) return null;
  const reply = readTrimmedString(body.reply);
  if (!reply) return null;

  if (body.status === "queued") return { reply, status: "queued" };
  return { reply, status: "ok" };
}

function extractAssistantReply(body: unknown, userMessage: string): string | null {
  if (!isRecord(body) || !Array.isArray(body.messages)) return null;

  const messages = body.messages.filter(isRecord);
  let lastUserIndex = -1;

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const role = messages[index].role;
    const content = readTrimmedString(messages[index].content);
    if (role === "user" && content === userMessage) {
      lastUserIndex = index;
      break;
    }
  }

  if (lastUserIndex < 0) return null;

  for (let index = lastUserIndex + 1; index < messages.length; index += 1) {
    const message = messages[index];
    if (message.role !== "assistant") continue;
    const content = readTrimmedString(message.content);
    if (content) return content;
  }

  return null;
}

async function pollAssistantReply(
  config: SofiaConfig,
  sessionId: string,
  userMessage: string,
): Promise<string | null> {
  const path = `/api/portfolio/chat?session_id=${encodeURIComponent(sessionId)}`;

  for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt += 1) {
    await sleep(POLL_INTERVAL_MS);

    try {
      const response = await sofiaFetch(config, path, {
        method: "GET",
        timeoutMs: POLL_TIMEOUT_MS,
      });
      if (!response.ok) continue;

      const reply = extractAssistantReply(await readJson(response), userMessage);
      if (reply) return reply;
    } catch {
      // timeout/rede no poll: tenta de novo até esgotar
    }
  }

  return null;
}

async function postPortfolioChat(
  config: SofiaConfig,
  payload: {
    sessionId: string;
    message: string;
    name?: string;
    email?: string;
  },
): Promise<{ kind: "ok"; value: SofiaChatSuccess } | { kind: "unavailable" } | { kind: "retry-poll" }> {
  const body: Record<string, string> = {
    session_id: payload.sessionId,
    message: payload.message,
  };
  if (payload.name) body.name = payload.name;
  if (payload.email) body.email = payload.email;

  try {
    const response = await sofiaFetch(config, "/api/portfolio/chat", {
      method: "POST",
      timeoutMs: CHAT_TIMEOUT_MS,
      body: JSON.stringify(body),
    });

    if (response.status === 200 || response.status === 202) {
      const parsed = readReply(await readJson(response));
      if (parsed) return { kind: "ok", value: parsed };
      return { kind: "unavailable" };
    }

    if (response.status === 503) return { kind: "unavailable" };
    return { kind: "unavailable" };
  } catch (error) {
    if (isAbortError(error) || error instanceof TypeError) {
      return { kind: "retry-poll" };
    }
    return { kind: "unavailable" };
  }
}

export async function requestSofiaReply(input: {
  sessionId: string;
  message: string;
  name?: string;
  email?: string;
}): Promise<SofiaChatSuccess | null> {
  const config = getSofiaConfig();
  if (!config) return null;

  const status = await getPortfolioStatus(config);
  if (status === "unavailable") return null;

  const posted = await postPortfolioChat(config, input);
  if (posted.kind === "ok") return posted.value;
  if (posted.kind === "unavailable") return null;

  const polled = await pollAssistantReply(config, input.sessionId, input.message);
  if (!polled) return null;
  return { reply: polled, status: "ok" };
}
