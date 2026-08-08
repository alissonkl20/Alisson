"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle } from "lucide-react";
import { SectionTitle, NeonText } from "@/components/ui/NeonText";
import { profile } from "@/lib/data";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";

export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-32 md:py-40">
      <motion.div
        className="pointer-events-none absolute inset-0"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-neon-purple/10 via-transparent to-neon-blue/5" />
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue/5 blur-[120px]" />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <SectionTitle subtitle="05 — Contato">Contato</SectionTitle>

        <motion.div
          className="glass-card rounded-3xl p-8 md:p-10"
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
         <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
  <div>
    <h3 className="mb-4 text-2xl font-semibold text-white md:text-3xl">
      <NeonText color="blue" ledSign flicker>
        Let's talk
      </NeonText>
    </h3>
    <p className="max-w-xl text-base leading-relaxed text-white/55 md:text-lg">
      I'm open to new projects, collaborations, and opportunities to build
      impactful, high-performance digital experiences.
    </p>
  </div>

            <div className="space-y-3">
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70 transition duration-300 hover:border-neon-blue/50 hover:text-white"
              >
                <Mail size={18} className="text-neon-blue" />
                {profile.email}
              </a>
              <a
                href={profile.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70 transition duration-300 hover:border-neon-blue/50 hover:text-white"
              >
                <MessageCircle size={18} className="text-neon-blue" />
                WhatsApp
              </a>
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70 transition duration-300 hover:border-neon-blue/50 hover:text-white"
              >
                <GitHubIcon size={18} className="text-neon-blue" />
                GitHub
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/70 transition duration-300 hover:border-neon-blue/50 hover:text-white"
              >
                <LinkedInIcon size={18} className="text-neon-blue" />
                LinkedIn
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
