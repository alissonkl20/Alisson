"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LOADING_STEPS } from "@/lib/constants";
import { Particles } from "@/components/effects/Particles";

interface LoadingScreenProps {
  onComplete: () => void;
}

const INTRO_LINES = [
  "alisson@portfolio:~$ whoami",
  "Alisson, desenvolvedor front-end e criador de experiências digitais.",
  "Preparando a entrada...",
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [finished, setFinished] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(true), 320);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible || finished) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const currentIndex = LOADING_STEPS.indexOf(prev as (typeof LOADING_STEPS)[number]);
        const nextIndex = currentIndex + 1;
        if (nextIndex >= LOADING_STEPS.length) {
          clearInterval(interval);
          setFinished(true);
          setTimeout(onComplete, 500);
          return 100;
        }
        return LOADING_STEPS[nextIndex];
      });
    }, 150);

    return () => clearInterval(interval);
  }, [visible, finished, onComplete]);

  useEffect(() => {
    if (!visible || finished) return;

    const currentLine = INTRO_LINES[lineIndex] ?? "";

    if (typedText.length < currentLine.length) {
      const timeout = setTimeout(() => {
        setTypedText(currentLine.slice(0, typedText.length + 1));
      }, 40);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      if (lineIndex >= INTRO_LINES.length - 1) {
        setTypedText(currentLine);
        return;
      }

      setTypedText("");
      setLineIndex((prev) => prev + 1);
    }, 700);

    return () => clearTimeout(timeout);
  }, [lineIndex, typedText, visible, finished]);

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          style={{
            backgroundColor: "var(--background)",
            backgroundImage:
              "radial-gradient(circle at 50% 20%, rgba(248, 248, 248, 0.16), transparent 34%)",
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
        >
          <Particles count={14} />

          <AnimatePresence>
            {visible && (
              <motion.div
                className="relative z-10 flex flex-col items-center gap-7 px-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <div className="loader" aria-hidden="true" />

                <motion.p
                  className="font-mono text-[11px] uppercase tracking-[0.45em] text-white/70 md:text-sm"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  inicializando
                </motion.p>

                <div className="terminal-window w-full max-w-xl">
                  <div className="terminal-bar">
                    <span className="terminal-dot" />
                    <span className="terminal-dot" />
                    <span className="terminal-dot" />
                  </div>
                  <div className="terminal-body">
                    <p className="terminal-line">
                      <span className="terminal-prompt">{typedText}</span>
                      <span className="terminal-cursor" />
                    </p>
                  </div>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/45 md:text-xs">
                  {progress}%
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
