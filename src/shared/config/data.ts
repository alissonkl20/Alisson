export const profile = {
  name: "Alisson de Almeida de Oliveira",
  title: "Full-Stack Developer",
  bio: "I'm Alisson de Almeida de Oliveira. I've spent the last three-plus years as a full-stack developer, building products all the way through — from the API to the interface. I write REST APIs that stay secure and scale, build business UIs in React, Next.js, and Vue, and design premium sites with a real point of view. I refactor so the code stays readable, and I lean on SDD, TDD, and system design to get from spec to production.",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  email: "almeidadeoliveiraalisson04@gmail.com",
  cv: "/cv/Alisson_Almeida_CV.pdf?v=20260831-2",
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
      "A personal finance manager that reads bank statements with a local 5B-parameter LLM and RAG, then breaks down income, expenses, and categories — leisure, bills, investments.",
    link: "#projects",
    linkLabel: "View in timeline",
  },
  {
    id: 2,
    title: "Chatbot Self-Service",
    category: "AI · Chatbot",
    initials: "CH",
    image:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&h=1866&fit=crop&q=90",
    description:
      "A self-service chatbot on a local 3B-parameter LLM with RAG, trained to sound human instead of reading from a script.",
    link: "#projects",
    linkLabel: "View in timeline",
  },
  {
    id: 3,
    title: "RPA Invoice Issuance for MEI",
    category: "Automation",
    initials: "RP",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1400&h=1866&fit=crop&q=90",
    description:
      "Automated MEI invoicing in Flask — HTTP requests and mapped HTML — so every invoice follows a fixed, pre-programmed path.",
    link: "#projects",
    linkLabel: "View in timeline",
  },
  {
    id: 4,
    title: "Ponto Web",
    category: "Automation",
    initials: "PW",
    image:
      "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=1400&h=1866&fit=crop&q=90",
    description:
      "A web-based time-tracking system for companies: clock-in and clock-out, overtime, time off, and absences, all in one workflow.",
    link: "#projects",
    linkLabel: "View in timeline",
  },
  {
    id: 5,
    title: "Mini ERP for a Restaurant",
    category: "Automation",
    initials: "MR",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400&h=1866&fit=crop&q=90",
    description:
      "A lightweight restaurant ERP — inventory, sales, customers, suppliers, and staff — built for a real kitchen, not an enterprise suite.",
    link: "#projects",
    linkLabel: "View in timeline",
  },
  {
    id: 6,
    title: "Draxy",
    category: "AI · Agent CLI",
    initials: "DX",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1400&h=1866&fit=crop&q=90",
    description:
      "An offline CLI agent for PHP/Laravel, powered by a local Ollama LLM through Python FastAPI. It uses RAG over a JSON knowledge base — Laravel docs, Stack Overflow dumps, params and structs — with auto-training and a SOLID layout. Python indexes the training files, then uses that context to debug PHP, scaffold MVC CRUDs, sketch the project structure, and run tasks end to end with TDD.",
    link: "#projects",
    linkLabel: "View in timeline",
  },
  {
    id: 7,
    title: "URL Shortener",
    category: "Web · Laravel",
    initials: "US",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1400&h=1866&fit=crop&q=90",
    description:
      "A Laravel URL shortener: short links, redirects, and click tracking.",
    link: "#projects",
    linkLabel: "View in timeline",
  },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
] as const;
