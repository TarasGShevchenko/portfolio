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

| Variable                    | production           | staging                      | local                   |
| --------------------------- | -------------------- | ---------------------------- | ----------------------- |
| `NEXT_PUBLIC_APP_ENV`       | `production`         | `staging`                    | `local`                 |
| `NEXT_PUBLIC_SITE_URL`      | `https://starg.shop` | `https://staging.starg.shop` | `http://localhost:3000` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | optional             | optional                     | optional                |

Only production is indexable by search engines; staging and local send `noindex`. `NEXT_PUBLIC_*` values are inlined at build time, so changing one in Vercel needs a redeploy.

## Workflow and CI/CD

1. Branch off `staging` (`feat/...`, `fix/...`) and open a pull request into `staging`.
2. **CI** (GitHub Actions, `.github/workflows/ci.yml`) runs format check, lint, typecheck and build on every PR and on pushes to `staging` and `master`. Vercel also posts a preview URL on the PR.
3. Merge into `staging` → Vercel deploys https://staging.starg.shop.
4. Open a PR `staging` → `master`, merge → Vercel deploys production at https://starg.shop.

**CD** is handled by the Vercel GitHub integration: every push builds and deploys automatically, with no deploy step in GitHub Actions.
