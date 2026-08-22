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
      "Experiência profissional usando PHP Laravel e Python com Flask, criando APIs robustas e escaláveis. Atuo na evolução de projetos e soluções tecnológicas de alta performance.",
  },
  {
    id: "frontend",
    number: "02",
    title: "Frontend",
    description:
      "Experiência profissional usando React e Next.js, criando interfaces de usuário modernas e responsivas, com soluções de alta performance e escalabilidade.",
  },
  {
    id: "database",
    number: "03",
    title: "Banco de Dados",
    description:
      "Experiência profissional com MySQL e PostgreSQL, criando soluções de alta performance e escalabilidade na evolução de projetos e soluções tecnológicas.",
  },
  {
    id: "devops",
    number: "04",
    title: "Git e DevOps",
    description:
      "Experiência profissional usando Git e DevOps, criando soluções de alta performance e escalabilidade e atuando na evolução de projetos e soluções tecnológicas.",
  },
];
