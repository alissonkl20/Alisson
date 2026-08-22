"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { createDataFlowSceneLayout } from "../lib/dataFlowLayout";
import { DataFlowNodes } from "./DataFlowNodes";
import { DataFlowPaths } from "./DataFlowPaths";
import { useDataFlowTheme } from "../context/DataFlowThemeProvider";

const DataFlowParticles = dynamic(
  () => import("./DataFlowParticles").then((m) => m.DataFlowParticles),
  { ssr: false },
);

interface DataFlowSceneProps {
  active: boolean;
}

/** Cena Three.js + nós — layout único centralizado para paths, partículas e ícones */
export function DataFlowScene({ active }: DataFlowSceneProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { config } = useDataFlowTheme();
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const update = () => {
      setSize({ width: el.clientWidth, height: el.clientHeight });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const layout = useMemo(
    () => createDataFlowSceneLayout(size.width, size.height, config.nodeSize),
    [size.width, size.height, config.nodeSize],
  );

  return (
    <div className="data-flow-stage">
      <div ref={canvasRef} className="data-flow-stage__canvas">
        {layout && (
          <div className="data-flow-stage__viewport">
            <DataFlowPaths layout={layout} active={active} />
            <DataFlowParticles
              layout={layout}
              active={active}
              reducedMotion={reducedMotion}
            />
            <DataFlowNodes
              layout={layout}
              active={active}
              reducedMotion={reducedMotion}
            />
          </div>
        )}
      </div>
    </div>
  );
}
