export const LOADING_STEPS = [
  0, 5, 12, 18, 25, 33, 41, 48, 55, 63, 71, 78, 85, 92, 97, 100,
] as const;

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },     
  { id: "experience", label: "Experience" }, 
  { id: "stacks", label: "Projects" },    
  { id: "contact", label: "Contact" },    
];

export const COLORS = {
  bg: "#000000",
  neonOrange: "#ff5e00",
  neonBlue: "#00d4ff",
  neonPurple: "#a855f7",
  neonWhite: "#ffffff",
  gray: "#1a1a1a",
  grayLight: "#888888",
} as const;

/** Labels de navegação com destaque neon laranja */
export const NEON_ORANGE_NAV_LABELS = new Set([
  "Experience",
  "Projects",
  "Contact",
]);
