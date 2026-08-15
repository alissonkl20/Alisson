/** Limite de perguntas do usuário por janela de tempo */
export const MAX_CHAT_QUESTIONS = 5;

/** Janela de 8 horas antes de liberar novas perguntas */
export const CHAT_COOLDOWN_MS = 8 * 60 * 60 * 1000;

export const CHAT_USAGE_COOKIE = "chat_usage";
export const CHAT_USAGE_STORAGE_KEY = "alisson_chat_usage";

export interface ChatUsageSession {
  count: number;
  windowStart: number;
}

export const CHAT_LIMIT_REPLY =
  "You've reached the limit of 5 questions in this session. To continue, use the Contact section at the bottom of the page or the email and social links there.";

export const CHAT_POLICY_REPLY =
  "I can't share personal data or internal system details. I can only help with Alisson's professional information: experience, projects, and technologies.";

export function createFreshUsageSession(): ChatUsageSession {
  return { count: 0, windowStart: Date.now() };
}

export function normalizeUsageSession(raw: ChatUsageSession | null): ChatUsageSession {
  if (!raw || typeof raw.count !== "number" || typeof raw.windowStart !== "number") {
    return createFreshUsageSession();
  }

  if (Date.now() - raw.windowStart >= CHAT_COOLDOWN_MS) {
    return createFreshUsageSession();
  }

  return raw;
}

export function getRemainingQuestions(session: ChatUsageSession): number {
  return Math.max(0, MAX_CHAT_QUESTIONS - session.count);
}

export function isLimitReached(session: ChatUsageSession): boolean {
  return session.count >= MAX_CHAT_QUESTIONS;
}

/** Bloqueia pedidos de dados pessoais ou detalhes internos do sistema */
export function isPolicyViolation(message: string): boolean {
  const text = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const patterns = [
    /\b(email|e-mail|telefone|whatsapp|celular|cpf|rg|endereco)\b/,
    /\bdados\s+pessoais\b/,
    /\b(senha|password|token|api\s*key|chave\s*api)\b/,
    /\bcomo\s+funciona\s+(o\s+)?(chat|bot|sistema|servidor|api|backend)\b/,
    /\barquitetura\s+(do\s+)?(sistema|chat|bot)\b/,
    /\binformacoes\s+privadas\b/,
  ];

  return patterns.some((pattern) => pattern.test(text));
}
