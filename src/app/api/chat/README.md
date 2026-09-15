# Chat module

Everything related to the portfolio chatbot lives here.

| Path | Role |
|------|------|
| `route.ts` | POST `/api/chat` — server proxy to VPS API |
| `client.ts` | HTTP client to Hostinger chat API |
| `bot/` | Static preset fallback (API offline only) |
| `ui/` | ChatWidget component |
| `shared/` | Contact links (single source) |
| `hostinger/` | Hono API + Ollama — runs on VPS |

## Rate limit

**10 LLM questions per IP per 24h**, enforced on the VPS API (`RATE_LIMIT_MAX`). Cached/idempotent repeats do not call Ollama again.

## Env (server)

- `SOFIA_URL` — chat API base URL (prod: `http://127.0.0.1:3100`)
- `SOFIA_TOKEN` — same as `PORTFOLIO_API_TOKEN` on VPS

## Deploy

See [hostinger/README.md](./hostinger/README.md) and [deploy/hostinger/README.md](../../../../deploy/hostinger/README.md).
