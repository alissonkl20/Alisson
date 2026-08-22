import type { GlowTheme } from "../types";

interface GlowFilterProps {
  theme: GlowTheme;
  intensity: number;
  filterId: string;
}

export function GlowFilter({
  theme,
  intensity,
  filterId,
}: GlowFilterProps) {
  const blur = 4 + (intensity / 100) * 18;
  const bloom = 8 + (intensity / 100) * 24;

  return (
    <defs>
      <filter
        id={`${filterId}-neon`}
        x="-50%"
        y="-50%"
        width="200%"
        height="200%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur stdDeviation={blur * 0.4} result="blur1" />
        <feGaussianBlur stdDeviation={blur} in="SourceGraphic" result="blur2" />
        <feMerge>
          <feMergeNode in="blur2" />
          <feMergeNode in="blur1" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter
        id={`${filterId}-bloom`}
        x="-80%"
        y="-80%"
        width="260%"
        height="260%"
      >
        <feGaussianBlur stdDeviation={bloom} result="bloom" />
        <feColorMatrix
          in="bloom"
          type="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.65 0"
          result="soft"
        />
        <feMerge>
          <feMergeNode in="soft" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <linearGradient id={`${filterId}-stroke`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={theme.secondary} stopOpacity="0.35" />
        <stop offset="50%" stopColor={theme.primary} stopOpacity="1" />
        <stop offset="100%" stopColor={theme.secondary} stopOpacity="0.5" />
      </linearGradient>

      <radialGradient id={`${filterId}-tip`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={theme.primary} stopOpacity="0.95" />
        <stop offset="55%" stopColor={theme.glow} stopOpacity="0.45" />
        <stop offset="100%" stopColor={theme.glow} stopOpacity="0" />
      </radialGradient>
    </defs>
  );
}
