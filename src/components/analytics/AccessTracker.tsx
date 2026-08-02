"use client";

import { useEffect, useRef } from "react";

import {
  hasPageViewBeenSent,
  hasSessionEndBeenSent,
  isAnalyticsConfigured,
  markPageViewSent,
  markSessionEndSent,
  sendPageView,
  sendSessionEnd,
} from "@/lib/analytics";

const SESSION_START_KEY = "obs_session_start";

function getSessionStart(): number {
  const stored = sessionStorage.getItem(SESSION_START_KEY);
  if (stored) {
    return Number(stored);
  }

  const now = Date.now();
  sessionStorage.setItem(SESSION_START_KEY, String(now));
  return now;
}

function getSessionTimeSeconds(startTime: number): number {
  return Math.max(0, Math.round((Date.now() - startTime) / 1000));
}

export default function AccessTracker() {
  const pageViewSentRef = useRef(false);
  const sessionEndSentRef = useRef(false);

  useEffect(() => {
    if (!isAnalyticsConfigured()) {
      return;
    }

    const page = window.location.pathname;
    const sessionStart = getSessionStart();

    // Evita duplicação no React Strict Mode (dev) e re-mounts
    if (!pageViewSentRef.current && !hasPageViewBeenSent()) {
      pageViewSentRef.current = true;
      markPageViewSent();

      sendPageView(page).catch(() => {
        pageViewSentRef.current = false;
        sessionStorage.removeItem("obs_page_view_sent");
      });
    }

    const dispatchSessionEnd = () => {
      if (sessionEndSentRef.current || hasSessionEndBeenSent()) {
        return;
      }

      sessionEndSentRef.current = true;
      markSessionEndSent();

      sendSessionEnd(page, getSessionTimeSeconds(sessionStart));
    };

    window.addEventListener("beforeunload", dispatchSessionEnd);
    window.addEventListener("pagehide", dispatchSessionEnd);

    return () => {
      window.removeEventListener("beforeunload", dispatchSessionEnd);
      window.removeEventListener("pagehide", dispatchSessionEnd);
    };
  }, []);

  return null;
}
