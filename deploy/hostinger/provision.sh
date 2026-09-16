#!/usr/bin/env bash
# Provisionamento inicial da VPS Hostinger (rodar como root, uma vez).
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y nginx certbot python3-certbot-nginx git curl ca-certificates gnupg

if ! command -v node >/dev/null || [[ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

npm install -g pm2

mkdir -p /var/www/portfolio
systemctl enable nginx
systemctl start nginx

echo "Provision OK: node $(node -v), pm2 $(pm2 -v), nginx $(nginx -v 2>&1 | awk '{print $3}')"
