Staged Dependency Upgrade Guide

This repository uses a staged approach to upgrade dependencies safely. The scripts in `scripts/` automate the recommended commands — run them locally in separate terminals and inspect output before committing.

Prerequisites

- Node.js 18+ (Node 20 recommended)
- pnpm installed globally if you use pnpm (optional)
- git clean working tree (commit or stash changes)

Quick workflow

1. Create a staging branch

```bash
git checkout -b upgrade/deps-staged
```

2. Client (Next.js) staged upgrade

- Stage A: dev tooling (TypeScript, Tailwind, PostCSS)
- Stage B: core (React, React DOM, Next)
- Stage C: UI libs (Radix, Lucide, Framer Motion, Zustand)
- Stage D: remaining packages

Run the provided client script to perform the staged `pnpm up` commands and build steps. Inspect logs and fix issues after each stage.

3. Server (Nest) staged upgrade

Run the server script to run `npx npm-check-updates -u` and install. Inspect `npm run build` and runtime logs.

Files created

- `scripts/staged-upgrade-client.sh` — staged `pnpm up` and build commands for the client
- `scripts/staged-upgrade-server.sh` — runs `npx npm-check-updates -u` and `npm install` for the server

Safety notes

- These scripts do not auto-commit changes. Commit only after verifying the app works.
- Major upgrades may require code changes. If you want, I can scan for common breaking changes and prepare codefix patches after you run the scripts and paste any error logs.
