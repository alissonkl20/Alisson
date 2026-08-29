export type GlassLayout = {
  zoom: number;
  focusX: number;
  focusY: number;
  pos: string;
};

export function getGlassLayout(width: number, height: number): GlassLayout {
  const w = Math.max(1, width);
  const h = Math.max(1, height);
  const aspect = w / h;

  let zoom = 1;
  let focusY = 0.2;

  if (w <= 480) {
    zoom = 1;
    focusY = 0.24;
  } else if (w <= 768) {
    zoom = 1.02;
    focusY = 0.2;
  } else if (w <= 1280) {
    zoom = 1.06;
    focusY = 0.16;
  } else if (w <= 1680) {
    zoom = 1.1;
    focusY = 0.13;
  } else {
    zoom = 1.14;
    focusY = 0.1;
  }

  if (aspect < 0.7) {
    zoom = Math.min(zoom, 1.02);
    focusY = Math.max(focusY, 0.26);
  } else if (aspect >= 1.8) {
    zoom = Math.max(zoom, 1.16);
    focusY = Math.min(focusY, 0.1);
  }

  if (h <= 540 && aspect > 1.15) {
    zoom = 1.06;
    focusY = 0.32;
  }

  const focusX = 0.5;
  return {
    zoom,
    focusX,
    focusY,
    pos: `${focusX * 100}% ${focusY * 100}%`,
  };
}
