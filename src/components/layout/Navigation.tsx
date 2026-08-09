"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navLinkClass = (active: boolean) =>
  cn(
    "relative text-sm transition-colors duration-300",
    active
      ? "text-neon-orange neon-text-orange"
      : "text-neon-orange/50 hover:text-neon-orange/80",
  );

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
        { threshold: 0.3 },
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
      <motion.nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 sm:py-4 safe-top safe-x transition-all duration-500",
          scrolled
            ? "bg-black/60 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent",
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <button
            onClick={() => handleClick("home")}
            className="font-mono text-xs tracking-widest text-neon-orange/80 transition-colors hover:text-neon-orange neon-text-orange sm:text-sm"
            aria-label="Ir para início"
          >
            Alisson.Dev
          </button>

          <div className="hidden items-center gap-8 md:flex">
            {SECTIONS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={navLinkClass(activeSection === id)}
              >
                {label}
                {activeSection === id && (
                  <motion.div
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-neon-orange"
                    layoutId="nav-indicator"
                    style={{ boxShadow: "0 0 10px rgba(255,94,0,0.5)" }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-neon-orange/70 hover:text-neon-orange"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-6 bg-black/95 backdrop-blur-xl safe-top safe-bottom sm:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {SECTIONS.map(({ id, label }, i) => (
              <motion.button
                key={id}
                onClick={() => handleClick(id)}
                className="text-2xl text-neon-orange/80 transition-colors hover:text-neon-orange neon-text-orange"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
