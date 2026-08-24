"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/shared/config/data";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);
  const wasMenuOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      wasMenuOpenRef.current = true;
      const frame = requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }

    if (wasMenuOpenRef.current) {
      wasMenuOpenRef.current = false;
      menuTriggerRef.current?.focus();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const closeMenu = () => setMenuOpen(false);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    desktopQuery.addEventListener("change", closeMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      desktopQuery.removeEventListener("change", closeMenu);
    };
  }, [menuOpen]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className="navbar-portfolio fixed top-0 left-0 right-0 z-50 border-b border-theme-border backdrop-blur-xl transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "var(--theme-nav-bg)" : "color-mix(in srgb, var(--theme-nav-bg) 82%, transparent)",
      }}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
        style={{ minHeight: "var(--nav-height)" }}
      >
        <a
          href="#about"
          onClick={(e) => handleClick(e, "#about")}
          className="flex min-h-11 items-center text-lg font-bold tracking-tight text-theme-text lg:min-h-0"
        >
          Dev<span className="text-theme-brand">.</span><span className="text-theme-brand">Kisper</span>
        </a>

        <div className="flex items-center gap-3">
          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="text-sm text-theme-text-muted transition hover:text-theme-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          <button
            ref={menuTriggerRef}
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-theme-border bg-theme-surface text-theme-text transition hover:bg-theme-surface-hover lg:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div
          id="mobile-nav"
          className="border-t border-theme-border bg-theme-nav-bg px-4 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link, index) => (
              <li key={link.href}>
                <a
                  ref={index === 0 ? firstMobileLinkRef : undefined}
                  href={link.href}
                  onClick={(e) => handleClick(e, link.href)}
                  className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium text-theme-text-muted transition hover:bg-theme-surface hover:text-theme-brand"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
