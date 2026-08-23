import { LINE_PAUSE, TYPED_LINES, TYPE_SPEED } from "./constants";

export interface WrappedLine {
  prompt: boolean;
  text: string;
}

export interface TextLayout {
  pad: number;
  fontSize: number;
  lineStep: number;
  startY: number;
  textX: number;
  innerW: number;
  wrapped: WrappedLine[];
}

export function wrapManifesto(innerW: number, fontSize: number): WrappedLine[] {
  const charW = fontSize * 0.58;
  const out: WrappedLine[] = [];

  for (const line of TYPED_LINES) {
    const maxW = innerW - (line.prompt ? 16 : 0);
    const words = line.text.split(" ");
    let cur = "";
    let isFirst = true;

    for (const word of words) {
      const test = cur ? `${cur} ${word}` : word;
      if (test.length * charW > maxW && cur) {
        out.push({ prompt: isFirst && line.prompt, text: cur });
        isFirst = false;
        cur = word;
      } else {
        cur = test;
      }
    }
    if (cur) out.push({ prompt: isFirst && line.prompt, text: cur });
  }
  return out;
}

export function buildTextLayout(w: number, mobile: boolean): TextLayout {
  const pad = mobile ? 14 : 18;
  const fontSize = mobile ? (w < 340 ? 9 : 10) : w < 560 ? 11 : 13;
  const textX = pad + (mobile ? 14 : 22);
  const innerW = w - textX - pad - 8;
  const titleY = mobile ? 28 : 34;
  const startY = titleY + (mobile ? 24 : 30);
  const lineStep = mobile ? 14 : 17;
  const wrapped = wrapManifesto(innerW, fontSize);

  return { pad, fontSize, lineStep, startY, textX, innerW, wrapped };
}

export function terminalHeightForLayout(layout: TextLayout): number {
  return layout.pad * 2 + layout.startY + layout.wrapped.length * layout.lineStep + 20;
}

export function typewriterBudget(modeTime: number): number {
  return Math.max(0, modeTime - 0.35) * TYPE_SPEED;
}

export function lineBudgetCost(textLength: number): number {
  return textLength + LINE_PAUSE * TYPE_SPEED;
}
