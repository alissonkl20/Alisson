# Deploy do portfólio na VPS Hostinger

Migração completa da Vercel para a mesma VPS que já roda a API de chat (`chat.alissonkisp.tech`).

## Arquitetura

```
alissonkisp.tech (443) ──nginx──► Next.js :3000  (portfólio)
chat.alissonkisp.tech (443) ──nginx──► Hono API :3100 + Ollama
```

Na VPS, o Next.js pode chamar o chat em `http://127.0.0.1:3100` (sem sair pela internet).

## Pré-requisitos na VPS

```bash
# Node 20+ (via nvm ou nodesource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nginx certbot python3-certbot-nginx
sudo npm i -g pm2
```

## 1. Clonar / atualizar o repo

```bash
cd /var/www
sudo git clone git@github.com:alissonkl20/Alisson.git portfolio
sudo chown -R $USER:$USER portfolio
cd portfolio
git checkout develop
```

## 2. Variáveis de ambiente

```bash
cp deploy/hostinger/.env.example .env.production
nano .env.production
```

| Variável | Descrição |
|----------|-----------|
| `GITHUB_TOKEN` | PAT GitHub (mesmo da Vercel) |
| `GITHUB_LOGIN` | Opcional; default em `data.ts` |
| `SOFIA_URL` | `http://127.0.0.1:3100` na mesma VPS |
| `SOFIA_TOKEN` | Igual a `PORTFOLIO_API_TOKEN` do chat |
| `PORT` | `3000` (default) |

Carregar no PM2:

```bash
set -a && source .env.production && set +a
```

## 3. Build e PM2

```bash
npm ci
npm run build
pm2 start deploy/hostinger/ecosystem.config.cjs
pm2 save
pm2 startup   # seguir instrução do comando
```

## 4. Nginx + SSL

```bash
sudo cp deploy/hostinger/nginx.alissonkisp.tech.conf /etc/nginx/sites-available/alissonkisp.tech
sudo ln -sf /etc/nginx/sites-available/alissonkisp.tech /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d alissonkisp.tech -d www.alissonkisp.tech
```

## 5. DNS (hPanel ou MCP)

Apontar para o IP da VPS:

| Tipo | Nome | Valor |
|------|------|-------|
| A | `@` | IP da VPS |
| A | `www` | IP da VPS |
| A | `chat` | IP da VPS (já deve existir) |

## 6. Validar

- `https://alissonkisp.tech` — portfólio carrega
- `https://alissonkisp.tech/api/cv` — PDF do CV
- Chat no widget — resposta via Ollama ou fallback estático
- Gráfico GitHub (usa `GITHUB_TOKEN`)

## 7. Desligar Vercel

Depois de validar DNS + SSL + chat:

1. Remover alias `devkisper.vercel.app` ou apontar domínio custom na Vercel
2. Opcional: pausar projeto na Vercel para não cobrar deploys

## Deploy incremental (atualizações)

Na VPS, na raiz do repo:

```bash
bash deploy/hostinger/deploy.sh
```
