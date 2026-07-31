"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { profile, aboutStats, techCategories } from "@/lib/data";
import { SectionTitle } from "@/components/ui/NeonText";
import { GlowCard } from "@/components/ui/GlowCard";

export function About() {
  return (
    <section id="about" className="relative px-6 py-32 md:py-40">
      <div className="mx-auto max-w-6xl">
        <SectionTitle subtitle="01 — About">About Me</SectionTitle>

        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            className="relative mx-auto aspect-square w-full max-w-md"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group relative h-full w-full">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 blur-2xl transition-all duration-500 group-hover:blur-3xl" />
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] transition-transform duration-300 hover:scale-[1.01]">
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

            <div className="mb-10 grid grid-cols-2 gap-4">
              {aboutStats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <GlowCard tilt={false} className="text-center">
                    <p className="text-3xl font-bold text-neon-blue">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs text-white/40">{stat.label}</p>
                  </GlowCard>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {techCategories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                >
                  <GlowCard tilt={false}>
                    <h3 className="mb-3 text-sm font-medium text-neon-blue/80">
                      {cat.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </GlowCard>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
