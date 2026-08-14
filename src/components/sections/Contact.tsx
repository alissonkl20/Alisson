"use client";

import { Mail, MessageCircle } from "lucide-react";
import { SectionTitle, NeonText } from "@/components/ui/NeonText";
import { profile } from "@/lib/data";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const contactLinks = [
  {
    href: `mailto:${profile.email}`,
    icon: Mail,
    label: profile.email,
  },
  {
    href: profile.whatsapp,
    icon: MessageCircle,
    label: "WhatsApp",
    external: true,
  },
  {
    href: profile.github,
    icon: GitHubIcon,
    label: "GitHub",
    external: true,
  },
  {
    href: profile.linkedin,
    icon: LinkedInIcon,
    label: "LinkedIn",
    external: true,
  },
] as const;

export function Contact() {
  return (
    <section
      id="contact"
      className="relative px-4 py-20 pb-[max(5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-28 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.06),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <SectionTitle label="Get in Touch">Contact</SectionTitle>

        <ScrollReveal>
          <div className="glass-card rounded-2xl p-6 sm:p-8 md:p-10">
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

              <div className="space-y-3">
                {contactLinks.map(({ href, icon: Icon, label, ...rest }) => (
                  <a
                    key={label}
                    href={href}
                    {...("external" in rest && rest.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="flex items-center gap-3 rounded-xl border border-[var(--border-neon)] bg-white/[0.02] px-4 py-3 text-sm text-[var(--text-secondary)] transition duration-300 hover:border-[var(--border-neon-hover)] hover:text-white hover:shadow-[0_0_16px_rgba(220,38,38,0.12)] break-all sm:break-normal"
                    data-cursor-hover
                  >
                    <Icon size={18} className="shrink-0 text-neon-red" />
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
