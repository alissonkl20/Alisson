---
name: portfolio-sofia-bridge
description: Portfolio static ChatWidget via /api/chat Route Handler. Use for ChatWidget, chatbot, bot/treinamento, orçamento, or VPS deploy.
---

# Portfolio chat (static)

Read `AGENTS.md` and `deploy/hostinger/README.md`.

## Do

- Static replies from `src/app/api/chat/bot/treinamento.ts`
- `POST /api/chat` → `getChatbotReply()` on the server
- UUID `session_id` per visitor
- Deploy with `deploy/hostinger/deploy.sh` on the VPS

## Do not

- Call Ollama or `hostinger/` API (legacy, unused)
- Invent budget prices in chat
- Commit `.env.local` or `.env.production`
