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
      "Worked as a full stack developer on systems focused on productivity and operational efficiency. Contributed to the optimization of credit analysis workflows for banking correspondents, improving agility, control, and accuracy across approval processes using Laravel, Flask, React, Vue.js, Next.js, and AWS.",
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
      "Contributed to the improvement of a WhatsApp-based SaaS platform by improving system stability, performance, and user experience. Worked on back-end fixes, front-end UI/UX refinements, and basic stress testing to identify bottlenecks and strengthen reliability.",
    technologies: ["Tailwind CSS", "React.js", "UI/UX", "Testing"],
  },
  {
    id: 3,
    company: "Freelance",
    role: "Web Developer",
    period: "May 2024 — Nov 2024",
    milestoneYear: "2024",
    description:
      "Worked as a Full Stack Developer on the WhaticketSaaS project, delivering high-quality solutions and technological innovation. Built an end-to-end audio transcription module, implemented REST APIs with Node.js, Express and TypeScript, and developed a responsive React interface integrated with PostgreSQL.",
    technologies: ["TypeScript", "Node.js", "React", "PostgreSQL"],
  },
];
