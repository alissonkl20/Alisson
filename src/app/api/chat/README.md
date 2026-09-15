# Chat module

Everything related to the portfolio chatbot lives here.

| Path | Role |
|------|------|
| `route.ts` | Vercel POST `/api/chat` proxy + guard |
| `guard.ts` | Rate limit (5 LLM / IP / 24h) on Vercel |
| `client.ts` | HTTP client to Hostinger API |
| `bot/` | Static preset fallback (offline) |
| `ui/` | ChatWidget component |
| `shared/` | Contact links (single source) |
| `hostinger/` | Hono API + Ollama — deploy on VPS |

## Vercel env

- `SOFIA_URL` — HTTPS of Hostinger API (no trailing slash)
- `SOFIA_TOKEN` — same as `PORTFOLIO_API_TOKEN` on VPS
- `CHAT_RATE_LIMIT_MAX` — optional, default `5`

## Deploy VPS

See [hostinger/README.md](./hostinger/README.md).
