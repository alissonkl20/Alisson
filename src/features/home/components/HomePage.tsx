"use client";

import dynamic from "next/dynamic";

const HomeClient = dynamic(
  () => import("./HomeClient").then((m) => m.HomeClient),
  { ssr: false },
);

/** Wrapper client-only — evita mismatch de hidratação do intro/sessionStorage. */
export function HomePage() {
  return <HomeClient />;
}
