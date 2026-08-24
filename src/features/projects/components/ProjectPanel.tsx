"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { TimelineProject } from "../types";

interface ProjectPanelProps {
  project: TimelineProject;
  side: "left" | "right";
  active: boolean;
  panelWidth: number;
  reducedMotion: boolean;
  parallaxY: number;
  animateFromSide?: boolean;
}

export function ProjectPanel({
  project,
  side,
  active,
  panelWidth,
  reducedMotion,
  parallaxY,
  animateFromSide = true,
}: ProjectPanelProps) {
  const horizontalOffset = animateFromSide
    ? side === "left"
      ? -48
      : 48
    : 0;

  return (
    <motion.article
      className={`timeline-panel timeline-panel--${side}${
        active ? " timeline-panel--active" : ""
      }`}
      style={{
        width: panelWidth,
        maxWidth: "min(92vw, 100%)",
        y: reducedMotion ? 0 : parallaxY,
      }}
      initial={false}
      animate={{
        opacity: active ? 1 : 0.22,
        x: active ? 0 : horizontalOffset,
        y: active ? 0 : 16,
        rotateX: active ? 0 : 4,
        scale: active ? 1 : 0.96,
        filter: active ? "blur(0px)" : "blur(1.5px)",
      }}
      transition={{
        duration: reducedMotion ? 0.15 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="timeline-panel__media">
        {project.video ? (
          <video
            src={project.video}
            muted
            loop
            playsInline
            preload="none"
            className="timeline-panel__video"
          />
        ) : project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 92vw, 420px"
            className="object-cover"
            loading="lazy"
          />
        ) : project.initials ? (
          <div className="timeline-panel__initials" aria-hidden>
            {project.initials}
          </div>
        ) : null}
      </div>

      <div className="timeline-panel__body">
        <div className="timeline-panel__meta">
          <span className="timeline-panel__category">{project.category}</span>
          {project.featured ? (
            <span className="timeline-panel__featured">Featured</span>
          ) : project.date ? (
            <span className="timeline-panel__date">{project.date}</span>
          ) : null}
        </div>
        <h3 className="timeline-panel__title">{project.title}</h3>
        <p className="timeline-panel__desc">{project.description}</p>
        {project.link && (
          <a href={project.link} className="timeline-panel__link">
            {project.linkLabel ?? "View project"} →
          </a>
        )}
      </div>
    </motion.article>
  );
}
