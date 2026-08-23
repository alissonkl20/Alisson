"use client";

import { useEffect, useRef, useState } from "react";

/**
 * AsciiVideo — morphing de partículas entre duas formas:
 *
 *   CAT (vídeo ASCII ao vivo)
 *     └─ clique ─▶ EXPLODE (onda de choque + turbulência)
 *                  └─▶ TERMINAL (partículas montam a janela: borda
 *                      arredondada, dots, linhas de código, cursor piscante)
 *                      └─ clique ─▶ EXPLODE ─▶ CAT (mola de volta ao frame)
 *
 * Tudo em um único canvas: as partículas são os próprios caracteres ASCII.
 */

const ASCII_CHARS = "@%#*+=-:. ".split("");
const FONT_SIZE = 7;
const CELL_W = FONT_SIZE * 0.6;
const CELL_H = FONT_SIZE;
/* Partículas do terminal usam fonte maior — letras nítidas para a animação de escrita. */
const PARTICLE_FONT = 11;
const BRIGHTNESS_THRESHOLD = 40;
const MAX_PARTICLES_DESKTOP = 1800;
const MAX_PARTICLES_MOBILE = 900;
const EXPLODE_TIME = 0.7;

type Mode = "cat" | "explode" | "morph" | "terminal";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  targetX: number;
  targetY: number;
  char: string;
  alpha: number;
  delay: number;
  isCursor: boolean;
  isLine: boolean;
}

/** Manifesto digitado quando o terminal monta — mensagem profissional ao visitante. */
const TYPED_LINES = [
  { prompt: true, text: "haff manifesto" },
  { prompt: false, text: "Um sistema simples não sustenta uma marca memorável." },
  { prompt: false, text: "O que você apresenta reflete quem você é — personalidade," },
  { prompt: false, text: "visão de negócio e a forma como você se posiciona no mercado." },
  { prompt: false, text: "Antes de vender serviços, software ou um site," },
  { prompt: false, text: "precisa existir algo autêntico: emoção antes da oferta." },
  { prompt: false, text: "A primeira impressão é decisiva. Não desperdice essa chance." },
  { prompt: false, text: "Vamos criar algo inovador que transmite valor e diferencia você." },
];
const TYPE_SPEED = 22; // mais lento — leitura confortável do manifesto
const LINE_PAUSE = 0.55; // pausa entre linhas (s)

interface WrappedLine {
  prompt: boolean;
  text: string;
}

interface TextLayout {
  pad: number;
  fontSize: number;
  lineStep: number;
  startY: number;
  textX: number;
  innerW: number;
  wrapped: WrappedLine[];
}

/** Quebra linhas longas para caber na largura do terminal. */
function wrapManifesto(innerW: number, fontSize: number): WrappedLine[] {
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

function buildTextLayout(w: number, mobile: boolean): TextLayout {
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

function terminalHeightForLayout(layout: TextLayout): number {
  return layout.pad * 2 + layout.startY + layout.wrapped.length * layout.lineStep + 20;
}

interface AsciiVideoProps {
  src?: string;
  className?: string;
}

/** Gera a forma do terminal (em pixels) para as partículas montarem. */
type ShapeKind = "frame" | "line" | "cursor";

function buildTerminalShape(
  width: number,
  height: number,
): { x: number; y: number; kind: ShapeKind }[] {
  const pts: { x: number; y: number; kind: ShapeKind }[] = [];
  const pad = 18;
  const W = width - pad * 2;
  const H = height - pad * 2;
  const R = 12;
  const step = 4.6;
  const push = (x: number, y: number, kind: ShapeKind = "frame") =>
    pts.push({ x: pad + x, y: pad + y, kind });

  // Contorno com cantos arredondados
  for (let x = R; x <= W - R; x += step) {
    push(x, 0);
    push(x, H);
  }
  for (let y = R; y <= H - R; y += step) {
    push(0, y);
    push(W, y);
  }
  const corners: [number, number, number, number][] = [
    [W - R, R, -Math.PI / 2, 0],
    [R, R, Math.PI, (3 * Math.PI) / 2],
    [R, H - R, Math.PI / 2, Math.PI],
    [W - R, H - R, 0, Math.PI / 2],
  ];
  for (const [cx, cy, a0, a1] of corners) {
    for (let a = a0; a <= a1; a += 0.16) {
      push(cx + R * Math.cos(a), cy + R * Math.sin(a));
    }
  }

  // Barra de título + dots
  const titleY = 34;
  for (let x = 10; x <= W - 10; x += step) push(x, titleY);
  for (let i = 0; i < 3; i++) {
    const dx = 24 + i * 20;
    for (let a = 0; a < Math.PI * 2; a += 0.55) {
      push(dx + 5.5 * Math.cos(a), 17 + 5.5 * Math.sin(a));
    }
  }

  // Linhas de "código" com gaps de palavras
  const lineWidths = [0.62, 0.45, 0.7, 0.3, 0.55, 0.38];
  const startY = titleY + 30;
  const lineStep = Math.max(22, (H - 60) / 7);
  lineWidths.forEach((ratio, li) => {
    const y = startY + li * lineStep;
    if (y > H - 16) return;
    const indent = li === 2 || li === 4 ? 30 : 0;
    const x0 = 22 + indent;
    const x1 = 22 + ratio * (W - 44);
    let x = x0;
    while (x < x1) {
      const wordLen = 18 + Math.random() * 40;
      const end = Math.min(x + wordLen, x1);
      for (let wx = x; wx < end; wx += 4.4) push(wx, y, "line");
      x += wordLen + 12;
    }
  });

  // Cursor no fim da última linha (marcado para piscar)
  const cursorY = startY + 5 * lineStep;
  const cursorX = 22 + 0.38 * (W - 44) + 18;
  if (cursorY <= H - 16) {
    for (let dy = -7; dy <= 7; dy += 3) push(cursorX, cursorY + dy, "cursor");
  }

  return pts;
}

export function AsciiVideo({ src = "/assets/cat.mp4", className = "" }: AsciiVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const samplerRef = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "playing" | "error">("loading");
  const [isCat, setIsCat] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const sampler = samplerRef.current;
    const display = displayRef.current;
    const wrap = wrapRef.current;
    if (!video || !sampler || !display || !wrap) return;

    const sctx = sampler.getContext("2d", { willReadFrequently: true });
    const dctx = display.getContext("2d");
    if (!sctx || !dctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf: number | undefined;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let charColor = "#ffd000";
    let highlightColor = "#ff0844";
    let dispW = 0;
    let dispH = 0;

    let mode: Mode = "cat";
    let particles: Particle[] = [];
    let modeTime = 0;
    let lastTime = performance.now();
    let maxParticles = MAX_PARTICLES_DESKTOP;

    const readTheme = () => {
      const cs = getComputedStyle(document.documentElement);
      charColor = cs.getPropertyValue("--theme-brand").trim() || charColor;
      highlightColor = cs.getPropertyValue("--theme-highlight").trim() || highlightColor;
    };
    readTheme();
    const themeObserver = new MutationObserver(readTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
    maxParticles = isMobile() ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;

    let textLayout: TextLayout = buildTextLayout(320, true);

    /** Mobile: largura total do card, altura calculada para o texto caber. */
    const terminalSize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const mobile = isMobile();

      const w = mobile
        ? Math.max(280, vw - 20)
        : Math.max(400, Math.min(vw - 32, 860));

      let layout = buildTextLayout(w, mobile);
      let h = terminalHeightForLayout(layout);

      if (mobile) {
        h = Math.min(Math.max(h, 400), Math.round(vh * 0.78));
        layout = buildTextLayout(w, mobile);
        h = Math.max(h, terminalHeightForLayout(layout));
      } else {
        h = Math.max(h, Math.min(480, Math.round(vh * 0.52)));
      }

      textLayout = layout;
      return { w, h };
    };

    const configure = () => {
      if (!video.videoWidth) return;
      maxParticles = isMobile() ? MAX_PARTICLES_MOBILE : MAX_PARTICLES_DESKTOP;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cols = Math.max(isMobile() ? 40 : 48, Math.floor(wrap.clientWidth / CELL_W));
      rows = Math.max(1, Math.floor((cols * video.videoHeight) / video.videoWidth / 2));
      sampler.width = cols;
      sampler.height = rows;
      setDisplaySize(cols * CELL_W, rows * CELL_H);
    };

    /** Redimensiona só o canvas visível (cat = aspecto do vídeo, terminal = fixo maior). */
    const setDisplaySize = (cssW: number, cssH: number) => {
      dispW = cssW;
      dispH = cssH;
      display.width = Math.round(cssW * dpr);
      display.height = Math.round(cssH * dpr);
      display.style.width = `${cssW}px`;
      display.style.height = `${cssH}px`;
    };

    const sampleFrame = () => {
      sctx.drawImage(video, 0, 0, cols, rows);
      return sctx.getImageData(0, 0, cols, rows).data;
    };

    const charFor = (b: number) =>
      ASCII_CHARS[Math.floor((b / 255) * (ASCII_CHARS.length - 1))];

    const setupContext = (fontSize = FONT_SIZE) => {
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dctx.font = `bold ${fontSize}px monospace`;
      dctx.textBaseline = "top";
      dctx.fillStyle = charColor;
    };

    const drawLive = () => {
      const pixels = sampleFrame();
      setupContext(FONT_SIZE);
      dctx.clearRect(0, 0, dispW, dispH);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const o = (y * cols + x) * 4;
          const b = 0.299 * pixels[o] + 0.587 * pixels[o + 1] + 0.114 * pixels[o + 2];
          if (b < 12) continue;
          dctx.globalAlpha = 0.25 + (b / 255) * 0.75;
          dctx.fillText(charFor(b), x * CELL_W, y * CELL_H);
        }
      }
      dctx.globalAlpha = 1;
    };

    const drawParticles = (t: number) => {
      setupContext(PARTICLE_FONT);
      dctx.clearRect(0, 0, dispW, dispH);
      for (const p of particles) {
        // Cursor do terminal pisca quando a forma está montada.
        const blink =
          mode === "terminal" && p.isCursor
            ? 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 4.5))
            : 1;
        // Linhas decorativas de "código falso" quase somem quando o texto
        // real é digitado por cima — evita ruído visual.
        const dim = mode === "terminal" && p.isLine ? 0.1 : 1;
        dctx.globalAlpha = p.alpha * blink * dim;
        dctx.fillText(p.char, p.x, p.y);
      }
      dctx.globalAlpha = 1;
    };

    /** Typewriter — linhas já quebradas para caber no card. */
    const drawTypedText = () => {
      const { pad, fontSize, lineStep, startY, textX, wrapped } = textLayout;

      let budget = Math.max(0, modeTime - 0.35) * TYPE_SPEED;

      dctx.font = `bold ${fontSize}px monospace`;
      dctx.textBaseline = "top";

      for (let li = 0; li < wrapped.length; li++) {
        if (budget <= 0) break;
        const line = wrapped[li];
        const y = pad + startY + li * lineStep;

        if (line.prompt) {
          dctx.fillStyle = highlightColor;
          dctx.globalAlpha = 1;
          dctx.fillText("$", textX, y);
        }

        const shown = line.text.slice(0, Math.floor(budget));
        dctx.fillStyle = charColor;
        dctx.globalAlpha = 0.95;
        dctx.fillText(shown, textX + (line.prompt ? 14 : 0), y);

        budget -= line.text.length + LINE_PAUSE * TYPE_SPEED;
      }

      dctx.globalAlpha = 1;
      dctx.fillStyle = charColor;
    };

    /** Células brilhantes do frame atual → lista de posições (para o cat). */
    const catTargets = () => {
      const pixels = sampleFrame();
      const list: { x: number; y: number; char: string; alpha: number }[] = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const o = (y * cols + x) * 4;
          const b = 0.299 * pixels[o] + 0.587 * pixels[o + 1] + 0.114 * pixels[o + 2];
          if (b < BRIGHTNESS_THRESHOLD) continue;
          list.push({
            x: x * CELL_W,
            y: y * CELL_H,
            char: charFor(b),
            alpha: 0.35 + (b / 255) * 0.65,
          });
        }
      }
      return list;
    };

    /**
     * Dispara a transição: explosão a partir do clique, depois as
     * partículas convergem (mola) para o alvo — terminal ou cat.
     */
    const explode = (clickX: number, clickY: number, toTerminal: boolean) => {
      if (!sampler.width || !sampler.height) return;

      if (mode === "cat") {
        // Partículas nascem das células brilhantes do frame atual.
        const cells = catTargets();
        const stepN = Math.max(1, Math.ceil(cells.length / maxParticles));
        const chosen = cells.filter((_, i) => i % stepN === 0);
        let maxDist = 0.0001;
        for (const c of chosen) {
          maxDist = Math.max(maxDist, Math.hypot(c.x - clickX, c.y - clickY));
        }
        particles = chosen.map((c) => {
          const dx = c.x - clickX + (Math.random() - 0.5) * 14;
          const dy = c.y - clickY + (Math.random() - 0.5) * 14;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const speed = 260 + Math.random() * 420;
          return {
            x: c.x,
            y: c.y,
            vx: (dx / dist) * speed,
            vy: (dy / dist) * speed,
            homeX: c.x,
            homeY: c.y,
            targetX: c.x,
            targetY: c.y,
            char: c.char,
            alpha: c.alpha,
            delay: (Math.hypot(c.x - clickX, c.y - clickY) / maxDist) * 0.14,
            isCursor: false,
            isLine: false,
          };
        });
      } else {
        // Terminal → explosão a partir das posições atuais.
        let maxDist = 0.0001;
        for (const p of particles) {
          maxDist = Math.max(maxDist, Math.hypot(p.x - clickX, p.y - clickY));
        }
        for (const p of particles) {
          const dx = p.x - clickX + (Math.random() - 0.5) * 14;
          const dy = p.y - clickY + (Math.random() - 0.5) * 14;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const speed = 260 + Math.random() * 420;
          p.vx = (dx / dist) * speed;
          p.vy = (dy / dist) * speed;
          p.delay = (Math.hypot(p.x - clickX, p.y - clickY) / maxDist) * 0.14;
          p.isCursor = false;
          p.isLine = false;
        }
      }

      mode = "explode";
      modeTime = 0;
      if (toTerminal) {
        setIsCat(false); // esconde o overlay "clique na tela"
        setExpanded(true); // card começa a expandir junto com a explosão
      }
    };

    /**
     * Define os alvos do morph e redimensiona o canvas para o destino.
     * Chamado na transição explode → morph: nesse momento o card já está
     * animando a largura, então canvas e card crescem/encolhem juntos.
     */
    const prepareMorphTargets = () => {
      if (goingToCat.current) {
        // Alvo: frame FRESCO do vídeo (o cat "remonta" no momento atual).
        setDisplaySize(cols * CELL_W, rows * CELL_H);
        const cells = catTargets();
        particles.forEach((p, i) => {
          const c = cells[(i * 7919) % Math.max(1, cells.length)] ?? {
            x: p.homeX,
            y: p.homeY,
          };
          p.targetX = c.x;
          p.targetY = c.y;
        });
        setExpanded(false); // card encolhe junto com o morph
      } else {
        const { w, h } = terminalSize();
        setDisplaySize(w, h);
        const shape = buildTerminalShape(w, h);
        particles.forEach((p, i) => {
          const s = shape[(i * 7919) % shape.length];
          p.targetX = s.x + (Math.random() - 0.5) * 1.2;
          p.targetY = s.y + (Math.random() - 0.5) * 1.2;
          p.isCursor = s.kind === "cursor";
          p.isLine = s.kind === "line";
        });
      }
    };

    const updateParticles = (dt: number, t: number) => {
      if (mode === "explode") {
        const damping = Math.max(0, 1 - 2.6 * dt);
        for (const p of particles) {
          if (modeTime < p.delay) continue;
          p.vx += Math.sin(p.y * 0.045 + t * 3.1) * 46 * dt;
          p.vy += Math.cos(p.x * 0.045 + t * 2.7) * 46 * dt;
          p.vx *= damping;
          p.vy *= damping;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
        }
        if (modeTime >= EXPLODE_TIME) {
          prepareMorphTargets();
          mode = "morph";
          modeTime = 0;
        }
        return;
      }

      if (mode === "morph" || mode === "terminal") {
        // Mola mais elástica: spring alto + damping baixo = overshoot visível.
        const spring = 58;
        const damping = Math.max(0, 1 - 4.2 * dt);
        let settled = true;
        for (const p of particles) {
          p.vx = (p.vx + (p.targetX - p.x) * spring * dt) * damping;
          p.vy = (p.vy + (p.targetY - p.y) * spring * dt) * damping;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (
            Math.abs(p.x - p.targetX) > 0.6 ||
            Math.abs(p.y - p.targetY) > 0.6 ||
            Math.hypot(p.vx, p.vy) > 20
          ) {
            settled = false;
          }
        }
        if (mode === "morph" && settled) {
          // Se o alvo era o cat, volta ao vídeo ao vivo; senão, terminal parado.
          const backToCat = particles[0] && !particles[0].isCursor && isCatTarget();
          if (backToCat) {
            mode = "cat";
            particles = [];
            setIsCat(true);
          } else {
            mode = "terminal";
            modeTime = 0; // reinicia o relógio para o typewriter
          }
        }
      }
    };

    // O morph terminou no cat se nenhum alvo é cursor e estávamos indo para o cat.
    const goingToCat = { current: false };
    const isCatTarget = () => goingToCat.current;

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      modeTime += dt;

      if (video.paused || video.ended) {
        raf = undefined;
        return;
      }

      if (!cols || !rows || !sampler.width) {
        configure();
        raf = requestAnimationFrame(loop);
        return;
      }

      if (mode === "cat") {
        drawLive();
      } else {
        updateParticles(dt, now / 1000);
        drawParticles(now / 1000);
        if (mode === "terminal") drawTypedText();
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (raf === undefined) {
        lastTime = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const onClick = (e: MouseEvent) => {
      if (reduced) return;
      const rect = display.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (mode === "cat") {
        goingToCat.current = false;
        explode(x, y, true);
      } else if (mode === "terminal") {
        goingToCat.current = true;
        explode(x, y, false);
      }
    };

    const onMetadata = () => {
      configure();
      start();
    };
    const onCanPlay = () => setStatus("playing");
    const onError = () => setStatus("error");
    const onResize = () => {
      if (video.readyState >= 1) configure();
    };

    video.addEventListener("loadedmetadata", onMetadata);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("play", start);
    video.addEventListener("error", onError);
    display.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);

    video.play().catch(() => {
      /* Autoplay bloqueado: espera interação do usuário. */
    });

    return () => {
      if (raf !== undefined) cancelAnimationFrame(raf);
      themeObserver.disconnect();
      video.removeEventListener("loadedmetadata", onMetadata);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("play", start);
      video.removeEventListener("error", onError);
      display.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
  }, [src]);

  return (
    <div
      className={`mx-auto w-full overflow-hidden rounded-xl border border-theme-border bg-black/60 shadow-lg backdrop-blur-md transition-[max-width] duration-1000 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] ${expanded ? "max-w-full sm:max-w-2xl lg:max-w-4xl" : "max-w-full sm:max-w-sm"} ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-theme-border px-2.5 py-1.5 sm:px-3">
        <span className="size-1.5 shrink-0 rounded-full bg-theme-brand" />
        <span className="min-w-0 truncate font-mono text-[0.6rem] uppercase tracking-[0.12em] text-theme-text-muted sm:text-[0.65rem] sm:tracking-[0.15em]">
          {isCat ? "ascii · cam feed" : "haff · terminal"}
        </span>
      </div>

      <video ref={videoRef} src={src} autoPlay loop muted playsInline className="hidden" />
      <canvas ref={samplerRef} className="hidden" />

      {status === "error" ? (
        <p className="p-4 text-center font-mono text-xs text-theme-text-muted">
          vídeo não encontrado em {src}
        </p>
      ) : (
        <div ref={wrapRef} className="relative w-full cursor-pointer p-1.5 sm:p-2">
          <canvas ref={displayRef} aria-hidden className="mx-auto block max-w-full" />
          {isCat && (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-2 text-center font-mono text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-theme-brand animate-pulse sm:text-xs sm:tracking-[0.25em] [text-shadow:0_0_10px_var(--theme-brand-glow)]">
              clique na tela
            </span>
          )}
        </div>
      )}
    </div>
  );
}
