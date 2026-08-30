"use client";

import type { RefObject } from "react";
import { AgentCliPane } from "./AgentCliPane";
import { useComparePlayback } from "../hooks/useComparePlayback";
import "./DualAgentCompare.css";

type DualAgentCompareProps = {
  rangeRef: RefObject<HTMLElement | null>;
};

export function DualAgentCompare({ rangeRef }: DualAgentCompareProps) {
  const playback = useComparePlayback(rangeRef);

  return (
    <div
      className="prompt-split"
      aria-label="Comparação lado a lado: o mesmo briefing, dois métodos, duas peças"
    >
      <AgentCliPane id="novice" playback={playback.novice} />
      <div className="prompt-split__line" aria-hidden />
      <AgentCliPane id="craft" playback={playback.craft} />
    </div>
  );
}
