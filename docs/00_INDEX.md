# Celebrate Florist Documentation

This folder is the **single source of truth** for the Celebrate Florist project. Every AI assistant and developer working on this repository should start here.

> **Repository:** [vinoslwly/celebrate-florist](https://github.com/vinoslwly/celebrate-florist)  
> **Active branch:** `rebuild/foundation`  
> **Supabase project:** `celebrate-florist-prod` (`jobknyooffpouniyqpkp`, `ap-southeast-1`)

---

## ⚠️ Product Revision V2 (Sprint 05.5)

**Before Sprint 06 implementation**, read the Product Revision V2 package. Celebrate evolved from a Digital Greeting Website into an **Interactive Digital Experience Platform** with four experience modes (Moments, Connection, Memories, Treasures).

| #   | Document                                                             | Purpose                                                   |
| --- | -------------------------------------------------------------------- | --------------------------------------------------------- |
| 7   | [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md)             | Why the product changed, positioning, founder amendments  |
| 8   | [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md)                   | Per-mode product specification                            |
| 9   | [09_ARCHITECTURE_IMPACT.md](./09_ARCHITECTURE_IMPACT.md)             | Engineering impact matrix (no code)                       |
| 10  | [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md)       | Schema recommendations (no SQL)                           |
| 11  | [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md) | **Sprint 06+ roadmap — supersedes pre-revision plan**     |
| 12  | [12_STUDIO_UX.md](./12_STUDIO_UX.md)                                 | **Studio admin UX — mandatory for Sprint 06 Studio work** |

Sprint 05.5 was **documentation only** — no code, no migrations. Sprints 00–05 remain valid.

## ✅ Sprint 05.5 — CLOSED (Official Implementation Baseline)

Sprint 05.5 is **closed**. All documentation in this package is the **official baseline** for Sprint 06+ implementation. No further design reviews required unless the founder explicitly reopens a decision.

| Review                     | Status                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Revision V2        | ✅ Closed                                                                                                                                                 |
| Architecture Review        | ✅ Closed — [02_ARCHITECTURE.md](./02_ARCHITECTURE.md), [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md)                                              |
| Database Design Review     | ✅ Closed — [03_DATABASE.md](./03_DATABASE.md), [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md)                                            |
| Studio Design Review       | ✅ Closed — [12_STUDIO_UX.md](./12_STUDIO_UX.md)                                                                                                          |
| Sprint 06 Readiness Review | ✅ Closed — **READY WITH MINOR NOTES**; notes are engineering checklist only ([11](./11_IMPLEMENTATION_ROADMAP_V2.md#sprint-06-implementation-checklist)) |

**Sprint 06 is complete.** Sprint 07 (Moments E2E + Memory Code) is cleared to begin per [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md).

## ✅ Sprint 06 — CLOSED (Studio Foundation + Mode Schema)

Sprint 06 is **closed**. Order-centric Studio foundation, Migration 016, and unified editor shell are implemented and accepted.

| Review                      | Status                         |
| --------------------------- | ------------------------------ |
| Sprint 06 Acceptance Review | ✅ Closed — **FULLY ACCEPTED** |

**Sprint 07 is cleared to begin.** Read [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md#sprint-07--moments-experience-end-to-end--memory-code) before implementation.

---

## Reading Order

### Foundation (Sprints 00–05)

Read these documents in order. Each file builds on the previous one.

| #   | Document                                             | Purpose                                                        |
| --- | ---------------------------------------------------- | -------------------------------------------------------------- |
| 1   | [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md)     | What the product is, why it exists, current status, tech stack |
| 2   | [02_ARCHITECTURE.md](./02_ARCHITECTURE.md)           | System design, Next.js patterns, data and security flows       |
| 3   | [03_DATABASE.md](./03_DATABASE.md)                   | Every table, constraint, index, RLS policy, storage bucket     |
| 4   | [04_SECURITY.md](./04_SECURITY.md)                   | Threat model, auth, RLS strategy, headers, secrets             |
| 5   | [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) | Locked business rules and their rationale                      |
| 6   | [06_DEVELOPMENT_GUIDE.md](./06_DEVELOPMENT_GUIDE.md) | Install, run, git workflow, migrations, deployment             |

### Product Revision V2 (Sprint 05.5) — read before Sprint 06

| #   | Document                                                             | Purpose                             |
| --- | -------------------------------------------------------------------- | ----------------------------------- |
| 7   | [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md)             | Product vision revision             |
| 8   | [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md)                   | Four experience modes in detail     |
| 9   | [09_ARCHITECTURE_IMPACT.md](./09_ARCHITECTURE_IMPACT.md)             | What changes vs what stays          |
| 10  | [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md)       | Planned schema extensions (no SQL)  |
| 11  | [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md) | Future sprint breakdown             |
| 12  | [12_STUDIO_UX.md](./12_STUDIO_UX.md)                                 | Studio IA, workflow, unified editor |

### AI Coding Rules

| #   | Document                           | Purpose                                                       |
| --- | ---------------------------------- | ------------------------------------------------------------- |
| —   | [07_AI_GUIDE.md](./07_AI_GUIDE.md) | Rules for AI coding assistants — **read before writing code** |

> **Note:** `07_AI_GUIDE.md` and `07_PRODUCT_REVISION_V2.md` share the `07_` prefix by historical numbering. Product Revision docs use **07–12**; the AI Guide predates Sprint 05.5. Always read **both** the Product Revision package (including [12_STUDIO_UX.md](./12_STUDIO_UX.md)) and the AI Guide before implementing Sprint 06+.

---

## Current Project Status

| Area                        | Status                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Development phase**       | Sprint 07 ready — Sprint 06 complete; Moments E2E + Memory Code next                                                                                   |
| **Current sprint**          | **Sprint 07 — Moments Experience End-to-End + Memory Code** 🚀 Active (per [Roadmap V2](./11_IMPLEMENTATION_ROADMAP_V2.md))                            |
| **Latest completed sprint** | **Sprint 06** — Studio Foundation + Mode Schema (Migration 016, order CRUD, unified editor) · Sprint 05.5 — Product Revision V2 closed                 |
| **Deployment**              | Vercel project linked; landing page deployable; Studio auth + order tools deployable; recipient Experience routes not yet implemented                  |
| **Database**                | 16 migration files in repo applied on remote; 11 tables + `experience_mode` / `quiz_title` (016); mode child tables **Planned** (017–019)              |
| **Security**                | Sprint 02B hardening complete; RLS and privilege hardening complete (migrations 011–015)                                                               |
| **Product**                 | **V2:** Four experience modes (Moments, Connection, Memories, Treasures) — [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md)                    |
| **Production readiness**    | **Partial** — schema, landing page, and Studio order foundation production-grade; recipient Experience delivery is Planned per Roadmap V2 (Sprint 07+) |

### Sprint History

| Sprint                                | Status        | Summary                                                                                       |
| ------------------------------------- | ------------- | --------------------------------------------------------------------------------------------- |
| Sprint 00 — Foundation                | ✅ Complete   | Next.js 16 scaffold, Supabase connectivity, tooling                                           |
| Sprint 01 — Landing Page              | ✅ Complete   | Full marketing site with 5 themes, bouquet catalog, FAQ                                       |
| Sprint 02 — Architecture              | ✅ Complete   | Folder structure, env validation, feature scaffolding                                         |
| Sprint 02A — Architecture Audit       | ✅ Complete   | Stress test of architecture decisions (audit only)                                            |
| Sprint 02B — Foundation Hardening     | ✅ Complete   | `proxy.ts`, CSP, security headers, image domains                                              |
| Sprint 03 — Database Design           | ✅ Approved   | Schema design in Notion (not duplicated here)                                                 |
| Sprint 03A — Database Implementation  | ✅ Complete   | 15 SQL migrations, live audit, hardening                                                      |
| Sprint 04 — Infrastructure            | ✅ Complete   | Env, clients, repos, errors, logging, actions, storage                                        |
| Sprint 05 — Studio Authentication     | ✅ Complete   | Studio auth pages, route protection, login action                                             |
| **Sprint 05.5 — Product Revision V2** | ✅ **Closed** | Docs 07–12; all reviews closed; **official implementation baseline**                          |
| **Sprint 06**                         | ✅ **Closed** | Studio orders + mode schema + migration 016 ([Roadmap V2](./11_IMPLEMENTATION_ROADMAP_V2.md)) |
| **Sprint 07**                         | 🚀 **Active** | Moments E2E + Memory Code grace period + trusted devices                                      |
| **Sprint 08**                         | 📋 Planned    | Connection quiz + templates                                                                   |
| **Sprint 09A**                        | 📋 Planned    | Memories match game                                                                           |
| **Sprint 09B**                        | 📋 Planned    | Treasures envelopes (max 6)                                                                   |

---

## AI Instructions

Every AI assistant working on this repository **MUST**:

1. **Read this file first**, then follow the reading order above.
2. **Read the Product Revision V2 package (docs 07–12) before Sprint 07 code** — especially [12_STUDIO_UX.md](./12_STUDIO_UX.md) for Studio work.
3. **Follow [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md)** for sprint scope — Sprint 06 is closed; Sprint 07 is active.
4. **Never modify architecture** without explicit founder approval.
5. **Respect [Founder Decisions](./05_FOUNDER_DECISIONS.md)** — they override convenience.
6. **Never over-engineer** — prefer the simplest correct solution.
7. **Never introduce features** outside the approved roadmap.
8. **Preserve existing architecture** whenever possible.
9. **Keep documentation synchronized** with implementation when sprints change schema, security, or business rules.
10. **Do not invent information** — use the codebase and these docs as source of truth. Mark unknowns as [Future Work](./01_PROJECT_CONTEXT.md#future-work).

### What Exists Today (Code Reality)

| Layer            | Implemented                                                                 | Not Yet Implemented                                                                            |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Routes           | `app/(public)/` landing; `app/(studio)/` login, dashboard, orders CRUD      | `app/(experience)/` recipient routes (`/e/[token]`)                                            |
| Features (code)  | `features/landing/`, `features/themes/`, `features/studio/` (auth + orders) | `features/experience/`, `features/access/`, mode features (quiz, match, envelopes)             |
| Supabase clients | `lib/supabase/client.ts`, `server.ts`, `admin.ts`                           | —                                                                                              |
| Auth             | Session helpers, action wrappers, Studio login/logout, `proxy.ts` gate      | Memory Code grace period + recipient flow (**Planned Sprint 07**)                              |
| Database         | Full V1 schema + Migration 016 (`experience_mode`, `quiz_title`) on remote  | Mode child tables 017–019 ([Planned](./10_DATABASE_REVISION_PLAN.md))                          |
| Product          | V2 four-mode platform — Studio foundation shipped                           | Recipient delivery, publish, preview ([Planned Sprint 07+](./11_IMPLEMENTATION_ROADMAP_V2.md)) |

---

## Documentation Maintenance

Whenever a sprint changes architecture, security, database, or business rules:

- Update the corresponding document in this folder.
- Do **not** create duplicate documentation elsewhere.
- Keep this index accurate — especially the **Current Project Status** table.
- Cross-reference between documents instead of copying content.
- Product changes go through Product Revision docs or amendments to `05_FOUNDER_DECISIONS.md`.

---

## Quick Links

### Foundation

- [Project context & vision](./01_PROJECT_CONTEXT.md)
- [Architecture & data flow](./02_ARCHITECTURE.md)
- [Database entities & migrations](./03_DATABASE.md)
- [Security model](./04_SECURITY.md)
- [Founder decisions (locked)](./05_FOUNDER_DECISIONS.md)
- [Development workflow](./06_DEVELOPMENT_GUIDE.md)

### Product Revision V2 (Sprint 05.5)

- [Product revision overview](./07_PRODUCT_REVISION_V2.md)
- [Experience modes](./08_EXPERIENCE_MODES.md)
- [Architecture impact](./09_ARCHITECTURE_IMPACT.md)
- [Database revision plan](./10_DATABASE_REVISION_PLAN.md)
- [Implementation roadmap V2](./11_IMPLEMENTATION_ROADMAP_V2.md)
- [Studio UX](./12_STUDIO_UX.md)

### Development

- [AI coding rules](./07_AI_GUIDE.md)
