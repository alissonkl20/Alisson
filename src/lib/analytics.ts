/**
 * Cliente de analytics para comunicação com a API de observabilidade.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_KEY = process.env.NEXT_PUBLIC_OBSERVABILITY_API_KEY ?? "";

const SESSION_VIEW_KEY = "obs_page_view_sent";
const SESSION_END_KEY = "obs_session_end_sent";

type AccessPayload = {
  page: string;
  event: "page_view" | "session_end";
  session_time: number;
};

type EventPayload = {
  event: string;
  page?: string;
  [key: string]: unknown;
};

function getHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    "x-api-key": API_KEY,
  };
}

function buildAccessBody(payload: AccessPayload): string {
  return JSON.stringify({
    ...payload,
    // Fallback para sendBeacon, que não suporta headers customizados
    x_api_key: API_KEY,
  });
}

export function isAnalyticsConfigured(): boolean {
  return Boolean(API_URL && API_KEY);
}

export function hasPageViewBeenSent(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_VIEW_KEY) === "1";
}

export function markPageViewSent(): void {
  sessionStorage.setItem(SESSION_VIEW_KEY, "1");
}

export function hasSessionEndBeenSent(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_END_KEY) === "1";
}

export function markSessionEndSent(): void {
  sessionStorage.setItem(SESSION_END_KEY, "1");
}

export async function sendPageView(page: string): Promise<void> {
  await fetch(`${API_URL}/api/access-log`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      page,
      event: "page_view",
      session_time: 0,
    }),
  });
}

export function sendSessionEnd(
  page: string,
  sessionTime: number
): boolean {
  const body = buildAccessBody({
    page,
    event: "session_end",
    session_time: sessionTime,
  });

  return navigator.sendBeacon(
    `${API_URL}/api/access-log`,
    new Blob([body], {
      type: "application/json",
    })
  );
}

export async function sendCustomEvent(
  payload: EventPayload
): Promise<void> {
  await fetch(`${API_URL}/api/event`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
}