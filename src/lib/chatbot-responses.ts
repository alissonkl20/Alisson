import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot-skills";
import { CHAT_POLICY_REPLY } from "@/lib/chatbot-limits";
import { isPolicyViolation } from "@/lib/chatbot-limits";

export const CHAT_GREETING =
  "Hi! I'm Alisson's assistant. You can ask up to 5 questions about experience, projects, or technologies.";

export const CHAT_SUGGESTIONS = [
  "Who is Alisson?",
  "Professional experience",
  "Projects",
  "Technologies",
] as const;

export type ChatIntent =
  | "greeting"
  | "alisson"
  | "experience"
  | "projects"
  | "tech"
  | "unknown";

const REPLY_ALISSON =
  "Alisson de Almeida is a Full Stack Developer with 3+ years of professional experience and 5 years in technology. He works with modern and legacy stacks, focusing on complete solutions, performance, and code quality.";

const REPLY_EXPERIENCE =
  "Experience in robust, scalable backends, performance optimization, modern responsive interfaces, and automation with web RPA and no-code tools. Worked at Rauzee, freelancing, and WhaticketSaaS.";

const REPLY_PROJECTS =
  "Highlights: MEI invoice RPAs, automated queries and notifications; Finance AI with a local LLM for bank statement analysis; and agents to streamline workflows.";

const REPLY_TECH =
  "Core stack: backend with Laravel and Flask; frontend with React, Next.js, Vue.js, NestJS, HTML, and CSS; PostgreSQL and REST APIs.";

const REPLY_HELLO =
  "Hi! Ask me about who Alisson is, his experience, projects, or technologies.";

const REPLY_FALLBACK =
  "I can help with who Alisson is, professional experience, projects, or technologies. Please rephrase your question in that context.";

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
    .replace(/\bexperencia\b/g, "experience")
    .replace(/\bexp profissional\b/g, "experience")
    .replace(/\bautomacao\b/g, "rpa")
    .replace(/\bfinancas\b/g, "finance")
    .replace(/\bfinanceiro\b/g, "finance");
}

const GREETING_RE =
  /^(oi|ola|hey|hi|hello|bom dia|boa tarde|boa noite|good morning|good afternoon|good evening)\b/;
const EXPERIENCE_RE =
  /exper\w*|exp\s*prof|trabalho|work|backend|back\s*end|frontend|front\s*end|rpa|escalab|performanc|otimiz|segur|api\b|automac/;
const PROJECTS_RE =
  /projeto|project|finance|financ|mei|nota\s*fiscal|notificac|mensag|chatbot|agente|extrato|llm/;
const TECH_RE =
  /tecnolog|stack|react|next|laravel|vue|nestjs|nest\b|flask|typescript|python|postgres|html|css/;
const ALISSON_RE =
  /alisson|quem\s+e|quem\s+eh|who\s+is|sobre\s+voce|sobre\s+voc|desenvolvedor\s+full/;

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
    alisson: "Short professional answer about who Alisson is (2 sentences).",
    experience: "Short answer about experience (2 sentences).",
    projects: "Short answer about projects (2 sentences).",
    tech: "Short answer about technologies (1 sentence).",
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
