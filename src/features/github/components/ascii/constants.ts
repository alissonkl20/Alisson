export const ASCII_CHARS = "@%#*+=-:. ".split("");
export const FONT_SIZE = 7;
export const CELL_W = FONT_SIZE * 0.6;
export const CELL_H = FONT_SIZE;
export const PARTICLE_FONT = 11;
export const BRIGHTNESS_THRESHOLD = 40;
export const MAX_PARTICLES_DESKTOP = 1800;
export const MAX_PARTICLES_MOBILE = 900;
export const EXPLODE_TIME = 0.7;
export const TYPE_SPEED = 22;
export const LINE_PAUSE = 0.55;
export const DEFAULT_VIDEO_SRC = "/assets/cat.mp4";

export const TYPED_LINES = [
  { prompt: true, text: "haff manifesto" },
  { prompt: false, text: "A simple system cannot sustain a memorable brand." },
  { prompt: false, text: "What you present reflects who you are — personality," },
  { prompt: false, text: "business vision, and how you position yourself in the market." },
  { prompt: false, text: "Before selling services, software, or a website," },
  { prompt: false, text: "something authentic must exist: emotion before the offer." },
  { prompt: false, text: "First impressions are decisive. Do not waste that chance." },
  { prompt: false, text: "Let's build something innovative that conveys value and sets you apart." },
] as const;
