"use client";

import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { NoiseOverlay } from "@/components/effects/NoiseOverlay";
import { MouseGlow } from "@/components/effects/MouseGlow";
import { Navigation } from "@/components/layout/Navigation";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Stacks } from "@/components/sections/Stacks";
// import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  const [phase, setPhase] = useState<"loading" | "main">("loading");

  const handleLoadingComplete = useCallback(() => {
    setPhase("main");
  }, []);

  return (
    <>
     
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
            {/* Projects section temporarily hidden */}
            {/* <Projects /> */}
            <Contact />
            <Footer />
          </motion.main>
    </>
  );
}
