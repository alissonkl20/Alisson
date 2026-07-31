"use client";

import { useEffect } from "react";

export default function AccessTracker() {
  useEffect(() => {
    const startTime = Date.now();

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/access-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: window.location.pathname,
        event: "page_view",
        session_time: 0,
      }),
    }).catch(console.error);

    const sendExitLog = () => {
      const sessionTime = Math.round((Date.now() - startTime) / 1000);

      navigator.sendBeacon(
        `${process.env.NEXT_PUBLIC_API_URL}/api/access-log`,
        new Blob(
          [
            JSON.stringify({
              page: window.location.pathname,
              event: "session_end",
              session_time: sessionTime,
            }),
          ],
          {
            type: "application/json",
          }
        )
      );
    };

    window.addEventListener("beforeunload", sendExitLog);

    return () => {
      sendExitLog();
      window.removeEventListener("beforeunload", sendExitLog);
    };
  }, []);

  return null;
}