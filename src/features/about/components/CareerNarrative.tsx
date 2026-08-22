"use client";

import { useRef } from "react";
import { TimelineCard } from "./TimelineCard";
import { TimelinePath } from "./TimelinePath";
import { timelineData } from "../lib/timelineData";
import { DEFAULT_PREMIUM_TIMELINE_PROPS } from "../types/timeline.types";
import { ExperienceCard } from "./ExperienceCard";
import { experienceData } from "../lib/experienceData";
import { CareerTimelineNode } from "./CareerTimelineNode";
import { useCareerPathScroll } from "../hooks/useCareerPathScroll";
import {
  CAREER_ROW_COUNT,
  experienceAnchorId,
  getCareerCardSide,
} from "../lib/careerFlow";
import "./PremiumTimeline.css";
import "@/features/experience/components/ExperienceSection.css";
import "./CareerNarrative.css";

const {
  lineColor,
  lineGlowColor,
  accentColor,
  cardBackground,
  animationDuration,
  heading,
} = DEFAULT_PREMIUM_TIMELINE_PROPS;

export function CareerNarrative() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { pathProgress, focusPathProgress, pathD, isMobile, reducedMotion } =
    useCareerPathScroll(trackRef, CAREER_ROW_COUNT);

  return (
    <div
      className="career-narrative"
      style={
        {
          "--pt-line": lineColor,
          "--pt-glow": lineGlowColor,
          "--pt-accent": accentColor,
          "--pt-card-bg": cardBackground,
          "--career-line": "var(--timeline-line)",
          "--career-glow": "var(--timeline-glow)",
          "--career-accent": "var(--timeline-accent)",
        } as React.CSSProperties
      }
    >
      <header className="career-narrative__header section-header">
        <h2 className="premium-timeline__heading section-title">{heading}</h2>
      </header>

      <div className="career-narrative__track">
        <div ref={trackRef} className="career-narrative__rows">
          <div className="career-narrative__line-layer" aria-hidden>
            <TimelinePath
              pathD={pathD}
              progress={pathProgress}
              lineColor={lineColor}
              lineGlowColor={lineGlowColor}
              accentColor={accentColor}
              reducedMotion={reducedMotion}
              syncScroll
            />
          </div>

          {timelineData.map((item, index) => {
            const side = getCareerCardSide(index, isMobile);

            return (
              <div
                key={item.id}
                className={`career-narrative__row career-narrative__row--${side}`}
              >
                <div className="career-narrative__slot career-narrative__slot--left">
                  {side === "left" && (
                    <TimelineCard
                      item={item}
                      index={index}
                      side="left"
                      isFocused={false}
                      accentColor={accentColor}
                      lineGlowColor={lineGlowColor}
                      cardBackground={cardBackground}
                      animationDuration={animationDuration}
                      reducedMotion={reducedMotion}
                    />
                  )}
                </div>

                <CareerTimelineNode
                  index={index}
                  label={item.number}
                  pathProgress={pathProgress}
                  focusPathProgress={focusPathProgress}
                />

                <div className="career-narrative__slot career-narrative__slot--right">
                  {side === "right" && (
                    <TimelineCard
                      item={item}
                      index={index}
                      side="right"
                      isFocused={false}
                      accentColor={accentColor}
                      lineGlowColor={lineGlowColor}
                      cardBackground={cardBackground}
                      animationDuration={animationDuration}
                      reducedMotion={reducedMotion}
                    />
                  )}
                </div>
              </div>
            );
          })}

          <header
            id="experience"
            className="career-narrative__experience-header experience-header"
          >
            <span
              className="career-narrative__bridge-anchor"
              data-career-bridge
              aria-hidden
            />
            <h2 className="experience-title section-title">Últimos trabalhos</h2>
          </header>

          {experienceData.map((exp, i) => {
            const globalIndex = timelineData.length + i;
            const side = getCareerCardSide(globalIndex, isMobile);

            return (
              <div
                key={exp.id}
                id={experienceAnchorId(exp.id)}
                className={`career-narrative__row career-narrative__row--${side}`}
              >
                <div className="career-narrative__slot career-narrative__slot--left">
                  {side === "left" && (
                    <ExperienceCard
                      exp={exp}
                      side="left"
                      isFocused={false}
                      reducedMotion={reducedMotion}
                      index={i}
                    />
                  )}
                </div>

                <CareerTimelineNode
                  index={globalIndex}
                  label={exp.milestoneYear}
                  pathProgress={pathProgress}
                  focusPathProgress={focusPathProgress}
                />

                <div className="career-narrative__slot career-narrative__slot--right">
                  {side === "right" && (
                    <ExperienceCard
                      exp={exp}
                      side="right"
                      isFocused={false}
                      reducedMotion={reducedMotion}
                      index={i}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
