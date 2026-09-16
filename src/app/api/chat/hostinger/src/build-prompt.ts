import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const KNOWLEDGE_DIR = join(dirname(fileURLToPath(import.meta.url)), "../../knowledge/portfolio");

type SectionId = "profile" | "contact" | "stack" | "experience" | "projects" | "services" | "examples";

const SECTION_KEYWORDS: Record<SectionId, string[]> = {
  profile: ["quem", "sobre", "about", "senioridade", "senior", "experiencia geral", "perfil", "alisson"],
  contact: ["contato", "contact", "email", "whatsapp", "linkedin", "github", "falar", "reach"],
  stack: [
    "stack",
    "stacks",
    "tecnologia",
    "tecnologias",
    "ferramenta",
    "linguagem",
    "backend",
    "frontend",
    "banco",
    "mysql",
    "postgres",
    "laravel",
    "django",
    "flask",
    "vue",
    "react",
    "next",
    "docker",
    "aws",
    "git",
    "ci/cd",
  ],
  experience: [
    "experiencia",
    "experience",
    "trabalho",
    "emprego",
    "cargo",
    "rauzee",
    "whaticket",
    "freelancer",
    "freelance",
    "carreira",
  ],
  projects: [
    "projeto",
    "projects",
    "finance ai",
    "ponto web",
    "draxy",
    "chatbot",
    "rpa",
    "erp",
    "camping",
    "trilha",
  ],
  services: [
    "servico",
    "services",
    "orcamento",
    "budget",
    "preco",
    "price",
    "custa",
    "custo",
    "valor",
    "quanto",
    "contratar",
    "hire",
    "freela",
    "consultoria",
  ],
  examples: [],
};

let rulesCache: string | null = null;
let sectionsCache: Map<SectionId, string> | null = null;

function loadRules(): string {
  if (rulesCache) return rulesCache;
  rulesCache = readFileSync(join(KNOWLEDGE_DIR, "rules.md"), "utf8");
  return rulesCache;
}

function parseSections(markdown: string): Map<SectionId, string> {
  const sections = new Map<SectionId, string>();
  const lines = markdown.split("\n");
  let current: SectionId | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current && buffer.length) sections.set(current, buffer.join("\n").trim());
    buffer = [];
  };

  for (const line of lines) {
    const match = /^## ([a-z]+)\s*$/.exec(line.trim());
    if (match) {
      flush();
      current = match[1] as SectionId;
      continue;
    }
    if (current) buffer.push(line);
  }
  flush();
  return sections;
}

function loadSections(): Map<SectionId, string> {
  if (sectionsCache) return sectionsCache;
  const raw = readFileSync(join(KNOWLEDGE_DIR, "SKILL.md"), "utf8");
  sectionsCache = parseSections(raw);
  return sectionsCache;
}

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "");
}

/** Pick 1–3 topic sections relevant to the user message. */
export function retrieveSections(userMessage: string): SectionId[] {
  const normalized = normalize(userMessage);
  const scores = new Map<SectionId, number>();

  for (const [section, keywords] of Object.entries(SECTION_KEYWORDS) as [SectionId, string[]][]) {
    if (section === "examples") continue;
    for (const keyword of keywords) {
      if (normalized.includes(normalize(keyword))) {
        scores.set(section, (scores.get(section) ?? 0) + 1);
      }
    }
  }

  const ranked = [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id]) => id);

  const picked = new Set<SectionId>(["profile", "contact"]);

  for (const id of ranked) {
    if (picked.size >= 5) break;
    picked.add(id);
  }

  if (ranked.length === 0) {
    picked.add("stack");
  }

  if (picked.has("services") || /orcamento|preco|budget|price|custa|custo|valor|quanto/.test(normalized)) {
    picked.add("services");
  }

  const order: SectionId[] = ["profile", "stack", "experience", "projects", "services", "contact", "examples"];
  return order.filter((id) => picked.has(id));
}

export function buildSystemPrompt(userMessage: string): string {
  const rules = loadRules();
  const sections = loadSections();
  const ids = retrieveSections(userMessage);

  const parts = [
    rules,
    "",
    "# Portfolio knowledge (use ONLY these facts)",
    "",
  ];

  for (const id of ids) {
    const body = sections.get(id);
    if (body) parts.push(`## ${id}\n\n${body}`, "");
  }

  return parts.join("\n").trim();
}

/** @deprecated Use buildSystemPrompt(userMessage) */
export function buildDefaultSystemPrompt(): string {
  return buildSystemPrompt("");
}
