#!/usr/bin/env bash
set -euo pipefail

echo "Running staged client upgrade (PNPM). Stop on errors and fix before continuing."
cd "$(dirname "$0")/.." || exit 1
cd client || exit 1

echo "Stage A — Dev tooling: TypeScript, Tailwind, PostCSS"
pnpm up -L typescript@latest tailwindcss@latest postcss@latest @tailwindcss/postcss@latest || true
pnpm install || true
pnpm exec tsc --noEmit || echo "TypeScript check failed — fix types before proceeding"

echo "Stage B — Core framework: next, react, react-dom"
pnpm up -L next@latest react@latest react-dom@latest || true
pnpm install || true
pnpm run build || echo "Build failed — inspect and fix issues"

echo "Stage C — UI libraries: radix, lucide, framer-motion, zustand, forms"
pnpm up -L @radix-ui/react-* lucide-react framer-motion zustand react-hook-form @hookform/resolvers || true
pnpm install || true
pnpm run build || echo "Build failed — inspect and fix issues"

echo "Stage D — remaining dependencies"
pnpm up -L || true
pnpm install || true
pnpm run build || echo "Final build failed — inspect and fix issues"

echo "Client staged-upgrade script finished. Review output and address any errors before committing."
