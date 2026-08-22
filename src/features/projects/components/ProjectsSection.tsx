"use client";

import { ProjectsTimeline } from "./ProjectsTimeline";
import { timelineProjects } from "@/shared/config/data";

export function ProjectsSection() {
  return (
    <ProjectsTimeline
      projects={timelineProjects}
      demo={false}
      glowTheme="brand"
      glowIntensity={78}
      pinStyle="glass-orb"
      curveShape={0.88}
      timelineItemHeight={760}
      panelWidth={360}
      pinSize={24}
      showControls={false}
    />
  );
}
