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
  { kind: "type", text: "oi, preciso de um site pra padaraia", charMs: 56 },
  { kind: "pause", ms: 520 },
  { kind: "delete", count: 3, charMs: 38 },
  { kind: "type", text: "ia", charMs: 48 },
  { kind: "pause", ms: 280 },
  { kind: "type", text: " da Padaria Demo", charMs: 52 },
  { kind: "pause", ms: 380 },
  { kind: "type", text: " moderno desing", charMs: 54 },
  { kind: "pause", ms: 640 },
  { kind: "delete", count: 6, charMs: 36 },
  { kind: "type", text: "design", charMs: 48 },
  { kind: "pause", ms: 260 },
  { kind: "type", text: " bonito, mostra os produtos", charMs: 52 },
  { kind: "pause", ms: 380 },
  {
    kind: "type",
    text: ". Rua Demo, 000, Cidade Demo. Tel (00) 00000-0000",
    charMs: 48,
  },
];

export const CRAFT_OPS: TypeOp[] = [
  {
    kind: "type",
    text: "Projeto Atelier Demo. Site institucional de padaria artesanal. ",
    charMs: 30,
  },
  { kind: "pause", ms: 200 },
  {
    kind: "type",
    text: "HeroSection: kicker, headline editorial e CTA. Paleta papel e sangue, full-bleed. ",
    charMs: 27,
  },
  { kind: "pause", ms: 200 },
  {
    kind: "type",
    text: "Caderno de produtos em lista — nome, origem, preço. Sem grid de cards. ",
    charMs: 27,
  },
  { kind: "pause", ms: 180 },
  {
    kind: "type",
    text: "Motion: nav sticky, reveal e scroll suave. ",
    charMs: 27,
  },
  { kind: "pause", ms: 160 },
  {
    kind: "type",
    text: "Dados demo: Rua Demo, 000, Cidade Demo, (00) 00000-0000.",
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
  { at: 80, kind: "assistant", text: "Beleza — um site pra Padaria Demo." },
  { at: 280, kind: "tool", text: "Write index.html" },
  { at: 500, kind: "tool", text: "Link Font Awesome CDN" },
  { at: 740, kind: "tool", text: "Hero, produtos, sobre e contato" },
  { at: 980, kind: "tool", text: "Dados demo · Rua Demo, 000" },
  { at: 1200, kind: "assistant", text: "Pronto. Padaria Demo no ar." },
];

export const CRAFT_SCRIPT: ScriptLine[] = [
  {
    at: 140,
    kind: "assistant",
    text: "Spec Atelier Demo: hero editorial, caderno e motion.",
  },
  {
    at: 780,
    kind: "tool",
    text: "Tokens · papel / sangue · Fraunces + Plex Mono",
  },
  {
    at: 1500,
    kind: "tool",
    text: "Hero full-bleed + caderno em lista + encomenda",
  },
  { at: 2220, kind: "tool", text: "Dados demo · Cidade Demo · (00) 00000-0000" },
  { at: 2940, kind: "tool", text: "nav sticky, reveal e scroll suave" },
  {
    at: 3600,
    kind: "assistant",
    text: "Atelier Demo no ar — editorial e interativo.",
  },
];

export const NOVICE_PREVIEW_AT = NOVICE_SUBMIT_AT + 1380;
export const CRAFT_PREVIEW_AT = CRAFT_SUBMIT_AT + 3680;
export const PLAY_END_MS = Math.max(NOVICE_PREVIEW_AT, CRAFT_PREVIEW_AT) + 120;

export const NOVICE_META = {
  title: "agent — sem experiência",
  label: "Sem experiência",
  welcome: "Welcome back.",
  model: "Agent · default template",
  cwd: "~/demo/padaria",
  hint: "oi, preciso de um site pra Padaria Demo…",
  activity: [
    "Pedido fictício, sem spec de layout",
    "Nome, rua e telefone demo no texto",
  ],
  news: [
    "Font Awesome via CDN",
    "Hero genérico, produtos e contato",
    "Template quente, botão pill",
  ],
} as const;

export const CRAFT_META = {
  title: "agent — com experiência",
  label: "Com experiência",
  welcome: "Welcome back, Alisson.",
  model: "Agent · spec first",
  cwd: "~/demo/atelier",
  hint: "Projeto Atelier Demo. HeroSection editorial…",
  activity: [
    "Brief fictício: caderno, a casa, encomenda",
    "Rua Demo, Cidade Demo, telefone 00",
  ],
  news: [
    "Caderno editorial · Fraunces + Plex Mono",
    "Lista de produtos, não grid de cards",
    "Papel, sangue e filete — sem pill button",
  ],
} as const;
