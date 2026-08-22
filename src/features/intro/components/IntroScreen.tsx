"use client";

import dynamic from "next/dynamic";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { motion } from "framer-motion";
import { INTRO_EXIT_MS, INTRO_HOLD_MS, INTRO_TEXT } from "../config";
import "./IntroScreen.css";

const ParticleTextEffect = dynamic(
  () => import("./ParticleTextEffect").then((m) => m.ParticleTextEffect),
  {
    ssr: false,
    loading: () => null,
  },
);

interface IntroScreenProps {
  onComplete: () => void;
}

type Phase = "animating" | "hold" | "exit" | "done";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function IntroScreen({ onComplete }: IntroScreenProps) {
  const [phase, setPhase] = useState<Phase>("animating");
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );

  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginHold = useCallback(() => {
    setPhase((prev) => (prev === "animating" ? "hold" : prev));
    progressFillRef.current?.style.setProperty("transform", "scaleX(1)");
    progressBarRef.current?.setAttribute("aria-valuenow", "100");
  }, []);

  useEffect(() => {
    if (phase !== "hold") return;
    holdTimerRef.current = setTimeout(() => setPhase("exit"), INTRO_HOLD_MS);
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    };
  }, [phase]);

  useEffect(() => {
    if (!reducedMotion || phase !== "animating") return;
    const timer = setTimeout(() => onComplete(), 150);
    return () => clearTimeout(timer);
  }, [reducedMotion, phase, onComplete]);

  useEffect(() => {
    document.body.classList.add("intro-active");
    return () => document.body.classList.remove("intro-active");
  }, []);

  useEffect(() => {
    if (phase !== "exit") return;

    const timer = setTimeout(() => {
      setPhase("done");
      onComplete();
    }, INTRO_EXIT_MS);

    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  if (phase === "done") return null;

  const showParticles = !reducedMotion && phase !== "exit";

  return (
    <motion.div
      className="intro-screen"
      aria-live="polite"
      aria-label={`Introduction ${INTRO_TEXT}`}
      initial={{ opacity: 1, scale: 1 }}
      animate={
        phase === "exit" ? { opacity: 0, scale: 1.02 } : { opacity: 1, scale: 1 }
      }
      transition={{
        duration: INTRO_EXIT_MS / 1000,
        ease: [0.65, 0.05, 0.35, 1],
      }}
    >
      <div className="intro-stage">
        {showParticles && (
          <ParticleTextEffect
            text={INTRO_TEXT}
            onFormed={beginHold}
            className="intro-particles"
          />
        )}
      </div>

      <div
        ref={progressBarRef}
        className="intro-progress intro-progress--pulse"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={0}
        aria-label="Introduction progress"
      >
        <div ref={progressFillRef} className="intro-progress__fill" />
      </div>
    </motion.div>
  );
}
