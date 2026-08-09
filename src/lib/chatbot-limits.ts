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
  "Você atingiu o limite de 5 perguntas nesta sessão. Para continuar, entre em contato pela seção Contact no site — role até o final da página ou use os links de e-mail e redes sociais.";

export const CHAT_POLICY_REPLY =
  "Não posso compartilhar dados pessoais nem detalhes internos de sistemas. Posso ajudar apenas com informações profissionais de Alisson: experiência, projetos e tecnologias.";

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
