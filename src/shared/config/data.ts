export const profile = {
  name: "Alisson de Almeida de Oliveira",
  title: "Full-Stack Developer",
  bio: "Hi, I'm Alisson de Almeida de Oliveira. I'm 23 and have been working as a full-stack developer for over 3 years building and evolving web systems — from scalable APIs and backends to modern interfaces and premium-design landing pages. I work across the full development cycle with robust, secure, and scalable backends; beautiful, modern, responsive, and optimized interfaces; and premium landing pages with no generic identity — interactive experiences that convey your brand's emotion.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  email: "almeidadeoliveiraalisson04@gmail.com",
  cv: "/cv/Alisson_Almeida_CV.pdf",
  social: {
    github: "https://github.com/alissonkl20",
    linkedin:
      "https://www.linkedin.com/in/alissonalmeida9/",
    twitter: "https://twitter.com",
  },
};

/** Scroll-driven timeline projects (demo mode uses demoData.ts) */
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
  {
    id: 4,
    title: "Ponto Web",
    category: "Automation",
    initials: "PW",
    description:
      "Web time-tracking system for companies with clock-in/out control, overtime, days off, and absences.",
    link: "#",
    linkLabel: "Case study",
  },
  {
    id: 5,
    title: "Mini ERP for a Restaurant",
    category: "Automation",
    initials: "MR",
    description:
      "Lightweight ERP for a restaurant with inventory, sales, customers, suppliers, staff, and more.",
    link: "#",
    linkLabel: "Case study",
  },
  {
    id: 6,
    title: "Draxy",
    category: "AI · Agent CLI",
    initials: "DX",
    description:
      "Offline CLI agent specialized in PHP/Laravel, powered by a local Ollama LLM through Python FastAPI. RAG over a JSON knowledge base (Laravel docs, Stack Overflow dumps, params and structs) with auto-training and SOLID architecture — Python indexes training files and queries that context to debug PHP, scaffold MVC CRUDs, define project structure, and run end-to-end tasks with TDD.",
    link: "#",
    linkLabel: "Case study",
  },
  {
    id: 7,
    title: "URL Shortener",
    category: "Web · Laravel",
    initials: "US",
    description:
      "URL shortener built with PHP and Laravel — generates short links, redirects to the original destination, and tracks clicks.",
    link: "#",
    linkLabel: "Case study",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
] as const;
