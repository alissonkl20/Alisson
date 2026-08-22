export const profile = {
  name: "Alisson de Almeida de Oliveira",
  title: "Full-Stack Developer",
  bio: "Sou Alisson de Almeida de Oliveira, 23 anos, desenvolvedor full stack com mais de 3 anos de experiência na criação e evolução de sistemas web — de APIs e backends escaláveis a interfaces modernas e landing pages com design premium. Atuo em todo o ciclo de desenvolvimento e também trabalho como freelancer em projetos sob demanda.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  email: "almeidadeoliveiraalisson04@gmail.com",
  cv: "/cv/Alisson_Almeida_CV.pdf",
  social: {
    github: "https://github.com/alissonkl20",
    linkedin:
      "https://www.linkedin.com/in/alisson-almeida-de-oliveira-3406bb347",
    twitter: "https://twitter.com",
  },
};

/** Projetos para a timeline scroll-driven (modo demo usa demoData.ts) */
export const timelineProjects = [
  {
    id: 1,
    title: "Finance AI",
    category: "AI · Finance",
    featured: true,
    initials: "FI",
    description:
      "Personal financial manager that processes bank statements via local LLM (5B params) with RAG. Generates detailed reports on income, expenses, and spending categorization (leisure, bills, investments).",
    link: "#",
    linkLabel: "Case study",
  },
  {
    id: 2,
    title: "Chatbot Self-Service",
    category: "AI · Chatbot",
    initials: "CH",
    description:
      "Chatbot with local LLM (3B params) and comprehensive RAG for humanized self-service, with custom training to answer queries empathetically.",
    link: "#",
    linkLabel: "Case study",
  },
  {
    id: 3,
    title: "RPA Invoice Issuance for MEI",
    category: "Automation",
    initials: "RP",
    description:
      "Invoice issuance automation for MEI (Brazilian micro-entrepreneur) using Flask, requests, and HTML element mapping, ensuring 100% pre-programmed accuracy.",
    link: "#",
    linkLabel: "Case study",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
];
