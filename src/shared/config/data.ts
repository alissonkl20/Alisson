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

/**
 * Scroll-driven timeline projects.
 * `image` alimenta as capas da timeline; troque por `/projects/<slug>.jpg` quando
 * as screenshots reais estiverem em `public/projects/`.
 */
export const timelineProjects = [
  {
    id: 1,
    title: "Finance AI",
    category: "AI · Finance",
    featured: true,
    initials: "FI",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&h=1866&fit=crop&q=90",
    description:
      "Personal financial manager that processes bank statements via local LLM (5B params) with RAG. Generates detailed reports on income, expenses, and spending categorization (leisure, bills, investments).",
    link: "#projects",
    linkLabel: "See in timeline",
  },
  {
    id: 2,
    title: "Chatbot Self-Service",
    category: "AI · Chatbot",
    initials: "CH",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=1866&fit=crop&q=90",
    description:
      "Chatbot with local LLM (3B params) and comprehensive RAG for humanized self-service, with custom training to answer queries empathetically.",
    link: "#projects",
    linkLabel: "See in timeline",
  },
  {
    id: 3,
    title: "RPA Invoice Issuance for MEI",
    category: "Automation",
    initials: "RP",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&h=1866&fit=crop&q=90",
    description:
      "Invoice issuance automation for MEI (Brazilian micro-entrepreneur) using Flask, requests, and HTML element mapping, ensuring 100% pre-programmed accuracy.",
    link: "#projects",
    linkLabel: "See in timeline",
  },
  {
    id: 4,
    title: "Ponto Web",
    category: "Automation",
    initials: "PW",
    image:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1400&h=1866&fit=crop&q=90",
    description:
      "Web time-tracking system for companies with clock-in/out control, overtime, days off, and absences.",
    link: "#projects",
    linkLabel: "See in timeline",
  },
  {
    id: 5,
    title: "Mini ERP for a Restaurant",
    category: "Automation",
    initials: "MR",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=1866&fit=crop&q=90",
    description:
      "Lightweight ERP for a restaurant with inventory, sales, customers, suppliers, staff, and more.",
    link: "#projects",
    linkLabel: "See in timeline",
  },
  {
    id: 6,
    title: "Draxy",
    category: "AI · Agent CLI",
    initials: "DX",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&h=1866&fit=crop&q=90",
    description:
      "Offline CLI agent specialized in PHP/Laravel, powered by a local Ollama LLM through Python FastAPI. RAG over a JSON knowledge base (Laravel docs, Stack Overflow dumps, params and structs) with auto-training and SOLID architecture — Python indexes training files and queries that context to debug PHP, scaffold MVC CRUDs, define project structure, and run end-to-end tasks with TDD.",
    link: "#projects",
    linkLabel: "See in timeline",
  },
  {
    id: 7,
    title: "URL Shortener",
    category: "Web · Laravel",
    initials: "US",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=1866&fit=crop&q=90",
    description:
      "URL shortener built with PHP and Laravel — generates short links, redirects to the original destination, and tracks clicks.",
    link: "#projects",
    linkLabel: "See in timeline",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Prompt", href: "#prompt" },
] as const;
