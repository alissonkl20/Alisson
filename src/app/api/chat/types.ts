import type { ContactLinks } from "./shared/contact-links";

export type ChatApiSuccess = {
  kind: "ok";
  reply: string;
  status: "ok" | "queued";
  cached?: boolean;
};

export type ChatApiLimitReached = {
  kind: "limit_reached";
  reply: string;
  contactLinks: ContactLinks;
};

export type ChatApiBusy = { kind: "busy" };
export type ChatApiUnavailable = { kind: "unavailable" };

export type ChatApiResult =
  | ChatApiSuccess
  | ChatApiLimitReached
  | ChatApiBusy
  | ChatApiUnavailable;
