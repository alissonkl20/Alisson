"use client";

import { useRef, useState, useEffect } from "react";
import { useRopePhysics } from "@/hooks/useRopePhysics";
import { NeonText } from "@/components/ui/NeonText";
import { Particles } from "@/components/effects/Particles";

interface RopeSceneProps {
  onPullComplete: () => void;
  onFadeComplete: () => void;
}

export function RopeScene({ onPullComplete, onFadeComplete }: RopeSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showRope, setShowRope] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const triggeredRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowRope(true), 420);
    return () => clearTimeout(timer);
  }, []);

  useRopePhysics(
    canvasRef,
    () => {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setFadingOut(true);
      onPullComplete();
      setTimeout(onFadeComplete, 220);
    },
    showRope,
  );

  return (
    <div
      className="fixed inset-0 z-[90] overflow-hidden"
      style={{
        backgroundColor: "#030303",
        backgroundImage:
          "radial-gradient(circle at 50% 12%, rgba(0,229,255,0.14), transparent 32%), linear-gradient(180deg, rgba(0,0,0,0.96) 0%, rgba(2,2,2,1) 100%)",
        opacity: fadingOut ? 0 : 1,
      }}
    >
      <Particles count={24} />

      <canvas
        ref={canvasRef}
        className={`absolute inset-0 z-10 touch-none ${showRope ? "opacity-100" : "opacity-0"}`}
        aria-label="Puxe a corda para iniciar"
      />

      {showRope && (
        <div className="pointer-events-none absolute bottom-[18%] left-1/2 z-20 -translate-x-1/2 -translate-y-0">
          <NeonText
            ledSign
            className="font-mono text-2xl font-semibold tracking-[0.55em] md:text-4xl"
          >
            Puxe
          </NeonText>
        </div>
      )}
    </div>
  );
}
