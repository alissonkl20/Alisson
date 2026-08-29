"use client";

import { useEffect, useRef } from "react";
import type { CompareLog, PanePlayback } from "../hooks/useComparePlayback";
import {
  CRAFT_META,
  NOVICE_META,
  type PaneId,
} from "../lib/compareScript";
import { BakeryPreview } from "./BakeryPreview";
import "./AgentCliPane.css";

type AgentCliPaneProps = {
  id: PaneId;
  playback: PanePlayback;
};

function LogLine({ line }: { line: CompareLog }) {
  if (line.kind === "user") {
    return (
      <p className="cli-log__user">
        <span className="cli-prompt-mark">&gt;</span> {line.text}
      </p>
    );
  }
  if (line.kind === "assistant") {
    return (
      <p className="cli-log__assistant">
        <span className="cli-claude-mark">⏺</span> {line.text}
      </p>
    );
  }
  if (line.kind === "tool") {
    return (
      <p className="cli-log__tool">
        <span className="cli-tool-mark">⎿</span> {line.text}
      </p>
    );
  }
  return <p className="cli-log__system">{line.text}</p>;
}

export function AgentCliPane({ id, playback }: AgentCliPaneProps) {
  const meta = id === "novice" ? NOVICE_META : CRAFT_META;
  const showWelcome =
    !playback.submitted && !playback.typing && playback.typed.length === 0;
  const logRef = useRef<HTMLDivElement>(null);
  const inputValue = playback.submitted ? "" : playback.typed;
  const placeholder = playback.busy
    ? "gerando…"
    : playback.showPreview
      ? "site no ar"
      : meta.hint;

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [playback.logs.length]);

  return (
    <article
      className={`agent-cli agent-cli--${id}`}
      aria-label={`${meta.label} — interface de agent CLI`}
    >
      <div className="cli-chrome">
        <span className="cli-dot" aria-hidden />
        <span className="cli-dot" aria-hidden />
        <span className="cli-dot" aria-hidden />
        <span className="cli-title">{meta.title}</span>
        <span className="cli-chrome__tag">{meta.label}</span>
      </div>

      {showWelcome ? (
        <div className="cli-welcome">
          <p className="cli-welcome__hi">{meta.welcome}</p>
          <p className="cli-start-cmd" aria-hidden>
            <span className="cli-prompt-mark">&gt;</span>
            {meta.hint}
          </p>
          <div className="cli-side">
            <p className="cli-side__label">Recent activity</p>
            {meta.activity.map((item) => (
              <p key={item} className="cli-side__muted">
                {item}
              </p>
            ))}
            <p className="cli-side__label">What&apos;s new</p>
            <ul>
              {meta.news.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <p className="cli-meta">{meta.model}</p>
          <p className="cli-cwd">{meta.cwd}</p>
        </div>
      ) : null}

      {playback.logs.length > 0 ? (
        <div ref={logRef} className="cli-log" aria-live="polite">
          {playback.logs.map((line) => (
            <LogLine key={line.id} line={line} />
          ))}
        </div>
      ) : null}

      {playback.showPreview ? <BakeryPreview variant={id} /> : null}

      <div className="cli-input">
        <span className="cli-prompt-mark" aria-hidden>
          &gt;
        </span>
        <span className="cli-input__value">
          {inputValue}
          {playback.typing ? <span className="cli-caret" aria-hidden /> : null}
        </span>
        {!inputValue && !playback.typing ? (
          <span className="cli-input__placeholder">{placeholder}</span>
        ) : null}
      </div>
      <p className="cli-shortcuts">
        {playback.showPreview
          ? id === "novice"
            ? "Padaria Demo"
            : "Atelier Demo"
          : playback.busy
            ? "agent working"
            : "digitando o pedido"}
      </p>
    </article>
  );
}
