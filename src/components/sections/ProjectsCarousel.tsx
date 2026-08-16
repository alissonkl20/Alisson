"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { stacks } from "@/lib/data";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  finance: "AI · Finance",
  chatbot: "AI · Chatbot",
  automation: "Automation",
};

function ProjectCard({
  shortName,
  name,
  description,
  category,
  color,
  featured,
}: {
  shortName: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  featured?: boolean;
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

      <div className="relative z-10 flex h-full flex-col">
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

          {featured && (
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
  const viewportRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ startX: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const onMove = (event: PointerEvent) => {
      const viewport = viewportRef.current;
      if (!viewport) return;

      event.preventDefault();
      const delta = event.clientX - dragState.current.startX;
      viewport.scrollLeft = dragState.current.scrollLeft - delta;
    };

    const endDrag = () => {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.style.scrollBehavior = "smooth";
      }
      setIsDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", endDrag);
      window.removeEventListener("pointercancel", endDrag);
    };
  }, [isDragging]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !viewportRef.current) return;

    dragState.current = {
      startX: event.clientX,
      scrollLeft: viewportRef.current.scrollLeft,
    };

    viewportRef.current.style.scrollBehavior = "auto";
    setIsDragging(true);
  };

  return (
    <div className="projects-carousel-section">
      <div className="projects-carousel-header mb-6 flex flex-wrap items-center justify-between gap-3 sm:mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/30">
          Selected work
        </p>
        <p className="projects-carousel-hint-drag items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
          <span className="projects-carousel-hint-dot" aria-hidden="true" />
          Drag to explore
        </p>
        <p className="projects-carousel-hint-swipe items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/25">
          <span className="projects-carousel-hint-dot" aria-hidden="true" />
          Swipe to explore
        </p>
      </div>

      <div
        ref={viewportRef}
        className={cn(
          "projects-carousel-viewport",
          isDragging && "is-dragging",
        )}
        aria-label="Projects carousel"
        tabIndex={0}
        data-lenis-prevent
        onPointerDown={handlePointerDown}
      >
        <div className="projects-carousel-track">
          {stacks.map((project, index) => (
            <ProjectCard
              key={project.shortName}
              shortName={project.shortName}
              name={project.name}
              description={project.description}
              category={project.category}
              color={project.color}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
