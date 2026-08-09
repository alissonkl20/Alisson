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

export interface ChatResponse {
  reply: string;
  source: "rules" | "ai" | "fallback";
}

const CHATBOT_API_URL = process.env.NEXT_PUBLIC_CHATBOT_API_URL?.replace(/\/$/, "");

/** Endpoint REST: Next.js interno ou servidor Express externo */
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

/** Envia mensagem ao backend e retorna a resposta do bot */
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
  });

  if (!response.ok) {
    throw new Error(`Chat API error: ${response.status}`);
  }

  return response.json() as Promise<ChatResponse>;
}

export const CHAT_GREETING =
  "Olá! Sou o assistente virtual de Alisson. Posso ajudar com informações sobre experiência, projetos e formas de contato.";

export const CHAT_SUGGESTIONS = [
  "Quem é Alisson?",
  "Experiência profissional",
  "Projetos",
  "Como entrar em contato?",
] as const;
