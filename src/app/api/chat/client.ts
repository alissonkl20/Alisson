/**
 * HTTP client for the Hostinger chat API — server only.
 * SOFIA_TOKEN must never be imported by "use client" components.
 */

import type { ChatApiResult } from "./types";
import { CONTACT_LINKS, LIMIT_REACHED_REPLY, type ContactLinks } from "./shared/contact-links";

const STATUS_TIMEOUT_MS = 8_000;
const CHAT_TIMEOUT_MS = 55_000;

type RemoteConfig = {
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

function getRemoteConfig(): RemoteConfig | null {
  const url = process.env.SOFIA_URL?.trim().replace(/\/+$/, "");
  const token = process.env.SOFIA_TOKEN?.trim();
  if (!url || !token) return null;
  return { url, token };
}

function remoteHeaders(
  token: string,
  clientIp: string,
  hasJsonBody: boolean,
): HeadersInit {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "X-Forwarded-For": clientIp,
  };
  if (hasJsonBody) headers["Content-Type"] = "application/json";
  return headers;
}

async function remoteFetch(
  config: RemoteConfig,
  clientIp: string,
  path: string,
  init: RequestInit & { timeoutMs: number },
): Promise<Response> {
  const { timeoutMs, headers, ...rest } = init;
  return fetch(`${config.url}${path}`, {
    ...rest,
    headers: {
      ...remoteHeaders(config.token, clientIp, Boolean(rest.body)),
      ...headers,
    },
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

function readContactLinks(body: unknown): ContactLinks {
  if (!isRecord(body) || !isRecord(body.contact_links)) return CONTACT_LINKS;
  const links = body.contact_links;
  return {
    linkedin: (readTrimmedString(links.linkedin) ?? CONTACT_LINKS.linkedin) as ContactLinks["linkedin"],
    email: (readTrimmedString(links.email) ?? CONTACT_LINKS.email) as ContactLinks["email"],
    whatsapp: (readTrimmedString(links.whatsapp) ?? CONTACT_LINKS.whatsapp) as ContactLinks["whatsapp"],
  };
}

async function getPortfolioStatus(
  config: RemoteConfig,
  clientIp: string,
): Promise<"ready" | "unavailable"> {
  try {
    const response = await remoteFetch(config, clientIp, "/api/portfolio/status", {
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

export async function requestRemoteReply(input: {
  sessionId: string;
  message: string;
  clientIp: string;
  name?: string;
  email?: string;
}): Promise<ChatApiResult> {
  const config = getRemoteConfig();
  if (!config) return { kind: "unavailable" };

  const status = await getPortfolioStatus(config, input.clientIp);
  if (status === "unavailable") return { kind: "unavailable" };

  const body: Record<string, string> = {
    session_id: input.sessionId,
    message: input.message,
  };
  if (input.name) body.name = input.name;
  if (input.email) body.email = input.email;

  try {
    const response = await remoteFetch(config, input.clientIp, "/api/portfolio/chat", {
      method: "POST",
      timeoutMs: CHAT_TIMEOUT_MS,
      body: JSON.stringify(body),
    });

    const payload = await readJson(response);

    if (response.status === 429) {
      const reply = readTrimmedString(isRecord(payload) ? payload.reply : null) ?? LIMIT_REACHED_REPLY;
      return {
        kind: "limit_reached",
        reply,
        contactLinks: readContactLinks(payload),
      };
    }

    if (response.status === 409) return { kind: "busy" };

    if (response.status === 200 || response.status === 202) {
      if (!isRecord(payload)) return { kind: "unavailable" };
      const reply = readTrimmedString(payload.reply);
      if (!reply) return { kind: "unavailable" };
      return {
        kind: "ok",
        reply,
        status: payload.status === "queued" ? "queued" : "ok",
        cached: payload.cached === true,
      };
    }

    return { kind: "unavailable" };
  } catch {
    return { kind: "unavailable" };
  }
}
