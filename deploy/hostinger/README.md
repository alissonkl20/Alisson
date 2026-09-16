# Deploy do portfólio na VPS Hostinger

Produção: **https://alissonkisp.tech**

## Arquitetura

```
alissonkisp.tech (443) ──nginx──► Next.js :3000 (PM2)
```

Chat é **100% estático** — `POST /api/chat` usa `bot/treinamento.ts`. Sem Ollama nem API na porta 3100.

## Pré-requisitos na VPS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm i -g pm2
```

Setup inicial (uma vez): `bash deploy/hostinger/provision.sh` (ignore Ollama se ainda estiver no script antigo).

## 1. Clonar / atualizar

```bash
cd /var/www/portfolio
git checkout develop
git pull
```

## 2. Variáveis de ambiente

```bash
cp deploy/hostinger/.env.example .env.production
# editar GITHUB_TOKEN se necessário
```

| Variável | Descrição |
|----------|-----------|
| `GITHUB_TOKEN` | PAT GitHub (read repos/commits) |
| `GITHUB_LOGIN` | Opcional |

## 3. Build e PM2

```bash
npm ci && npm run build
pm2 start deploy/hostinger/ecosystem.config.cjs
pm2 save && pm2 startup
```

## 4. Nginx + SSL

```bash
sudo cp deploy/hostinger/nginx.alissonkisp.tech.conf /etc/nginx/sites-available/alissonkisp.tech
sudo ln -sf /etc/nginx/sites-available/alissonkisp.tech /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d alissonkisp.tech -d www.alissonkisp.tech
```

## 5. Validar

- `https://alissonkisp.tech`
- Chat no widget (respostas instantâneas, sem LLM)
- `/api/github-stats`

## Desligar Ollama (se ainda rodando)

```bash
pm2 delete portfolio-chat-api 2>/dev/null || true
sudo systemctl stop ollama
sudo systemctl disable ollama
```

## Deploy incremental

```bash
bash deploy/hostinger/deploy.sh
# ou: npm run deploy
```
