# starg.shop

Portfolio and storefront for landing pages: work samples for employers and commercial landing pages built for companies. Built with Next.js 16 (App Router, Cache Components) and Tailwind CSS v4.

## Getting started

```bash
nvm use               # Node 22, see .nvmrc
npm install           # also installs git hooks (husky)
cp .env.example .env.local
npm run dev           # http://localhost:3000
```

## Scripts

| Script                                    | What it does                              |
| ----------------------------------------- | ----------------------------------------- |
| `npm run dev`                             | Dev server                                |
| `npm run build` / `npm run start`         | Production build / serve it               |
| `npm run lint` / `npm run lint:fix`       | ESLint                                    |
| `npm run format` / `npm run format:check` | Prettier (with Tailwind class sorting)    |
| `npm run typecheck`                       | Generate route types, then `tsc --noEmit` |
| `npm run check`                           | Everything CI runs except the build       |

Git hooks: `pre-commit` runs lint-staged (ESLint + Prettier on staged files), `pre-push` runs the typecheck.

## Environments

| Environment | Git branch | URL                        | Vercel environment         |
| ----------- | ---------- | -------------------------- | -------------------------- |
| production  | `master`   | https://starg.shop         | Production                 |
| staging     | `staging`  | https://staging.starg.shop | Preview (branch `staging`) |
| local       | any        | http://localhost:3000      | — (`.env.local`)           |

Variables (see `.env.example`, read through `lib/env.ts`):

| Variable               | production           | staging                      | local                   |
| ---------------------- | -------------------- | ---------------------------- | ----------------------- |
| `NEXT_PUBLIC_APP_ENV`  | `production`         | `staging`                    | `local`                 |
| `NEXT_PUBLIC_SITE_URL` | `https://starg.shop` | `https://staging.starg.shop` | `http://localhost:3000` |
| `GROQ_API_KEY`         | secret               | secret                       | optional                |

`GROQ_API_KEY` is server-only (read via `lib/env.server.ts`) and powers the hero chat at `/api/chat` on Groq's free tier; without it, or when the free quota runs out, the chat answers from prepared replies in `lib/profile.ts`. Only production is indexable by search engines; staging and local send `noindex`. `NEXT_PUBLIC_*` values are inlined at build time, so changing one in Vercel needs a redeploy.

## Workflow and CI/CD

`master` and `staging` are protected on GitHub: no direct pushes, changes land only through a pull request with a green CI check.

1. Branch off `staging` (`feat/...`, `fix/...`, `chore/...`), push it and open a pull request into `staging`.
2. **CI** (GitHub Actions, `.github/workflows/ci.yml`) runs format check, lint, typecheck and build on the PR. Merging is blocked until it passes.
3. Merge into `staging` → Vercel deploys https://staging.starg.shop.
4. Open a PR `staging` → `master`, merge → Vercel deploys production at https://starg.shop.

**CD** is the Vercel GitHub integration. `vercel.json` sets an Ignored Build Step (`scripts/vercel-ignore-build.sh`) so Vercel builds only `master` and `staging`; feature branches and PRs get no deployments. Because both branches are protected, a deploy happens only after a PR is merged.
