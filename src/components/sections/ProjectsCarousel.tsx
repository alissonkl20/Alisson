"use client";

import { Sparkles } from "lucide-react";
import { stacks } from "@/lib/data";

const CATEGORY_LABELS: Record<string, string> = {
  finance: "AI · Finance",
  chatbot: "AI · Chatbot",
  automation: "Automation",
};

/** Duplica os itens para o loop infinito sem salto visual */
const CAROUSEL_ITEMS = [...stacks, ...stacks];

function ProjectCard({
  shortName,
  name,
  description,
  category,
  color,
  index,
}: {
  shortName: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  index: number;
}) {
  const categoryLabel =
    CATEGORY_LABELS[category] ??
    category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <article className="projects-carousel-card group">
      <div
        className="projects-carousel-card-glow"
        style={{ background: `radial-gradient(circle at 30% 20%, ${color}22, transparent 65%)` }}
        aria-hidden="true"
      />

      <div
        className="projects-carousel-card-accent"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        aria-hidden="true"
      />

      <div className="projects-carousel-card-shimmer" aria-hidden="true" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="mb-5 flex items-start justify-between gap-3">
          <span
            className="projects-carousel-category"
            style={{
              color,
              borderColor: `${color}40`,
              backgroundColor: `${color}12`,
            }}
          >
            {categoryLabel}
          </span>

          {index % stacks.length === 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-neon-red/25 bg-neon-red/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neon-red">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
        </div>

        <div className="projects-carousel-icon-wrap mb-5">
          <div
            className="projects-carousel-icon-ring"
            style={{ boxShadow: `0 0 28px ${color}35` }}
            aria-hidden="true"
          />
          <div
            className="projects-carousel-icon"
            style={{
              background: `linear-gradient(145deg, ${color}, ${color}cc)`,
              boxShadow: `0 8px 28px ${color}40`,
            }}
          >
            {shortName}
          </div>
        </div>

        <h3 className="projects-carousel-title">{name}</h3>

        {description && (
          <p className="projects-carousel-desc">{description}</p>
        )}

        <div className="projects-carousel-footer mt-auto pt-5">
          <span
            className="projects-carousel-footer-dot"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
            aria-hidden="true"
          />
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
            Case study
          </span>
        </div>
      </div>
    </article>
  );
}

export function ProjectsCarousel() {
  return (
    <div className="projects-carousel-section">
      <div className="projects-carousel-header mb-6 flex items-center justify-between gap-4 px-1 sm:mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
          Infinite showcase
        </p>
        <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
          <span className="projects-carousel-hint-dot" aria-hidden="true" />
          Hover to pause
        </div>
      </div>

      <div className="projects-carousel-viewport" aria-label="Projects carousel">
        <div className="projects-carousel-track">
          {CAROUSEL_ITEMS.map((project, index) => (
            <ProjectCard
              key={`${project.shortName}-${index}`}
              shortName={project.shortName}
              name={project.name}
              description={project.description}
              category={project.category}
              color={project.color}
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
