#!/usr/bin/env bash
# Installs and starts the Azurite blob emulator plus the Azure SDK used by
# tests/fixtures/azhelper.js for setup and verification.
set -euo pipefail
mkdir -p /tmp/az
cd /tmp/az
if [ ! -f package.json ]; then
  npm init -y >/dev/null
fi
npm install --no-audit --no-fund --silent azurite@3.29.0 @azure/storage-blob@12.17.0
mkdir -p /tmp/az/data
nohup /tmp/az/node_modules/.bin/azurite-blob \
  --blobHost 127.0.0.1 --blobPort 10000 \
  --location /tmp/az/data --skipApiVersionCheck --loose \
  > /tmp/az/azurite.log 2>&1 &
for i in $(seq 1 60); do
  if (echo > /dev/tcp/127.0.0.1/10000) >/dev/null 2>&1; then
    echo "Azurite is up"
    exit 0
  fi
  sleep 1
done
echo "Azurite failed to start"
cat /tmp/az/azurite.log || true
exit 1
