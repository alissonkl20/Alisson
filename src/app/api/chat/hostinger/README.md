# Portfolio chat API (Hostinger) — **deprecated**

The site uses the static bot in `../bot/` only. This Hono + Ollama stack is kept for reference; do not deploy or run on the VPS.

## Setup

```bash
# Install Ollama + model
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:1b
# Preset bot handles most questions; LLM loads on demand (OLLAMA_KEEP_ALIVE=0)

# API
cd src/app/api/chat/hostinger
cp .env.example .env
# edit PORTFOLIO_API_TOKEN
npm ci
npm run build
npm i -g pm2
pm2 start ecosystem.config.cjs
pm2 save
```

## nginx

```nginx
limit_req_zone $binary_remote_addr zone=chat_ip:10m rate=10r/m;

server {
  listen 443 ssl;
  server_name chat.alissonkisp.tech;
  location / {
    limit_req zone=chat_ip burst=3 nodelay;
    proxy_pass http://127.0.0.1:3100;
    proxy_read_timeout 120s;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  }
}
```

## Atualizar conhecimento do chat

1. Edite `../knowledge/portfolio/SKILL.md` (fatos) ou `rules.md` (regras)
2. Seções usam header `## stack`, `## experience`, etc.
3. Na VPS: `npm run build && pm2 restart portfolio-chat-api`

## Checklist

- `GET /api/portfolio/status` without Bearer → 401
- With Bearer → `{ "online": true, "llm": true }`
- 10 distinct LLM questions per IP → 11th returns 429 + contact links
- Same question twice → cache hit, no extra Ollama call
