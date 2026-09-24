# Celebrate Florist

Private gift experiences for a single florist in Surakarta. A bouquet carries a QR code. The recipient opens a themed page with a letter, photos, and a photobooth. The founder runs everything from Studio. There is no checkout and no customer accounts.

The current handoff is [docs/17_CURRENT_HANDOFF.md](docs/17_CURRENT_HANDOFF.md). Start there. Older files in `docs/sprint-*` are historical plans. The index is [docs/00_INDEX.md](docs/00_INDEX.md).

## Status

The app branch is `rebuild/foundation`. Production is [celebrate-florist.vercel.app](https://celebrate-florist.vercel.app). Pushes do not deploy by themselves. `celebrateflorist.id` is a different site.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Supabase · Zod

## Getting started

```bash
git checkout rebuild/foundation
npm install
cp .env.example .env.local   # fill in real values; never commit this file
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script                    | Purpose                                      |
| ------------------------- | -------------------------------------------- |
| `npm run dev`             | Development server                           |
| `npm run build`           | Production build                             |
| `npm run start`           | Serve the production build                   |
| `npm run lint`            | ESLint                                       |
| `npm run typecheck`       | TypeScript, no emit                          |
| `npm run format`          | Prettier write                               |
| `npm run verify:supabase` | Auth health check for the configured project |

## Environment

Names and classification live in `.env.example`. Application code reads them through `config/env.ts` and `config/env.server.ts`. `proxy.ts` is the Edge exception: it reads `ADMIN_EMAIL` from `process.env` because it cannot import the server env module.

## Git hooks

Husky runs lint-staged and `npm run typecheck` before each commit.
