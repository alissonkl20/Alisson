"use client";

import { useEffect, useMemo, useState, type RefObject } from "react";
import { useMotionValue, useReducedMotion, useScroll } from "framer-motion";
import {
  generateTimelinePath,
  type TimelineAnchor,
} from "../lib/generateTimelinePath";
import { CAREER_FLOW, getCareerCardSide } from "../lib/careerFlow";
import {
  buildScrollKeyframes,
  getPathProgressMaps,
  interpolateScrollToPath,
  type ScrollKeyframe,
} from "../lib/mapPathProgress";

const PATH_SIZE = CAREER_FLOW.pathHeight;
const ROW_SELECTOR = ".career-narrative__row";
const ANCHOR_SELECTOR = "[data-career-anchor]";
const BRIDGE_SELECTOR = "[data-career-bridge]";
const HEADER_SELECTOR = ".career-narrative__experience-header";
const LINE_LAYER_SELECTOR = ".career-narrative__line-layer";

interface MeasuredTimeline {
  pathD: string;
  focusPathProgress: number[];
  scrollKeyframes: ScrollKeyframe[];
}

function buildPathD(anchors: TimelineAnchor[], layerWidth: number) {
  const spread = Math.min(Math.max(layerWidth * 0.13, 85), 130);
  return generateTimelinePath(anchors, PATH_SIZE, {
    extendPastLast: false,
    leadIn: 12,
    tension: 0.82,
    curveSpread: spread,
  });
}

function measureTimeline(
  trackEl: HTMLElement,
  isMobile: boolean,
): MeasuredTimeline {
  const empty: MeasuredTimeline = {
    pathD: "",
    focusPathProgress: [],
    scrollKeyframes: [],
  };

  const lineLayer = trackEl.querySelector<HTMLElement>(LINE_LAYER_SELECTOR);
  if (!lineLayer) return empty;

  const layerRect = lineLayer.getBoundingClientRect();
  const layerW = layerRect.width || 1;
  const layerH = layerRect.height || 1;

  /** Coordenadas normalizadas 0–1000 — evita distorção no SVG */
  const toAnchor = (
    el: HTMLElement,
    side?: TimelineAnchor["side"],
  ): TimelineAnchor => {
    const rect = el.getBoundingClientRect();
    return {
      x:
        ((rect.left + rect.width / 2 - layerRect.left) / layerW) * PATH_SIZE,
      y:
        ((rect.top + rect.height / 2 - layerRect.top) / layerH) * PATH_SIZE,
      side,
    };
  };

  const pathAnchors: TimelineAnchor[] = [];
  const focusAnchors: TimelineAnchor[] = [];
  let focusIndex = 0;

  for (const child of Array.from(trackEl.children)) {
    if (!(child instanceof HTMLElement)) continue;

    if (child.matches(ROW_SELECTOR)) {
      const node = child.querySelector<HTMLElement>(ANCHOR_SELECTOR);
      if (!node) continue;
      const side = getCareerCardSide(focusIndex, isMobile);
      const anchor = toAnchor(node, side);
      pathAnchors.push(anchor);
      focusAnchors.push(anchor);
      focusIndex += 1;
      continue;
    }

    if (child.matches(HEADER_SELECTOR)) {
      const bridge = child.querySelector<HTMLElement>(BRIDGE_SELECTOR);
      if (bridge) pathAnchors.push(toAnchor(bridge));
    }
  }

  const pathD = buildPathD(pathAnchors, layerW);
  const { allPathProgress, focusPathProgress } = getPathProgressMaps(
    pathD,
    pathAnchors,
    focusAnchors,
  );

  const scrollKeyframes = buildScrollKeyframes({
    trackEl,
    rowSelector: ROW_SELECTOR,
    headerSelector: HEADER_SELECTOR,
    bridgeSelector: BRIDGE_SELECTOR,
    anchorSelector: ANCHOR_SELECTOR,
    allPathProgress,
    focusPathProgress,
  });

  return { pathD, focusPathProgress, scrollKeyframes };
}

export function useCareerPathScroll(
  trackRef: RefObject<HTMLDivElement | null>,
  rowCount: number,
) {
  const [isMobile, setIsMobile] = useState(false);
  const [pathD, setPathD] = useState("");
  const [scrollKeyframes, setScrollKeyframes] = useState<ScrollKeyframe[]>([]);
  const [focusPathProgress, setFocusPathProgress] = useState<number[]>([]);
  const reducedMotion = useReducedMotion() ?? false;

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.82", "end 0.05"],
  });

  const fallbackPathD = useMemo(() => {
    if (pathD) return pathD;
    const anchors = Array.from({ length: rowCount }, (_, i) => ({
      x: PATH_SIZE / 2,
      y: ((i + 1) / (rowCount + 1)) * PATH_SIZE,
      side: getCareerCardSide(i, isMobile),
    }));
    return buildPathD(anchors, 0);
  }, [pathD, rowCount, isMobile]);

  const pathProgress = useMotionValue(0);

  useEffect(() => {
    const update = (scrollP: number) => {
      pathProgress.set(interpolateScrollToPath(scrollP, scrollKeyframes));
    };

    update(scrollYProgress.get());
    return scrollYProgress.on("change", update);
  }, [scrollYProgress, scrollKeyframes, pathProgress]);

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    let raf = 0;
    let idleHandle: number | null = null;

    const applyMeasure = () => {
      const measured = measureTimeline(trackEl, isMobile);
      setPathD(measured.pathD);
      setScrollKeyframes(measured.scrollKeyframes);
      setFocusPathProgress(measured.focusPathProgress);
    };

    /** Agrupa ResizeObserver bursts e mede fora do frame crítico. */
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (typeof window.requestIdleCallback === "function") {
          if (idleHandle != null) window.cancelIdleCallback(idleHandle);
          idleHandle = window.requestIdleCallback(applyMeasure, {
            timeout: 120,
          });
        } else {
          applyMeasure();
        }
      });
    };

    applyMeasure();
    const ro = new ResizeObserver(scheduleMeasure);
    ro.observe(trackEl);
    window.addEventListener("resize", scheduleMeasure);

    const imgs = trackEl.querySelectorAll("img");
    imgs.forEach((img) => img.addEventListener("load", scheduleMeasure));

    return () => {
      cancelAnimationFrame(raf);
      if (idleHandle != null && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleHandle);
      }
      ro.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      imgs.forEach((img) => img.removeEventListener("load", scheduleMeasure));
    };
  }, [trackRef, rowCount, isMobile]);

  return {
    scrollYProgress,
    pathProgress,
    focusPathProgress,
    pathD: pathD || fallbackPathD,
    isMobile,
    reducedMotion,
  };
}
