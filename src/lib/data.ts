import {
  Code2,
  Database,
  Globe,
  Layers,
  Server,
  ShoppingCart,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

export const profile = {
  name: "Alisson de Almeida",
  title: "Full Stack Developer",
  experience: "3+ years of experience",
  description:
    "Full Stack Developer with over 3 years of experience in web application development, specializing in building robust and scalable backends, efficient APIs, and modern, responsive interfaces. Focused on architecture, performance, code quality, and delivering complete solutions.",
  bio: "I’m a Full Stack Developer with over 3 years of experience building web applications, with a focus on scalable backends, modern interfaces, performance, and security. Experienced in developing APIs, refactoring legacy systems, optimizing applications, and implementing RPA and workflow automation solutions. I’m passionate about solving complex problems and building reliable, maintainable, and high-performance software",
  email: "alisson@email.com",
  github: "https://github.com/alissonkl20",
  linkedin: "https://www.linkedin.com/in/alisson-almeida-de-oliveira-3406bb347",
  whatsapp: "https://wa.me/5546999420574",
  cvUrl: "/cv/index.html"
};

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Rauzee",
    role: "Full Stack Developer",
    period: "Mar 2026 — Present",
    description:
      "Working as a full stack developer on systems focused on productivity and operational efficiency. I contribute to the optimization of credit analysis workflows for banking correspondents, improving agility, control, and accuracy across approval processes using PHP (Laravel), Vue.js, and AWS.",
    technologies: ["Laravel", "Vue.js", "PHP", "AWS"],
  },
  {
    id: "2",
    company: "Autônomo",
    role: "Freelancer",
    period: "Jun 2025 — Sep 2025",
    description:
      "Contributed to the improvement of a WhatsApp-based SaaS platform by improving system stability, performance, and user experience. Worked on back-end fixes, front-end UI/UX refinements, and basic stress testing to identify bottlenecks and strengthen reliability.",
    technologies: ["Tailwind CSS", "React.js", "UI/UX", "Testing"],
  },
  {
    id: "3",
    company: "Freelance",
    role: "Web Developer",
    period: "May 2024 — Nov 2024",
    description:
      "Worked as a Full Stack Developer on the WhaticketSaaS project, delivering high-quality solutions and technological innovation. Built an end-to-end audio transcription module, implemented REST APIs with Node.js, Express and TypeScript, and developed a responsive React interface integrated with PostgreSQL.",
    technologies: ["TypeScript", "Node.js", "React", "PostgreSQL"],
  },
];

export interface StackItem {
  name: string;
  category: string; 
  color: string; 
  description?: string; 
}

export type StackCategory = 
  | "backend" | "frontend" | "database" | "tools"
  | "finanças" | "chatbot" | "automação";

export const stacks: StackItem[] = [
  {
    name: "Finance AI",
    category: "finance",
    color: "from-green-600/40 to-blue-600/40",
    description:
      "Personal financial manager that processes bank statements via local LLM (5B params) with RAG. Generates detailed reports on income, expenses, and spending categorization (leisure, bills, investments).",
  },
  {
    name: "Chatbot Self-Service",
    category: "chatbot",
    color: "from-purple-600/40 to-pink-600/40",
    description:
      "Chatbot with local LLM (3B params) and comprehensive RAG for humanized self-service, with custom training to answer queries empathetically.",
  },
  {
    name: "RPA Invoice Issuance for MEI",
    category: "automation",
    color: "from-orange-600/40 to-red-600/40",
    description:
      "Invoice issuance automation for MEI (Brazilian micro-entrepreneur) using Flask, requests, and HTML element mapping, ensuring 100% pre-programmed accuracy.",
  },
];

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  github: string;
  deploy: string;
  gradient: string;
  icon: LucideIcon;
}

export const projects: Project[] = 
  {
    id: "1",
    title: "Automação de E-mail e WhatsApp",
    description:
      "Automação de e-mail que captura mensagens, verifica palavras-chave e gera relatório, com disparo automático de mensagem WhatsApp.",
    technologies: ["Next.js", "Laravel", "PostgreSQL", "Stripe"],
    github: "https://github.com/alisson",
    deploy: "https://example.com/",
    gradient: "from-blue-600/40 to-purple-600/40",
    icon: ShoppingCart,
  },
  {
    id: "2",
    title: "Dashboard Analítico SaaS",
    description:
      "Dashboard analítico com gráficos em tempo real, autenticação e gestão de usuários multi-tenant.",
    technologies: ["React", "Node.js", "MySQL", "Docker"],
    github: "https://github.com/alisson",
    deploy: "https://example.com/",
    gradient: "from-cyan-600/40 to-blue-600/40",
    icon: Layers,
  },
  {
    id: "3",
    title: "Gateway de APIs",
    description:
      "Gateway de APIs com rate limiting, autenticação JWT e documentação Swagger automática.",
    technologies: ["Express", "TypeScript", "Redis", "Docker"],
    github: "https://github.com/alisson",
    deploy: "https://example.com/",
    gradient: "from-purple-600/40 to-pink-600/40",
    icon: Server,
  },
  {
    id: "4",
    title: "Aviso de Compromisso",
    description:
      "Projeto pessoal para amigo secreto com aviso de compromisso, design mobile-first e suporte para notificações.",
    technologies: ["Vue.js", "PWA", "TailwindCSS", "Firebase"],
    github: "https://github.com/alisson",
    deploy: "https://example.com/",
    gradient: "from-green-600/40 to-teal-600/40",
    icon: Smartphone,
  },
  {
    id: "5",
    title: "CMS Headless",
    description:
      "Sistema de gerenciamento de conteúdo headless com API GraphQL e editor visual.",
    technologies: ["Next.js", "GraphQL", "PostgreSQL", "Prisma"],
    github: "https://github.com/alisson",
    deploy: "https://example.com/",
    gradient: "from-orange-600/40 to-red-600/40",
    icon: Globe,
  },
  {
    id: "6",
    title: "DevTools Suite",
    description:
      "Suite de ferramentas para desenvolvedores com formatadores, validadores e geradores de código.",
    technologies: ["React", "TypeScript", "WebAssembly", "Vite"],
    github: "https://github.com/alisson",
    deploy: "https://example.com/",
    gradient: "from-indigo-600/40 to-violet-600/40",
    icon: Code2,
  },
];

export const techCategories = [
  {
    title: "Back-end",
    items: ["PHP", "Python", "Java", "Node.js"],
  },
  {
    title: "Front-end",
    items: [
      "React",
      "Next.js",
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "TailwindCSS",
    ],
  },
  {
    title: "Banco de Dados",
    items: ["MySQL", "PostgreSQL"],
    icon: Database,
  },
  {
    title: "Ferramentas",
    items: ["Git", "Docker", "REST APIs"],
  },
];
