"use client";

import { useEffect, useRef } from "react";
import {
  INTRO_BG,
  INTRO_BG_RGB,
  INTRO_PARTICLE_RGB,
  INTRO_PARTICLE_RGB_LIGHT,
  INTRO_FORMED_RATIO,
  INTRO_LETTER_SPACING,
  INTRO_MAX_DPR,
  INTRO_PARTICLE_SPEED_MAX,
  INTRO_PARTICLE_SPEED_MIN,
  INTRO_SETTLE_FRAMES,
  INTRO_TRAIL_ALPHA,
} from "../config";

interface Vector2D {
  x: number;
  y: number;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Amarelo da marca com leve gradiente horizontal. */
function particleColorAt(x: number, width: number): Rgb {
  const t = Math.max(0, Math.min(1, x / Math.max(1, width)));
  return {
    r: Math.round(
      INTRO_PARTICLE_RGB.r +
        (INTRO_PARTICLE_RGB_LIGHT.r - INTRO_PARTICLE_RGB.r) * t,
    ),
    g: Math.round(
      INTRO_PARTICLE_RGB.g +
        (INTRO_PARTICLE_RGB_LIGHT.g - INTRO_PARTICLE_RGB.g) * t,
    ),
    b: Math.round(
      INTRO_PARTICLE_RGB.b +
        (INTRO_PARTICLE_RGB_LIGHT.b - INTRO_PARTICLE_RGB.b) * t,
    ),
  };
}

class Particle {
  pos: Vector2D = { x: 0, y: 0 };
  vel: Vector2D = { x: 0, y: 0 };
  acc: Vector2D = { x: 0, y: 0 };
  target: Vector2D = { x: 0, y: 0 };

  closeEnoughTarget = 100;
  maxSpeed = 1;
  maxForce = 0.1;
  colorBlendRate = 0.01;

  startColor: Rgb = { r: INTRO_BG_RGB.r, g: INTRO_BG_RGB.g, b: INTRO_BG_RGB.b };
  targetColor: Rgb = { ...INTRO_PARTICLE_RGB };
  colorWeight = 0;

  move() {
    let proximityMult = 1;
    const dx = this.pos.x - this.target.x;
    const dy = this.pos.y - this.target.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget;
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    };

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y,
    );
    if (magnitude > 0) {
      towardsTarget.x =
        (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult;
      towardsTarget.y =
        (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult;
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    };

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y);
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce;
      steer.y = (steer.y / steerMagnitude) * this.maxForce;
    }

    this.acc.x += steer.x;
    this.acc.y += steer.y;

    this.vel.x += this.acc.x;
    this.vel.y += this.acc.y;
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.colorWeight < 1) {
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1);
    }

    const r = Math.round(
      this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
    );
    const g = Math.round(
      this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
    );
    const b = Math.round(
      this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
    );

    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(this.pos.x, this.pos.y, 2, 2);
  }

  get isSettled(): boolean {
    const dx = this.pos.x - this.target.x;
    const dy = this.pos.y - this.target.y;
    return dx * dx + dy * dy < this.closeEnoughTarget;
  }
}

async function waitForFonts(): Promise<void> {
  try {
    await document.fonts.load('700 120px "Space Grotesk"');
    await document.fonts.ready;
  } catch {
    /* fallback para fonte do sistema */
  }
}

function randomSpawnPos(width: number, height: number): Vector2D {
  const cx = width / 2;
  const cy = height / 2;
  const mag = (width + height) / 2;
  const direction = { x: Math.random() * 1000 - cx, y: Math.random() * 500 - cy };
  const magnitude = Math.sqrt(
    direction.x * direction.x + direction.y * direction.y,
  );
  if (magnitude > 0) {
    direction.x = (direction.x / magnitude) * mag;
    direction.y = (direction.y / magnitude) * mag;
  }
  return { x: cx + direction.x, y: cy + direction.y };
}

/** Amostra os pixels do texto e distribui alvos para as partículas. */
function assignTextTargets(
  text: string,
  particles: Particle[],
  width: number,
  height: number,
): void {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const offCtx = off.getContext("2d");
  if (!offCtx) return;

  if ("letterSpacing" in offCtx) {
    (
      offCtx as CanvasRenderingContext2D & { letterSpacing: string }
    ).letterSpacing = INTRO_LETTER_SPACING;
  }

  const fontFamily = '"Space Grotesk", Inter, system-ui, sans-serif';
  let fontSize = height * 0.5;
  const maxW = width * 0.92;

  while (fontSize > 24) {
    offCtx.font = `700 ${fontSize}px ${fontFamily}`;
    if (offCtx.measureText(text).width <= maxW) break;
    fontSize -= 2;
  }

  offCtx.fillStyle = "#ffffff";
  offCtx.font = `700 ${fontSize}px ${fontFamily}`;
  offCtx.textAlign = "center";
  offCtx.textBaseline = "middle";
  offCtx.fillText(text, width / 2, height / 2);

  const pixels = offCtx.getImageData(0, 0, width, height).data;

  // Passo adaptativo: mantém a contagem de partículas estável em qualquer tela.
  const pixelSteps = Math.max(4, Math.round(width / 220));

  const coordIndexes: number[] = [];
  for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
    coordIndexes.push(i);
  }

  // Embaralha para o preenchimento ser fluido (sem varredura linear).
  for (let i = coordIndexes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coordIndexes[i], coordIndexes[j]] = [coordIndexes[j], coordIndexes[i]];
  }

  let particleIndex = 0;

  for (const coordIndex of coordIndexes) {
    if (pixels[coordIndex + 3] <= 0) continue;

    const x = (coordIndex / 4) % width;
    const y = Math.floor(coordIndex / 4 / width);

    let particle: Particle;
    if (particleIndex < particles.length) {
      particle = particles[particleIndex];
      particleIndex++;
    } else {
      particle = new Particle();
      const spawn = randomSpawnPos(width, height);
      particle.pos.x = spawn.x;
      particle.pos.y = spawn.y;
      particle.maxSpeed =
        Math.random() * (INTRO_PARTICLE_SPEED_MAX - INTRO_PARTICLE_SPEED_MIN) +
        INTRO_PARTICLE_SPEED_MIN;
      particle.maxForce = particle.maxSpeed * 0.05;
      particle.colorBlendRate = Math.random() * 0.0275 + 0.0025;
      particles.push(particle);
    }

    particle.startColor = {
      r:
        particle.startColor.r +
        (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
      g:
        particle.startColor.g +
        (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
      b:
        particle.startColor.b +
        (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
    };
    particle.targetColor = particleColorAt(x, width);
    particle.colorWeight = 0;
    particle.target.x = x;
    particle.target.y = y;
  }

  // Partículas excedentes (resize para tela menor) são descartadas.
  particles.length = particleIndex;
}

interface ParticleTextEffectProps {
  text: string;
  /** Disparado uma única vez quando o texto está formado e estável. */
  onFormed?: () => void;
  className?: string;
}

export function ParticleTextEffect({
  text,
  onFormed,
  className,
}: ParticleTextEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onFormedRef = useRef(onFormed);

  useEffect(() => {
    onFormedRef.current = onFormed;
  }, [onFormed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    if (!canvas || !stage) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: Particle[] = [];
    let raf = 0;
    let cancelled = false;
    let formedFired = false;
    let settleFrames = 0;

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, INTRO_MAX_DPR);
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (width <= 0 || height <= 0) return false;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = INTRO_BG;
      ctx.fillRect(0, 0, width, height);
      return true;
    };

    const rebuild = () => {
      if (!applySize()) return;
      assignTextTargets(text, particles, stage.clientWidth, stage.clientHeight);
    };

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!cancelled) rebuild();
      }, 200);
    });

    const tick = () => {
      if (cancelled) return;
      raf = requestAnimationFrame(tick);

      if (document.hidden) return;

      const width = stage.clientWidth;
      const height = stage.clientHeight;

      // Rastro de movimento — mesma cor preta do card / tela de intro.
      ctx.fillStyle = `rgba(${INTRO_BG_RGB.r}, ${INTRO_BG_RGB.g}, ${INTRO_BG_RGB.b}, ${INTRO_TRAIL_ALPHA})`;
      ctx.fillRect(0, 0, width, height);

      let settled = 0;
      for (const particle of particles) {
        particle.move();
        particle.draw(ctx);
        if (particle.isSettled) settled++;
      }

      if (!formedFired && particles.length > 0) {
        if (settled / particles.length >= INTRO_FORMED_RATIO) {
          formedFired = true;
          onFormedRef.current?.();
        }
      } else if (formedFired) {
        // Deixa os rastros assentarem e congela o loop — zero custo no hold.
        settleFrames++;
        if (settleFrames >= INTRO_SETTLE_FRAMES) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      }
    };

    // Montagem inicial: espera as fontes para amostrar o glifo correto.
    rebuild();
    void waitForFonts().then(() => {
      if (!cancelled) rebuild();
    });
    ro.observe(stage);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
    };
  }, [text]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
