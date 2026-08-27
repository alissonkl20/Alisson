import { NextResponse } from "next/server";
import { requestSofiaReply } from "./sofia";

/** Tempo alto: Ollama local via túnel pode demorar dezenas de segundos. */
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

/** POST /api/chat — proxy SOFIA; token fica no servidor. */
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

  const name = readRequiredString(body.name) ?? undefined;
  const email = readRequiredString(body.email) ?? undefined;

  try {
    const result = await requestSofiaReply({ sessionId, message, name, email });
    if (!result) return unavailable();

    const status = result.status === "queued" ? 202 : 200;
    return NextResponse.json(
      { reply: result.reply, status: result.status },
      { status, headers: NO_STORE },
    );
  } catch {
    return unavailable();
  }
}
