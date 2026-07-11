# 06 — Development Guide

> **Related:** [Project Context](./01_PROJECT_CONTEXT.md) · [Architecture](./02_ARCHITECTURE.md) · [Database](./03_DATABASE.md) · [AI Guide](./07_AI_GUIDE.md)

---

## Prerequisites

| Tool         | Version | Notes                                                                 |
| ------------ | ------- | --------------------------------------------------------------------- |
| Node.js      | 20.x+   | LTS recommended                                                       |
| npm          | 10.x+   | Comes with Node                                                       |
| Git          | 2.x+    |                                                                       |
| Supabase CLI | Latest  | Optional for local DB; migrations can be applied via dashboard or MCP |
| Vercel CLI   | Latest  | Optional for deployment                                               |

---

## Installation

```bash
# Clone the repository
git clone https://github.com/vinoslwly/celebrate-florist.git
cd celebrate-florist

# Checkout the active development branch
git checkout rebuild/foundation

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
```

### Environment Setup

Edit `.env.local` with real values:

```env
# Public (safe in browser)
NEXT_PUBLIC_SUPABASE_URL=https://jobknyooffpouniyqpkp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Server-only (leave empty until Sprint 04+)
SUPABASE_SERVICE_ROLE_KEY=
MEMORY_KEY_PEPPER=

# Admin (never commit real value)
ADMIN_EMAIL=your-admin@email.com
```

Get Supabase keys from the [Supabase dashboard](https://supabase.com/dashboard/project/jobknyooffpouniyqpkp/settings/api).

---

## Running Locally

```bash
# Development server (Turbopack)
npm run dev

# Open http://localhost:3000
```

### Verify Supabase Connectivity

```bash
npm run verify:supabase
```

This hits the Supabase Auth health endpoint — confirms URL and anon key are valid. Does not query any tables.

### Other Commands

| Command                | Purpose                           |
| ---------------------- | --------------------------------- |
| `npm run build`        | Production build                  |
| `npm run start`        | Serve production build            |
| `npm run lint`         | ESLint check                      |
| `npm run lint:fix`     | ESLint auto-fix                   |
| `npm run typecheck`    | TypeScript check (`tsc --noEmit`) |
| `npm run format`       | Prettier write                    |
| `npm run format:check` | Prettier check                    |

---

## Branch Strategy

| Branch               | Purpose                                                |
| -------------------- | ------------------------------------------------------ |
| `main`               | Stable baseline (initial Create Next App — not active) |
| `rebuild/foundation` | **Active development branch** — all sprints            |

### Workflow

1. All work happens on `rebuild/foundation` (or feature branches merged into it).
2. Feature branches optional for large sprints: `feat/sprint-04-studio-auth`.
3. Merge to `rebuild/foundation` via PR or direct push (solo developer).
4. `main` will be updated when the rebuild is production-ready.

---

## Git Workflow

### Pre-commit Hooks

Husky + lint-staged run on every commit:

- `*.{ts,tsx}` → ESLint fix + Prettier
- `*.{js,jsx,mjs,cjs,json,css,md}` → Prettier

### Commit Style

Follow existing history:

```
feat: Sprint 01 landing page implementation and hardening
feat(db): Sprint 03A database schema, hardening, and admin email lock
fix(security): remove admin email from version control
feat: Sprint 02B foundation hardening (proxy, CSP, security headers)
chore: Sprint 00 engineering foundation
```

Format: `<type>: <description>` where type is `feat`, `fix`, `chore`, `docs`, etc.

### What Never Goes in Git

- `.env.local` (gitignored)
- Real `ADMIN_EMAIL` value
- `SUPABASE_SERVICE_ROLE_KEY`
- `MEMORY_KEY_PEPPER`

---

## Migration Workflow

### File Location

```
supabase/migrations/
├── 20260710210001_extensions.sql
├── 20260710210002_enums.sql
├── ...
└── 20260710210015_seed_admin_email.sql
```

### Naming Convention

`YYYYMMDDHHMMSS_description.sql` — timestamp prefix ensures ordering.

### Rules

1. **Never modify applied migrations** — create a new migration instead.
2. **One concern per file** — tables, constraints, indexes, RLS are separate files.
3. **Comment every migration** — explain what and why in the file header.
4. **Test locally** before applying to production Supabase.
5. **Update [03_DATABASE.md](./03_DATABASE.md)** when schema changes.

### Applying Migrations

**Option A: Supabase CLI (local Docker)**

```bash
supabase db reset    # Reset local DB and apply all migrations
supabase db push     # Push to linked remote project
```

**Option B: Supabase Dashboard**

SQL Editor → paste migration content → run.

**Option C: Supabase MCP** (used during Sprint 03A audit)

Apply via `apply_migration` tool on project `jobknyooffpouniyqpkp`.

### Current State

All 15 migration files in `supabase/migrations/` are applied on remote `celebrate-florist-prod`. Schema is in sync.

> **Note:** Remote Supabase migration history shows **16 entries** because the Sprint 03A audit applied two `rls_auto_enable` revokes separately; the repo consolidates them into file 012. See [03_DATABASE.md#repo-vs-remote-migration-history](./03_DATABASE.md#repo-vs-remote-migration-history).

---

## Supabase Workflow

### Project Details

| Property     | Value                                                                                 |
| ------------ | ------------------------------------------------------------------------------------- |
| Project name | `celebrate-florist-prod`                                                              |
| Project ID   | `jobknyooffpouniyqpkp`                                                                |
| Region       | `ap-southeast-1`                                                                      |
| Dashboard    | [supabase.com/dashboard](https://supabase.com/dashboard/project/jobknyooffpouniyqpkp) |

### Client Usage

| Client  | File                     | When to use                                            |
| ------- | ------------------------ | ------------------------------------------------------ |
| Browser | `lib/supabase/client.ts` | Client Components (future Studio auth)                 |
| Server  | `lib/supabase/server.ts` | Server Components, Server Actions (anon key + cookies) |
| Admin   | `lib/supabase/admin.ts`  | **Future** — service_role for privileged operations    |

### Auth Setup

One admin user exists in Supabase Auth: `varrelakun@gmail.com`. Created manually during Sprint 03A setup.

---

## Build Process

```bash
npm run typecheck   # Must pass
npm run lint        # Must pass
npm run build       # Production build
```

Build validates `config/env.ts` at compile time — missing `NEXT_PUBLIC_*` vars cause build failure.

`config/env.server.ts` secrets are optional until Sprint 04 — build succeeds with empty values.

---

## Lint & Typecheck

### ESLint

Config: `eslint.config.mjs` with `eslint-config-next` + `eslint-config-prettier` + `eslint-plugin-import`.

```bash
npm run lint        # Check
npm run lint:fix    # Auto-fix
```

### TypeScript

Strict mode with additional checks:

- `noUncheckedIndexedAccess`
- `noImplicitOverride`
- `forceConsistentCasingInFileNames`

```bash
npm run typecheck
```

### Prettier

```bash
npm run format:check   # CI-style check
npm run format         # Auto-format
```

---

## Testing

**Status:** No automated test suite exists.

| Type                | Status                                              |
| ------------------- | --------------------------------------------------- |
| Unit tests          | Not implemented                                     |
| Integration tests   | Not implemented                                     |
| E2E tests           | Not implemented                                     |
| Manual verification | `npm run verify:supabase` (connectivity only)       |
| Security audit      | Sprint 03A — 53 manual checks against live Supabase |

### Future Work

Add tests when Studio and Experience features are implemented. Priority: Access Code verification, RLS policy tests, Server Action integration tests.

---

## Deployment

### Platform

Vercel — project linked (`.vercel/` directory present).

### Environment Variables (Vercel Dashboard)

Set the same variables as `.env.local`:

| Variable                        | Environment                                    |
| ------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Production, Preview                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview                            |
| `NEXT_PUBLIC_APP_URL`           | Production (real domain), Preview (Vercel URL) |
| `SUPABASE_SERVICE_ROLE_KEY`     | Production only (when Studio ships)            |
| `MEMORY_KEY_PEPPER`             | Production only (when Experience ships)        |
| `ADMIN_EMAIL`                   | Production only (when Studio ships)            |

### Deploy Commands

```bash
# Via Vercel CLI
vercel          # Preview deploy
vercel --prod   # Production deploy

# Or push to rebuild/foundation — Vercel auto-deploys if connected
```

### What Is Deployable Today

The landing page (`(public)` route group) deploys successfully. It requires only the three `NEXT_PUBLIC_*` variables.

---

## Folder Conventions

```
app/                    # Next.js App Router pages and layouts
  (public)/             # Public marketing routes
  (studio)/             # Admin routes (future)
  (experience)/         # Recipient routes (future)

components/
  providers/            # React context providers
  shared/               # Cross-feature reusable components
  ui/                   # shadcn/ui primitives

config/                 # Environment validation (env.ts, env.server.ts)

features/<domain>/        # Feature modules (domain-driven)
  components/           # UI for this domain
  hooks/                # React hooks
  actions/              # Server Actions
  services/             # Business logic
  repositories/         # Database queries
  config/               # Static config for this domain

lib/                    # Shared utilities (supabase clients, utils)
types/                  # Shared TypeScript types
public/                 # Static assets
scripts/                # CLI scripts (verify-supabase)
supabase/migrations/    # SQL migrations
docs/                   # This documentation
proxy.ts                # Session refresh (root level, Next.js 16 convention)
```

---

## Naming Conventions

| Entity           | Convention               | Example                                 |
| ---------------- | ------------------------ | --------------------------------------- |
| Files            | kebab-case               | `bouquet-catalog.ts`, `site-navbar.tsx` |
| React components | PascalCase               | `HeroSection`, `SiteNavbar`             |
| Functions        | camelCase                | `createClient`, `buildWhatsAppUrl`      |
| Constants        | camelCase or UPPER_SNAKE | `allThemes`, `ADMIN_EMAIL`              |
| Database tables  | snake_case               | `experience_photos`, `audit_logs`       |
| Database columns | snake_case               | `memory_key_hash`, `sort_order`         |
| Enums (Postgres) | snake_case               | `order_status`, `audit_actor_type`      |
| Route groups     | parentheses, lowercase   | `(public)`, `(studio)`                  |
| Feature folders  | lowercase                | `features/landing/`, `features/access/` |
| Migrations       | timestamp prefix         | `20260710210003_tables.sql`             |
| CSS variables    | kebab-case with `--`     | `--font-sans`, `--primary`              |

### Import Paths

Use `@/` alias (maps to project root):

```typescript
import { env } from "@/config/env";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/features/landing/components/hero-section";
```

---

## How Future Contributors Should Work

1. **Read [docs/00_INDEX.md](./00_INDEX.md)** and follow the reading order.
2. **Check sprint status** — know what's built and what's next.
3. **Respect [Founder Decisions](./05_FOUNDER_DECISIONS.md)** — don't add features outside scope.
4. **Match existing patterns** — read surrounding code before writing.
5. **Validate env at build time** — use `config/env.ts`, never raw `process.env`.
6. **One migration per concern** — never edit applied migrations.
7. **Update docs** when changing schema, security, or business rules.
8. **Run lint + typecheck** before committing.
9. **Don't speculate** — build only what the current sprint requires.

---

## Technical Debt & Security Backlog

The following items are low/medium-priority findings that do not block production but should be addressed in future sprints:

| ID     | Priority | Area           | Description                                                                                                       | Resolution Plan                                                                                                                                                  |
| ------ | -------- | -------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MED-01 | Medium   | Auth Logging   | `loginAction` logs the raw submitted email on credential failure. This can pollute logs with PII.                 | Update `securityLogger` in `features/studio/actions/auth.ts` to log only the email domain (e.g. `email.split("@")[1]`), rather than the full address.            |
| LOW-01 | Low      | Open Redirect  | `loginAction` returns `redirectTo` from server (`/studio`), which the client follows without validation.          | When redirect paths become dynamic, ensure client or server validates that `redirectTo` is a relative path or trusted origin to prevent open redirects.          |
| LOW-02 | Low      | Barrel Clarity | `lib/auth/index.ts` exports `isAdminEmailMatch` without a `server-only` guard, mixing with `server-only` exports. | Separate Edge-safe pure functions into an explicit `lib/auth/edge.ts` or similar barrel to prevent accidental `server-only` build failures on client components. |

---

## Common Issues

| Issue                        | Solution                                                        |
| ---------------------------- | --------------------------------------------------------------- |
| Build fails on env vars      | Ensure `.env.local` exists with all `NEXT_PUBLIC_*` values      |
| `server-only` import error   | You're importing `config/env.server.ts` from a Client Component |
| Supabase health check fails  | Verify URL and anon key in `.env.local`                         |
| Husky hook fails             | Run `npm run lint:fix && npm run format` then recommit          |
| PowerShell `&&` syntax error | Use `;` instead of `&&` in PowerShell commands                  |

---

## Related Documents

- [00_INDEX.md](./00_INDEX.md) — documentation entry point
- [03_DATABASE.md](./03_DATABASE.md) — schema reference and migration history
- [04_SECURITY.md](./04_SECURITY.md) — secrets and env variable rules
- [07_AI_GUIDE.md](./07_AI_GUIDE.md) — coding standards for AI assistants
