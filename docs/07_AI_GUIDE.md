# 07 — AI Guide

> **This is the most important document for AI coding assistants.**  
> **Related:** [Index](./00_INDEX.md) · [Project Context](./01_PROJECT_CONTEXT.md) · [Architecture](./02_ARCHITECTURE.md) · [Database](./03_DATABASE.md) · [Security](./04_SECURITY.md) · [Founder Decisions](./05_FOUNDER_DECISIONS.md) · [Development Guide](./06_DEVELOPMENT_GUIDE.md) · [Studio UX](./12_STUDIO_UX.md)

---

## Before You Write Any Code

1. Read [17_CURRENT_HANDOFF.md](./17_CURRENT_HANDOFF.md) first. Then [00_INDEX.md](./00_INDEX.md). Sprint folders are history. Where they disagree with the handoff or the code, the code wins.
2. Read [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) — locked constraints.
3. For **Sprint 06 Studio work**, read [12_STUDIO_UX.md](./12_STUDIO_UX.md) and [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md#sprint-06-implementation-checklist).
4. Read the relevant domain doc ([02_ARCHITECTURE.md](./02_ARCHITECTURE.md), [03_DATABASE.md](./03_DATABASE.md), or [04_SECURITY.md](./04_SECURITY.md)).
5. Inspect the actual codebase — docs may lag implementation; code is the final authority.
6. If unsure, **ask the founder** — do not guess on architecture or business rules.

**Sprint 05.5 is closed.** Docs 07–12 are the official implementation baseline. Feature dependency rules in [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) supersede older cross-import wording in this guide.

---

## Project Philosophy

Celebrate Florist is a **small, focused product** built by a solo founder. Every line of code must earn its place.

| Principle                     | Meaning                                                                     |
| ----------------------------- | --------------------------------------------------------------------------- |
| **Minimize scope**            | Smallest correct diff. No drive-by refactors.                               |
| **No over-engineering**       | No abstractions for one use case. No plugin systems.                        |
| **Preserve architecture**     | Match existing patterns. Extend, don't replace.                             |
| **Respect founder decisions** | [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) overrides convenience. |
| **Security by default**       | Never weaken RLS, never expose secrets, never skip the Access Code gate.    |
| **Document changes**          | Update `docs/` when sprints change schema, security, or business rules.     |

---

## What MUST NEVER Be Changed

Without **explicit founder approval**, never:

| Area                       | Rule                                                                                                                                                 |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Business model**         | No payment gateway, no customer accounts, no multi-tenant                                                                                            |
| **1:1 relationship**       | One order → one experience (UNIQUE constraint)                                                                                                       |
| **Gift domain RLS**        | `anon` must have zero policies on experiences, photos, sessions, analytics                                                                           |
| **Audit log immutability** | Never remove or bypass `prevent_audit_log_mutation()` trigger                                                                                        |
| **Photobooth captures**    | Recipient camera photos stay in the browser. Do not upload them. Studio strip templates may use `photobooth-strips` and `catalog-photobooth-strips`. |
| **6-photo limit**          | Never increase `sort_order` range beyond 1–6                                                                                                         |
| **Access Code hashing**    | Never store plaintext Access Code                                                                                                                    |
| **Admin email in Git**     | Never commit real `ADMIN_EMAIL` to version control                                                                                                   |
| **Env validation pattern** | Never read `process.env` outside `config/env.ts`, `config/env.server.ts`, and `proxy.ts` (Edge cannot import the server env module)                  |
| **`server-only` guard**    | Never remove from `config/env.server.ts`                                                                                                             |
| **Applied migrations**     | Never edit SQL files that are already applied to production                                                                                          |
| **Route group structure**  | Don't rename `(public)`, `(studio)`, `(experience)` without approval                                                                                 |
| **Proxy matcher strategy** | Keep it opt-in: `/studio`, `/e/:path*`, `/theme-lab`. Do not switch to opt-out. Do not remove the production Theme Lab 404.                          |

---

## Architecture Rules

### Next.js

| Rule                                           | Detail                                      |
| ---------------------------------------------- | ------------------------------------------- |
| App Router only                                | No `pages/` directory                       |
| Default to Server Components                   | Add `"use client"` only when necessary      |
| Server Actions in `features/<domain>/actions/` | Use `"use server"` directive                |
| Route groups for surfaces                      | `(public)`, `(studio)`, `(experience)`      |
| `proxy.ts` at root                             | Next.js 16 convention (not `middleware.ts`) |

### Supabase Clients

| Client  | File                     | Key            | When                               |
| ------- | ------------------------ | -------------- | ---------------------------------- |
| Browser | `lib/supabase/client.ts` | anon           | Client Components only             |
| Server  | `lib/supabase/server.ts` | anon + cookies | Server Components, admin reads     |
| Admin   | `lib/supabase/admin.ts`  | service_role   | Recipient reads, privileged writes |

**Never** use `service_role` in Client Components or pass it to the browser.

### Feature Modules

```
features/<domain>/
├── components/
├── hooks/
├── actions/        # "use server"
├── services/       # Pure business logic
├── repositories/   # Database queries
└── config/         # Static config
```

- Put code in the domain it belongs to.
- Feature dependency rules: see [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) § Dependency Rules (`experience` → modes via registry; modes ↛ `studio`; no direct sibling imports).
- Empty scaffolded folders are intentional — populate them in the correct sprint.

### Environment Variables

```typescript
// ✅ Correct
import { env } from "@/config/env";
import { serverEnv } from "@/config/env.server";

// ❌ Wrong — never do this
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
```

---

## Coding Standards

### TypeScript

- Strict mode is on — don't disable checks.
- `noUncheckedIndexedAccess` is on — handle `undefined` from array/object access.
- Use `type` over `interface` unless extending is needed (match existing files).
- Path alias: `@/*` maps to project root.

### React

- Functional components only.
- Props typed inline or with `type` (not `interface` unless existing file uses it).
- Isolate Framer Motion behind `MotionProvider` — don't spread `"use client"` unnecessarily.

### Styling

- Tailwind CSS 4 utility classes.
- Use `cn()` from `lib/utils.ts` for conditional classes.
- shadcn/ui components in `components/ui/` — don't modify generated primitives unless necessary.
- Brand fonts: Poppins (sans), Fraunces (serif), Fira Code (mono).

### Comments

- Explain **why**, not **what**.
- Security and business rule comments are valuable.
- Don't add comments to self-explanatory code.

### Error Handling

- Validate at boundaries (env, user input, API responses).
- Don't add try/catch everywhere — only where failure is expected and recoverable.
- Server Actions should return typed error responses, not throw to the client.

---

## Database Rules

### Migrations

1. **Never modify applied migrations** — create `016_*.sql` instead.
2. **One concern per file** — tables, constraints, indexes, RLS separate.
3. **Comment headers** — every migration file explains what and why.
4. **RLS on every table** — no exceptions.
5. **Update [03_DATABASE.md](./03_DATABASE.md)** after schema changes.

### Query Patterns

| Operation                  | Client               | RLS                                  |
| -------------------------- | -------------------- | ------------------------------------ |
| Admin reads orders         | Server (anon + auth) | `authenticated` SELECT               |
| Admin writes order         | Server (anon + auth) | `authenticated` INSERT/UPDATE        |
| Recipient reads experience | Admin (service_role) | Bypasses — app gate first            |
| Record analytics event     | Admin (service_role) | Bypasses                             |
| Write audit log            | Admin (service_role) | Bypasses — trigger prevents mutation |

### Constraints

- Don't remove CHECK constraints to "fix" validation errors — fix the data.
- Don't add columns without updating types and docs.
- Respect ON DELETE policies: RESTRICT for business entities, CASCADE for children.

---

## Security Rules

### Non-Negotiable

1. **Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.**
2. **Never store Access Code in plaintext** — hash with `MEMORY_KEY_PEPPER`.
3. **Never add `anon` RLS policies on Gift domain tables.**
4. **Never log secrets, tokens, or Access Codes.**
5. **Never render `ADMIN_EMAIL` in UI** — server-side only.
6. **Never skip Access Code verification** for recipient content.
7. **Never delete audit_logs rows** — the trigger prevents it; don't work around it.

### When Adding New Tables

- Enable RLS immediately.
- Define policies in the same sprint as the table.
- Default-deny: no policy = no access.
- Consider whether `anon`, `authenticated`, or service_role only.
- Add to [03_DATABASE.md](./03_DATABASE.md) and [04_SECURITY.md](./04_SECURITY.md).

### When Adding New API Routes

- Validate input with Zod.
- Use appropriate Supabase client (server vs admin).
- Rate-limit sensitive endpoints (Access Code verification).
- Log security events for failures.

---

## Business Rules

Quick reference — full detail in [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md):

| Rule                         | Enforcement                     |
| ---------------------------- | ------------------------------- |
| Max 6 photos                 | DB constraint + CHECK           |
| No photobooth storage        | No bucket, no upload code       |
| 1:1 order-experience         | UNIQUE on `order_id`            |
| Content locked after publish | `content_locked_at` + app check |
| Preview ≠ Experience link    | Separate tokens                 |
| No order/experience deletion | No delete RLS policies          |
| Single admin                 | `ADMIN_EMAIL` check             |
| 365-day archival             | Future cron job                 |

---

## How to Propose New Features

1. **Check founder decisions** — is this explicitly out of scope?
2. **Check sprint plan** — is this scheduled, or are you jumping ahead?
3. **Write a brief proposal:**
   - What problem does it solve?
   - What files/tables are affected?
   - What are the trade-offs?
   - Does it violate any founder decision?
4. **Get founder approval** before implementing.
5. **Update docs** after implementation.

### Red Flags (Probably Out of Scope)

- Payment processing
- Customer registration/login
- Multi-admin or role system
- Florist marketplace or partners
- Photobooth cloud storage
- CMS for landing page content
- Real-time chat
- Push notifications
- Mobile app
- Internationalization

---

## How to Review Code

### Checklist

- [ ] Diff is minimal — no unrelated changes?
- [ ] Follows existing naming and folder conventions?
- [ ] Uses `@/config/env` instead of raw `process.env`?
- [ ] No secrets in client code or Git?
- [ ] Server/client boundary correct (`"use client"` only where needed)?
- [ ] RLS policies considered for new tables/queries?
- [ ] Founder decisions respected?
- [ ] No speculative features beyond current sprint?
- [ ] Comments explain non-obvious business/security logic?
- [ ] Docs updated if schema/security/business rules changed?

---

## How to Review SQL

### Checklist

- [ ] New migration file (not editing applied migration)?
- [ ] RLS enabled on new tables?
- [ ] Correct ON DELETE policy (RESTRICT vs CASCADE)?
- [ ] CHECK constraints for business rules?
- [ ] Indexes justified by query pattern (not speculative)?
- [ ] No `anon` policies on Gift domain?
- [ ] Functions have `SET search_path = ''`?
- [ ] No PUBLIC EXECUTE on functions?
- [ ] Seed data minimal (no dummy orders/users)?
- [ ] [03_DATABASE.md](./03_DATABASE.md) updated?

---

## How to Perform Security Audits

1. **RLS matrix** — verify every table has correct policies per [03_DATABASE.md](./03_DATABASE.md).
2. **Privilege grants** — `anon` should have zero DML on Gift domain.
3. **Function EXECUTE** — no PUBLIC grants on trigger/security functions.
4. **Secret exposure** — grep for `SERVICE_ROLE`, `PEPPER`, `ADMIN_EMAIL` in client files.
5. **CSP** — verify `next.config.ts` headers still correct after changes.
6. **Access Code flow** — hash → compare → session → signed URL (when implemented).
7. **Audit immutability** — trigger still present and functional.
8. **Storage** — buckets private, no anon policies.

---

## How to Avoid Technical Debt

| Do                                    | Don't                           |
| ------------------------------------- | ------------------------------- |
| Extend existing functions             | Create parallel implementations |
| Match existing file structure         | Invent new folder patterns      |
| Add types near their domain           | Create a mega `types/` dump     |
| Fix the root cause                    | Add workaround comments         |
| Remove dead code when replacing       | Leave commented-out blocks      |
| Tighten env schema when feature ships | Leave secrets optional forever  |
| Write migrations additively           | Edit production migrations      |

---

## When Unsure

| Situation              | Action                                                                                 |
| ---------------------- | -------------------------------------------------------------------------------------- |
| Architecture question  | Prefer existing architecture. Read [02_ARCHITECTURE.md](./02_ARCHITECTURE.md).         |
| Business rule question | Check [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md). Ask founder if not listed. |
| Schema question        | Check [03_DATABASE.md](./03_DATABASE.md) and actual migration files.                   |
| Security question      | Check [04_SECURITY.md](./04_SECURITY.md). Default to more restrictive.                 |
| Scope question         | Check [00_INDEX.md](./00_INDEX.md) sprint status. Don't jump ahead.                    |
| Pattern question       | Read surrounding code in the same feature folder.                                      |
| Still unsure           | **Ask the founder.** Do not guess.                                                     |

### Default Behaviors

- **Prefer existing architecture.**
- **Never over-engineer.**
- **Never introduce features outside the approved roadmap.**
- **Always respect Founder Decisions.**
- **Always preserve backward compatibility** unless explicitly instructed.
- **Mark unknowns as Future Work** — don't invent implementation details.

---

## Current Sprint Context (Sprint 04)

When Sprint 04 begins, expected work includes:

- Wire `ADMIN_EMAIL` into `config/env.server.ts`
- Create `lib/supabase/admin.ts` (service role client)
- Studio login page and auth gate in `proxy.ts`
- Bootstrap `app_settings.admin_email` from env var

**Do not implement Sprint 04 work unless explicitly asked.** This section provides context so you understand what is coming, not permission to build it.

---

## Documentation Maintenance

When you change the codebase, update docs if you affect:

| Change type          | Update                                                                                        |
| -------------------- | --------------------------------------------------------------------------------------------- |
| New table or column  | [03_DATABASE.md](./03_DATABASE.md)                                                            |
| New RLS policy       | [03_DATABASE.md](./03_DATABASE.md) + [04_SECURITY.md](./04_SECURITY.md)                       |
| New route or feature | [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md) + [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) |
| New env variable     | [04_SECURITY.md](./04_SECURITY.md) + [06_DEVELOPMENT_GUIDE.md](./06_DEVELOPMENT_GUIDE.md)     |
| New founder decision | [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md)                                          |
| Sprint completion    | [00_INDEX.md](./00_INDEX.md) status table                                                     |

---

## Related Documents

| Doc                                                  | When to read                                   |
| ---------------------------------------------------- | ---------------------------------------------- |
| [00_INDEX.md](./00_INDEX.md)                         | Always — first file                            |
| [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md)     | Understanding the product                      |
| [02_ARCHITECTURE.md](./02_ARCHITECTURE.md)           | Before adding routes, components, or data flow |
| [03_DATABASE.md](./03_DATABASE.md)                   | Before writing SQL or database queries         |
| [04_SECURITY.md](./04_SECURITY.md)                   | Before touching auth, RLS, secrets, or headers |
| [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) | Before proposing any feature                   |
| [06_DEVELOPMENT_GUIDE.md](./06_DEVELOPMENT_GUIDE.md) | Before setting up or deploying                 |
