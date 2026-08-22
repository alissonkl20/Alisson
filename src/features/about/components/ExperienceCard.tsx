"use client";

import { motion } from "framer-motion";
import type { ExperienceItem } from "@/features/experience/types";

interface ExperienceCardProps {
  exp: ExperienceItem;
  side: "left" | "right";
  isFocused: boolean;
  reducedMotion: boolean;
  index: number;
}

export function ExperienceCard({
  exp,
  side,
  isFocused,
  reducedMotion,
  index,
}: ExperienceCardProps) {
  return (
    <motion.article
      className={`experience-card experience-card--${side} ${
        isFocused ? "experience-card--focused" : ""
      }`}
      initial={reducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35, margin: "-8% 0px -8% 0px" }}
      transition={{
        duration: reducedMotion ? 0.15 : 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: reducedMotion ? 0 : index * 0.05,
      }}
    >
      <div className="experience-card__header">
        <div>
          <h3 className="experience-card__role">{exp.role}</h3>
          <p className="experience-card__company">{exp.company}</p>
        </div>
        <span className="experience-card__period">{exp.period}</span>
      </div>

      <p className="experience-card__desc">{exp.description}</p>

      {exp.technologies && exp.technologies.length > 0 && (
        <ul className="experience-card__tags">
          {exp.technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}
