"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Database, Code, Server, Wrench } from "lucide-react";
import { profile, techCategories } from "@/lib/data";
import { SectionTitle } from "@/components/ui/NeonText";
import { GlowCard } from "@/components/ui/GlowCard";

// Ícones com cores neon fortes
const categoryIcons: Record<string, React.ReactNode> = {
  "Back-end": <Server className="h-5 w-5 text-neon-blue" strokeWidth={1.8} />,
  "Front-end": <Code className="h-5 w-5 text-neon-purple" strokeWidth={1.8} />,
  "Banco de Dados": <Database className="h-5 w-5 text-neon-green" strokeWidth={1.8} />,
  Ferramentas: <Wrench className="h-5 w-5 text-neon-pink" strokeWidth={1.8} />,
};

export function About() {
  return (
    <section id="about" className="relative px-4 py-20 sm:px-6 sm:py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionTitle subtitle="01 — About">About Me</SectionTitle>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            className="relative mx-auto aspect-square w-full max-w-[280px] sm:max-w-md"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group relative h-full w-full">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 blur-2xl transition-all duration-500 group-hover:blur-3xl" />
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
                <Image
                  src="/foto.png"
                  alt={profile.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </div>
          </motion.div>

          {/* Texto e tecnologias */}
          <div>
            <motion.p
              className="mb-8 text-lg leading-relaxed text-white/80 md:text-xl"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {profile.bio}
            </motion.p>

            {/* Card único – sem animação de entrada e sem efeitos hover */}
            <div className="mt-10">
              <GlowCard tilt={false} className="p-6 md:p-8">
                <div className="grid gap-6 sm:grid-cols-2">
                  {techCategories.map((cat) => {
                    const icon = categoryIcons[cat.title] || null;

                    return (
                      <div
                        key={cat.title}
                        className={`rounded-xl border p-5`}
                      >
                        <div className="mb-3 flex items-center gap-2.5">
                          {icon}
                          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/90">
                            {cat.title}
                          </h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {cat.items.map((item) => (
                            <span
                              key={item}
                              className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1 text-xs font-medium text-white/80"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlowCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}