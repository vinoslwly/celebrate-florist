# Celebrate Florist Documentation

This folder is the **single source of truth** for the Celebrate Florist project. Every AI assistant and developer working on this repository should start here.

> **Repository:** [vinoslwly/celebrate-florist](https://github.com/vinoslwly/celebrate-florist)  
> **Active branch:** `rebuild/foundation`  
> **Supabase project:** `celebrate-florist-prod` (`jobknyooffpouniyqpkp`, `ap-southeast-1`)

---

## ⚠️ Product Revision V2 (Sprint 05.5)

**Before Sprint 06 implementation**, read the Product Revision V2 package. Celebrate evolved from a Digital Greeting Website into an **Interactive Digital Experience Platform** with four experience modes (Moments, Connection, Memories, Treasures).

| #   | Document                                                                             | Purpose                                                                                                                                         |
| --- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 7   | [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md)                             | Why the product changed, positioning, founder amendments                                                                                        |
| 8   | [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md)                                   | Per-mode product specification                                                                                                                  |
| 9   | [09_ARCHITECTURE_IMPACT.md](./09_ARCHITECTURE_IMPACT.md)                             | Engineering impact matrix (no code)                                                                                                             |
| 10  | [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md)                       | Schema recommendations (no SQL)                                                                                                                 |
| 11  | [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md)                 | **Sprint 06+ roadmap — supersedes pre-revision plan**                                                                                           |
| 12  | [12_STUDIO_UX.md](./12_STUDIO_UX.md)                                                 | **Studio admin UX — mandatory for Sprint 06 Studio work**                                                                                       |
| 13  | [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md)                               | **Experience Journey SSOT — recipient & buyer-preview ordering (all modes)**                                                                    |
| 14  | [14_REPLAYABLE_EXPERIENCE.md](./14_REPLAYABLE_EXPERIENCE.md)                         | **CF-R1 + CF-R2 — Replayable Experience SSOT (locked)**                                                                                         |
| 15  | [15_SPRINT_10_CF-R2_REPLAY_RESET.md](./15_SPRINT_10_CF-R2_REPLAY_RESET.md)           | **Sprint 10 — CF-R2 Treasures replay reset (✅ complete)**                                                                                      |
| 16  | [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](./16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) | **Sprint 11 — Scene Engine core spec + GER (✅ architecture complete; impl NOT authorized)**                                                    |
| —   | [sprint-11/README.md](./sprint-11/README.md)                                         | **Sprint 11 mode docs index — incremental documentation strategy**                                                                              |
| —   | [sprint-12/README.md](./sprint-12/README.md)                                         | **Sprint 12 UI System — CLOSED (docs baseline)**                                                                                                |
| —   | [sprint-12-implementation/README.md](./sprint-12-implementation/README.md)           | **Sprint 12 Implementation Pass — CLOSED (Core UI approved)**                                                                                   |
| —   | [sprint-12-5/README.md](./sprint-12-5/README.md)                                     | **Sprint 12.5 — Theme Lab milestone** · Bloom·Warm·Sky 🔒 · Playful/Pure 🧊 · [24 closure](./sprint-12-5/24_SPRINT_12_5_FINAL_CLOSURE_AUDIT.md) |

Sprint 05.5 was **documentation only** — no code, no migrations. Sprints 00–05 remain valid.

## ✅ CF-R1 + CF-R2 — LOCKED (Replayable Experience)

Founder approved **CF-R1** and **CF-R2** (CF-R2-A/B/C). **Sprint 10 is officially complete.** Engineering freeze in effect — no new implementation without explicit founder approval. See [14](./14_REPLAYABLE_EXPERIENCE.md) · [15](./15_SPRINT_10_CF-R2_REPLAY_RESET.md).

## 📋 Roadmap V1 — Post Sprint 10 (Founder Approved)

Sprint 00–10 = **Phase A — Product Foundation** ✅ complete. Platform core is shipped. Official long-term roadmap:

| Phase                            | Sprints | Status         | Purpose                                                                                                                                                                                                   |
| -------------------------------- | ------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Phase A — Product Foundation** | 00–10   | ✅ Complete    | Engineering, 4 modes, replayability, platform core                                                                                                                                                        |
| **Phase B — Experience Layer**   | 11–16   | 🔄 In progress | Sprint 11 architecture ✅; Sprint 12 Core UI ✅; **Sprint 12.5 Theme Lab 🔒 CLOSED** (Bloom·Warm·Sky locked · Playful frozen · [24](./sprint-12-5/24_SPRINT_12_5_FINAL_CLOSURE_AUDIT.md)); S13–16 planned |
| **Phase C — Release Layer**      | 17–19   | 📋 Planned     | QA, production readiness (incl. landing/SEO), **V1 Launch**                                                                                                                                               |

**Sprint 11 architecture is complete** (2026-07-16). All four modes locked; cross-mode review passed. **Scene Engine implementation has NOT started.** [16](./16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [sprint-11/](./sprint-11/README.md) · [05 — Cross-Mode Review](./sprint-11/05_CROSS_MODE_REVIEW.md).

**Sprint 12 Implementation Pass is CLOSED** (2026-07-19) — Core UI System **IMPLEMENTED AND APPROVED**. **Sprint 12.5 Theme Lab milestone is 🔒 CLOSED** (2026-08-04) — Bloom · Warm · Sky locked (12 mode combinations); Playful + Pure frozen; release scope **3×4**. [24 closure](./sprint-12-5/24_SPRINT_12_5_FINAL_CLOSURE_AUDIT.md) · [sprint-12-5/](./sprint-12-5/README.md). Production Scene Engine / `/e/[token]` wiring **NOT AUTHORIZED**.

## ✅ Sprint 05.5 — CLOSED (Official Implementation Baseline)

Sprint 05.5 is **closed**. All documentation in this package is the **official baseline** for Sprint 06+ implementation. No further design reviews required unless the founder explicitly reopens a decision.

| Review                     | Status                                                                                                                                                    |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Product Revision V2        | ✅ Closed                                                                                                                                                 |
| Architecture Review        | ✅ Closed — [02_ARCHITECTURE.md](./02_ARCHITECTURE.md), [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md)                                              |
| Database Design Review     | ✅ Closed — [03_DATABASE.md](./03_DATABASE.md), [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md)                                            |
| Studio Design Review       | ✅ Closed — [12_STUDIO_UX.md](./12_STUDIO_UX.md)                                                                                                          |
| Sprint 06 Readiness Review | ✅ Closed — **READY WITH MINOR NOTES**; notes are engineering checklist only ([11](./11_IMPLEMENTATION_ROADMAP_V2.md#sprint-06-implementation-checklist)) |

**Sprint 08R is complete.** Sprints 09A, 09B, and 10 are complete per [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md).

## ✅ Sprint 06 — CLOSED (Studio Foundation + Mode Schema)

Sprint 06 is **closed**. Order-centric Studio foundation, Migration 016, and unified editor shell are implemented and accepted.

| Review                      | Status                         |
| --------------------------- | ------------------------------ |
| Sprint 06 Acceptance Review | ✅ Closed — **FULLY ACCEPTED** |

## ✅ Sprint 08 — CLOSED (Connection Experience)

Sprint 08 is **closed**. Connection quiz, templates, recipient grading, buyer preview, and `service_role` hotfix are implemented and accepted.

| Review                   | Status                                                                              |
| ------------------------ | ----------------------------------------------------------------------------------- |
| Sprint 08 Phase 8 Review | ✅ Closed — **CONDITIONALLY ACCEPTED** (P1 smoke test satisfied in founder session) |

## ✅ Sprint 08R — CLOSED (Connection Journey Revision)

Sprint 08R is **closed**. Connection recipient flow revised to game-first reward architecture per [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md).

| Phase | Status | Summary                                                              |
| ----- | ------ | -------------------------------------------------------------------- |
| 08R-A | ✅     | Gate Payload + Reward Payload contracts and services                 |
| 08R-B | ✅     | Recipient orchestration (`ConnectionExperienceFlow`)                 |
| 08R-C | ✅     | Verification, regression, buyer preview alignment, security evidence |
| 08R-D | ✅     | Documentation synchronization — SSOT linked; drift resolved          |

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

| #   | Document                                                                             | Purpose                                                                     |
| --- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| 7   | [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md)                             | Product vision revision                                                     |
| 8   | [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md)                                   | Four experience modes in detail                                             |
| 9   | [09_ARCHITECTURE_IMPACT.md](./09_ARCHITECTURE_IMPACT.md)                             | What changes vs what stays                                                  |
| 10  | [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md)                       | Planned schema extensions (no SQL)                                          |
| 11  | [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md)                 | Future sprint breakdown                                                     |
| 12  | [12_STUDIO_UX.md](./12_STUDIO_UX.md)                                                 | Studio IA, workflow, unified editor                                         |
| 13  | [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md)                               | **Experience Journey SSOT** — all mode recipient & preview ordering         |
| 16  | [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](./16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) | **Sprint 11 Scene Engine spec + ADRs** — read before Phase B implementation |

### AI Coding Rules

| #   | Document                           | Purpose                                                       |
| --- | ---------------------------------- | ------------------------------------------------------------- |
| —   | [07_AI_GUIDE.md](./07_AI_GUIDE.md) | Rules for AI coding assistants — **read before writing code** |

> **Note:** `07_AI_GUIDE.md` and `07_PRODUCT_REVISION_V2.md` share the `07_` prefix by historical numbering. Product Revision docs use **07–12**; the AI Guide predates Sprint 05.5. Always read **both** the Product Revision package (including [12_STUDIO_UX.md](./12_STUDIO_UX.md)) and the AI Guide before implementing Sprint 06+.

---

## Current Project Status

| Area                        | Status                                                                                                                                                                      |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Development phase**       | **Engineering freeze** — Phase A (Sprint 00–10) complete; Phase B/C planned per [Roadmap V1](./11_IMPLEMENTATION_ROADMAP_V2.md#roadmap-v1--post-sprint-10-founder-approved) |
| **Current sprint**          | **Sprint 12.5 — CLOSED** · Bloom·Warm·Sky 🔒 · Playful 🧊 · [24 closure](./sprint-12-5/24_SPRINT_12_5_FINAL_CLOSURE_AUDIT.md) · next: Sprint 13 (Founder authorize)         |
| **Latest completed sprint** | **Sprint 10** — CF-R2 replay reset (10A–10C) + CRIT-01 `service_role` DELETE hotfix                                                                                         |
| **Deployment**              | Vercel project linked; Studio + recipient `/e/[token]` + buyer `/preview/[token]` routes deployable                                                                         |
| **Database**                | **21** migrations in repo; all Sprint 09A–10 migrations applied on remote — see [03_DATABASE.md](./03_DATABASE.md)                                                          |
| **Security**                | Sprint 02B hardening complete; RLS and privilege hardening complete (migrations 011–015)                                                                                    |
| **Product**                 | **V2:** All **four experience modes** production-ready — Moments, Connection, Memories, Treasures (Studio publish, preview, QR, recipient UI)                               |
| **Production readiness**    | **Platform core shipped** — Phase B/C transforms functional product into premium launch experience                                                                          |

### Sprint History

| Sprint                                | Status        | Summary                                                                                                         |
| ------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------- |
| Sprint 00 — Foundation                | ✅ Complete   | Next.js 16 scaffold, Supabase connectivity, tooling                                                             |
| Sprint 01 — Landing Page              | ✅ Complete   | Full marketing site with 5 themes, bouquet catalog, FAQ                                                         |
| Sprint 02 — Architecture              | ✅ Complete   | Folder structure, env validation, feature scaffolding                                                           |
| Sprint 02A — Architecture Audit       | ✅ Complete   | Stress test of architecture decisions (audit only)                                                              |
| Sprint 02B — Foundation Hardening     | ✅ Complete   | `proxy.ts`, CSP, security headers, image domains                                                                |
| Sprint 03 — Database Design           | ✅ Approved   | Schema design in Notion (not duplicated here)                                                                   |
| Sprint 03A — Database Implementation  | ✅ Complete   | 15 SQL migrations, live audit, hardening                                                                        |
| Sprint 04 — Infrastructure            | ✅ Complete   | Env, clients, repos, errors, logging, actions, storage                                                          |
| Sprint 05 — Studio Authentication     | ✅ Complete   | Studio auth pages, route protection, login action                                                               |
| **Sprint 05.5 — Product Revision V2** | ✅ **Closed** | Docs 07–12; all reviews closed; **official implementation baseline**                                            |
| **Sprint 06**                         | ✅ **Closed** | Studio orders + mode schema + migration 016 ([Roadmap V2](./11_IMPLEMENTATION_ROADMAP_V2.md))                   |
| **Sprint 07**                         | ✅ **Closed** | Moments E2E + Memory Code grace period + trusted devices + publish/preview/QR                                   |
| **Sprint 08**                         | ✅ **Closed** | Connection quiz + templates — Phases 1–8 complete; hotfix `service_role` grants applied                         |
| **Sprint 08R**                        | ✅ **Closed** | Connection journey revision — gate/reward split, orchestration, verification, doc sync (08R-A–D)                |
| **Sprint 09A**                        | ✅ **Closed** | Memories — match pairs, gate/reward, recipient UI, buyer preview (Phases 1–7)                                   |
| **Sprint 09B**                        | ✅ **Closed** | Treasures envelopes (max 6) — Studio editor, recipient UI, per-envelope fetch (FD-T1–T5)                        |
| **Sprint 10**                         | ✅ **Closed** | CF-R2 Treasures replay reset (10A–10C) + CRIT-01 production hotfix ([15](./15_SPRINT_10_CF-R2_REPLAY_RESET.md)) |

### Planned Roadmap (Phase B — Experience Layer)

| Sprint        | Status                         | Summary                                                                                                                                                                        |
| ------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Sprint 11** | ✅ **Complete (Architecture)** | Scene Engine spec, ADRs, four mode docs, cross-mode review — [sprint-11/](./sprint-11/README.md) · impl NOT authorized                                                         |
| **Sprint 12** | ✅ **CLOSED**                  | UI System docs + **Core UI implementation approved** — [impl pass](./sprint-12-implementation/README.md) · [Bloom plan](./sprint-12-5/00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md) |
| **Sprint 13** | 📋 Planned — **NOT STARTED**   | Motion System — cinematic transitions; reduced-motion; photobooth excluded                                                                                                     |
| **Sprint 14** | 📋 Planned — **NOT STARTED**   | Experience Components — Photobooth redesign (Layout B, Layout K)                                                                                                               |
| **Sprint 15** | 📋 Planned                     | **Studio UX** — operational polish; UX only; no backend changes                                                                                                                |
| **Sprint 16** | 📋 Planned                     | Polish — micro interactions, loading states, a11y, performance                                                                                                                 |

### Planned Roadmap (Phase C — Release Layer)

| Sprint        | Status     | Summary                                                                                                     |
| ------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| **Sprint 17** | 📋 Planned | QA — all modes, Studio, desktop/mobile, regression, security                                                |
| **Sprint 18** | 📋 Planned | Production Readiness — docs, monitoring, analytics, **landing readiness**, SEO, metadata, release checklist |
| **Sprint 19** | 📋 Planned | **V1 Launch** — production deployment; critical bug fixes only                                              |

---

## AI Instructions

Every AI assistant working on this repository **MUST**:

1. **Read this file first**, then follow the reading order above.
2. **Read the Product Revision V2 package (docs 07–12) before Sprint 07 code** — especially [12_STUDIO_UX.md](./12_STUDIO_UX.md) for Studio work.
3. **Follow [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md)** — Phase A complete; Roadmap V1 (Sprint 11–19) is the official post–Sprint 10 plan. Sprint 11 uses **incremental mode documentation** ([sprint-11/](./sprint-11/README.md)); do not implement Scene Engine without explicit founder implementation clearance.
4. **Consult [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md)** for recipient and buyer-preview journey ordering — **SSOT for all modes**.
5. **Never modify architecture** without explicit founder approval.
6. **Respect [Founder Decisions](./05_FOUNDER_DECISIONS.md)** — they override convenience.
7. **Never over-engineer** — prefer the simplest correct solution.
8. **Never introduce features** outside the approved roadmap.
9. **Preserve existing architecture** whenever possible.
10. **Keep documentation synchronized** with implementation when sprints change schema, security, or business rules.
11. **Do not invent information** — use the codebase and these docs as source of truth. Mark unknowns as [Future Work](./01_PROJECT_CONTEXT.md#future-work).

### What Exists Today (Code Reality)

| Layer            | Implemented                                                                                                                                                                                                                                     | Not Yet Implemented                                                             |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Routes           | `app/(public)/` landing; `app/(studio)/` login, dashboard, orders CRUD; `app/(experience)/e/[token]`; `app/(preview)/preview/[token]`                                                                                                           | —                                                                               |
| Features (code)  | `features/landing/`, `features/themes/`, `features/studio/`, `features/experience/`, `features/access/`, `features/preview/`, `features/photobooth/`, `features/analytics/`, `features/quiz/`, **`features/match/`**, **`features/treasures/`** | Phase B — Scene Engine, UI system, motion, photobooth, Studio UX (Sprint 11–16) |
| Supabase clients | `lib/supabase/client.ts`, `server.ts`, `admin.ts`                                                                                                                                                                                               | —                                                                               |
| Auth             | Session helpers, Studio login/logout, `proxy.ts` gate, Memory Code grace/trusted devices, recipient access gate                                                                                                                                 | —                                                                               |
| Database         | Full V1 schema + migrations through Sprint 10 — see [03_DATABASE.md](./03_DATABASE.md)                                                                                                                                                          | —                                                                               |
| Product          | V2 four-mode platform — **all four modes E2E shipped**; CF-R2 replay reset (Treasures)                                                                                                                                                          | Phase B/C — premium experience + Studio UX + V1 launch (Sprint 11–19)           |

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
- [Experience Journey SSOT](./13_EXPERIENCE_JOURNEY.md)

### Development

- [AI coding rules](./07_AI_GUIDE.md)
