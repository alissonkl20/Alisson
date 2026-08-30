import type { ExperienceItem } from "@/features/experience/types";

/** Ordem 01–03 — cada item liga a um marco do card de jornada da Premium Timeline */
export const experienceData: ExperienceItem[] = [
  {
    id: 1,
    company: "Rauzee",
    role: "Full Stack Developer",
    period: "Mar 2026 — Jul 2026",
    milestoneYear: "2026",
    description:
      "I worked full-stack on tools for productivity and day-to-day operations. I streamlined credit-analysis workflows for banking correspondents — faster approvals, tighter control, fewer mistakes — using Laravel, Flask, React, Vue.js, Next.js, and AWS.",
    technologies: [
      "Laravel",
      "Flask",
      "PHP",
      "Python",
      "AWS",
      "Next.js",
      "React",
      "Vue.js",
      "Git",
      "REST APIs",
    ],
  },
  {
    id: 2,
    company: "Self-employed",
    role: "Freelancer",
    period: "Jun 2025 — Sep 2025",
    milestoneYear: "2025",
    description:
      "I improved a WhatsApp SaaS: backend stability, front-end UX, and a few focused stress tests to catch bottlenecks before they hit production.",
    technologies: ["Tailwind CSS", "React.js", "UI/UX", "Testing"],
  },
  {
    id: 3,
    company: "Freelance",
    role: "Web Developer",
    period: "May 2024 — Nov 2024",
    milestoneYear: "2024",
    description:
      "I worked full-stack on WhaticketSaaS. I built an audio transcription feature from start to finish — REST APIs in Node.js, Express, and TypeScript, and a responsive React UI on PostgreSQL.",
    technologies: ["TypeScript", "Node.js", "React", "PostgreSQL"],
  },
];
