"use client";

import { ScrambleTextReveal } from "./ScrambleTextReveal";
import {
  SCRAMBLE_ABOUT_CONFIG,
  SCRAMBLE_ABOUT_TEXT,
} from "../lib/scrambleTextReveal.config";
import { CareerNarrative } from "./CareerNarrative";
import { DeferredSection } from "@/shared/ui/DeferredSection";
import "./AboutSection.css";
import "./ScrambleTextReveal.css";

const ABOUT_MEDIA_SRC = "/about/media.jpeg";

export function AboutSection() {
  return (
    <section id="about" className="about-section" aria-label="About me">
      <ScrambleTextReveal
        text={SCRAMBLE_ABOUT_TEXT}
        title={SCRAMBLE_ABOUT_CONFIG.title}
        scrollDistance={SCRAMBLE_ABOUT_CONFIG.scrollDistance}
        radius={SCRAMBLE_ABOUT_CONFIG.radius}
        rotation={SCRAMBLE_ABOUT_CONFIG.rotation}
        viewportHeight={SCRAMBLE_ABOUT_CONFIG.viewportHeight}
        glassSrc={ABOUT_MEDIA_SRC}
      />

      <DeferredSection
        rootMargin="40% 0px"
        fallback={<div className="min-h-screen" aria-hidden />}
      >
        <CareerNarrative />
      </DeferredSection>
    </section>
  );
}
