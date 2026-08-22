/**
 * Configuração da animação de introdução ("dev kisper").
 *
 * Partículas amarelas montam o texto no canvas; ao terminar, fade da tela
 * e transição direta para a section About (sem texto HTML sobreposto).
 */

export const INTRO_TEXT = "dev kisper";

/** Preto profundo — tela e card de partículas. */
export const INTRO_BG = "#000000";
export const INTRO_BG_RGB = { r: 0, g: 0, b: 0 } as const;

/** Amarelo da marca (--theme-brand no tema escuro). */
export const INTRO_PARTICLE_COLOR = "#ffd000";
export const INTRO_PARTICLE_RGB = { r: 255, g: 208, b: 0 } as const;
/** Variação mais clara para gradiente sutil nas partículas. */
export const INTRO_PARTICLE_RGB_LIGHT = { r: 255, g: 232, b: 120 } as const;

export const INTRO_LETTER_SPACING = "-0.04em";

/** Durações (ms). */
export const INTRO_HOLD_MS = 700;
export const INTRO_EXIT_MS = 600;

export const INTRO_MAX_DPR = 1.5;

export const INTRO_FORMED_RATIO = 0.92;
export const INTRO_SETTLE_FRAMES = 45;

export const INTRO_PARTICLE_SPEED_MIN = 1.6;
export const INTRO_PARTICLE_SPEED_MAX = 3.4;
export const INTRO_TRAIL_ALPHA = 0.08;
