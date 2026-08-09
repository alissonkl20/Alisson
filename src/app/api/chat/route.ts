import { generateText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  buildRuleBasedReply,
  CHATBOT_SYSTEM_PROMPT,
  detectIntent,
  getIntentHint,
} from "@/lib/chatbot-responses";
import {
  CHAT_COOLDOWN_MS,
  CHAT_LIMIT_REPLY,
  CHAT_POLICY_REPLY,
  CHAT_USAGE_COOKIE,
  createFreshUsageSession,
  getRemainingQuestions,
  isLimitReached,
  isPolicyViolation,
  normalizeUsageSession,
  type ChatUsageSession,
} from "@/lib/chatbot-limits";

type ChatRole = "user" | "assistant";

interface ChatRequestBody {
  message?: string;
  history?: Array<{ role: ChatRole; content: string }>;
}

const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

async function readUsageFromCookie(): Promise<ChatUsageSession> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(CHAT_USAGE_COOKIE)?.value;

  if (!raw) return createFreshUsageSession();

  try {
    return normalizeUsageSession(JSON.parse(raw) as ChatUsageSession);
  } catch {
    return createFreshUsageSession();
  }
}

function attachUsageCookie(response: NextResponse, session: ChatUsageSession): void {
  response.cookies.set(CHAT_USAGE_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(CHAT_COOLDOWN_MS / 1000),
    path: "/",
  });
}

function jsonWithUsage(
  body: Record<string, unknown>,
  session: ChatUsageSession,
): NextResponse {
  const response = NextResponse.json({
    ...body,
    usage: {
      count: session.count,
      remaining: getRemainingQuestions(session),
      limitReached: isLimitReached(session),
      windowStart: session.windowStart,
    },
  });
  attachUsageCookie(response, session);
  return response;
}

async function buildGroqReply(
  message: string,
  history: ChatRequestBody["history"],
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const modelId = process.env.GROQ_MODEL ?? DEFAULT_GROQ_MODEL;
  const groq = createGroq({ apiKey });
  const intent = detectIntent(message);
  const intentHint = getIntentHint(intent);

  const contextNote = intentHint
    ? `[${intentHint} Máximo 2-3 frases. Sem listas longas.]`
    : "[Resposta curta: máximo 2-3 frases.]";

  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    ...(history ?? []).slice(-4).map((entry) => ({
      role: entry.role,
      content: entry.content,
    })),
    {
      role: "user",
      content: `${contextNote}\n\nPergunta: ${message}`,
    },
  ];

  try {
    const result = await generateText({
      model: groq(modelId),
      system: CHATBOT_SYSTEM_PROMPT,
      messages,
      temperature: 0.4,
      maxOutputTokens: 180,
    });

    return result.text?.trim() || null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const message = body.message?.trim();

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const session = await readUsageFromCookie();

    if (isLimitReached(session)) {
      return jsonWithUsage(
        { reply: CHAT_LIMIT_REPLY, source: "limit" },
        session,
      );
    }

    if (isPolicyViolation(message)) {
      const updated: ChatUsageSession = {
        windowStart: session.windowStart,
        count: session.count + 1,
      };
      return jsonWithUsage(
        { reply: CHAT_POLICY_REPLY, source: "policy" },
        updated,
      );
    }

    const aiReply = await buildGroqReply(message, body.history);
    const reply = aiReply ?? buildRuleBasedReply(message);

    const updated: ChatUsageSession = {
      windowStart: session.windowStart,
      count: session.count + 1,
    };

    return jsonWithUsage(
      { reply, source: aiReply ? "ai" : "rules" },
      updated,
    );
  } catch {
    const session = await readUsageFromCookie();
    return jsonWithUsage(
      {
        reply: "Ocorreu um erro ao processar sua mensagem. Tente novamente em instantes.",
        source: "fallback",
      },
      session,
    );
  }
}
