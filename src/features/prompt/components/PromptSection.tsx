"use client";

import { useRef } from "react";
import { DualAgentCompare } from "./DualAgentCompare";
import "./PromptSection.css";

export function PromptSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className="prompt-section section-shell"
      aria-label="Prompt — same brief, two outputs"
    >
      <header className="prompt-head">
        <p className="section-eyebrow">Prompt</p>
        <h2 className="section-title">Same brief, two outputs</h2>
        <p className="section-subtitle">
          Both agents start from the same facts. What changes is the method: a
          loose request becomes a template; a spec-backed brief — components,
          editorial notebook, and motion — becomes a product. That is the lens I
          use in the loop: SDD, TDD, and system design before code.
        </p>
      </header>
      <DualAgentCompare rangeRef={sectionRef} />
    </section>
  );
}
