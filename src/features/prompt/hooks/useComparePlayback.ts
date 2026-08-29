"use client";

import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import {
  CRAFT_OPS,
  CRAFT_PREVIEW_AT,
  CRAFT_PROMPT,
  CRAFT_SCRIPT,
  CRAFT_START_MS,
  NOVICE_OPS,
  NOVICE_PREVIEW_AT,
  NOVICE_PROMPT,
  NOVICE_SCRIPT,
  NOVICE_START_MS,
  PLAY_END_MS,
  SUBMIT_PAUSE_MS,
  resolveTyped,
  type LogKind,
  type ScriptLine,
  type TypeOp,
} from "../lib/compareScript";

export type CompareLog = {
  id: string;
  kind: LogKind;
  text: string;
};

export type PanePlayback = {
  typed: string;
  submitted: boolean;
  logs: CompareLog[];
  showPreview: boolean;
  busy: boolean;
  typing: boolean;
  prompt: string;
};

export type ComparePlayback = {
  novice: PanePlayback;
  craft: PanePlayback;
  reduced: boolean;
};

function snapshotKey(elapsed: number): string {
  const novice = resolveTyped(NOVICE_OPS, NOVICE_START_MS, elapsed, SUBMIT_PAUSE_MS);
  const craft = resolveTyped(CRAFT_OPS, CRAFT_START_MS, elapsed, SUBMIT_PAUSE_MS);
  const noviceLogs = novice.submitted
    ? NOVICE_SCRIPT.filter((line) => elapsed >= novice.submitAt + line.at).length
    : 0;
  const craftLogs = craft.submitted
    ? CRAFT_SCRIPT.filter((line) => elapsed >= craft.submitAt + line.at).length
    : 0;
  return [
    novice.text.length,
    craft.text.length,
    novice.submitted ? 1 : 0,
    craft.submitted ? 1 : 0,
    noviceLogs,
    craftLogs,
    elapsed >= NOVICE_PREVIEW_AT ? 1 : 0,
    elapsed >= CRAFT_PREVIEW_AT ? 1 : 0,
  ].join(":");
}

function buildLogs(
  elapsed: number,
  submitted: boolean,
  submitAt: number,
  prompt: string,
  script: ScriptLine[],
): CompareLog[] {
  if (!submitted) return [];
  const lines: CompareLog[] = [{ id: "user", kind: "user", text: prompt }];
  for (const [index, line] of script.entries()) {
    if (elapsed < submitAt + line.at) break;
    lines.push({
      id: `${line.kind}-${index}`,
      kind: line.kind,
      text: line.text,
    });
  }
  return lines;
}

function derivePane(
  elapsed: number,
  ops: TypeOp[],
  startMs: number,
  prompt: string,
  script: ScriptLine[],
  previewAt: number,
  previewLatched: boolean,
): PanePlayback {
  const typed = resolveTyped(ops, startMs, elapsed, SUBMIT_PAUSE_MS);
  const showPreview = previewLatched || elapsed >= previewAt;
  return {
    typed: typed.submitted ? "" : typed.text,
    submitted: typed.submitted,
    logs: buildLogs(elapsed, typed.submitted, typed.submitAt, prompt, script),
    showPreview,
    busy: typed.submitted && !showPreview,
    typing: typed.typing,
    prompt,
  };
}

function derive(
  elapsed: number,
  shown: { novice: boolean; craft: boolean },
): Omit<ComparePlayback, "reduced"> {
  return {
    novice: derivePane(
      elapsed,
      NOVICE_OPS,
      NOVICE_START_MS,
      NOVICE_PROMPT,
      NOVICE_SCRIPT,
      NOVICE_PREVIEW_AT,
      shown.novice,
    ),
    craft: derivePane(
      elapsed,
      CRAFT_OPS,
      CRAFT_START_MS,
      CRAFT_PROMPT,
      CRAFT_SCRIPT,
      CRAFT_PREVIEW_AT,
      shown.craft,
    ),
  };
}

const session = {
  elapsed: 0,
  done: false,
  shown: { novice: false, craft: false },
};

export function useComparePlayback(
  rootRef: RefObject<HTMLElement | null>,
): ComparePlayback {
  const reduceMotion = useReducedMotion() ?? false;
  const [elapsed, setElapsed] = useState(session.elapsed);
  const frozen = reduceMotion || session.done;

  useEffect(() => {
    if (frozen) return;

    const root = rootRef.current;
    if (!root) return;

    let raf = 0;
    let origin = 0;
    let running = false;
    let inView = false;
    let lastKey = snapshotKey(session.elapsed);

    const commit = (next: number) => {
      session.elapsed = next;
      if (next >= NOVICE_PREVIEW_AT) session.shown.novice = true;
      if (next >= CRAFT_PREVIEW_AT) session.shown.craft = true;
      const key = snapshotKey(next);
      if (key !== lastKey) {
        lastKey = key;
        setElapsed(next);
      }
    };

    const stop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      running = false;
    };

    const tick = (now: number) => {
      if (!inView || session.done) {
        stop();
        return;
      }

      const next = Math.min(PLAY_END_MS, now - origin);
      commit(next);

      if (next >= PLAY_END_MS) {
        session.done = true;
        session.shown = { novice: true, craft: true };
        stop();
        setElapsed(PLAY_END_MS);
        return;
      }

      raf = requestAnimationFrame(tick);
    };

    const play = () => {
      if (session.done || !inView || running || document.hidden) return;
      running = true;
      origin = performance.now() - session.elapsed;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) play();
        else stop();
      },
      { threshold: 0.28 },
    );
    io.observe(root);

    const onVis = () => {
      if (document.hidden) {
        stop();
        return;
      }
      play();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      stop();
    };
  }, [frozen, rootRef]);

  const shown = frozen ? { novice: true, craft: true } : session.shown;
  const panes = derive(frozen ? PLAY_END_MS : elapsed, shown);
  return { ...panes, reduced: reduceMotion };
}
