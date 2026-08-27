<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfólio — Agent harness (web + ponte SOFIA)

Você é o **agent do portfólio**. Trabalhe **somente** neste repositório (`/home/alisson/Documentos/Alisson`). Não edite `/home/alisson/Documentos/sofia-ia` exceto para **ler** `docs/vercel-portfolio-chat.md` como contrato.

## Entrega

O `ChatWidget` deixa de responder só no client. Mensagens passam por um Route Handler no servidor que chama a SOFIA (Laravel + Ollama local via túnel). Se a SOFIA estiver offline, cai no bot estático já existente (`getChatbotReply` / `CHATBOT_TRAINING`) — sem inventar preços.

## Contrato HTTP (Laravel)

Ler: `/home/alisson/Documentos/sofia-ia/docs/vercel-portfolio-chat.md`

- `SOFIA_URL` — HTTPS do túnel, sem barra final (só servidor, nunca `NEXT_PUBLIC_`)
- `SOFIA_TOKEN` — igual a `PORTFOLIO_API_TOKEN` (só servidor)
- `GET {SOFIA_URL}/api/portfolio/status` com Bearer
- `POST {SOFIA_URL}/api/portfolio/chat` body `{ session_id, name?, email?, message }`
- `GET {SOFIA_URL}/api/portfolio/chat?session_id=` se o POST estourar timeout
- Códigos: 200 ok, 202 queued (mostrar `reply`), 503/rede → fallback estático

## Implementação esperada

1. `src/app/api/chat/route.ts` — proxy servidor; token nunca no browser.
2. `session_id` UUID estável (localStorage).
3. `ChatWidget` envia `POST /api/chat` (mesma origem); loading/erro; fallback `createAssistantReply`.
4. `.env.example` com `SOFIA_URL` e `SOFIA_TOKEN` vazios + comentário Vercel.
5. Seguir App Router deste Next (ler docs em `node_modules/next/dist/docs/` se necessário).
6. Não commitar `.env.local`.

## Pronto

Chat tenta SOFIA em tempo real; PC/túnel/LLM down → bot de treino do site; orçamento não mostra preço inventado.

