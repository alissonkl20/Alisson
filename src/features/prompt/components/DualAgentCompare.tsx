"use client";

import { useRef } from "react";
import { AgentCliPane } from "./AgentCliPane";
import { useComparePlayback } from "../hooks/useComparePlayback";
import "./DualAgentCompare.css";

export function DualAgentCompare() {
  const rootRef = useRef<HTMLDivElement>(null);
  const playback = useComparePlayback(rootRef);

  return (
    <div
      ref={rootRef}
      className="prompt-split"
      aria-label="Comparação lado a lado: o mesmo pedido em dois agents"
    >
      <AgentCliPane id="novice" playback={playback.novice} />
      <div className="prompt-split__line" aria-hidden />
      <AgentCliPane id="craft" playback={playback.craft} />
    </div>
  );
}
