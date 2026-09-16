export { chatbotConfig } from "./config";
export {
  createAssistantReply,
  createMessage,
  createWelcomeMessage,
  getChatbotReply,
  tryPresetReply,
  type ChatMessage,
  type ChatRole,
} from "./replies";
export {
  CHATBOT_FALLBACK,
  CHATBOT_TRAINING,
  buildProjectResponse,
  type TrainingEntry,
  type TrainingTopicId,
} from "./treinamento";
