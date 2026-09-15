#!/usr/bin/env bash
# Atualiza o portfólio na VPS Hostinger (pull + build + reload PM2).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

red() { printf '\033[31m%s\033[0m\n' "$*"; }
ok() { printf '\033[32m%s\033[0m\n' "$*"; }
info() { printf '\033[36m%s\033[0m\n' "$*"; }

if [[ ! -f package.json ]]; then
  red "Rode a partir da raiz do repositório."
  exit 1
fi

if [[ ! -f .env.production ]]; then
  red ".env.production não encontrado. Copie deploy/hostinger/.env.example"
  exit 1
fi

info "1/5  git pull"
git pull --ff-only

info "2/5  harden (env + firewall)"
bash deploy/hostinger/harden-vps.sh

info "3/5  npm ci + build"
npm ci
set -a && source .env.production && set +a
npm run build

info "4/5  pm2 reload"
pm2 reload deploy/hostinger/ecosystem.config.cjs --update-env || \
  pm2 start deploy/hostinger/ecosystem.config.cjs

info "5/5  pm2 save"
pm2 save

ok "Deploy concluído. Valide https://alissonkisp.tech"
