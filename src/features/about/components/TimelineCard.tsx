"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { TimelineItem } from "../types/timeline.types";

const EASE = [0.25, 0.46, 0.45, 0.94] as const;

interface TimelineCardProps {
  item: TimelineItem;
  index: number;
  side: "left" | "right";
  isFocused: boolean;
  accentColor: string;
  lineGlowColor: string;
  cardBackground: string;
  animationDuration: number;
  reducedMotion: boolean;
}

export function TimelineCard({
  item,
  index,
  side,
  isFocused,
  accentColor,
  lineGlowColor,
  cardBackground,
  animationDuration,
  reducedMotion,
}: TimelineCardProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, {
    once: true,
    amount: 0.35,
    margin: "-8% 0px -8% 0px",
  });
  const visible = reducedMotion || inView;

  return (
    <motion.article
      ref={ref}
      className={`premium-timeline__card premium-timeline__card--${side} ${
        isFocused ? "premium-timeline__card--focused" : ""
      }`}
      style={
        {
          "--pt-accent": accentColor,
          "--pt-glow": lineGlowColor,
          "--pt-card-bg": cardBackground,
        } as React.CSSProperties
      }
      initial={
        reducedMotion ? false : { opacity: 0, y: 48, scale: 0.97 }
      }
      animate={
        visible
          ? { opacity: 1, y: 0, scale: 1 }
          : { opacity: 0, y: 48, scale: 0.97 }
      }
      transition={{
        duration: animationDuration,
        delay: reducedMotion ? 0 : index * 0.05,
        ease: EASE,
      }}
      aria-labelledby={`timeline-card-title-${item.id}`}
    >
      <div className="premium-timeline__card-inner">
        <span className="premium-timeline__number" aria-hidden>
          {item.number}
        </span>

        <div className="premium-timeline__card-body">
          <h3
            id={`timeline-card-title-${item.id}`}
            className="premium-timeline__card-title"
          >
            {item.title}
          </h3>

          {item.subtitle && (
            <p className="premium-timeline__card-subtitle">{item.subtitle}</p>
          )}

          {typeof item.description === "string" && (
            <p className="premium-timeline__card-desc">{item.description}</p>
          )}

          {item.contentBlocks?.map((block) => (
            <div key={block.title} className="premium-timeline__content-block">
              <h4 className="premium-timeline__content-block-title">
                {block.title}
              </h4>
              {block.description && (
                <p className="premium-timeline__content-block-desc">
                  {block.description}
                </p>
              )}
            </div>
          ))}

          {item.stackCategories && (
            <div className="premium-timeline__stack">
              {item.stackCategories.map((cat) => (
                <div key={cat.area} className="premium-timeline__stack-group">
                  <h4 className="premium-timeline__stack-area">{cat.area}</h4>
                  <ul className="premium-timeline__stack-tags">
                    {cat.items.map((tag) => (
                      <li key={tag} className="premium-timeline__stack-tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {item.milestones && (
            <ol className="premium-timeline__milestones">
              {item.milestones.map((m) => {
                const content = (
                  <>
                    <span className="premium-timeline__milestone-year">
                      {m.year}
                    </span>
                    <span className="premium-timeline__milestone-text">
                      {m.text}
                    </span>
                    {m.experienceId != null && (
                      <span
                        className="premium-timeline__milestone-connector"
                        aria-hidden
                      />
                    )}
                  </>
                );

                if (m.experienceId != null) {
                  return (
                    <li key={m.year}>
                      <a
                        href={`#experience-${m.experienceId}`}
                        className="premium-timeline__milestone premium-timeline__milestone--linked"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById(`experience-${m.experienceId}`)
                            ?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                        }}
                      >
                        {content}
                      </a>
                    </li>
                  );
                }

                return (
                  <li key={m.year} className="premium-timeline__milestone">
                    {content}
                  </li>
                );
              })}
            </ol>
          )}

          {item.highlights && item.highlights.length > 0 && (
            <div className="premium-timeline__highlights">
              {item.highlightsTitle && (
                <p className="premium-timeline__highlights-title">
                  {item.highlightsTitle}
                </p>
              )}
              <ul className="premium-timeline__highlights-list">
                {item.highlights.map((h) => (
                  <li key={h.number} className="premium-timeline__highlight">
                    <span className="premium-timeline__highlight-num">
                      {h.number}
                    </span>
                    <span>{h.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {item.bridgeText && (
            <a
              href={item.bridgeHref ?? "#experience"}
              className="premium-timeline__bridge"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector(item.bridgeHref ?? "#experience")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="premium-timeline__bridge-line" aria-hidden />
              <span>{item.bridgeText}</span>
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
