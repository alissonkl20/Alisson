# Chat module

Static portfolio chatbot — no LLM.

| Path | Role |
|------|------|
| `route.ts` | POST `/api/chat` — preset replies from `bot/` |
| `bot/` | Training data + matcher (`treinamento.ts`, `replies.ts`) |
| `ui/` | ChatWidget component |

## Flow

1. `ChatWidget` → `POST /api/chat` with `session_id` + `message`.
2. `getChatbotReply()` matches training/projects or returns the generic fallback.
3. No Ollama, no external API, no rate limit.

## Edit answers

Update `bot/treinamento.ts` (triggers + responses). Rebuild and redeploy Next.js.

## Legacy (unused)

`hostinger/` and `knowledge/` were for the Ollama API — kept for reference only.
