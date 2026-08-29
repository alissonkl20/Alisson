"use client";

import { DualAgentCompare } from "./DualAgentCompare";
import "./PromptSection.css";

export function PromptSection() {
  return (
    <section
      id="prompt"
      className="prompt-section section-shell"
      aria-label="Mesmo negócio, dois sites — pedido solto versus brief com spec"
    >
      <header className="prompt-head">
        <p className="section-eyebrow">Prompt</p>
        <h2 className="section-title">Mesmo negócio, dois sites</h2>
        <p className="section-subtitle">
          Os dois agents recebem os mesmos dados demo. Um pedido solto vira
          template. Um brief com caderno editorial e motion vira outra peça.
        </p>
      </header>
      <DualAgentCompare />
    </section>
  );
}
