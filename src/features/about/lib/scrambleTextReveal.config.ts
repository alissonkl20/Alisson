import { profile } from "@/shared/config/data";

/** Texto do efeito scramble — independente da timeline (conteúdo fixo abaixo) */
export const SCRAMBLE_ABOUT_TEXT = profile.bio;

export const SCRAMBLE_ABOUT_CONFIG = {
  scrollDistance: 110,
  radius: 28,
  rotation: 48,
  title: profile.title,
  viewportHeight: 100,
} as const;
