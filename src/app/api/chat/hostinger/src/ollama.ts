import { buildSystemPrompt } from "./build-prompt.js";
import { config } from "./config.js";

type ChatTurn = { role: "user" | "assistant"; content: string };

export async function pingOllama(): Promise<boolean> {
  try {
    const response = await fetch(`${config.ollamaBaseUrl}/api/tags`, {
      signal: AbortSignal.timeout(3_000),
      cache: "no-store",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function chatWithOllama(history: ChatTurn[], userMessage: string): Promise<string | null> {
  const messages = [
    { role: "system", content: buildSystemPrompt(userMessage) },
    ...history.slice(-8),
    { role: "user", content: userMessage },
  ];

  try {
    const response = await fetch(`${config.ollamaBaseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: config.ollamaModel,
        messages,
        stream: false,
        keep_alive: config.ollamaKeepAlive,
        options: { temperature: 0.15, top_p: 0.8, num_predict: 512, num_ctx: 2048 },
      }),
      signal: AbortSignal.timeout(config.ollamaTimeoutMs),
      cache: "no-store",
    });

    if (!response.ok) return null;
    const body = (await response.json()) as { message?: { content?: string } };
    const reply = body.message?.content?.trim();
    return reply || null;
  } catch (error) {
    console.error("[chat-api] ollama error");
    return null;
  }
}
