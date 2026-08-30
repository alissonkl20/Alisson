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
    "Hey — glad you're here.",
    `I'm ${firstName}'s portfolio assistant. He's a full-stack developer with more than three years of experience building products from start to finish — REST APIs, business UIs, and premium, immersive sites.`,
    "I can talk about how he works, recent roles, projects, the stack, and how to get in touch. What would you like to know?",
  ].join("\n\n");
}

function aboutResponse(): string {
  return [
    `${profile.name} is a ${profile.title.toLowerCase()} with more than three years of experience building products from start to finish.`,
    "He writes REST APIs that stay secure and scale, builds business UIs in React, Next.js, and Vue, and designs premium sites with a real point of view. SDD, TDD, and system design are how he gets from spec to production.",
    "Want to go deeper? Ask about recent work, a project, or the stack.",
  ].join("\n\n");
}

function projectsResponse(): string {
  const lines = timelineProjects.map((project) => {
    const featured = project.featured ? " (featured)" : "";
    return `• ${project.title}${featured} — ${project.category}\n  ${project.description}`;
  });

  return [
    `The site features ${timelineProjects.length} recent projects — AI, automation, and product work. He's delivered more than 15 projects and 25+ engagements, including longer corporate contracts and milestone-based work.`,
    lines.join("\n\n"),
    'Want details on a specific one? Ask by name, e.g. "Finance AI" or "Ponto Web".',
  ].join("\n\n");
}

function stackResponse(): string {
  const pillars = timelineData
    .map((item) => `• ${item.title}: ${item.description}`)
    .join("\n");

  return [
    `${firstName}'s work breaks down into four areas:`,
    pillars,
    "Day to day:",
    "• Backend: PHP, Laravel, Python, Flask — REST APIs",
    "• Frontend: React, Vue, Next.js — component-based UIs and premium sites",
    "• Method: SDD, TDD, system design, and analytics — he works as an analyst across the whole product",
    "• Infra: Git, CI/CD, cloud hosting, and AWS",
  ].join("\n\n");
}

function servicesResponse(): string {
  return [
    `${firstName} builds products from the first spec through to production.`,
    "Before he recommends a stack, he figures out how complex the project actually is. Simple systems stay lean. He only reaches for a heavier setup when the product needs it.",
    "On the frontend, he builds a real visual identity — business UIs and premium, immersive sites, not generic templates. Premium work sometimes needs extra help (custom imagery, a more polished finish), and that's scoped up front.",
    "Corporate work can be milestone-based or ongoing, depending on what you need.",
    "For budget or scope, ask about pricing or use the contact email.",
  ].join("\n\n");
}

function pricingResponse(): string {
  return [
    "There's no fixed price — it depends on how complex the project is and whether we need outside help.",
    "What tends to change the cost:",
    "• Premium sites: custom imagery, custom templates, and a more polished finish",
    "• Simple systems: lean flows, no heavy infra — you only pay for what you need",
    "• Integrations, automations (RPA), APIs, local or cloud AI — each layer changes the effort",
    `${firstName} sizes the work before he proposes a stack or architecture, so you don't pay for complexity you don't need.`,
    `For a quote that fits your project, email is the best place to start: ${profile.email}.`,
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
    "Here's a quick look at his recent roles:",
    roles,
    "What stays consistent: he works as both analyst and engineer on the same product — SDD, TDD, system design, and delivery from the API to the UI.",
  ].join("\n\n");
}

function contactResponse(): string {
  return [
    `Here's how to reach ${firstName}:`,
    `• Email: ${profile.email}`,
    `• LinkedIn: ${profile.social.linkedin}`,
    `• GitHub: ${profile.social.github}`,
    "You can also download his resume from the About section.",
  ].join("\n\n");
}

function cvResponse(): string {
  return [
    "You can download his resume from the About section.",
    `File: ${profile.cv}`,
    `If you're hiring, email is the fastest way to reach him: ${profile.email}.`,
  ].join("\n\n");
}

function thanksResponse(): string {
  return [
    "You're welcome — happy to help.",
    "If you want to keep going, I can go deeper on a project, the stack, or how he works.",
  ].join("\n\n");
}

function helpResponse(): string {
  return [
    "I answer from what's on this site. You can ask things like:",
    '• "Who are you?" — profile and how he works',
    '• "Projects" — an overview or a specific project',
    '• "Stack" — APIs, frontend, method, and infra',
    '• "Services" — how he scopes work before sending a proposal',
    '• "Price" or "budget" — how pricing works (no invented numbers)',
    '• "Experience" — recent roles',
    '• "Contact" — email and social links',
    "Small typos are fine — I'll still try to match what you meant.",
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
  "I don't have a specific answer for that on this site.\n\nTry asking about: profile, how he works, projects, stack, services, pricing/budget, recent work, or contact. You can also name a project — like Finance AI or Ponto Web.";

export function buildProjectResponse(project: (typeof timelineProjects)[number]): string {
  return [
    `${project.title} (${project.category})`,
    project.description,
    project.featured
      ? "This is one of the featured projects on the site."
      : "You can see more context in the Projects section.",
  ].join("\n\n");
}

export function resolveTrainingResponse(
  response: TrainingEntry["response"],
): string {
  return typeof response === "function" ? response() : response;
}
