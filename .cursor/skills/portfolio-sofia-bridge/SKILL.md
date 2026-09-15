---
name: portfolio-sofia-bridge
description: Portfolio ChatWidget wired to Hostinger VPS chat API (Hono + Ollama) via server-only Route Handler. Use for ChatWidget, /api/chat, SOFIA_URL, SOFIA_TOKEN, orçamento, or VPS deploy.
---

# Portfolio → chat Hostinger

Read this repo `AGENTS.md` and `deploy/hostinger/README.md`.

## Do

- Server-only `SOFIA_URL` + `SOFIA_TOKEN`
- Keep static `createAssistantReply` / `bot/` as fallback
- UUID `session_id` per visitor
- Never put the token in client bundles
- Deploy with `deploy/hostinger/deploy.sh` on the VPS

## Do not

- Use `NEXT_PUBLIC_SOFIA_TOKEN`
- Commit `.env.local` or `.env.production`
