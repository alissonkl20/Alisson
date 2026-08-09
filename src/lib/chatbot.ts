import {
  CHAT_GREETING,
  CHAT_SUGGESTIONS,
} from "@/lib/chatbot-responses";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  history?: Array<{ role: ChatRole; content: string }>;
}

export interface ChatUsageInfo {
  count: number;
  remaining: number;
  limitReached: boolean;
  windowStart: number;
}

export interface ChatResponse {
  reply: string;
  source: "rules" | "ai" | "fallback" | "limit" | "policy";
  usage?: ChatUsageInfo;
}

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL?.replace(/\/$/, "");

function getChatEndpoint(): string {
  return CHATBOT_API_URL ? `${CHATBOT_API_URL}/api/chat` : "/api/chat";
}

export function createMessage(role: ChatRole, content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[] = [],
): Promise<ChatResponse> {
  const payload: ChatRequest = {
    message,
    history: history.map(({ role, content }) => ({ role, content })),
  };

  const response = await fetch(getChatEndpoint(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }

  return response.json() as Promise<ChatResponse>;
}

export { CHAT_GREETING, CHAT_SUGGESTIONS };
