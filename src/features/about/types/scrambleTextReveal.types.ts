export interface ScrambleTextRevealProps {
  /** Texto revelado letra a letra — não altera o conteúdo da timeline abaixo */
  text: string;
  /** Altura extra de scroll além do viewport (vh) */
  scrollDistance?: number;
  /** Raio de dispersão das letras antes de revelar (px) */
  radius?: number;
  /** Rotação máxima por letra (graus) */
  rotation?: number;
  /** Altura do viewport sticky (vh) */
  viewportHeight?: number;
  /** Título principal acima do texto */
  title?: string;
  glassSrc?: string;
  className?: string;
}

export const DEFAULT_SCRAMBLE_TEXT_REVEAL_PROPS = {
  scrollDistance: 120,
  radius: 42,
  rotation: 72,
  viewportHeight: 100,
} as const;
