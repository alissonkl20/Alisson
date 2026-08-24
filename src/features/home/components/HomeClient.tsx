"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { useLazyLoadSections } from "../hooks/useLazyLoadSections";
import { isMobileViewport } from "@/shared/lib/isMobileViewport";

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
  isMobile: boolean;
};

const INTRO_SSR_STATE: IntroState = {
  initialized: false,
  showIntro: true,
  portfolioReady: false,
  isMobile: false,
};

let introSnapshot: IntroState = INTRO_SSR_STATE;

function readIntroState(): IntroState {
  if (typeof window === "undefined") return INTRO_SSR_STATE;

  const seen = Boolean(sessionStorage.getItem(INTRO_KEY));
  const isMobile = isMobileViewport();
  const showIntro = !seen && !isMobile;
  const portfolioReady = seen || isMobile;

  if (
    introSnapshot.initialized &&
    introSnapshot.showIntro === showIntro &&
    introSnapshot.portfolioReady === portfolioReady &&
    introSnapshot.isMobile === isMobile
  ) {
    return introSnapshot;
  }

  introSnapshot = { initialized: true, showIntro, portfolioReady, isMobile };
  return introSnapshot;
}

function subscribeIntro(onStoreChange: () => void) {
  window.addEventListener(INTRO_CHANGE_EVENT, onStoreChange);
  return () => window.removeEventListener(INTRO_CHANGE_EVENT, onStoreChange);
}

export function HomeClient() {
  const { initialized, showIntro, portfolioReady, isMobile } =
    useSyncExternalStore(
      subscribeIntro,
      readIntroState,
      () => INTRO_SSR_STATE,
    );

  useEffect(() => {
    if (!sessionStorage.getItem(INTRO_KEY)) void import("./MainPortfolio");
  }, []);

  useLazyLoadSections(initialized && !isMobile);

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
