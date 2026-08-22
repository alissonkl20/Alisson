export type DataFlowThemeKey = "dark" | "neon" | "night" | "glass" | "minimal";

export interface DataFlowTheme {
  id: DataFlowThemeKey;
  label: string;
  primary: string;
  secondary: string;
  background: string;
  nodeBg: string;
  nodeBorder: string;
  particle: string;
  ring: string;
  textColor: string;
  cardBg: string;
  cardBorder: string;
  cardAccent: string;
}

export interface ExperienceItem {
  id: number;
  company: string;
  role: string;
  period: string;
  /** Ano exibido no nó da linha — alinhado ao card 03 da timeline */
  milestoneYear: string;
  description: string;
  technologies?: string[];
}

export interface DataFlowConfig {
  theme: DataFlowThemeKey;
  particleCount: number;
  speed: number;
  nodeSize: number;
  showLabels: boolean;
  primaryColor?: string;
  secondaryColor?: string;
}

export type DataFlowNodeType = "input" | "center" | "server" | "user";

export interface DataFlowNodeLayout {
  id: string;
  label: string;
  x: number;
  y: number;
  type: DataFlowNodeType;
  icon: string;
}
