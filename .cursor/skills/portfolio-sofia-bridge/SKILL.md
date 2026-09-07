---
name: portfolio-sofia-bridge
description: Wires the Next.js portfolio ChatWidget to SOFIA IA via a server-only Route Handler. Use when working on ChatWidget, chatbot, /api/chat, SOFIA_URL, SOFIA_TOKEN, orçamento, or local LLM from the Vercel site.
---

# Portfolio → SOFIA (web)

Read `/home/alisson/Documentos/sofia-ia/docs/vercel-portfolio-chat.md` and this repo `AGENTS.md` (section Portfólio).

## Do

- Server-only `SOFIA_URL` + `SOFIA_TOKEN`
- Keep static `getChatbotReply` as fallback
- UUID `session_id` per visitor
- Never put the token in client bundles

## Do not

- Edit Laravel in `~/Documentos/sofia-ia`
- Use `NEXT_PUBLIC_SOFIA_TOKEN`
