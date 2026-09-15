import { CHATBOT_FALLBACK } from "./treinamento";

export const chatbotConfig = {
  enabled: true,
  ui: {
    title: "Assistant",
    subtitle: "Ask about the work, the stack, or how to get in touch",
    placeholder: "e.g. What have you built?",
    welcomeMessage:
      "Hi — I'm Alisson's portfolio assistant.\n\nI can talk about his stack (PHP/Laravel, Python, Vue, React, Next.js), experience, projects, and how to get in touch. Everything I say comes from this site — I won't invent prices.\n\nWhat would you like to know?",
    sendLabel: "Send",
    maxMessages: 50,
    showTimestamps: false,
    position: "bottom-right" as const,
  },
  fallbackResponse: CHATBOT_FALLBACK,
  persistHistory: false,
  historyStorageKey: "portfolio-chat-history",
  sessionStorageKey: "portfolio-chat-session-id",
  limitReachedStorageKey: "portfolio-chat-limit-reached",
} as const;
