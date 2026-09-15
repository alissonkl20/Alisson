<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Portfólio — Agent harness (web + chat Hostinger)

Você é o **agent do portfólio**. Trabalhe **somente** neste repositório (`/dados/Documentos/Alisson`).

## Produção

Site em **https://alissonkisp.tech** na VPS Hostinger (nginx + PM2 + Next.js). Chat LLM via API Hono + Ollama local na mesma VPS (`src/app/api/chat/hostinger/`).

## Chat

1. `ChatWidget` (`src/app/api/chat/ui/`) → `POST /api/chat` (mesma origem).
2. `route.ts` — proxy servidor + rate limit; token nunca no browser.
3. `client.ts` — chama a API na VPS (`SOFIA_URL` + `SOFIA_TOKEN`, só servidor).
4. `bot/` — fallback estático se LLM/API offline; **nunca inventar preços**.
5. `session_id` UUID estável em localStorage.

## Env (servidor)

- `SOFIA_URL` — URL da API de chat (prod na VPS: `http://127.0.0.1:3100`)
- `SOFIA_TOKEN` — igual a `PORTFOLIO_API_TOKEN` em `hostinger/.env`
- `GITHUB_TOKEN` — stats GitHub (Route Handler `/api/github-stats`)
- Ver `.env.example` e `deploy/hostinger/README.md`

## Deploy

```bash
bash deploy/hostinger/deploy.sh   # na VPS, após git pull
```

Não commitar `.env.local` nem `.env.production`.
