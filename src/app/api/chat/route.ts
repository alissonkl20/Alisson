import { NextResponse } from "next/server";
import { consumeLlmQuota, extractClientIp, hasLlmQuota } from "./guard";
import { requestRemoteReply } from "./client";
import { CONTACT_LINKS, LIMIT_REACHED_REPLY } from "./shared/contact-links";

export const maxDuration = 60;

const NO_STORE = { "Cache-Control": "no-store" } as const;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object";
}

function readRequiredString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function unavailable() {
  return NextResponse.json({ error: "unavailable" }, { status: 503, headers: NO_STORE });
}

function invalidRequest() {
  return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: NO_STORE });
}

function limitReached() {
  return NextResponse.json(
    {
      status: "limit_reached",
      reply: LIMIT_REACHED_REPLY,
      contact_links: CONTACT_LINKS,
    },
    { status: 429, headers: NO_STORE },
  );
}

/** POST /api/chat — proxy to Hostinger; token stays on the server. */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidRequest();
  }

  if (!isRecord(body)) return invalidRequest();

  const sessionId = readRequiredString(body.session_id);
  const message = readRequiredString(body.message);
  if (!sessionId || !UUID_PATTERN.test(sessionId) || !message) {
    return invalidRequest();
  }

  const clientIp = extractClientIp(request);
  if (!hasLlmQuota(clientIp, sessionId)) return limitReached();

  const name = readRequiredString(body.name) ?? undefined;
  const email = readRequiredString(body.email) ?? undefined;

  try {
    const result = await requestRemoteReply({
      sessionId,
      message,
      clientIp,
      name,
      email,
    });

    if (result.kind === "limit_reached") {
      return NextResponse.json(
        {
          status: "limit_reached",
          reply: result.reply,
          contact_links: result.contactLinks,
        },
        { status: 429, headers: NO_STORE },
      );
    }

    if (result.kind === "busy") {
      return NextResponse.json({ status: "busy" }, { status: 409, headers: NO_STORE });
    }

    if (result.kind === "unavailable") return unavailable();

    if (!result.cached) consumeLlmQuota(clientIp, sessionId);

    const httpStatus = result.status === "queued" ? 202 : 200;
    return NextResponse.json(
      { reply: result.reply, status: result.status, cached: result.cached ?? false },
      { status: httpStatus, headers: NO_STORE },
    );
  } catch {
    return unavailable();
  }
}
