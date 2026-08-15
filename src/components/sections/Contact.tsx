"use client";

import { useEffect, useRef, useState } from "react";
import {
  Mail,
  MessageCircle,
  ChevronDown,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";
import { NeonText } from "@/components/ui/NeonText";
import { profile } from "@/lib/data";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

const SMOOTH_EASE = [0.45, 0, 0.55, 1] as const;

type ContactLink = {
  href: string;
  icon: LucideIcon | typeof GitHubIcon;
  label: string;
  external?: boolean;
  accent: string;
};

const contactLinks: ContactLink[] = [
  {
    href: `mailto:${profile.email}`,
    icon: Mail,
    label: profile.email,
    accent: "#ff6b9d",
  },
  {
    href: profile.whatsapp,
    icon: MessageCircle,
    label: "WhatsApp",
    external: true,
    accent: "#6ee7a0",
  },
  {
    href: profile.github,
    icon: GitHubIcon,
    label: "GitHub",
    external: true,
    accent: "#c77dff",
  },
  {
    href: profile.linkedin,
    icon: LinkedInIcon,
    label: "LinkedIn",
    external: true,
    accent: "#5eb8ff",
  },
];

function ContactLinksReveal() {
  const panelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(panelRef, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isInView || reduceMotion) {
      if (isInView && reduceMotion) setOpen(true);
      return;
    }
    const timer = window.setTimeout(() => setOpen(true), 500);
    return () => window.clearTimeout(timer);
  }, [isInView, reduceMotion]);

  return (
    <div ref={panelRef} className="relative">
      {!open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          className="group relative w-full overflow-hidden rounded-2xl border border-neon-red/35 bg-transparent px-5 py-4 text-left transition-colors hover:border-neon-red/60 sm:px-6 sm:py-5"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: SMOOTH_EASE }}
          aria-expanded={open}
          aria-controls="contact-links-panel"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-neon-red/5 via-transparent to-neon-red/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden="true"
          />

          {!reduceMotion && (
            <motion.span
              className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-neon-red/15 blur-2xl"
              animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          )}

          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-neon-red/30 bg-neon-red/5 text-neon-red shadow-[0_0_24px_rgba(220,38,38,0.15)]">
                <Sparkles className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-[family-name:var(--font-space-grotesk)] text-sm font-semibold text-white sm:text-base">
                  Connect with me
                </p>
                <p className="text-xs text-[var(--text-secondary)] sm:text-sm">
                  Tap to reveal contact channels
                </p>
              </div>
            </div>

            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/60"
              animate={reduceMotion ? undefined : { y: [0, 3, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
            </motion.span>
          </div>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            id="contact-links-panel"
            key="contact-panel"
            initial={reduceMotion ? false : { opacity: 0, height: 0, scale: 0.96 }}
            animate={{ opacity: 1, height: "auto", scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.96 }}
            transition={{
              height: { type: "spring", stiffness: 120, damping: 22 },
              opacity: { duration: 0.35, ease: SMOOTH_EASE },
              scale: { type: "spring", stiffness: 200, damping: 24 },
            }}
            className="overflow-hidden"
          >
            <motion.ul
              className="space-y-3 pt-1"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: reduceMotion ? 0 : 0.1, delayChildren: 0.08 },
                },
              }}
            >
              {contactLinks.map((link) => (
                <motion.li
                  key={link.label}
                  variants={{
                    hidden: {
                      opacity: 0,
                      x: 48,
                      y: 12,
                      filter: "blur(10px)",
                      scale: 0.92,
                    },
                    visible: {
                      opacity: 1,
                      x: 0,
                      y: 0,
                      filter: "blur(0px)",
                      scale: 1,
                      transition: {
                        type: "spring",
                        stiffness: 140,
                        damping: 18,
                      },
                    },
                  }}
                >
                  <a
                    href={link.href}
                    {...(link.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className={cn(
                      "group/link relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/[0.08] bg-transparent px-4 py-3.5 text-sm transition-all duration-300",
                      "hover:border-[var(--border-neon-hover)] hover:shadow-[0_0_28px_rgba(220,38,38,0.18)]",
                      "break-all sm:break-normal",
                    )}
                    data-cursor-hover
                  >
                    <span
                      className="pointer-events-none absolute inset-y-0 left-0 w-0.5 opacity-70 transition-all duration-300 group-hover/link:opacity-100 group-hover/link:shadow-[0_0_12px_currentColor]"
                      style={{ backgroundColor: link.accent, color: link.accent }}
                      aria-hidden="true"
                    />

                    <span
                      className="contact-link-shimmer pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/link:opacity-100"
                      aria-hidden="true"
                    />

                    <span
                      className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] transition-transform duration-300 group-hover/link:scale-110"
                      style={{ color: link.accent }}
                    >
                      <link.icon size={18} />
                    </span>

                    <span
                      className="relative z-10 font-medium text-[var(--text-secondary)] transition-colors duration-300 group-hover/link:text-white"
                    >
                      {link.label}
                    </span>

                    <motion.span
                      className="relative z-10 ml-auto hidden h-1.5 w-1.5 rounded-full sm:block"
                      style={{ backgroundColor: link.accent }}
                      animate={
                        reduceMotion
                          ? undefined
                          : { opacity: [0.35, 1, 0.35], scale: [0.8, 1.2, 0.8] }
                      }
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden="true"
                    />
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <motion.button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.06] bg-transparent py-2 text-xs font-medium uppercase tracking-wider text-white/40 transition-colors hover:border-white/15 hover:text-white/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              <ChevronDown className="h-3.5 w-3.5 rotate-180" strokeWidth={1.75} />
              Collapse
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:py-28 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.06),transparent_60%)]"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto w-[92vw] max-w-4xl">
        <ScrollReveal className="mb-10 sm:mb-12 md:mb-14">
          <p className="section-label mb-5">Get in Touch</p>
          <h2 className="font-[family-name:var(--font-space-grotesk)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
            <NeonText color="red" ledSign as="span">
              Contact
            </NeonText>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={1}>
          <div className="rounded-2xl border border-white/[0.06] bg-transparent p-6 sm:p-8 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h3 className="mb-4 font-[family-name:var(--font-space-grotesk)] text-2xl font-semibold md:text-3xl">
                  <NeonText color="red" ledSign>
                    Let&apos;s talk
                  </NeonText>
                </h3>
                <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)]">
                  I&apos;m open to new projects, collaborations, and opportunities to build
                  impactful, high-performance digital experiences.
                </p>
              </div>

              <ContactLinksReveal />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
