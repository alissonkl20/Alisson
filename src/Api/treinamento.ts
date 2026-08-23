import { profile, timelineProjects } from "@/shared/config/data";
import { experienceData } from "@/features/about/lib/experienceData";
import { timelineData } from "@/features/about/lib/timelineData";

export type TrainingTopicId =
  | "greeting"
  | "about"
  | "projects"
  | "stack"
  | "services"
  | "pricing"
  | "contact"
  | "experience"
  | "cv"
  | "thanks"
  | "help";

export interface TrainingEntry {
  id: TrainingTopicId;
  triggers: string[];
  response: string | (() => string);
  /** Internal notes — not shown in chat */
  context?: string;
  priority?: number;
}

const firstName = profile.name.split(" ")[0];

function greetingResponse(): string {
  return [
    "Hi! Great to have you here.",
    `I'm ${firstName}'s portfolio assistant — a full-stack developer focused on complete web products, from API to interface.`,
    "I can talk about career, projects, stack, and contact. Where would you like to start?",
  ].join("\n\n");
}

function aboutResponse(): string {
  return [
    `${profile.name} is a ${profile.title.toLowerCase()} with over 3 years building and evolving web systems.`,
    "Works across the full development cycle: scalable, secure backends, modern interfaces, and digital experiences with a distinct identity.",
    "Want to go deeper? Ask about professional experience, projects, or technologies.",
  ].join("\n\n");
}

function projectsResponse(): string {
  const lines = timelineProjects.map((project) => {
    const featured = project.featured ? " (featured)" : "";
    return `• ${project.title}${featured} — ${project.category}\n  ${project.description}`;
  });

  return [
    `The site highlights ${timelineProjects.length} recent projects — a sample of the areas ${firstName} works in. In total, more than 15 projects delivered and 25+ services provided, plus corporate contracts by milestone or open-ended engagement.`,
    lines.join("\n\n"),
    'Want details on a specific one? Ask by name, e.g. "Finance AI" or "Ponto Web".',
  ].join("\n\n");
}

function stackResponse(): string {
  const pillars = timelineData
    .map((item) => `• ${item.title}: ${item.description}`)
    .join("\n");

  return [
    `${firstName} organizes the stack into four main pillars:`,
    pillars,
    "Core day-to-day technologies:",
    "• Backend: PHP, Laravel, Python, and Flask",
    "• Frontend: React, Vue, and Next.js",
    "• Infra: cloud hosting, CI/CD, and deployment (AWS and general cloud environments)",
  ].join("\n\n");
}

function servicesResponse(): string {
  return [
    `${firstName} provides full-stack development services — from demand analysis through delivery.`,
    "Before proposing any solution, the real project complexity is assessed. Simple systems don't need heavy architectures: over-engineering is avoided, and robust setups are recommended only when truly necessary.",
    "On the front end, helps build visual identity in projects — interfaces with personality, not generic templates. Premium sites may require external resources (image creation, refined custom templates), and that's factored in from the start.",
    "Corporate contracts can be milestone-based or open-ended, depending on client needs.",
    "For budget or scope, ask about pricing or use the contact email.",
  ].join("\n\n");
}

function pricingResponse(): string {
  return [
    "Service pricing isn't fixed — it depends on project complexity and the need for external resources.",
    "Examples that affect cost:",
    "• Premium sites: image creation, custom templates, and more polished visual finish",
    "• Simple systems: lean flows, no heavy infra — cost reflects only what's needed",
    "• Integrations, automations (RPA), APIs, local or cloud AI — each layer changes the effort",
    `${firstName} analyzes the demand before proposing stack and architecture, so you don't pay for complexity the project doesn't require.`,
    `For a personalized estimate, the best channel is ${profile.email}.`,
  ].join("\n\n");
}

function experienceResponse(): string {
  const roles = experienceData
    .map(
      (item) =>
        `• ${item.role} — ${item.company}\n  ${item.period}\n  ${item.description}`,
    )
    .join("\n\n");

  return [
    "Professional background at a glance:",
    roles,
    "The experience combines product thinking, performance, and end-to-end delivery in real-world environments.",
  ].join("\n\n");
}

function contactResponse(): string {
  return [
    `To reach ${firstName}, these are the main channels:`,
    `• Email: ${profile.email}`,
    `• LinkedIn: ${profile.social.linkedin}`,
    `• GitHub: ${profile.social.github}`,
    "The resume is also available in the About section if you'd like to download it.",
  ].join("\n\n");
}

function cvResponse(): string {
  return [
    "The resume is available for download in the About section.",
    `File: ${profile.cv}`,
    `If you're evaluating an opportunity, ${profile.email} is the best channel for direct contact.`,
  ].join("\n\n");
}

function thanksResponse(): string {
  return [
    "You're welcome! Happy to help.",
    "If you'd like to keep exploring, I can go into more detail on projects, stack, or professional experience.",
  ].join("\n\n");
}

function helpResponse(): string {
  return [
    "I can answer based on this portfolio's content. Some examples:",
    '• "Who are you?" — profile and professional focus',
    '• "Projects" — overview or a specific project',
    '• "Stack" — technologies and areas of expertise',
    '• "Services" — what is offered and how demand is analyzed',
    '• "Price" or "budget" — how pricing works',
    '• "Experience" — professional history',
    '• "Contact" — email and social links',
    "Even with small typos, I'll try to understand what you asked.",
  ].join("\n\n");
}

/** General training — edit triggers, context, and response here */
export const CHATBOT_TRAINING: TrainingEntry[] = [
  {
    id: "greeting",
    triggers: [
      "oi",
      "ola",
      "olá",
      "hello",
      "hi",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "bom dia",
      "boa tarde",
      "boa noite",
      "e ai",
      "e aí",
      "howdy",
    ],
    response: greetingResponse,
    context: "Warm greeting + invite to explore the portfolio.",
    priority: 1,
  },
  {
    id: "help",
    triggers: [
      "ajuda",
      "help",
      "o que voce sabe",
      "o que você sabe",
      "what do you know",
      "o que pode fazer",
      "what can you do",
      "comandos",
      "commands",
      "menu",
    ],
    response: helpResponse,
    context: "List topics the assistant covers.",
    priority: 2,
  },
  {
    id: "about",
    triggers: [
      "quem e voce",
      "quem é você",
      "who are you",
      "sobre voce",
      "sobre você",
      "about you",
      "quem e o alisson",
      "quem é o alisson",
      "who is alisson",
      "perfil",
      "profile",
      "about",
      "bio",
    ],
    response: aboutResponse,
    context: "Professional summary based on profile.",
    priority: 3,
  },
  {
    id: "projects",
    triggers: [
      "projetos",
      "projects",
      "project",
      "portfolio",
      "portfólio",
      "trabalhos",
      "work",
      "cases",
      "o que voce fez",
      "o que você fez",
      "what did you do",
      "what have you built",
    ],
    response: projectsResponse,
    context: "List projects with a short description each.",
    priority: 3,
  },
  {
    id: "stack",
    triggers: [
      "stack",
      "tecnologias",
      "technologies",
      "tech",
      "ferramentas",
      "tools",
      "linguagens",
      "languages",
      "skills",
      "habilidades",
      "laravel",
      "flask",
      "react",
      "vue",
      "next",
      "nextjs",
      "php",
      "python",
      "nuvem",
      "cloud",
      "aws",
      "hospedagem",
      "hosting",
    ],
    response: stackResponse,
    context: "Pillars + PHP/Laravel, Python/Flask, React/Vue/Next, and cloud.",
    priority: 3,
  },
  {
    id: "services",
    triggers: [
      "servicos",
      "serviços",
      "services",
      "servico",
      "serviço",
      "prestacao",
      "prestação",
      "o que oferece",
      "what do you offer",
      "o que voce faz",
      "o que você faz",
      "what do you do",
      "contrato",
      "contratos",
      "contract",
      "contracts",
      "empresarial",
      "corporate",
      "identidade visual",
      "visual identity",
      "design",
      "landing page",
      "site premium",
      "premium site",
      "analise de demanda",
      "análise de demanda",
      "demand analysis",
      "over engineering",
      "sistema simples",
      "simple system",
    ],
    response: servicesResponse,
    context: "Services, demand analysis, visual identity, and contract types.",
    priority: 3,
  },
  {
    id: "pricing",
    triggers: [
      "preco",
      "preço",
      "price",
      "pricing",
      "precos",
      "preços",
      "prices",
      "orcamento",
      "orçamento",
      "budget",
      "valor",
      "custo",
      "cost",
      "quanto custa",
      "how much",
      "how much does it cost",
      "quanto e",
      "quanto é",
      "cobranca",
      "cobrança",
      "billing",
      "complexidade",
      "complexity",
      "estimativa",
      "estimate",
      "cotacao",
      "cotação",
      "quote",
      "avaliacao",
      "avaliação",
      "evaluation",
    ],
    response: pricingResponse,
    context: "Pricing by complexity and external resources (premium sites, etc.).",
    priority: 4,
  },
  {
    id: "contact",
    triggers: [
      "contato",
      "contact",
      "email",
      "e-mail",
      "linkedin",
      "github",
      "falar com voce",
      "falar com você",
      "talk to you",
      "reach out",
      "contratar",
      "hire",
      "oportunidade",
      "opportunity",
    ],
    response: contactResponse,
    context: "Contact channels and CTA for recruiters.",
    priority: 3,
  },
  {
    id: "experience",
    triggers: [
      "experiencia",
      "experiência",
      "experience",
      "carreira",
      "career",
      "trabalho",
      "work history",
      "empresa",
      "company",
      "historico",
      "histórico",
      "history",
      "onde trabalhou",
      "where did you work",
    ],
    response: experienceResponse,
    context: "Professional timeline with companies and periods.",
    priority: 3,
  },
  {
    id: "cv",
    triggers: ["cv", "curriculo", "currículo", "resume"],
    response: cvResponse,
    context: "Resume download + contact.",
    priority: 4,
  },
  {
    id: "thanks",
    triggers: [
      "obrigado",
      "obrigada",
      "valeu",
      "thanks",
      "thank you",
      "grato",
      "appreciate it",
    ],
    response: thanksResponse,
    context: "Positive closing with a suggested next step.",
    priority: 1,
  },
];

export const CHATBOT_FALLBACK =
  "I couldn't find a specific answer for that in the portfolio.\n\nTry asking about: profile, projects, stack, services, pricing/budget, experience, or contact. You can also name a project — like Finance AI or Ponto Web.";

export function buildProjectResponse(project: (typeof timelineProjects)[number]): string {
  return [
    `${project.title} (${project.category})`,
    project.description,
    project.featured
      ? "This is one of the featured projects in the portfolio."
      : "You can explore more context in the Projects section of the site.",
  ].join("\n\n");
}

export function resolveTrainingResponse(
  response: TrainingEntry["response"],
): string {
  return typeof response === "function" ? response() : response;
}
