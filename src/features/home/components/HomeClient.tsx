"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
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
const INTRO_CHANGE_EVENT = "portfolio-intro-change";

type IntroState = {
  initialized: boolean;
  showIntro: boolean;
  portfolioReady: boolean;
};

const INTRO_SSR_STATE: IntroState = {
  initialized: false,
  showIntro: true,
  portfolioReady: false,
};

function readIntroState(): IntroState {
  if (typeof window === "undefined") return INTRO_SSR_STATE;

  const seen = sessionStorage.getItem(INTRO_KEY);
  return {
    initialized: true,
    showIntro: !seen,
    portfolioReady: Boolean(seen),
  };
}

function subscribeIntro(onStoreChange: () => void) {
  window.addEventListener(INTRO_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(INTRO_CHANGE_EVENT, onStoreChange);
}

export function HomeClient() {
  const { initialized, showIntro, portfolioReady } = useSyncExternalStore(
    subscribeIntro,
    readIntroState,
    () => INTRO_SSR_STATE,
  );

  useEffect(() => {
    if (!sessionStorage.getItem(INTRO_KEY)) void import("./MainPortfolio");
  }, []);

  useLazyLoadSections(initialized);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    window.dispatchEvent(new Event(INTRO_CHANGE_EVENT));
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
