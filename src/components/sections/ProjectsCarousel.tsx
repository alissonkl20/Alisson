"use client";

import { stacks } from "@/lib/data";

/** Gradientes distintos para cada sigla do projeto */
const ICON_GRADIENTS: Record<string, string> = {
  FI: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
  CH: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
  RP: "linear-gradient(135deg, #0891b2 0%, #0e7490 100%)",
};

/** Duplica os itens para o loop infinito sem salto visual */
const CAROUSEL_ITEMS = [...stacks, ...stacks];

function ProjectCard({
  shortName,
  name,
  description,
}: {
  shortName: string;
  name: string;
  description?: string;
}) {
  return (
    <article className="projects-carousel-card">
      <div
        className="projects-carousel-icon"
        style={{ background: ICON_GRADIENTS[shortName] ?? ICON_GRADIENTS.FI }}
        aria-hidden="true"
      >
        {shortName}
      </div>
      <h3 className="projects-carousel-title">{name}</h3>
      {description && <p className="projects-carousel-desc">{description}</p>}
    </article>
  );
}

export function ProjectsCarousel() {
  return (
    <div className="projects-carousel-section">
      {/*
        Viewport: 90% da largura, centralizado, overflow hidden.
        Container queries definem quantos cards ficam visíveis por breakpoint.
      */}
      <div className="projects-carousel-viewport" aria-label="Projects carousel">
        <div className="projects-carousel-track">
          {CAROUSEL_ITEMS.map((project, index) => (
            <ProjectCard
              key={`${project.shortName}-${index}`}
              shortName={project.shortName}
              name={project.name}
              description={project.description}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
