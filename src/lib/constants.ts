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
  neonRed: "#dc2626",
  neonRedBright: "#ff0000",
  neonOrange: "#dc2626",
  neonBlue: "#4b9eff",
  neonPurple: "#b388ff",
  neonWhite: "#ffffff",
  textSecondary: "#b0b0b0",
  gray: "#1a1a1a",
  grayLight: "#b0b0b0",
} as const;
