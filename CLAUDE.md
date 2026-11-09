# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Next.js version warning

This project uses **Next.js 16.4 / React 19.3**, which is newer than most training data. Before using any Next.js API, config option, or file convention, check the version-matched docs bundled at `node_modules/next/dist/docs/` (`01-app/` for the App Router, which this project uses). Don't rely on memory for caching, prefetching, or routing behavior.

## Commands

- `npm run dev`: start the dev server at http://localhost:3000
- `npm run build`: production build (also type-checks)
- `npm run start`: serve the production build
- `npm run lint` / `lint:fix`: ESLint (flat config: `eslint-config-next` + `eslint-config-prettier` last)
- `npm run format` / `format:check`: Prettier with `prettier-plugin-tailwindcss` (sorts class names)
- `npm run typecheck`: `next typegen && tsc --noEmit` (typegen is needed so `LayoutProps`/`PageProps` exist)
- `npm run check`: format check + lint + typecheck

There is no test framework configured yet. Husky hooks: `pre-commit` → lint-staged, `pre-push` → typecheck. CI (`.github/workflows/ci.yml`) runs format check, lint, typecheck and build.

## Environments and deploys

Branches map to environments: `master` → production (starg.shop), `staging` → staging.starg.shop (Vercel Preview scoped to the `staging` branch), local → `.env.local`. Feature branches merge into `staging` first, then `staging` → `master`. Vercel's Git integration does the deploying; GitHub Actions only runs checks.

Read env vars only through `lib/env.ts` (`env.appEnv`, `env.siteUrl`, `isProduction`), and add new keys to `.env.example` and the README table. `NEXT_PUBLIC_*` values are inlined at build time and must be referenced as literal `process.env.NAME`. Non-production builds set `robots: noindex` in `app/layout.tsx`.

## Architecture

- **App Router only** (`app/`). `app/layout.tsx` is the root layout; it loads Bricolage Grotesque (variable `opsz`/`wdth` axes) via `next/font/google` as `--font-bricolage`. Page props use the global, generated `LayoutProps<"/">` / `PageProps<...>` route types (from `.next/types`), not hand-written prop interfaces.
- **Rendering model** (`next.config.ts`): `cacheComponents: true` and `partialPrefetching: true` are on. Data fetching and caching follow the Cache Components model (`"use cache"`, `<Suspense>` boundaries for dynamic data), and `<Link>` prefetches a per-route App Shell by default. Read `01-app/01-getting-started/08-caching.md` and `01-app/02-guides/prefetching.md` in the bundled docs before adding data fetching or caching. `experimental.agentFeedback` is also enabled.
- **Styling**: Tailwind CSS v4, wired in through a Turbopack loader rule (`@tailwindcss/turbopack` on `*.css` in `next.config.ts`). There is no `postcss.config` or `tailwind.config`. Colors are semantic tokens in `app/globals.css` (`background`, `foreground`, `line`, `muted`, `signal`) backed by CSS variables, so components never need `dark:` variants.
- **Theming**: light/dark follows `prefers-color-scheme` unless `<html data-theme>` overrides it. `components/theme-toggle.tsx` sets the attribute and saves it to `localStorage['theme']`; an inline script in `app/layout.tsx` re-applies it before first paint (no flash). Theme-dependent UI is switched with CSS (see `.theme-icon-*`), not React state, to keep server HTML hydration-safe.
- **Imports**: path alias `@/*` maps to the repo root.
