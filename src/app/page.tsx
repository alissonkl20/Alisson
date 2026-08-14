"use client";

import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Stacks } from "@/components/sections/Stacks";
import { Contact } from "@/components/sections/Contact";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { Particles } from "@/components/effects/Particles";
import { CustomCursor } from "@/components/effects/CustomCursor";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[var(--background)]">
      <Particles />
      <div className="scanlines" aria-hidden="true" />
      <NoiseOverlay />
      <MouseGlow />
      <CustomCursor />
      <Navigation />
      <Hero />
      <About />
      <Experience />
      <Stacks />
      <Contact />
      <ChatWidget />
    </main>
  );
}
