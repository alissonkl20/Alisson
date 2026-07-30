"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { GitHubIcon } from "@/components/ui/SocialIcons";
import { projects } from "@/lib/data";
import { SectionTitle } from "@/components/ui/NeonText";
import { NeonButton } from "@/components/ui/NeonButton";

export function Projects() {
  return (
    <section id="projects" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionTitle subtitle="04 — Projetos">Projetos</SectionTitle>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => {
            const Icon = project.icon;
            return (
              <motion.article
                key={project.id}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <div
                  className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${project.gradient}`}
                >
                  <Icon
                    size={48}
                    className="text-white/20 transition-all duration-500 group-hover:scale-110 group-hover:text-white/40"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(0,212,255,0.1), transparent 70%)",
                    }}
                  />
                </div>

                <div className="p-6">
                  <h3 className="mb-2 text-lg font-semibold text-white transition-colors group-hover:text-neon-blue">
                    {project.title}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-white/40">
                    {project.description}
                  </p>

                  <div className="mb-5 flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-white/40"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <NeonButton
                      href={project.github}
                      variant="ghost"
                      size="sm"
                    >
                      <GitHubIcon size={14} />
                      GitHub
                    </NeonButton>
                    <NeonButton
                      href={project.deploy}
                      variant="ghost"
                      size="sm"
                    >
                      <ExternalLink size={14} />
                      Deploy
                    </NeonButton>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
