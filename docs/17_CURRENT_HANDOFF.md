# 17 — Current Handoff

> **Updated:** 2026-09-24  
> **Audience:** a programmer joining the project  
> **Related:** [Index](./00_INDEX.md) · [Development guide](./06_DEVELOPMENT_GUIDE.md) · [Security](./04_SECURITY.md) · [AI guide](./07_AI_GUIDE.md)

This file describes the app as it actually runs. Sprint folders (`docs/sprint-*`) are historical plans. Several of them still say Scene Engine, motion, or photobooth work is not authorized. That work has shipped. When an older doc disagrees with this file or the code, follow the code.

---

## What you are taking over

Celebrate Florist pairs a physical bouquet with a private web gift. One founder operates Studio. Buyers and recipients do not have accounts. There is no checkout.

Live themes are **Bloom, Warm, and Sky**. Playful and Pure are frozen. Each live theme has four modes: Moments, Connection, Memories, and Treasures.

Recipient camera photos from the photobooth stay in the browser and are not uploaded. Studio strip templates are different: they are stored in Supabase (`photobooth-strips`, `catalog-photobooth-strips`).

---

## Production

| Item                                   | Value                                                                                                                                                                |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App URL                                | `https://celebrate-florist.vercel.app`                                                                                                                               |
| Vercel project                         | `celebrate-florist` on team `vino-project` (Hobby)                                                                                                                   |
| Current deployment                     | `dpl_5frugw8E8iPuqqcbLbnzcqPMtWzd` (CLI, production, `iad1`)                                                                                                         |
| Git commit recorded on that deployment | `088a932` on `rebuild/foundation`. The upload also contained the analytics files that are now committed. The recorded SHA does not change until the next CLI deploy. |
| GitHub repo                            | `vinoslwly/celebrate-florist`                                                                                                                                        |
| App branch                             | `rebuild/foundation`                                                                                                                                                 |
| `main`                                 | Not the app. Do not deploy it.                                                                                                                                       |
| Supabase                               | `celebrate-florist-prod` (`jobknyooffpouniyqpkp`, `ap-southeast-1`)                                                                                                  |

`https://celebrateflorist.id` is a separate site (different host, different page). It is not a domain on this Vercel project. Shipping this repo does not update that domain.

GitHub is **not** connected to Vercel. A push does not deploy. Production is published with the Vercel CLI from a local checkout.

### Git and the live deployment

Web Analytics and Speed Insights live in `components/visitor-metrics.tsx` and are mounted from `app/layout.tsx`. They are in git. Speed Insights Plus was not enabled. The free tier is what is running.

The current production deployment was created before this commit, so Vercel still labels it `088a932`. The analytics code on that deployment matches this repo. A later `vercel deploy` is what moves the recorded SHA. A GitHub push does not.

Web Analytics is enabled on the Vercel project. Gift tokens in `/e/...` and `/preview/...`, and Studio order ids, are rewritten before those events are sent.

---

## Stack

| Layer          | Version in `package.json`                             |
| -------------- | ----------------------------------------------------- |
| Next.js        | 16.2.10 (App Router, `proxy.ts`, not `middleware.ts`) |
| React          | 19.2.4                                                |
| TypeScript     | 5.x, strict                                           |
| Tailwind CSS   | 4.x                                                   |
| Supabase       | `@supabase/supabase-js` 2.x, `@supabase/ssr`          |
| Node on Vercel | 24.x                                                  |

Read `node_modules/next/dist/docs/` before using a Next.js API. This release does not match older training data.

---

## Routes

| Route                                                                                                          | Role                                                                                 |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `/`                                                                                                            | Marketing site. Static at build time.                                                |
| `/studio/login`                                                                                                | Studio sign-in. Static HTML, but the proxy still runs.                               |
| `/studio`, `/studio/orders`, `/studio/orders/new`, `/studio/orders/[id]`, `/studio/settings`, `/studio/strips` | Dynamic Studio.                                                                      |
| `/e/[token]`                                                                                                   | Recipient gift. Dynamic. Private.                                                    |
| `/e/[token]/trust`                                                                                             | Sets the trusted-device cookie during the 24-hour grace window, then redirects back. |
| `/preview/[token]`                                                                                             | Buyer preview. Dynamic. Not matched by the proxy.                                    |
| `/api/studio/experiences/[experienceId]/qr`                                                                    | QR download.                                                                         |
| `/theme-lab/bloom`, `/sky`, `/warm`                                                                            | Exist in the repo. **Production `proxy.ts` returns 404.**                            |

---

## Security invariants

Do not change these unless the founder explicitly asks:

- Studio RLS uses `public.is_studio_admin()`. A random authenticated user is not an admin. The allowlisted email lives in `app_settings.admin_email` and is synced from `ADMIN_EMAIL` by the server. An empty setting fails closed.
- `anon` cannot read gift tables. Recipient data is loaded with `service_role` only after the access gate.
- Memory Code is stored as a hash. Grace period stays 24 hours. An experience locks after 20 failed Memory Code attempts on that gift, ignoring IP. There is also a secondary per-IP hourly limit.
- Studio login throttles at 8 failures in 15 minutes and returns one generic error. It does not reveal whether the email exists.
- Signup is disabled in production and in `supabase/config.toml`. Do not re-enable it.
- `IP_HASH_PEPPER` is set on Vercel Production. Never print it, commit it, or put it in a chat.
- Do not weaken CSP, the Theme Lab production 404, or the photobooth camera model (client-only capture, `blob:` URLs).
- Do not run `npm audit fix --force` or mass-upgrade dependencies.
- Do not edit a migration that is already applied. Add a new file.
- Leaked-password protection in Supabase Auth is a paid feature. It is out of scope. Do not upgrade the Supabase plan to turn it on.

`sharp` and its Linux libvips binaries are traced into every serverless route via `outputFileTracingIncludes` in `next.config.ts`. That exists because Studio image uploads failed on Vercel without libvips. Do not delete that include unless you have checked that uploads still succeed on a preview deployment.

---

## Database

26 files in `supabase/migrations/`. Hosted history includes all of them, through `studio_admin_rls` (hosted version `20260923093146`). Repo filenames and hosted version numbers differ for the early Sprint 03A files. That is expected. Do not re-apply them.

Buckets used by the app:

| Bucket                      | Use                                     |
| --------------------------- | --------------------------------------- |
| `experience-photos`         | Gift photos. Signed URLs.               |
| `experience-qr`             | QR images.                              |
| `photobooth-strips`         | Strip images attached to an experience. |
| `catalog-photobooth-strips` | Studio catalog of strip templates.      |
| `website-assets`            | Marketing images edited in Studio.      |

`docs/03_DATABASE.md` still describes the earlier table set. Use the SQL files and `lib/storage/buckets.ts` for the current shape.

---

## Local setup

```bash
git clone https://github.com/vinoslwly/celebrate-florist.git
cd celebrate-florist
git checkout rebuild/foundation
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` from the Supabase dashboard and from the founder. Required for a real local Studio and gift flow:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (`http://localhost:3000`)
- `SUPABASE_SERVICE_ROLE_KEY`
- `MEMORY_KEY_PEPPER`
- `IP_HASH_PEPPER`
- `ADMIN_EMAIL` (must match the single Studio user)

`npm run verify:supabase` only checks that the Auth health endpoint answers. It does not prove RLS.

Pre-commit runs lint-staged, then `npm run typecheck`. ESLint allows zero warnings. `react-hooks/set-state-in-effect` is an error. On PowerShell, do not chain commands with `&&`.

There is no automated test suite.

---

## Deploy

From a clean, intended tree:

```bash
npx vercel deploy --prod --scope vino-project
```

That publishes the working directory, not “whatever is on GitHub”. Confirm `git status` first.

Environment variables already exist on the Vercel project for Production. Do not rotate or print them as part of onboarding.

---

## Where to read next

| Need                          | Document                                               |
| ----------------------------- | ------------------------------------------------------ |
| Product rules that are locked | [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md)   |
| Recipient order of scenes     | [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) |
| How to run and migrate        | [06_DEVELOPMENT_GUIDE.md](./06_DEVELOPMENT_GUIDE.md)   |
| Threat model                  | [04_SECURITY.md](./04_SECURITY.md)                     |
| Rules for AI edits            | [07_AI_GUIDE.md](./07_AI_GUIDE.md)                     |

Ignore “current sprint” tables in older docs when they conflict with this page.
