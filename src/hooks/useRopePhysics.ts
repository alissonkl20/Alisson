"use client";

import { useCallback, useEffect, useRef } from "react";

interface RopeState {
  anchorX: number;
  anchorY: number;
  endX: number;
  endY: number;
  velX: number;
  velY: number;
  pullOffset: number;
  isDragging: boolean;
}

const GRAVITY = 0.72;
const DAMPING = 0.958;
const SPRING = 0.2;
const ROPE_LENGTH = 250;
const PULL_THRESHOLD = 86;
const DRAG_LERP = 0.48;
const MAX_PULL = 138;

export function useRopePhysics(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  onPullComplete: () => void,
  enabled = true,
) {
  const stateRef = useRef<RopeState>({
    anchorX: 0,
    anchorY: 0,
    endX: 0,
    endY: 0,
    velX: 0,
    velY: 0,
    pullOffset: 0,
    isDragging: false,
  });
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);
  const mouseRef = useRef({ x: 0, y: 0, down: false });

  const drawRope = useCallback(
    (ctx: CanvasRenderingContext2D, w: number, h: number) => {
      const s = stateRef.current;
      if (s.anchorX === 0) {
        s.anchorX = w / 2;
        s.anchorY = -20;
        s.endX = w / 2;
        s.endY = ROPE_LENGTH;
      }

      ctx.clearRect(0, 0, w, h);

      const segments = 24;
      const points: { x: number; y: number }[] = [];

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const sway = Math.sin(Date.now() * 0.0044 + t * 4.4) * (5.8 + s.pullOffset * 0.018);
        const x = s.anchorX + (s.endX - s.anchorX) * t + sway * t * (1 - t) * 3.2;
        const baseY = s.anchorY + (s.endY - s.anchorY) * t;
        const y = baseY + s.pullOffset * t * t;
        points.push({ x, y });
      }

      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const cpx = (prev.x + curr.x) / 2;
        const cpy = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, cpx, cpy);
      }
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(255,255,255,0.98)";
      ctx.lineWidth = 2.2;
      ctx.shadowColor = "rgba(0,229,255,0.8)";
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      const handle = points[points.length - 1];
      ctx.beginPath();
      ctx.ellipse(handle.x, handle.y + 18, 16, 24, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(245,250,255,0.98)";
      ctx.shadowColor = "rgba(0,229,255,0.9)";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.ellipse(handle.x, handle.y + 18, 9, 15, 0, Math.PI, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0.35)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      if (s.pullOffset >= PULL_THRESHOLD && !completedRef.current) {
        completedRef.current = true;
        onPullComplete();
      }
    },
    [onPullComplete],
  );

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const s = stateRef.current;
    const w = canvas.width / (window.devicePixelRatio || 1);

    if (s.isDragging) {
      s.endX += (mouseRef.current.x - s.endX) * DRAG_LERP;
      s.endY += (mouseRef.current.y - s.endY) * DRAG_LERP;
      s.pullOffset = Math.min(MAX_PULL, Math.max(0, s.endY - ROPE_LENGTH + 36));
      s.velX = 0;
      s.velY = 0;
    } else {
      s.velY += GRAVITY;
      s.endY += s.velY;
      s.velX *= DAMPING;
      s.velY *= DAMPING;

      const dx = s.endX - s.anchorX;
      const dy = s.endY - s.anchorY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const targetDist = ROPE_LENGTH + s.pullOffset;

      if (dist > targetDist) {
        s.endX -= (dx / dist) * (dist - targetDist) * SPRING;
        s.endY -= (dy / dist) * (dist - targetDist) * SPRING;
      }

      s.endX += s.velX;
      s.endY += s.velY;

      if (s.pullOffset > 0 && !s.isDragging) {
        s.pullOffset *= 0.9;
        if (s.pullOffset < 0.8) s.pullOffset = 0;
      }

      if (s.endY < ROPE_LENGTH * 0.28) {
        s.endY = ROPE_LENGTH * 0.28;
        s.velY = Math.abs(s.velY) * 0.24;
      }
    }

    drawRope(ctx, w, window.innerHeight);
    rafRef.current = requestAnimationFrame(tick);
  }, [canvasRef, drawRope]);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const s = stateRef.current;
    s.endY = -40;
    s.velY = 0;

    setTimeout(() => {
      s.velY = 4.2;
    }, 70);

    rafRef.current = requestAnimationFrame(tick);

    const onDown = (e: MouseEvent | TouchEvent) => {
      const point = "touches" in e ? e.touches[0] : e;
      mouseRef.current = { x: point.clientX, y: point.clientY, down: true };
      s.isDragging = true;
      canvas.style.cursor = "grabbing";
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      const point = "touches" in e ? e.touches[0] : e;
      mouseRef.current.x = point.clientX;
      mouseRef.current.y = point.clientY;

      if (!s.isDragging) {
        const handleY = s.endY + 18;
        const dist = Math.hypot(point.clientX - s.endX, point.clientY - handleY);
        canvas.style.cursor = dist < 42 ? "grab" : "default";

        if (dist < 62) {
          s.velX += (point.clientX - s.endX) * 0.0043;
        }
      }
    };

    const onUp = () => {
      s.isDragging = false;
      mouseRef.current.down = false;
      canvas.style.cursor = "default";
      s.velY = s.pullOffset * 0.11;
    };

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseup", onUp);
    canvas.addEventListener("mouseleave", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: true });
    canvas.addEventListener("touchmove", onMove, { passive: true });
    canvas.addEventListener("touchend", onUp);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onDown);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseup", onUp);
      canvas.removeEventListener("mouseleave", onUp);
      canvas.removeEventListener("touchstart", onDown);
      canvas.removeEventListener("touchmove", onMove);
      canvas.removeEventListener("touchend", onUp);
    };
  }, [canvasRef, tick, enabled]);

  return stateRef;
}
