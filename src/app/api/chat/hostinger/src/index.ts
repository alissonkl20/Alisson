import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { bearerAuth } from "./auth.js";
import { getCachedReply, setCachedReply } from "./cache.js";
import { CONTACT_LINKS, LIMIT_REACHED_REPLY } from "./contact-links.js";
import { config } from "./config.js";
import { getIdempotentReply, setIdempotentReply } from "./idempotency.js";
import { hashMessage } from "./normalize.js";
import { chatWithOllama, pingOllama } from "./ollama.js";
import { consumeLlmQuota, extractClientIp, isLlmQuotaAvailable } from "./rate-limit.js";
import {
  appendSessionMessage,
  getSessionMessages,
  isSessionBusy,
  setSessionBusy,
} from "./sessions.js";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const app = new Hono();

app.get("/health", (c) => c.json({ ok: true }));

app.use("/api/portfolio/*", bearerAuth);

app.get("/api/portfolio/status", async (c) => {
  const llm = await pingOllama();
  return c.json({ online: true, llm });
});

app.get("/api/portfolio/chat", (c) => {
  const sessionId = c.req.query("session_id")?.trim() ?? "";
  if (!UUID_PATTERN.test(sessionId)) {
    return c.json({ error: "invalid_request" }, 422);
  }
  return c.json({
    status: "ok",
    stage: null,
    complete: false,
    summary: null,
    messages: getSessionMessages(sessionId),
  });
});

app.post("/api/portfolio/chat", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "invalid_request" }, 422);
  }

  if (!body || typeof body !== "object") {
    return c.json({ error: "invalid_request" }, 422);
  }

  const record = body as Record<string, unknown>;
  const sessionId = typeof record.session_id === "string" ? record.session_id.trim() : "";
  const message = typeof record.message === "string" ? record.message.trim() : "";

  if (!UUID_PATTERN.test(sessionId) || !message) {
    return c.json({ error: "invalid_request" }, 422);
  }

  const clientIp = extractClientIp(c.req.header("X-Forwarded-For"));

  if (isSessionBusy(sessionId)) {
    return c.json({ status: "busy" }, 409);
  }

  const messageHash = hashMessage(message);
  const idempotencyKey = `${sessionId}:${messageHash}`;

  const idempotent = getIdempotentReply(idempotencyKey);
  if (idempotent) {
    return c.json({ status: "ok", reply: idempotent, cached: true });
  }

  if (!isLlmQuotaAvailable(clientIp)) {
    return c.json(
      {
        status: "limit_reached",
        reply: LIMIT_REACHED_REPLY,
        contact_links: CONTACT_LINKS,
      },
      429,
    );
  }

  const cached = getCachedReply(messageHash);
  if (cached) {
    setIdempotentReply(idempotencyKey, cached);
    appendSessionMessage(sessionId, "user", message);
    appendSessionMessage(sessionId, "assistant", cached);
    return c.json({ status: "ok", reply: cached, cached: true });
  }

  setSessionBusy(sessionId, true);
  try {
    const history = getSessionMessages(sessionId);
    const reply = await chatWithOllama(history, message);
    if (!reply) {
      return c.json({ error: "unavailable" }, 503);
    }

    consumeLlmQuota(clientIp);
    setCachedReply(messageHash, reply);
    setIdempotentReply(idempotencyKey, reply);
    appendSessionMessage(sessionId, "user", message);
    appendSessionMessage(sessionId, "assistant", reply);

    return c.json({ status: "ok", reply });
  } catch {
    return c.json({ error: "unavailable" }, 503);
  } finally {
    setSessionBusy(sessionId, false);
  }
});

serve({ fetch: app.fetch, port: config.port, hostname: "127.0.0.1" }, () => {
  console.log(`portfolio-chat-api listening on 127.0.0.1:${config.port}`);
});
