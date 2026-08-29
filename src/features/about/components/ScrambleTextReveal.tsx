"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import {
  getLetterReveal,
  useScrambleTextReveal,
} from "../hooks/useScrambleTextReveal";
import type { ScrambleTextRevealProps } from "../types/scrambleTextReveal.types";
import { DEFAULT_SCRAMBLE_TEXT_REVEAL_PROPS } from "../types/scrambleTextReveal.types";
import { ProfileActions } from "./ProfileActions";
import { LiquidGlassCanvas } from "./LiquidGlassCanvas";
import "./ScrambleTextReveal.css";

function useCompactViewport() {
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 640px)");
    const short = window.matchMedia("(max-height: 540px)");
    const update = () => setCompact(narrow.matches || short.matches);
    update();
    narrow.addEventListener("change", update);
    short.addEventListener("change", update);
    return () => {
      narrow.removeEventListener("change", update);
      short.removeEventListener("change", update);
    };
  }, []);

  return compact;
}

/** Texto que se monta letra a letra conforme o scroll (sticky). */
export function ScrambleTextReveal({
  text,
  scrollDistance = DEFAULT_SCRAMBLE_TEXT_REVEAL_PROPS.scrollDistance,
  radius = DEFAULT_SCRAMBLE_TEXT_REVEAL_PROPS.radius,
  rotation = DEFAULT_SCRAMBLE_TEXT_REVEAL_PROPS.rotation,
  viewportHeight = DEFAULT_SCRAMBLE_TEXT_REVEAL_PROPS.viewportHeight,
  title,
  glassSrc,
  className = "",
}: ScrambleTextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const hintLineRef = useRef<HTMLSpanElement>(null);
  const compact = useCompactViewport();
  const { letters, scrollProgress, reducedMotion, progressRef, onProgressRef } =
    useScrambleTextReveal(containerRef, text);

  const responsiveRadius = compact ? radius * 0.55 : radius;
  const responsiveRotation = compact ? rotation * 0.5 : rotation;
  const hintScale = reducedMotion ? 0 : Math.max(0, 1 - scrollProgress / 0.4);
  const actionsVisible = reducedMotion || scrollProgress >= 0.55;

  useEffect(() => {
    const paint = (scrollP: number) => {
      const nodes = textRef.current?.children;
      if (!nodes) return;

      const total = letters.length;
      for (let index = 0; index < total; index++) {
        const el = nodes[index] as HTMLElement | undefined;
        if (!el) continue;

        const char = letters[index]!;
        const isSpace = char === " ";
        const reveal = reducedMotion
          ? 1
          : getLetterReveal(scrollP, index, total);
        const angle = (index / Math.max(total - 1, 1)) * Math.PI * 2;
        const scatter = 1 - reveal;
        const x = Math.cos(angle) * responsiveRadius * scatter;
        const y = Math.sin(angle) * responsiveRadius * scatter * 0.65;
        const rotate =
          (index % 2 === 0 ? 1 : -1) * responsiveRotation * scatter;

        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg)`;
        el.style.opacity = String(isSpace ? 1 : 0.35 + reveal * 0.65);
      }

      if (hintLineRef.current && !reducedMotion) {
        const scale = Math.max(0, 1 - scrollP / 0.4);
        hintLineRef.current.style.transform = `scaleX(${scale})`;
      }
    };

    onProgressRef.current = paint;
    paint(progressRef.current);

    return () => {
      onProgressRef.current = null;
    };
  }, [
    letters,
    onProgressRef,
    progressRef,
    reducedMotion,
    responsiveRadius,
    responsiveRotation,
  ]);

  const extraScroll = compact
    ? Math.round(scrollDistance * 0.72)
    : scrollDistance;

  return (
    <div
      ref={containerRef}
      className={`scramble-reveal ${className}`.trim()}
      style={
        {
          "--scramble-screen": String(viewportHeight),
          "--scramble-extra": String(extraScroll),
        } as CSSProperties
      }
      aria-label={text}
    >
      <div className="scramble-reveal__sticky">
        {glassSrc ? (
          <div className="scramble-reveal__glass" aria-hidden>
            <LiquidGlassCanvas
              src={glassSrc}
              fit="fill"
              priority
            />
          </div>
        ) : null}
        <div className="scramble-reveal__inner">
          {title ? (
            <h2 className="scramble-reveal__title section-title section-title--hero">
              {title}
            </h2>
          ) : null}
          <p
            ref={textRef}
            className="scramble-reveal__text section-subtitle"
            aria-hidden
          >
            {letters.map((char, index) => {
              const isSpace = char === " ";
              return (
                <span
                  key={`${index}-${char}`}
                  className={`scramble-reveal__char${isSpace ? " scramble-reveal__char--space" : ""}`}
                  aria-hidden={isSpace}
                >
                  {isSpace ? "\u00A0" : char}
                </span>
              );
            })}
          </p>

          <ProfileActions visible={actionsVisible} />
        </div>

        {!reducedMotion && (
          <div className="scramble-reveal__hint" aria-hidden>
            <span>Scroll</span>
            <span
              ref={hintLineRef}
              className="scramble-reveal__hint-line"
              style={{ transform: `scaleX(${hintScale})` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
