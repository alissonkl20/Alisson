"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { DataFlowScene } from "./DataFlowScene";
import { DataFlowThemeProvider } from "../context/DataFlowThemeProvider";
import "./ExperienceSection.css";

const FLOW_REVEAL = {
  /** scrollYProgress da seção quando começa / termina o reveal */
  start: 0.14,
  end: 0.42,
  /** progresso mínimo para ativar partículas e nós */
  activeAt: 0.2,
} as const;

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [flowActive, setFlowActive] = useState(false);
  const [viewportH, setViewportH] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 900,
  );
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const onResize = () => setViewportH(window.innerHeight);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });

  const flowOpacity = useTransform(
    scrollYProgress,
    [FLOW_REVEAL.start, FLOW_REVEAL.end],
    [0, 1],
  );

  const flowScale = useTransform(
    scrollYProgress,
    [FLOW_REVEAL.start, FLOW_REVEAL.end],
    [0.94, 1],
  );

  const flowY = useTransform(
    scrollYProgress,
    [FLOW_REVEAL.start, FLOW_REVEAL.end],
    [28, 0],
  );

  useEffect(() => {
    if (reducedMotion) return;

    const sync = (p: number) => {
      setFlowActive(p >= FLOW_REVEAL.activeAt);
    };

    sync(scrollYProgress.get());
    return scrollYProgress.on("change", sync);
  }, [scrollYProgress, reducedMotion]);

  const isFlowActive = reducedMotion || flowActive;
  const trackMinHeight = `calc(${viewportH}px * 1.35)`;

  return (
    <DataFlowThemeProvider>
      <section
        id="data-flow"
        ref={sectionRef}
        className="experience-section experience-section--flow"
        style={{ minHeight: trackMinHeight, background: "var(--theme-bg)" }}
        aria-label="Data Flow"
      >
        <header className="experience-header experience-header--flow">
          <p className="section-eyebrow">Imersão</p>
          <h2 className="experience-title section-title">Data Flow</h2>
        </header>

        <div className="experience-track experience-track--flow">
          <motion.div
            className="experience-flow-sticky"
            style={
              reducedMotion
                ? undefined
                : {
                    opacity: flowOpacity,
                    scale: flowScale,
                    y: flowY,
                  }
            }
          >
            <DataFlowScene active={isFlowActive} />
          </motion.div>
        </div>
      </section>
    </DataFlowThemeProvider>
  );
}
