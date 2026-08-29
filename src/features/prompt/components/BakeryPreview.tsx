"use client";

import { useEffect, useRef, useState } from "react";
import "./BakeryPreview.css";

type BakeryPreviewProps = {
  variant: "novice" | "craft";
};

const FRAME_WIDTH = 1280;

const DEMOS = {
  novice: {
    src: "/demos/padaria-demo.html",
    url: "http://padaria-demo.com",
    title: "Padaria Demo",
  },
  craft: {
    src: "/demos/atelier-demo.html",
    url: "https://atelier-demo.com",
    title: "Atelier Demo",
  },
} as const;

function DemoFrame({ variant }: BakeryPreviewProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [frameHeight, setFrameHeight] = useState(900);
  const demo = DEMOS[variant];

  useEffect(() => {
    const wrap = viewportRef.current;
    if (!wrap) return;

    const resize = () => {
      const next = wrap.clientWidth / FRAME_WIDTH;
      setScale(Math.max(0.2, next));
      setFrameHeight(Math.max(640, wrap.clientHeight / Math.max(0.2, next)));
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={`bakery-frame bakery-frame--${variant}`}>
      <div className="bakery-frame__bar">
        <span className="bakery-frame__dots" aria-hidden>
          <i />
          <i />
          <i />
        </span>
        <span className="bakery-frame__url">{demo.url}</span>
      </div>
      <div ref={viewportRef} className="bakery-frame__viewport">
        <iframe
          className="bakery-frame__site"
          src={demo.src}
          title={demo.title}
          loading="eager"
          tabIndex={0}
          style={{
            width: FRAME_WIDTH,
            height: frameHeight,
            transform: `scale(${scale})`,
          }}
        />
      </div>
    </div>
  );
}

export function BakeryPreview({ variant }: BakeryPreviewProps) {
  return <DemoFrame variant={variant} />;
}
