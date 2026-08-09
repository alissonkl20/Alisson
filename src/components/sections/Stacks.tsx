"use client";

import { motion } from "framer-motion";
import { stacks } from "@/lib/data";
import { SectionTitle } from "@/components/ui/NeonText";
import { GlowCard } from "@/components/ui/GlowCard";

function StackCard({
  stack,
  index,
}: {
  stack: (typeof stacks)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: (index % 4) * 0.08,
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ perspective: 1000 }}
    >
      <GlowCard className="h-full bg-white/5 backdrop-blur-sm border border-white/10">
        <div className="mb-4 flex items-center justify-between">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold"
            style={{
              backgroundColor: `${stack.color}15`,
              color: stack.color,
              boxShadow: `0 0 20px ${stack.color}20`,
            }}
          >
            {stack.name.slice(0, 2).toUpperCase()}
          </div>

        </div>

        <h3 className="mb-2 text-lg font-semibold text-white">{stack.name}</h3>

        {stack.description && (
          <p className="mb-4 text-sm text-white/60 leading-relaxed">
            {stack.description}
          </p>
        )}

        <div className="relative h-1.5 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${stack.color}, ${stack.color}80)`,
              boxShadow: `0 0 10px ${stack.color}40`,
            }}
            initial={{ width: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </GlowCard>
    </motion.div>
  );
}

export function Stacks() {
  return (
    <section id="stacks" className="relative px-4 py-20 sm:px-6 sm:py-32 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neon-blue/5 via-transparent to-transparent" />

      <div className="mx-auto max-w-6xl">
        <SectionTitle subtitle="03 — Projects">Projects</SectionTitle>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stacks.map((stack, i) => (
            <StackCard key={stack.name} stack={stack} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}