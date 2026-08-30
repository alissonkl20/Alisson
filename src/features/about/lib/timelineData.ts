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
      "I build REST APIs in PHP/Laravel and Python/Flask — secure, easy to follow, and built to scale. That's the contract the rest of the product relies on.",
  },
  {
    id: "frontend",
    number: "02",
    title: "Frontend",
    description:
      "Business UIs and premium, immersive sites — built as components in React, Next.js, and Vue, with Tailwind or Bootstrap when it fits. Fast, clear design. Not another generic template.",
  },
  {
    id: "database",
    number: "03",
    title: "Databases",
    description:
      "MySQL and PostgreSQL shaped around the domain: queries that stay quick as the data grows, and schemas you can evolve without rewriting the product.",
  },
  {
    id: "devops",
    number: "04",
    title: "Git & DevOps",
    description:
      "Git every day — branches, reviews, merge conflicts. CI/CD, cloud hosting, and AWS, so a release is just another pipeline — not a late-night fire drill.",
  },
];
