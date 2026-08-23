import { NextResponse } from "next/server";
import { getCachedGitHubStats } from "@/features/github/server/cache";
import {
  REVALIDATE_SECONDS,
  STALE_WHILE_REVALIDATE_SECONDS,
} from "@/features/github/server/config";

/** 6 horas — precisa ser literal para o Next.js aplicar ISR na rota. */
export const revalidate = 21600;

const GENERIC_ERROR = { error: "unavailable" } as const;

const CACHE_HEADERS = {
  "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=${STALE_WHILE_REVALIDATE_SECONDS}`,
};

/** GET /api/github-stats — snapshot em cache de 6h; token fica no servidor. */
export async function GET() {
  try {
    const payload = await getCachedGitHubStats();
    return NextResponse.json(payload, { headers: CACHE_HEADERS });
  } catch {
    return NextResponse.json(GENERIC_ERROR, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
