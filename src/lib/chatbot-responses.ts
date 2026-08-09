import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot-skills";
import { CHAT_POLICY_REPLY } from "@/lib/chatbot-limits";
import { isPolicyViolation } from "@/lib/chatbot-limits";

export const CHAT_GREETING =
  "Olá! Sou o assistente de Alisson. Você pode fazer até 5 perguntas sobre experiência, projetos ou tecnologias.";

export const CHAT_SUGGESTIONS = [
  "Quem é Alisson?",
  "Experiência profissional",
  "Projetos",
  "Tecnologias",
] as const;

export type ChatIntent =
  | "greeting"
  | "alisson"
  | "experience"
  | "projects"
  | "tech"
  | "unknown";

const REPLY_ALISSON =
  "Alisson de Almeida é desenvolvedor Full Stack com mais de 3 anos de experiência profissional e 5 anos na área de tecnologia. Atua com stacks modernas e legadas, com foco em soluções completas, performance e qualidade de código.";

const REPLY_EXPERIENCE =
  "Experiência em backends robustos e escaláveis, otimização de performance, interfaces modernas e responsivas, e automação com RPA web e no-code. Atuou em Rauzee, freelancing e WhaticketSaaS.";

const REPLY_PROJECTS =
  "Destaques: RPAs para nota MEI, consultas automatizadas e notificações; Finance AI com LLM local para análise de extratos; e agentes para agilização de trabalho.";

const REPLY_TECH =
  "Stack principal: backend com Laravel e Flask; frontend com React, Next.js, Vue.js, NestJS, HTML e CSS; PostgreSQL e REST APIs.";

const REPLY_HELLO =
  "Olá! Pergunte sobre quem é Alisson, experiência, projetos ou tecnologias.";

const REPLY_FALLBACK =
  "Posso ajudar com quem é Alisson, experiência profissional, projetos ou tecnologias. Reformule sua pergunta nesse contexto.";

export function normalizeForMatch(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function applyTypoAliases(normalized: string): string {
  return normalized
    .replace(/\bexperencia\b/g, "experiencia")
    .replace(/\bexp profissional\b/g, "experiencia")
    .replace(/\bautomacao\b/g, "rpa")
    .replace(/\bfinancas\b/g, "finance")
    .replace(/\bfinanceiro\b/g, "finance");
}

const GREETING_RE = /^(oi|ola|hey|hi|hello|bom dia|boa tarde|boa noite)\b/;
const EXPERIENCE_RE =
  /exper\w*|exp\s*prof|trabalho|backend|back\s*end|frontend|front\s*end|rpa|escalab|performanc|otimiz|segur|api\b|automac/;
const PROJECTS_RE =
  /projeto|project|finance|financ|mei|nota\s*fiscal|notificac|mensag|chatbot|agente|extrato|llm/;
const TECH_RE =
  /tecnolog|stack|react|next|laravel|vue|nestjs|nest\b|flask|typescript|python|postgres|html|css/;
const ALISSON_RE =
  /alisson|quem\s+e|quem\s+eh|sobre\s+voce|sobre\s+voc|desenvolvedor\s+full/;

export function detectIntent(message: string): ChatIntent {
  const normalized = applyTypoAliases(normalizeForMatch(message));

  if (!normalized) return "unknown";
  if (GREETING_RE.test(normalized)) return "greeting";
  if (ALISSON_RE.test(normalized)) return "alisson";
  if (EXPERIENCE_RE.test(normalized)) return "experience";
  if (PROJECTS_RE.test(normalized)) return "projects";
  if (TECH_RE.test(normalized)) return "tech";

  return "unknown";
}

export function getIntentHint(intent: ChatIntent): string | null {
  const hints: Record<ChatIntent, string | null> = {
    greeting: null,
    alisson: "Resposta curta e profissional sobre quem é Alisson (2 frases).",
    experience: "Resposta curta sobre experiência (2 frases).",
    projects: "Resposta curta sobre projetos (2 frases).",
    tech: "Resposta curta sobre tecnologias (1 frase).",
    unknown: null,
  };
  return hints[intent];
}

export function buildRuleBasedReply(message: string): string {
  if (isPolicyViolation(message)) {
    return CHAT_POLICY_REPLY;
  }

  const intent = detectIntent(message);

  switch (intent) {
    case "greeting":
      return REPLY_HELLO;
    case "alisson":
      return REPLY_ALISSON;
    case "experience":
      return REPLY_EXPERIENCE;
    case "projects":
      return REPLY_PROJECTS;
    case "tech":
      return REPLY_TECH;
    default:
      return REPLY_FALLBACK;
  }
}

export { CHATBOT_SYSTEM_PROMPT };
