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

Add tests when Studio and Experience features are implemented. Priority: Memory Code grace-period verification, RLS policy tests, Server Action integration tests.

---

## Deployment

### Platform

Vercel — project linked (`.vercel/` directory present).

### Environment Variables (Vercel Dashboard)

Set the same variables as `.env.local`. For Sprint 07 Moments E2E, **all variables below are required** in Production (and Preview if testing recipient/preview flows).

| Variable                        | Environment                                    |
| ------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Production, Preview                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview                            |
| `NEXT_PUBLIC_APP_URL`           | Production (real domain), Preview (Vercel URL) |
| `SUPABASE_SERVICE_ROLE_KEY`     | Production, Preview (recipient/preview/QR)     |
| `MEMORY_KEY_PEPPER`             | Production, Preview (Memory Code save/verify)  |
| `ADMIN_EMAIL`                   | Production, Preview, **Edge** (proxy.ts gate)  |

### Sprint 07 Deployment Readiness Checklist

Required environment variables and failure modes:

| Variable                        | Required where                 | What breaks if missing                                                                           |
| ------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | Client + server                | App cannot connect to Supabase                                                                   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + server                | Auth and Studio client fail                                                                      |
| `NEXT_PUBLIC_APP_URL`           | Server (publish, QR)           | Recipient/preview URLs and QR codes point to wrong host                                          |
| `SUPABASE_SERVICE_ROLE_KEY`     | Server (`createAdminClient`)   | `/preview/[token]`, `/e/[token]`, QR download API, analytics, trust route — `ConfigError` or 404 |
| `MEMORY_KEY_PEPPER`             | Server (hash/verify)           | Memory Code save in Studio and post-grace recipient verify fail with `ConfigError`               |
| `ADMIN_EMAIL`                   | Server + **Edge** (`proxy.ts`) | Studio: non-admin lockout or open redirect loop; must match Supabase Auth admin email            |

**Edge note:** `ADMIN_EMAIL` must be set in Vercel env for Production **and** Preview — `proxy.ts` runs on Edge and cannot read `env.server.ts`.

### Grace Period — Engineering Verification (Sprint 07)

**Code-verified (this remediation pass):**

| Check                                         | Evidence                                                                             |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| Grace window = `first_opened_at + 24h`        | `grace-period.service.ts` — no `grace_expires_at` column                             |
| Pre-first-open treated as in-grace            | `isWithinGracePeriod(null) === true`                                                 |
| Trust cookie only via route handler           | `app/(experience)/e/[token]/trust/route.ts`                                          |
| Post-grace requires Memory Code on new device | `evaluateAccessGate` → `memory_code_required` when not in grace and no valid session |
| Trusted session validation                    | `isTrustedSessionValid` + HttpOnly `cf_experience_session` cookie                    |
| `first_opened_at` set once on granted access  | `experiences.repository.ts` — `.is("first_opened_at", null)` guard                   |

**Manually verified (founder session, local dev):**

| Check                                              | Status                             |
| -------------------------------------------------- | ---------------------------------- |
| First recipient open within grace (no Memory Code) | ✅ Confirmed after trust-route fix |
| Publish → QR → recipient link                      | ✅ Confirmed                       |

**NOT verified locally (requires production-like multi-device test):**

| Check                                        | Why not verified                                                                | How to verify in production                                                                                |
| -------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Trusted device post-grace — no code          | Requires 24h elapsed or DB `first_opened_at` backdate + existing session cookie | Open on Device A during grace; wait 24h; reopen Device A — should skip Memory Code                         |
| Post-grace new device — Memory Code required | Same — need grace expiry on a published experience                              | After grace expiry, open on Device B without cookie — should show Memory Code gate; correct code → trusted |

Do not fabricate multi-device grace evidence. Schedule the above as a **post-deploy smoke test** before first real bouquet delivery.

### Sprint 08 — Connection Verification (Phase 7)

**Code-verified:**

| Check                                                      | Evidence                                                                                  |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Buyer preview loads quiz for `connection` mode only        | `fetch-buyer-preview.service.ts`                                                          |
| Preview DTO excludes `correct_option_index`                | `fetch-preview-quiz.service.ts` → `PreviewQuizView`                                       |
| Recipient DTO excludes `correct_option_index`              | `fetch-recipient-quiz.service.ts` → `RecipientQuizView`                                   |
| Grading is server-side only; answers not persisted         | `submit-quiz-answers.service.ts`, `grade-quiz-answers.service.ts` (OD-5)                  |
| Connection publish requires 1–6 questions + ≥ 1 score band | `publish-validation.service.ts`                                                           |
| Mode change deletes quiz rows when leaving Connection      | `change-experience-mode.service.ts`                                                       |
| Analytics uses `experience_opened` only (OD-1)             | `app/(experience)/e/[token]/page.tsx`; no migration 020 in repo                           |
| Memories publish blocked; Treasures publish blocked        | `publish-validation.service.ts` — **Memories unblocked Phase 5**; Treasures still blocked |

### Sprint 08R — Connection Journey Verification

> **SSOT:** [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) · **Founder decisions:** CF-1–CF-5 in [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md)

#### Architecture verification

| Check                                               | Evidence                                                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------ |
| Connection uses `fetchConnectionGatePayload()` only | `app/(experience)/e/[token]/page.tsx` — Connection branch (line ~58)           |
| Moments uses `fetchPublishedExperience()` only      | Same file — Moments branch (line ~69)                                          |
| `ConnectionExperienceFlow` is client orchestrator   | `features/experience/components/connection-experience-flow.tsx`                |
| `QuizPlayer` is quiz-only (reusable)                | `features/quiz/components/quiz-player.tsx` — no letter/gallery/session unlock  |
| Mode registry discriminated union                   | `features/experience/config/mode-registry.tsx` — `connectionGate` vs `payload` |

#### Security verification

| Check                                            | Evidence                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| Gate projection strips letter fields             | `toConnectionGateExperience()` in `fetch-connection-gate-payload.service.ts`   |
| Reward built only post-submit                    | `buildConnectionRewardPayload()` in `submit-quiz-answers.service.ts`           |
| `correct_option_index` absent from recipient DTO | `RecipientQuizQuestion` type; `fetch-recipient-quiz.service.ts`                |
| Letter/gallery not rendered pre-unlock (SSR)     | `connection-unlock-session.ts` returns `null` on server → `isUnlocked = false` |
| Gallery signed URLs not in initial payload       | `ConnectionGatePayload` type excludes photos                                   |

#### Regression verification

| Area                                      | Status       | Notes                                                    |
| ----------------------------------------- | ------------ | -------------------------------------------------------- |
| Moments recipient flow                    | ✅ Unchanged | Still `fetchPublishedExperience()` + `MomentsExperience` |
| Memories/Treasures stubs                  | ✅ Unchanged | Non-live path unchanged                                  |
| Studio / Quiz Builder                     | ✅ Unchanged | No 08R changes                                           |
| Publish flow                              | ✅ Unchanged | Connection publish validation intact                     |
| Access gate / Memory Code / grace / trust | ✅ Unchanged | Gate logic in `page.tsx` preserved                       |
| Analytics                                 | ✅ Unchanged | `experience_opened` on granted access                    |
| Theme                                     | ✅ Unchanged | Resolved via gate or published payload                   |
| Photobooth                                | ✅ Unchanged | Post-unlock (Connection) or immediate (Moments)          |
| Buyer preview backend                     | ✅ Unchanged | `fetchBuyerPreview` / `fetchPreviewQuiz` preserved       |

#### Acceptance criteria (Sprint 08R)

| #   | Criterion                                                                      | Status |
| --- | ------------------------------------------------------------------------------ | ------ |
| 1   | Connection journey: Quiz → Submit → Score+Band → Letter → Gallery → Photobooth | ✅     |
| 2   | Buyer preview: Quiz → Letter → Gallery → Approve (no gating)                   | ✅     |
| 3   | Gate Payload on initial load; Reward Payload after submit only                 | ✅     |
| 4   | Connection live path does not call `fetchPublishedExperience()`                | ✅     |
| 5   | Moments live path still calls `fetchPublishedExperience()`                     | ✅     |
| 6   | CF-1: score never blocks letter/gallery unlock                                 | ✅     |
| 7   | CF-2: sessionStorage unlock only; no DB migration                              | ✅     |
| 8   | `npm run typecheck` + `npm run lint` + `npm run build` pass                    | ✅     |

#### Manual browser checklist

| Check                                                      | Status                                 |
| ---------------------------------------------------------- | -------------------------------------- |
| Connection: first visit shows quiz only (no letter in DOM) | Recommended before first live delivery |
| Connection: submit reveals score, band, letter, gallery    | Recommended                            |
| Connection: refresh same tab preserves unlock              | Recommended                            |
| Connection: new tab requires quiz replay                   | Expected (CF-2)                        |
| Buyer preview Connection: quiz section before letter       | Recommended                            |
| Moments: letter visible on first granted open              | Recommended                            |
| Memory Code / grace regression with Connection order       | Recommended                            |

#### Network verification checklist

| Request                                   | Expected payload                                         | Verified       |
| ----------------------------------------- | -------------------------------------------------------- | -------------- |
| GET `/e/[token]` (Connection, first load) | Gate: theme + quiz only; no letter; no signed photo URLs | Code review ✅ |
| POST `submitQuizAnswersAction`            | `{ result, reward }` with letter + signed photos         | Code review ✅ |
| GET `/e/[token]` (Moments)                | Full published experience including letter + photos      | Code review ✅ |

#### SSR verification

| Field             | Initial Connection SSR | Verified |
| ----------------- | ---------------------- | -------- |
| `letter_content`  | Not rendered           | ✅       |
| `letter_closing`  | Not rendered           | ✅       |
| `closing_name`    | Not rendered           | ✅       |
| Signed photo URLs | Not rendered           | ✅       |

#### RSC verification

| Prop                 | Initial Connection RSC              | Verified |
| -------------------- | ----------------------------------- | -------- |
| Letter fields        | Absent from `ConnectionGatePayload` | ✅       |
| Signed photo URLs    | Absent                              | ✅       |
| Quiz correct answers | Stripped in `RecipientQuizView`     | ✅       |

#### DTO verification

| DTO                         | Forbidden fields                                   | Verified     |
| --------------------------- | -------------------------------------------------- | ------------ |
| `RecipientQuizQuestion`     | `correct_option_index`                             | ✅           |
| `ConnectionGateExperience`  | `letter_content`, `letter_closing`, `closing_name` | ✅           |
| `RecipientMatchStory` (09A) | `photo_sort_order` mapping                         | ✅ (Phase 3) |

#### Payload verification

| Payload                   | Contents                                    | When                         |
| ------------------------- | ------------------------------------------- | ---------------------------- |
| `ConnectionGatePayload`   | `experience` (safe fields), `theme`, `quiz` | Initial load                 |
| `ConnectionRewardPayload` | letter fields, signed photo URLs            | After successful submit only |

#### Dependency verification (grep)

```
fetchConnectionGatePayload  → page.tsx Connection branch only
fetchPublishedExperience    → page.tsx Moments + non-live stubs only
```

Connection recipient path must **not** grep-match `fetchPublishedExperience`. Moments recipient path **must** grep-match `fetchPublishedExperience`.

### Sprint 09A — Memories Verification (Phase 3)

**Code-verified:**

| Check                                                 | Evidence                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Aggregate repo owns replace/delete-all orchestration  | `experience-match.repository.ts`; sub-repo has CRUD only (LOW-06 avoided)            |
| Draft save allows incomplete config                   | `validateMatchConfigDraft()` in `save-match-config.service.ts`                       |
| Publish validation separate from draft save           | `validateMatchConfigPublish()` + `assertMatchPublishable()` (Phase 5)                |
| Recipient DTO excludes `photo_sort_order`             | `RecipientMatchStory` / `RecipientMatchView`; `map-match-views.service.ts`           |
| Preview DTO excludes correct mappings (A-3)           | `PreviewMatchView`; `fetch-preview-match.service.ts`                                 |
| Batch grading 100% server-side; answers not persisted | `submit-match-answers.service.ts`, `grade-match.service.ts`                          |
| `final_unlock_message` only returned when all correct | `grade-match.service.ts` — **Phase 3 code; superseded by FD-M5** (align in Phase 6A) |

> **Note:** Phase 3 grading reflects pre–FD-M5 design. Phase 6A will align `gradeMatchAnswers()` with FD-M5 (reward never blocked). FD-M3 (no retry) enforced in Phase 6B/6C client orchestration.

**NOT verified locally (manual E2E required — Phase 6+):**

| Check                                                             | Status                                            |
| ----------------------------------------------------------------- | ------------------------------------------------- |
| Full Memories publish → preview → recipient match flow            | NOT VERIFIED                                      |
| Buyer preview shows stories/photos without answer leak in browser | NOT VERIFIED                                      |
| Match unlimited retry UX in browser                               | **N/A** — superseded by FD-M3 (single submission) |
| Connection/Moments regression after Memories services             | NOT VERIFIED (code review only)                   |

### Sprint 09A — Memories Verification (Phase 4)

**Code-verified:**

| Check                                                       | Evidence                                                             |
| ----------------------------------------------------------- | -------------------------------------------------------------------- |
| Studio UI → Server Action → Service → Repository flow       | `match-config.ts` → `saveMatchConfig` / `fetchMatchConfig`           |
| Thin UI — no business validation in React                   | Components only call actions; errors from server `ValidationError`   |
| Single data model (`MatchStudioConfig` / `MatchDraftState`) | `match-draft.ts` maps config ↔ draft; save returns server config     |
| Manual save only (no auto-save)                             | `MatchBuilderPanel.handleSave` — explicit button                     |
| Unlock message after match pairs                            | `match-builder-panel.tsx` field order                                |
| Photo slot selector — one slot per pair (A-1 UX)            | `MatchPhotoSlotSelector` disables used/empty slots                   |
| Publish flow untouched                                      | `publish-validation.service.ts` — Memories publish wired in Phase 5  |
| Memories editor replaces "Coming soon" stub                 | `order-editor-form.tsx` + `experience-modes.ts` `editorSprint: null` |

**NOT verified locally (manual E2E required — Phase 4):**

| Check                                                     | Status       |
| --------------------------------------------------------- | ------------ |
| Save match draft from Studio browser                      | NOT VERIFIED |
| Photo slot selector UX with uploaded photos               | NOT VERIFIED |
| Server validation errors displayed in Studio UI           | NOT VERIFIED |
| Mode change away from Memories shows correct warning copy | NOT VERIFIED |

### Sprint 09A — Memories Verification (Phase 5)

**Code-verified:**

| Check                                                       | Evidence                                                          |
| ----------------------------------------------------------- | ----------------------------------------------------------------- |
| Memories mode publishable when checklist passes             | `isPublishableMode()` includes `memories`                         |
| Treasures mode still blocked at publish                     | `isBlockedPremiumMode()` — Treasures only                         |
| `evaluateExperienceMatch()` wired to checklist              | `appendMemoriesMatchChecklistItems()`                             |
| `evaluateExperienceMatch()` wired to `assertPublishAllowed` | `assertPublishAllowed()` memories branch                          |
| Photo slot occupancy validated at publish                   | `uploadedPhotoSortOrders` from `ExperiencePhotosRepository`       |
| Mode change deletes match pairs when leaving Memories       | `change-experience-mode.service.ts` → `deleteAllByExperienceId()` |
| Mode change clears `final_unlock_message`                   | `updateDraft({ finalUnlockMessage: null })`                       |
| Order detail uses async checklist                           | `buildPublishChecklistForExperience()` in `orders/[id]/page.tsx`  |
| Connection + Moments publish unchanged                      | Regression — no changes to quiz/moments branches                  |

### Sprint 09A — Memories Architecture Lock (Phase 5.5)

**Documentation-only — no code changes.**

| Check                                                     | Status |
| --------------------------------------------------------- | ------ |
| FD-M1–FD-M5 recorded in `05_FOUNDER_DECISIONS.md`         | ✅     |
| Match Retry marked SUPERSEDED by FD-M3                    | ✅     |
| Reward-only-after-allCorrect marked superseded by FD-M5   | ✅     |
| SSOT `13_EXPERIENCE_JOURNEY.md` Memories journey updated  | ✅     |
| `08_EXPERIENCE_MODES.md` synchronized                     | ✅     |
| Phase 6 architecture unambiguous (Gate/Reward mirror 08R) | ✅     |

**Phase 6 implementation targets (locked, not yet built):**

| Component                                                     | Phase |
| ------------------------------------------------------------- | ----- |
| `fetchMemoriesGatePayload()` / `buildMemoriesRewardPayload()` | 6A    |
| `MemoriesExperienceFlow` / `MatchCinematicReveal`             | 6B    |
| `memories-unlock-session.ts` / page wiring                    | 6C    |

**NOT verified locally (manual E2E required — Phase 6+):**

| Check                                                             | Status                          |
| ----------------------------------------------------------------- | ------------------------------- |
| Full Connection publish → preview → approve → recipient quiz flow | NOT VERIFIED                    |
| Buyer preview score band messages visible in browser              | NOT VERIFIED                    |
| Quiz one-submit-per-session UX in browser                         | NOT VERIFIED                    |
| Moments regression after Connection changes                       | NOT VERIFIED (code review only) |
| Studio QR download for Connection order                           | NOT VERIFIED                    |
| Multi-device grace / Memory Code regression with Connection       | NOT VERIFIED                    |

### Deploy Commands

```bash
# Via Vercel CLI
vercel          # Preview deploy
vercel --prod   # Production deploy

# Or push to rebuild/foundation — Vercel auto-deploys if connected
```

### What Is Deployable Today

- **Landing page** (`(public)`) — requires only the three `NEXT_PUBLIC_*` variables.
- **Moments E2E (Sprint 07)** — Studio, buyer preview, recipient `/e/[token]`, QR download — requires **all variables** in the deployment checklist above.
- **Connection E2E (Sprint 08)** — Same env requirements as Moments; adds quiz builder, Connection publish validation, buyer preview quiz panel, recipient quiz grading.

---

## Folder Conventions

```
app/                    # Next.js App Router pages and layouts
  (public)/             # Public marketing routes
  (studio)/             # Admin routes (Sprint 05+)
    studio/
      orders/           # Order list, create, unified editor [id]
  (experience)/         # Recipient routes (Sprint 07+)

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
  repositories/         # Cross-domain infrastructure only (e.g. Repository base) — not business repos
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
10. **Log deferred issues** — any bug, debt, UX limitation, scalability concern, or security hardening opportunity discovered **outside** the current phase scope must be added to the backlog below (unique ID, priority, deferral reason, revisit sprint). Known issues must not live only in phase reports. **Backlog maintenance is part of Definition of Done.**
11. **Verify privilege matrix after every migration that creates a new table.** See [Migration Privilege Checklist](#migration-privilege-checklist) below.

---

## Migration Privilege Checklist

**Lesson learned — Sprint 08 hotfix (MED-06):** Migration 017 omitted `service_role` SELECT on quiz tables. Buyer preview and recipient grading use `createAdminClient()` (service_role), so any new table accessed server-side via admin client must explicitly grant SELECT to `service_role`.

After every `CREATE TABLE`, verify the following matrix before applying to remote:

| Role                             | anon                                                                   | authenticated                              | service_role                                                      |
| -------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------- |
| Table-level SELECT               | ❌ Revoked (Gift domain) or ✅ Granted (public ref data like `themes`) | ✅ only the operations the Studio UI needs | ✅ SELECT at minimum for any table read via `createAdminClient()` |
| Table-level INSERT/UPDATE/DELETE | ❌ Revoked                                                             | ✅ only if Studio writes it                | ✅ explicit GRANT per operation (RLS bypass ≠ table privileges)   |
| RLS enabled                      | ✅ Required on every new table                                         | —                                          | — (service_role bypasses RLS)                                     |

### Per-path verification questions

For every new table, ask:

1. **Studio path** — Is this table written/read by the admin via `createClient()` (authenticated RLS)? → ensure `authenticated` grants match.
2. **Recipient path** — Is this table read by recipient services via `createAdminClient()` (service_role)? → ensure `service_role` has SELECT.
3. **Preview path** — Is this table read by buyer preview via `createAdminClient()`? → same as above.
4. **Admin/service path** — Is this table written by server-side services (analytics, access, sessions)? → ensure `service_role` has INSERT.
5. **anon boundary** — Does anon have SELECT or DML? → It must not (Gift domain). Only `themes` is the exception.

### Known table → required service_role operations

| Table                         | service_role needs         | Reason                                                                                         |
| ----------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| `orders`                      | SELECT, INSERT, UPDATE     | Publish, preview, QR workflows                                                                 |
| `experiences`                 | SELECT, INSERT, UPDATE     | Recipient gate, publish lock                                                                   |
| `experience_photos`           | SELECT                     | Recipient + preview signed URLs                                                                |
| `experience_quiz_questions`   | **SELECT**                 | Recipient grading, buyer preview (hotfix 018)                                                  |
| `experience_quiz_score_bands` | **SELECT**                 | Recipient grading, buyer preview (hotfix grants)                                               |
| `experience_match_pairs`      | **SELECT**                 | Recipient match grading, buyer preview (Sprint 09A)                                            |
| `experience_envelopes`        | **SELECT at minimum**      | Sprint 09B — include in same migration as CREATE TABLE                                         |
| `experience_envelope_opens`   | **SELECT, INSERT, DELETE** | Recipient open progress + CF-R2 replay reset via `createAdminClient()` (hotfix 20260714110000) |
| `preview_links`               | SELECT, INSERT, UPDATE     | Preview token lookup                                                                           |
| `experience_sessions`         | SELECT, INSERT, UPDATE     | Trusted device session writes                                                                  |
| `access_attempts`             | SELECT, INSERT             | Rate limiting                                                                                  |
| `experience_analytics`        | SELECT, INSERT             | Event recording                                                                                |
| `security_events`             | SELECT, INSERT             | Audit trail                                                                                    |
| `audit_logs`                  | SELECT, INSERT             | Audit trail                                                                                    |

---

## Technical Debt & Security Backlog

The following items are low/medium-priority findings that do not block production but should be addressed in future sprints:

| ID     | Priority | Area                | Description                                                                                                                                                                                                                                                                                                       | Resolution Plan                                                                                                                                                                                                                                                                                      |
| ------ | -------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MED-01 | Medium   | Auth Logging        | `loginAction` logs the raw submitted email on credential failure. This can pollute logs with PII.                                                                                                                                                                                                                 | Update `securityLogger` in `features/studio/actions/auth.ts` to log only the email domain (e.g. `email.split("@")[1]`), rather than the full address.                                                                                                                                                |
| LOW-01 | Low      | Open Redirect       | `loginAction` returns `redirectTo` from server (`/studio`), which the client follows without validation.                                                                                                                                                                                                          | When redirect paths become dynamic, ensure client or server validates that `redirectTo` is a relative path or trusted origin to prevent open redirects.                                                                                                                                              |
| LOW-02 | Low      | Barrel Clarity      | `lib/auth/index.ts` exports `isAdminEmailMatch` without a `server-only` guard, mixing with `server-only` exports.                                                                                                                                                                                                 | Separate Edge-safe pure functions into an explicit `lib/auth/edge.ts` or similar barrel to prevent accidental `server-only` build failures on client components.                                                                                                                                     |
| MED-02 | Medium   | Quiz Data           | `ExperienceQuizRepository.replaceAllForExperience()` uses delete-then-insert, consistent with `experience_photos`. Not atomic — a failed insert after delete may leave empty quiz data.                                                                                                                           | Acceptable for current MVP. Future: Postgres RPC in a dedicated migration when stronger multi-table consistency is required. See also `lib/actions/transaction.ts`.                                                                                                                                  |
| MED-03 | Medium   | Studio UX           | Server-rendered publish checklist can become temporarily stale after changing experience mode until the page refreshes.                                                                                                                                                                                           | Acceptable for Sprint 08 — does not affect publish correctness. UX improvement only; defer post–Sprint 08.                                                                                                                                                                                           |
| MED-04 | Medium   | Publish Logic       | `isPremiumMode()` still treats every non-`moments` mode as premium. Publish validation uses explicit mode switching, so this is not a production bug today.                                                                                                                                                       | Re-evaluate after Sprint 08 when Memories/Treasures implementation begins. Refactor only if a later phase requires it.                                                                                                                                                                               |
| MED-05 | Medium   | Quiz Security       | `submitQuizAnswersAction` has no per-session submit rate limit. A motivated actor could brute-force correct answers (max 3⁶ = 729 combinations for 6 MCQ questions). Access gate limits unauthenticated abuse but not repeated submits after access.                                                              | Defer to post–Sprint 08 hardening. Add server-side attempt cap or exponential backoff in a future security sprint; revisit Sprint 09 or dedicated hardening pass.                                                                                                                                    |
| MED-06 | Medium   | Database            | Migration 017 omitted `service_role` SELECT grants on `experience_quiz_questions` and `experience_quiz_score_bands`. Connection buyer preview and recipient quiz grading failed with permission denied (surfaced as misleading 404).                                                                              | **Fixed** — hotfix migration `20260713020000_experience_quiz_service_role_grants.sql` applied. Pattern: any new Gift-domain table read via `createAdminClient()` must grant SELECT to `service_role`.                                                                                                |
| LOW-03 | Low      | Quiz UX             | One-submit-per-session uses `sessionStorage` only (OD-5). Clearing storage or a new tab allows another graded attempt on the same device.                                                                                                                                                                         | Accepted for V2 per OD-5. Revisit only if founder requires stricter anti-retake semantics (would need server state — conflicts with OD-5).                                                                                                                                                           |
| LOW-04 | Low      | Buyer Preview       | Connection buyer preview renders quiz section even when zero questions are saved (draft state). Empty-state copy added in Phase 7; publish still blocked server-side.                                                                                                                                             | UX polish only. Optional: hide quiz section entirely until ≥ 1 question — defer post–Sprint 08 if founder prefers.                                                                                                                                                                                   |
| LOW-05 | Low      | Analytics           | `experience_opened` is inserted on every granted recipient page load — no deduplication vs `first_opened_at`. Coarse open counts may over-count returning recipients/trusted devices.                                                                                                                             | Acceptable for V2 coarse analytics (OD-1). Revisit Sprint 10 dashboard / analytics polish if unique-open metrics are required.                                                                                                                                                                       |
| LOW-06 | Low      | Quiz Repo           | `QuizQuestionsRepository` exposes `replaceAllForExperience()` on both the questions repo **and** the aggregate `ExperienceQuizRepository`. The aggregate wraps the sub-repos correctly, but the direct method on `QuizQuestionsRepository` is redundant and may be called independently, bypassing bands cleanup. | No production bug today (only aggregate is called externally). Remove `replaceAllForExperience` from the sub-repos in a future refactor, leaving only the aggregate-level method. **Memories match (Sprint 09A) follows the corrected pattern** — orchestration only on `ExperienceMatchRepository`. |
| LOW-07 | Low      | Preview Security    | `fetch-preview-quiz.service.ts` does NOT check `experience.status === "published"` before returning quiz data. Only `previewLink.experience_id` presence gates the call. A draft experience with an active preview link would expose quiz structure to the buyer before publish.                                  | Intended behavior for buyer preview (admin sends preview before publish). Safety is answer-exclusion only, not status gating. Low risk: only studio admin controls preview links. Document as accepted V2 behavior; revisit if preview access model changes.                                         |
| LOW-08 | Low      | Schema Consistency  | `experience_quiz_score_bands` table has no `created_at` column, unlike `experience_quiz_questions`. Minor inconsistency in migration 017.                                                                                                                                                                         | No functional impact. Add `created_at` in a **dedicated timestamped cleanup migration** if desired — do **not** bundle with Sprint 09A feature migration.                                                                                                                                            |
| LOW-09 | Low      | Error Observability | `/preview/[token]` and `/e/[token]` pages catch all non-`ConfigError` failures with `notFound()` — infrastructure errors (e.g. Postgres `42501` permission denied) appear as generic 404, slowing diagnosis. Discovered during Sprint 08 hotfix (MED-06).                                                         | Intentional production behavior (no error detail leak to users). Improve server-side logging or distinguish `NotFoundError` vs other `ApplicationError` in page catch blocks during next observability pass. Revisit Sprint 09 or dedicated ops hardening.                                           |
| LOW-10 | Low      | Security Config     | `IP_HASH_PEPPER` referenced in security design (`04_SECURITY.md`) but not yet in `config/env.ts` / `.env.example`. Rate-limit hashing uses placeholder or is incomplete.                                                                                                                                          | Post-V2 hardening. Add to env schema when full IP-hash rate limiting is implemented. Revisit Sprint 09 security pass or before high-volume launch.                                                                                                                                                   |
| LOW-11 | Low      | QA / Testing        | No automated E2E test suite for publish → preview → recipient flows. Sprint 08 Phase 8 marked 4 manual acceptance items NOT VERIFIED by automation.                                                                                                                                                               | Manual smoke test required before first live Connection delivery (P1 operational). Add Playwright or similar in Sprint 10 polish or when test ROI justifies setup.                                                                                                                                   |

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
- [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) — Experience Journey SSOT
- [03_DATABASE.md](./03_DATABASE.md) — schema reference and migration history
- [04_SECURITY.md](./04_SECURITY.md) — secrets and env variable rules
- [07_AI_GUIDE.md](./07_AI_GUIDE.md) — coding standards for AI assistants
