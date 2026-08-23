import type { TimelineItem } from "../types/timeline.types";

/**
 * Narrativa unificada About → Experiência → Data Flow.
 * Cards 01–04: sequência zigzag (01 direita, 02 esquerda…) via `getCareerCardSide`.
 * Conectam à linha central em CareerNarrative + animação em useCareerPathScroll.
 */
export const timelineData: TimelineItem[] = [
  {
    id: "backend",
    number: "01",
    title: "Backend",
    description:
      "I build robust, scalable APIs focused on security and performance, using PHP with Laravel and Python with Flask on the backend.",
  },
  {
    id: "frontend",
    number: "02",
    title: "Frontend",
    description:
      "I build performant, optimized interfaces with beautiful, modern design, componentization, and best practices, using React, Next.js, Vue, Tailwind, and Bootstrap.",
  },
  {
    id: "database",
    number: "03",
    title: "Databases",
    description:
      "Experience with MySQL and PostgreSQL building high-performance, scalable solutions, contributing to the evolution of projects and technological solutions.",
  },
  {
    id: "devops",
    number: "04",
    title: "Git & DevOps",
    description:
      "Experience with code versioning, branch conflicts, CI/CD, deployment, and cloud computing.",
  },
];
