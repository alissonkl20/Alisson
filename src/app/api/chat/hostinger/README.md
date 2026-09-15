# Portfolio chat API (Hostinger)

Hono + Ollama. Deploy this folder on your VPS.

## Setup

```bash
# Install Ollama + model
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:3b

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

## Checklist

- `GET /api/portfolio/status` without Bearer → 401
- With Bearer → `{ "online": true, "llm": true }`
- 5 distinct LLM questions → 6th returns 429 + contact links
- Same question twice → cache hit, no extra Ollama call
