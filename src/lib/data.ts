import { Database } from "lucide-react";

export const profile = {
  name: "Alisson de Almeida",
  title: "Full Stack Developer",
  experience: "3+ years of experience",
  description:
    "Full Stack Developer with over 3 years of experience in web application development, specializing in building robust and scalable backends, efficient APIs, and modern, responsive interfaces. Focused on architecture, performance, code quality, and delivering complete solutions.",
  bio: "I’m a Full Stack Developer with over 3 years of experience building web applications, with a focus on scalable backends, modern interfaces, performance, and security. Experienced in developing APIs, refactoring legacy systems, optimizing applications, and implementing RPA and workflow automation solutions. I’m passionate about solving complex problems and building reliable, maintainable, and high-performance software",
  email: "almeidadeoliveiraalisson04@gmail.com",
  github: "https://github.com/alissonkl20",
  linkedin: "https://www.linkedin.com/in/alisson-almeida-de-oliveira-3406bb347",
  whatsapp: "https://wa.me/5546999420574",
  cvUrl: "/cv/index.html",
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
    period: "Mar 2026 — Jul 2026",
    description:
      "Worked as a full stack developer on systems focused on productivity and operational efficiency. Contributed to the optimization of credit analysis workflows for banking correspondents, improving agility, control, and accuracy across approval processes using Laravel, Flask, React, Vue.js, Next.js, and AWS.",
    technologies: ["Laravel", "Flask", "PHP", "Python", "AWS", "Next.js", "React", "Vue.js", "Git", "REST APIs"],
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
  | "backend"
  | "frontend"
  | "database"
  | "tools"
  | "finanças"
  | "chatbot"
  | "automação";

export const stacks: StackItem[] = [
  {
    name: "Finance AI",
    category: "finance",
    color: "#00e676",
    description:
      "Personal financial manager that processes bank statements via local LLM (5B params) with RAG. Generates detailed reports on income, expenses, and spending categorization (leisure, bills, investments).",
  },
  {
    name: "Chatbot Self-Service",
    category: "chatbot",
    color: "#b388ff",
    description:
      "Chatbot with local LLM (3B params) and comprehensive RAG for humanized self-service, with custom training to answer queries empathetically.",
  },
  {
    name: "RPA Invoice Issuance for MEI",
    category: "automation",
    color: "#ff5e00",
    description:
      "Invoice issuance automation for MEI (Brazilian micro-entrepreneur) using Flask, requests, and HTML element mapping, ensuring 100% pre-programmed accuracy.",
  },
];

export const techCategories = [
  {
    title: "Back-end",
    items: ["Laravel", "PHP", "Flask", "Python"],
  },
  {
    title: "Front-end",
    items: ["React", "Next.js", "Vue.js", "NestJS", "HTML", "CSS", "TypeScript"],
  },
  {
    title: "Banco de Dados",
    items: ["MySQL", "PostgreSQL"],
    icon: Database,
  },
  {
    title: "Ferramentas",
    items: ["Git", "REST APIs"],
  },
];
