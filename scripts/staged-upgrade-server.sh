#!/usr/bin/env bash
set -euo pipefail

echo "Running server upgrade: bump package.json via npm-check-updates and install"
cd "$(dirname "$0")/.." || exit 1
cd server || exit 1

npx npm-check-updates -u || true
npm install || true
npm run build || echo "Server build failed — inspect TypeScript errors and runtime logs"

echo "Server staged-upgrade script finished. Review output and address any errors before committing."
