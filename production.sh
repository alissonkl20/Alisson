#!/usr/bin/env bash
# Deploy de produção na Vercel — rode quando a correção em fix/portfolio estiver pronta.
# Não imprime secrets. Não faz commit nem push.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PROD_ALIAS="${PROD_ALIAS:-devkisper.vercel.app}"
PROJECT="${VERCEL_PROJECT:-alisson}"

red() { printf '\033[31m%s\033[0m\n' "$*"; }
ok() { printf '\033[32m%s\033[0m\n' "$*"; }
info() { printf '\033[36m%s\033[0m\n' "$*"; }

if [[ ! -f package.json ]]; then
  red "package.json não encontrado. Rode a partir da raiz do repositório."
  exit 1
fi

if [[ -n "$(git status --porcelain)" ]]; then
  red "Working tree sujo. Commit ou stash antes do deploy."
  exit 1
fi

info "1/4  lint + build local"
npm run lint
npm run build

info "2/4  conferindo GITHUB_TOKEN no Vercel (só o nome, sem valor)"
if ! npx vercel env ls production --project "$PROJECT" 2>/dev/null | grep -q 'GITHUB_TOKEN'; then
  red "GITHUB_TOKEN não está nas env vars de Production."
  red "Adicione em: Vercel → $PROJECT → Settings → Environment Variables"
  red "Use um PAT novo. Não cole o token neste script."
  exit 1
fi
ok "GITHUB_TOKEN presente em Production."

info "3/4  deploy produção"
DEPLOY_LOG="$(mktemp)"
npx vercel deploy --prod --yes --project "$PROJECT" | tee "$DEPLOY_LOG"
DEPLOY_URL="$(grep -Eo 'https://[a-z0-9.-]+\.vercel\.app' "$DEPLOY_LOG" | grep -v "$PROD_ALIAS" | tail -1 || true)"
rm -f "$DEPLOY_LOG"
if [[ -z "$DEPLOY_URL" ]]; then
  red "Não foi possível ler a URL do deploy."
  exit 1
fi
ok "Deploy: $DEPLOY_URL"

info "4/4  alias $PROD_ALIAS"
npx vercel alias set "$DEPLOY_URL" "$PROD_ALIAS" >/dev/null
ok "https://$PROD_ALIAS"

printf '\nPronto. Abra https://%s e valide gráfico + ASCII.\n' "$PROD_ALIAS"
