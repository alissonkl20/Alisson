export const LOADING_STEPS = [
  0, 5, 12, 18, 25, 33, 41, 48, 55, 63, 71, 78, 85, 92, 97, 100,
] as const;

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "Sobre" },
  { id: "experience", label: "Experiência" },
  { id: "stacks", label: "Stacks" },
  { id: "projects", label: "Projetos" },
  { id: "contact", label: "Contato" },
] as const;

export const COLORS = {
  bg: "#000000",
  neonBlue: "#00d4ff",
  neonPurple: "#a855f7",
  neonWhite: "#ffffff",
  gray: "#1a1a1a",
  grayLight: "#888888",
} as const;
