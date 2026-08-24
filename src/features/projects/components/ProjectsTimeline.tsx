"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { DEMO_TIMELINE_PROJECTS } from "../lib/demoData";
import { generateSPath, getPathPoints } from "../lib/generateSPath";
import { ProjectPanel } from "./ProjectPanel";
import { SShapePath } from "./SShapePath";
import { TimelineProvider, useTimelineContext } from "../context/TimelineContext";
import { TimelineControls } from "./TimelineControls";
import type { ProjectsTimelineProps, TimelineProject } from "../types";
import "./ProjectsTimeline.css";

const MOBILE_BREAK = 768;
const MAX_CANVAS_WIDTH = 920;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAK}px)`;

function subscribeMobileViewport(onChange: () => void) {
  const media = window.matchMedia(MOBILE_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getMobileViewportSnapshot() {
  return window.matchMedia(MOBILE_QUERY).matches;
}

function TimelineDesktop({
  projects,
  showControls,
}: {
  projects: TimelineProject[];
  showControls: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [layout, setLayout] = useState({
    canvasWidth: MAX_CANVAS_WIDTH,
    viewportH: 900,
    stickyH: 800,
  });
  const reducedMotion = useReducedMotion() ?? false;
  const { config, theme } = useTimelineContext();

  const count = projects.length;

  useEffect(() => {
    const update = () => {
      const canvasW = canvasRef.current?.clientWidth ?? MAX_CANVAS_WIDTH;
      const sticky = stickyRef.current;
      const styles = sticky ? getComputedStyle(sticky) : null;
      const stickyPad =
        (styles ? parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom) : 96) ||
        96;
      const stickyH = sticky
        ? Math.max(420, sticky.clientHeight - stickyPad)
        : Math.max(420, window.innerHeight - 68);

      setLayout({
        canvasWidth: Math.max(300, Math.min(MAX_CANVAS_WIDTH, canvasW)),
        viewportH: window.innerHeight,
        stickyH,
      });
    };

    update();
    const ro = new ResizeObserver(update);
    if (canvasRef.current) ro.observe(canvasRef.current);
    if (stickyRef.current) ro.observe(stickyRef.current);
    window.addEventListener("resize", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  const padTop = Math.round(Math.min(200, layout.stickyH * 0.24));
  const padBottom = Math.round(Math.min(360, layout.stickyH * 0.42));
  const itemStep = Math.max(config.timelineItemHeight, layout.stickyH * 0.82);
  const contentHeight = padTop + padBottom + Math.max(0, count - 1) * itemStep;
  const trackHeight = contentHeight + layout.stickyH * 0.9;
  const svgWidth = layout.canvasWidth;

  const pathD = useMemo(
    () =>
      generateSPath(
        svgWidth,
        contentHeight,
        count,
        config.curveShape,
        padTop,
        padBottom,
      ),
    [svgWidth, contentHeight, count, config.curveShape, padTop, padBottom],
  );

  const points = useMemo(
    () =>
      getPathPoints(
        svgWidth,
        contentHeight,
        count,
        config.curveShape,
        padTop,
        padBottom,
      ),
    [svgWidth, contentHeight, count, config.curveShape, padTop, padBottom],
  );

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 0.08", "end 0.92"],
  });

  const pathProgress = useSpring(scrollYProgress, {
    stiffness: reducedMotion ? 1000 : 85,
    damping: reducedMotion ? 100 : 30,
    restDelta: 0.001,
  });

  const progress = reducedMotion ? scrollYProgress : pathProgress;

  const canvasY = useTransform(progress, (p) => {
    if (contentHeight <= layout.stickyH) {
      return (layout.stickyH - contentHeight) / 2;
    }

    const usable = Math.max(1, contentHeight - padTop - padBottom);
    const pinY = padTop + Math.max(0, Math.min(1, p)) * usable;
    const focus = layout.stickyH * 0.34;
    const raw = focus - pinY;
    const minT = layout.stickyH - contentHeight;
    return Math.max(minT, Math.min(0, raw));
  });

  useMotionValueEvent(progress, "change", (p) => {
    const idx = Math.round(p * Math.max(0, count - 1));
    setActiveIndex(Math.min(count - 1, Math.max(0, idx)));
  });

  const panelWidth = Math.min(config.panelWidth, svgWidth * 0.42);

  return (
    <section id="projects" className="timeline-section">
      <header className="timeline-header">
        <p className="section-eyebrow">Portfolio</p>
        <h2 className="timeline-title section-title text-theme-title">Projects</h2>
        {showControls && <TimelineControls />}
      </header>

      <div ref={trackRef} className="timeline-track" style={{ height: trackHeight }}>
        <div ref={stickyRef} className="timeline-sticky">
          <motion.div
            ref={canvasRef}
            className="timeline-canvas"
            style={{ height: contentHeight, y: canvasY }}
          >
            <div className="timeline-svg-wrap" style={{ height: contentHeight }}>
              <SShapePath
                pathD={pathD}
                theme={theme}
                glowIntensity={config.glowIntensity}
                progress={progress}
                reducedMotion={reducedMotion}
              />
            </div>

            {projects.map((project, i) => {
              const pt = points[i];
              if (!pt) return null;

              return (
                <div
                  key={project.id}
                  className={`timeline-milestone${
                    i === count - 1 ? " timeline-milestone--last" : ""
                  }`}
                  style={{ top: pt.y }}
                >
                  <ProjectPanel
                    project={project}
                    side={pt.side}
                    active={activeIndex === i}
                    panelWidth={panelWidth}
                    reducedMotion={reducedMotion}
                    parallaxY={0}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TimelineMobile({
  projects,
  showControls,
}: {
  projects: TimelineProject[];
  showControls: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion() ?? false;
  const { config } = useTimelineContext();

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLDivElement[];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number(entry.target.getAttribute("data-index"));
          if (!Number.isNaN(idx)) setActiveIndex(idx);
        });
      },
      { threshold: 0.45, rootMargin: "-12% 0px -12% 0px" },
    );
    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [projects.length]);

  return (
    <section id="projects" className="timeline-section">
      <header className="timeline-header">
        <p className="section-eyebrow">Portfolio</p>
        <h2 className="timeline-title section-title text-theme-title">Projects</h2>
        {showControls && <TimelineControls />}
      </header>

      <div className="timeline-mobile timeline-mobile--visible">
        {projects.map((project, i) => (
          <div
            key={project.id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            data-index={i}
            className="timeline-mobile-item"
          >
            <ProjectPanel
              project={project}
              side="left"
              active={activeIndex === i}
              panelWidth={Math.min(config.panelWidth, 420)}
              reducedMotion={reducedMotion}
              parallaxY={0}
              animateFromSide={false}
            />
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineRouter({
  projects,
  showControls,
}: {
  projects: TimelineProject[];
  showControls: boolean;
}) {
  const isMobile = useSyncExternalStore(
    subscribeMobileViewport,
    getMobileViewportSnapshot,
    () => false,
  );

  if (isMobile) {
    return <TimelineMobile projects={projects} showControls={showControls} />;
  }

  return <TimelineDesktop projects={projects} showControls={showControls} />;
}

export function ProjectsTimeline({
  projects,
  demo = true,
  glowTheme = "brand",
  glowIntensity = 72,
  pinStyle = "glass-orb",
  curveShape = 0.85,
  timelineItemHeight = 620,
  panelWidth = 380,
  pinSize = 22,
  showControls = true,
}: ProjectsTimelineProps) {
  const items = projects ?? DEMO_TIMELINE_PROJECTS;

  return (
    <TimelineProvider
      initial={{
        glowTheme,
        glowIntensity,
        pinStyle,
        curveShape,
        timelineItemHeight,
        panelWidth,
        pinSize,
        demo,
      }}
    >
      <TimelineRouter
        projects={items}
        showControls={showControls && demo}
      />
    </TimelineProvider>
  );
}
