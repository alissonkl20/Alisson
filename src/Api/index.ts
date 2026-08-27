import { timelineProjects } from "@/shared/config/data";
import {
  buildProjectResponse,
  CHATBOT_FALLBACK,
  CHATBOT_TRAINING,
  resolveTrainingResponse,
  type TrainingEntry,
  type TrainingTopicId,
} from "./treinamento";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
}

export const chatbotConfig = {
  enabled: true,
  ui: {
    title: "Assistant",
    subtitle: "Ask about career, projects, or contact",
    placeholder: "E.g.: what projects have you built?",
    welcomeMessage:
      "Hi! I'm Alisson's portfolio assistant.\n\nI can talk about profile, experience, projects, stack, services, pricing, and contact — all based on this site's content.\n\nHow can I help?",
    sendLabel: "Send",
    maxMessages: 50,
    showTimestamps: false,
    position: "bottom-right" as const,
  },
  fallbackResponse: CHATBOT_FALLBACK,
  persistHistory: false,
  historyStorageKey: "portfolio-chat-history",
  sessionStorageKey: "portfolio-chat-session-id",
} as const;

function normalizeInput(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const rows = b.length + 1;
  const cols = a.length + 1;
  const matrix = Array.from({ length: rows }, () => new Array<number>(cols));

  for (let i = 0; i < rows; i++) matrix[i][0] = i;
  for (let j = 0; j < cols; j++) matrix[0][j] = j;

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = b[i - 1] === a[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}

function maxEditDistance(word: string): number {
  if (word.length <= 4) return 1;
  if (word.length <= 7) return 2;
  return 3;
}

/** Tolerates minor spelling mistakes when matching triggers to the message */
function fuzzyMatchesInput(input: string, trigger: string): boolean {
  const normalizedTrigger = normalizeInput(trigger);
  if (!normalizedTrigger) return false;

  if (input.includes(normalizedTrigger)) return true;

  const inputWords = input.split(/\s+/).filter((word) => word.length >= 3);
  const triggerWords = normalizedTrigger
    .split(/\s+/)
    .filter((word) => word.length >= 3);

  if (!triggerWords.length) return false;

  const wordMatches = (target: string) =>
    input.includes(target) ||
    inputWords.some(
      (word) => levenshtein(word, target) <= maxEditDistance(target),
    );

  if (triggerWords.length === 1) {
    return wordMatches(triggerWords[0]);
  }

  return triggerWords.every(wordMatches);
}

function findProjectMatch(input: string) {
  const normalized = normalizeInput(input);

  return (
    timelineProjects.find((project) => {
      const aliases = [
        project.title,
        project.initials,
        ...project.title.split(/\s+/).filter((word) => word.length > 2),
        ...project.category.split("·").map((part) => part.trim()),
      ];

      return aliases.some((alias) => {
        const value = normalizeInput(alias);
        return value.length >= 2 && normalized.includes(value);
      });
    }) ?? null
  );
}

function scoreTrainingEntry(entry: TrainingEntry, normalizedInput: string): number {
  let bestTriggerScore = 0;

  for (const trigger of entry.triggers) {
    const normalizedTrigger = normalizeInput(trigger);
    if (!normalizedTrigger) continue;

    if (fuzzyMatchesInput(normalizedInput, trigger)) {
      bestTriggerScore = Math.max(bestTriggerScore, normalizedTrigger.length);
    }
  }

  if (!bestTriggerScore) return 0;

  return bestTriggerScore + (entry.priority ?? 0);
}

function findTrainingMatch(input: string) {
  const normalized = normalizeInput(input);
  if (!normalized) return null;

  let bestEntry: TrainingEntry | null = null;
  let bestScore = 0;

  for (const entry of CHATBOT_TRAINING) {
    const score = scoreTrainingEntry(entry, normalized);
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  return bestEntry;
}

function shouldPreferProjectReply(
  input: string,
  topic: TrainingTopicId | null,
): boolean {
  if (!topic || topic === "projects") return true;

  const project = findProjectMatch(input);
  if (!project) return false;

  const normalized = normalizeInput(input);
  const titleWords = normalizeInput(project.title)
    .split(/\s+/)
    .filter((word) => word.length > 3);

  return titleWords.some((word) => normalized.includes(word));
}

export function getChatbotReply(input: string): string {
  const normalized = normalizeInput(input);
  if (!normalized) return chatbotConfig.fallbackResponse;

  const project = findProjectMatch(input);
  const match = findTrainingMatch(input);

  if (project && shouldPreferProjectReply(input, match?.id ?? null)) {
    return buildProjectResponse(project);
  }

  if (match) {
    return resolveTrainingResponse(match.response);
  }

  return chatbotConfig.fallbackResponse;
}

export function createMessage(
  role: ChatRole,
  content: string,
  id = crypto.randomUUID(),
): ChatMessage {
  return {
    id,
    role,
    content,
    createdAt: Date.now(),
  };
}

export function createWelcomeMessage(): ChatMessage {
  return createMessage("assistant", chatbotConfig.ui.welcomeMessage, "welcome");
}

export function createAssistantReply(input: string): ChatMessage {
  return createMessage("assistant", getChatbotReply(input));
}

export {
  CHATBOT_FALLBACK,
  CHATBOT_TRAINING,
  buildProjectResponse,
  type TrainingEntry,
  type TrainingTopicId,
} from "./treinamento";
