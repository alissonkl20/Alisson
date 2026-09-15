import { createHash } from "node:crypto";

export function normalizeMessage(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function hashMessage(value: string): string {
  return createHash("sha256").update(normalizeMessage(value)).digest("hex");
}
