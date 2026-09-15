# Chat module

Everything related to the portfolio chatbot lives here.

| Path | Role |
|------|------|
| `route.ts` | POST `/api/chat` — server proxy + rate limit |
| `guard.ts` | Rate limit (5 LLM / IP / 24h) on Next.js |
| `client.ts` | HTTP client to Hostinger chat API |
| `bot/` | Static preset fallback (offline) |
| `ui/` | ChatWidget component |
| `shared/` | Contact links (single source) |
| `hostinger/` | Hono API + Ollama — runs on VPS |

## Env (server)

- `SOFIA_URL` — chat API base URL (prod: `http://127.0.0.1:3100`)
- `SOFIA_TOKEN` — same as `PORTFOLIO_API_TOKEN` on VPS
- `CHAT_RATE_LIMIT_MAX` — optional, default `5`

## Deploy

See [hostinger/README.md](./hostinger/README.md) and [deploy/hostinger/README.md](../../../../deploy/hostinger/README.md).
