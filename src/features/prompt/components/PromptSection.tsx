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
      aria-label="Prompt — o mesmo briefing, duas peças"
    >
      <header className="prompt-head">
        <p className="section-eyebrow">Prompt</p>
        <h2 className="section-title">O mesmo briefing, duas peças</h2>
        <p className="section-subtitle">
          Os dois agents partem dos mesmos dados. O que muda é o método: um
          pedido solto vira template; um brief com spec — componentes, caderno
          editorial e motion — vira produto. É o recorte que uso no ciclo: SDD,
          TDD e system design antes do código.
        </p>
      </header>
      <DualAgentCompare rangeRef={sectionRef} />
    </section>
  );
}
