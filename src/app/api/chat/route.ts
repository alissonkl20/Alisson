import { NextResponse } from "next/server";
import { getChatbotReply } from "./bot/replies";

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

function invalidRequest() {
  return NextResponse.json({ error: "invalid_request" }, { status: 400, headers: NO_STORE });
}

/** POST /api/chat — static preset bot only (no LLM). */
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

  const reply = getChatbotReply(message);
  return NextResponse.json(
    { reply, status: "ok", source: "preset" },
    { status: 200, headers: NO_STORE },
  );
}
