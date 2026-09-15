#!/usr/bin/env bash
# Endurecimento da VPS — firewall, permissões de env, bind local.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

# Remover env de dev se tiver sido rsync acidentalmente
rm -f "$ROOT/.env.local"

chmod 600 "$ROOT/.env.production" 2>/dev/null || true
chmod 600 "$ROOT/src/app/api/chat/hostinger/.env" 2>/dev/null || true

if command -v ufw >/dev/null; then
  ufw --force reset
  ufw default deny incoming
  ufw default allow outgoing
  ufw allow OpenSSH
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw --force enable
fi

echo "Harden OK. Portas 3000/3100/11434 devem ficar só em 127.0.0.1 (ss -tlnp)."
