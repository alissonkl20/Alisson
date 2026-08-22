"use client";

import { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useLazyLoadSections } from "../hooks/useLazyLoadSections";

const IntroScreen = dynamic(
  () => import("@/features/intro").then((m) => m.IntroScreen),
  { ssr: false },
);

const MainPortfolio = dynamic(
  () => import("./MainPortfolio").then((m) => m.MainPortfolio),
  { ssr: false },
);

const INTRO_KEY = "dev-kisper-intro-seen";

function getIntroState() {
  if (typeof window === "undefined") {
    return { initialized: false, showIntro: true, portfolioReady: false };
  }

  const seen = sessionStorage.getItem(INTRO_KEY);
  if (!seen) void import("./MainPortfolio");

  return {
    initialized: true,
    showIntro: !seen,
    portfolioReady: Boolean(seen),
  };
}

export function HomeClient() {
  const [{ initialized, showIntro, portfolioReady }, setIntroState] =
    useState(getIntroState);

  // Preload progressivo (About → Experience → Projects) começa junto com a
  // intro: a animação é leve e lenta, então os chunks chegam prontos antes
  // dela terminar — sem gargalo na montagem.
  useLazyLoadSections(initialized);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setIntroState({
      initialized: true,
      showIntro: false,
      portfolioReady: true,
    });
  }, []);

  if (!initialized) {
    return <div className="fixed inset-0 z-[200] bg-black" aria-hidden />;
  }

  return (
    <>
      {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      {portfolioReady && <MainPortfolio />}
    </>
  );
}
