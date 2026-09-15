# Deploy do portfólio na VPS Hostinger

Produção: **https://alissonkisp.tech**

## Arquitetura

```
alissonkisp.tech (443) ──nginx──► Next.js :3000
127.0.0.1:3100 ◄── Hono chat API + Ollama (só local, PM2)
127.0.0.1:11434 ◄── Ollama
```

O Next.js chama o chat em `http://127.0.0.1:3100` — não precisa expor a porta 3100 na internet.

## Pré-requisitos na VPS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm i -g pm2
curl -fsSL https://ollama.com/install.sh | sh
ollama pull llama3.2:3b
```

Setup inicial (uma vez): `bash deploy/hostinger/provision.sh`

## 1. Clonar / atualizar

```bash
cd /var/www/portfolio   # git clone … ver histórico do repo
git checkout develop
git pull
```

## 2. Variáveis de ambiente

```bash
cp deploy/hostinger/.env.example .env.production
cp src/app/api/chat/hostinger/.env.example src/app/api/chat/hostinger/.env
# editar tokens
```

| Variável | Descrição |
|----------|-----------|
| `GITHUB_TOKEN` | PAT GitHub (read repos/commits) |
| `SOFIA_URL` | `http://127.0.0.1:3100` |
| `SOFIA_TOKEN` | = `PORTFOLIO_API_TOKEN` do chat |

## 3. Build e PM2

```bash
npm ci && npm run build
cd src/app/api/chat/hostinger && npm ci && npm run build
cd /var/www/portfolio
pm2 start deploy/hostinger/ecosystem.config.cjs
pm2 start src/app/api/chat/hostinger/ecosystem.config.cjs
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
- `https://alissonkisp.tech/api/cv`
- Chat no widget (Ollama ou fallback estático)
- `/api/github-stats`

## Deploy incremental

```bash
bash deploy/hostinger/deploy.sh
# ou, na raiz do repo: npm run deploy
```
