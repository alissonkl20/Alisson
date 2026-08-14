"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinkClass = (active: boolean) =>
  cn(
    "relative px-4 py-2 font-[family-name:var(--font-space-grotesk)] text-sm font-medium transition-colors duration-300",
    active ? "text-white" : "text-[var(--text-secondary)] hover:text-white",
  );

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        {
          threshold: 0.35,
          rootMargin: "-72px 0px -45% 0px",
        },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleClick = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] transition-all duration-500 safe-top safe-x",
          scrolled
            ? "border-b border-[var(--border-neon)] bg-black/82 backdrop-blur-xl"
            : "bg-transparent",
        )}
        aria-label="Main navigation"
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => handleClick("home")}
            className="font-[family-name:var(--font-space-grotesk)] text-sm font-bold tracking-tight text-white transition-colors hover:text-neon-red"
            aria-label="Go to home"
            data-cursor-hover
          >
            A<span className="text-neon-red">.</span>Almeida
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {SECTIONS.map(({ id, label }) => (
              <li key={id}>
                <button
                  onClick={() => handleClick(id)}
                  className={navLinkClass(activeSection === id)}
                  data-cursor-hover
                >
                  {label === "Home" ? "About" : label === "Stacks" ? "Projects" : label}
                  {activeSection === id && (
                    <span
                      className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-neon-red-bright shadow-[0_0_8px_rgba(220,38,38,0.45)]"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="text-[var(--text-secondary)] transition hover:text-neon-red md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            data-cursor-hover
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 border-b border-[var(--border-neon)] bg-black/95 backdrop-blur-xl safe-top safe-bottom md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {SECTIONS.map(({ id, label }, i) => (
              <motion.button
                key={id}
                onClick={() => handleClick(id)}
                className="font-[family-name:var(--font-space-grotesk)] text-2xl text-[var(--text-secondary)] transition hover:text-neon-red"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                data-cursor-hover
              >
                {label === "Home" ? "About" : label === "Stacks" ? "Projects" : label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
