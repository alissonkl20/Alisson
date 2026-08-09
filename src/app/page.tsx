"use client";

import { motion } from "framer-motion";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Stacks } from "@/components/sections/Stacks";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";

export default function Home() {
  return (
    <motion.main
      initial={false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="relative min-h-screen bg-[var(--background)]"
    >
      <NoiseOverlay />
      <MouseGlow />
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Stacks />
      <Contact />
      <Footer />
      <ChatWidget />
    </motion.main>
  );
}
