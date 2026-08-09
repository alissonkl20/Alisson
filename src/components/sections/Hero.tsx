"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { profile } from "@/lib/data";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonText } from "@/components/ui/NeonText";
import { TechGrid } from "@/components/effects/TechGrid";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] min-h-screen items-center justify-center overflow-hidden px-4 pt-20 sm:px-6 sm:pt-24"
    >
      <TechGrid />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-neon-blue/[0.02] via-transparent to-neon-purple/[0.02]" />

      <div className="relative z-10 mx-auto max-w-6xl text-center">
        <motion.p
          className="mb-4 sm:mb-6 font-mono text-xs uppercase tracking-[0.2em] text-neon-blue/70 sm:text-sm sm:tracking-[0.35em]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <NeonText color="white" ledSign className="text-xs uppercase tracking-[0.2em] sm:text-sm sm:tracking-[0.35em]">
            {profile.experience}
          </NeonText>
        </motion.p>

        <motion.h1
          className="mb-4 text-4xl font-bold tracking-tighter break-words sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          initial={{ opacity: 0, y: 60, filter: "blur(20px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <NeonText color="orange" ledSign>
            {profile.name}
          </NeonText>
        </motion.h1>

        <motion.p
          className="mb-8 text-xl font-light text-white/60 md:text-2xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <NeonText color="white" ledSign className="text-xl md:text-2xl">
            {profile.title}
          </NeonText>
        </motion.p>

        <motion.p
          className="mx-auto mb-8 sm:mb-12 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {profile.description}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <NeonButton href={profile.cvUrl} variant="primary">
            <Download size={16} />
            Download CV
          </NeonButton>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}
