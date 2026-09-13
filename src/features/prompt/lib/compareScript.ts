export type LogKind = "user" | "assistant" | "tool" | "system";

export type ScriptLine = {
  at: number;
  kind: Exclude<LogKind, "user">;
  text: string;
};

export type PaneId = "novice" | "craft";

export type TypeOp =
  | { kind: "type"; text: string; charMs?: number }
  | { kind: "delete"; count: number; charMs?: number }
  | { kind: "pause"; ms: number };

export type TypedState = {
  text: string;
  typing: boolean;
  submitted: boolean;
  submitAt: number;
};

export const TYPE_START_MS = 640;
export const SUBMIT_PAUSE_MS = 420;

const TYPE_DEFAULT = 46;
const DELETE_DEFAULT = 34;

export function trackDuration(ops: TypeOp[]): number {
  let t = 0;
  for (const op of ops) {
    if (op.kind === "pause") t += op.ms;
    else if (op.kind === "type") t += op.text.length * (op.charMs ?? TYPE_DEFAULT);
    else t += op.count * (op.charMs ?? DELETE_DEFAULT);
  }
  return t;
}

export function resolveTyped(
  ops: TypeOp[],
  startMs: number,
  elapsed: number,
  submitPauseMs: number,
): TypedState {
  const submitAt = startMs + trackDuration(ops) + submitPauseMs;

  if (elapsed < startMs) {
    return { text: "", typing: false, submitted: false, submitAt };
  }

  let t = startMs;
  let text = "";

  for (const op of ops) {
    if (op.kind === "pause") {
      if (elapsed < t + op.ms) {
        return { text, typing: false, submitted: false, submitAt };
      }
      t += op.ms;
      continue;
    }

    if (op.kind === "type") {
      const charMs = op.charMs ?? TYPE_DEFAULT;
      const duration = op.text.length * charMs;
      if (elapsed < t + duration) {
        const n = Math.min(op.text.length, Math.floor((elapsed - t) / charMs));
        return {
          text: text + op.text.slice(0, n),
          typing: true,
          submitted: false,
          submitAt,
        };
      }
      text += op.text;
      t += duration;
      continue;
    }

    const charMs = op.charMs ?? DELETE_DEFAULT;
    const duration = op.count * charMs;
    if (elapsed < t + duration) {
      const n = Math.min(op.count, Math.floor((elapsed - t) / charMs));
      return {
        text: text.slice(0, Math.max(0, text.length - n)),
        typing: true,
        submitted: false,
        submitAt,
      };
    }
    text = text.slice(0, Math.max(0, text.length - op.count));
    t += duration;
  }

  return {
    text,
    typing: false,
    submitted: elapsed >= submitAt,
    submitAt,
  };
}

export function finalPrompt(ops: TypeOp[]): string {
  return resolveTyped(ops, 0, Number.POSITIVE_INFINITY, 0).text;
}

export const NOVICE_OPS: TypeOp[] = [
  { kind: "type", text: "hi, i need a website for a bakary", charMs: 56 },
  { kind: "pause", ms: 520 },
  { kind: "delete", count: 3, charMs: 38 },
  { kind: "type", text: "ery", charMs: 48 },
  { kind: "pause", ms: 280 },
  { kind: "type", text: " for Demo Bakery", charMs: 52 },
  { kind: "pause", ms: 380 },
  { kind: "type", text: " modern desing", charMs: 54 },
  { kind: "pause", ms: 640 },
  { kind: "delete", count: 6, charMs: 36 },
  { kind: "type", text: "design", charMs: 48 },
  { kind: "pause", ms: 260 },
  { kind: "type", text: ", show the products", charMs: 52 },
  { kind: "pause", ms: 380 },
  {
    kind: "type",
    text: ". Demo St, 000, Demo City. Tel (00) 00000-0000",
    charMs: 48,
  },
];

export const CRAFT_OPS: TypeOp[] = [
  {
    kind: "type",
    text: "Project Atelier Demo. Artisan bakery institutional site. ",
    charMs: 30,
  },
  { kind: "pause", ms: 200 },
  {
    kind: "type",
    text: "HeroSection: kicker, editorial headline and CTA. Paper and blood palette, full-bleed. ",
    charMs: 27,
  },
  { kind: "pause", ms: 200 },
  {
    kind: "type",
    text: "Product notebook in a list — name, origin, price. No card grid. ",
    charMs: 27,
  },
  { kind: "pause", ms: 180 },
  {
    kind: "type",
    text: "Motion: sticky nav, reveal and smooth scroll. ",
    charMs: 27,
  },
  { kind: "pause", ms: 160 },
  {
    kind: "type",
    text: "Demo data: Demo St, 000, Demo City, (00) 00000-0000.",
    charMs: 27,
  },
];

export const NOVICE_START_MS = TYPE_START_MS;
export const CRAFT_START_MS = TYPE_START_MS + 180;

export const NOVICE_PROMPT = finalPrompt(NOVICE_OPS);
export const CRAFT_PROMPT = finalPrompt(CRAFT_OPS);

export const NOVICE_SUBMIT_AT =
  NOVICE_START_MS + trackDuration(NOVICE_OPS) + SUBMIT_PAUSE_MS;
export const CRAFT_SUBMIT_AT =
  CRAFT_START_MS + trackDuration(CRAFT_OPS) + SUBMIT_PAUSE_MS;

export const NOVICE_SCRIPT: ScriptLine[] = [
  { at: 80, kind: "assistant", text: "Sure — a site for Demo Bakery." },
  { at: 280, kind: "tool", text: "Write index.html" },
  { at: 500, kind: "tool", text: "Link Font Awesome CDN" },
  { at: 740, kind: "tool", text: "Hero, products, about and contact" },
  { at: 980, kind: "tool", text: "Demo data · Demo St, 000" },
  { at: 1200, kind: "assistant", text: "Done. Demo Bakery is live." },
];

export const CRAFT_SCRIPT: ScriptLine[] = [
  {
    at: 140,
    kind: "assistant",
    text: "Spec Atelier Demo: editorial hero, notebook and motion.",
  },
  {
    at: 780,
    kind: "tool",
    text: "Tokens · paper / blood · Fraunces + Plex Mono",
  },
  {
    at: 1500,
    kind: "tool",
    text: "Hero full-bleed + list notebook + order",
  },
  { at: 2220, kind: "tool", text: "Demo data · Demo City · (00) 00000-0000" },
  { at: 2940, kind: "tool", text: "sticky nav, reveal and smooth scroll" },
  {
    at: 3600,
    kind: "assistant",
    text: "Atelier Demo is live — editorial and interactive.",
  },
];

export const NOVICE_PREVIEW_AT = NOVICE_SUBMIT_AT + 1380;
export const CRAFT_PREVIEW_AT = CRAFT_SUBMIT_AT + 3680;
export const PLAY_END_MS = Math.max(NOVICE_PREVIEW_AT, CRAFT_PREVIEW_AT) + 120;

export const NOVICE_META = {
  title: "agent — no experience",
  label: "No experience",
  welcome: "Welcome back.",
  model: "Agent · default template",
  cwd: "~/demo/bakery",
  hint: "hi, i need a website for Demo Bakery…",
  activity: [
    "Fictional request, no layout spec",
    "Demo name, street and phone in the prompt",
  ],
  news: [
    "Font Awesome via CDN",
    "Generic hero, products and contact",
    "Hot template, pill button",
  ],
} as const;

export const CRAFT_META = {
  title: "agent — experienced",
  label: "Experienced",
  welcome: "Welcome back, Alisson.",
  model: "Agent · spec first",
  cwd: "~/demo/atelier",
  hint: "Project Atelier Demo. Editorial HeroSection…",
  activity: [
    "Fictional brief: notebook, the house, order",
    "Demo St, Demo City, phone 00",
  ],
  news: [
    "Editorial notebook · Fraunces + Plex Mono",
    "Product list, not card grid",
    "Paper, blood and rule — no pill button",
  ],
} as const;
