# 05 — Founder Decisions

> **Related:** [Project Context](./01_PROJECT_CONTEXT.md) · [Architecture](./02_ARCHITECTURE.md) · [Database](./03_DATABASE.md) · [Security](./04_SECURITY.md) · [AI Guide](./07_AI_GUIDE.md)

---

## Purpose

This document records **locked business and product decisions** made by the founder. These are not suggestions — they are constraints that every developer and AI assistant must respect unless the founder explicitly approves a change.

Each decision includes the **what**, the **why**, and where it is **enforced** in the codebase.

---

## Business Model

### Single Florist, Single Brand

|              |                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Celebrate Florist is one florist in Surakarta — not a platform, marketplace, or franchise.                                    |
| **Why**      | The product is a bespoke emotional gift experience tied to a specific brand identity. Multi-brand dilutes the personal touch. |
| **Enforced** | No multi-tenant schema, no `florist_id` column, no partner tables.                                                            |

### No Payment Gateway

|              |                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Orders are placed offline via WhatsApp. No checkout, no Stripe, no payment processing.                                                                          |
| **Why**      | Target market (Surakarta) operates on personal relationships and offline payment (transfer, cash). Payment gateways add complexity without value at this stage. |
| **Enforced** | Landing page CTAs link to WhatsApp (`lib/whatsapp.ts`). No payment tables or API integrations.                                                                  |

### No Customer Accounts

|              |                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Neither buyers nor recipients create accounts.                                                                                       |
| **Why**      | The gift is the identity — adding account creation friction kills the emotional moment. Admin is the only authenticated user.        |
| **Enforced** | No `customers` table. Supabase Auth has one admin user only. Recipients authenticate via Memory Code (trusted device), not accounts. |

### Single Administrator

|              |                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| **Decision** | One admin (`ADMIN_EMAIL`). No multi-admin, no role hierarchy.                                               |
| **Why**      | The founder operates the business solo. Role systems add complexity for a team that doesn't exist.          |
| **Enforced** | No roles/claims table. RLS uses `authenticated` as admin. Email verified server-side against `ADMIN_EMAIL`. |

---

## Product Architecture

### One Order → One Experience

|              |                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Every order maps to exactly one digital experience. 1:1 relationship.                                               |
| **Why**      | A bouquet is a single gift for a single person. Multiple experiences per order would confuse the product narrative. |
| **Enforced** | `experiences.order_id` has UNIQUE constraint in migration 004.                                                      |

### Preview Link ≠ Experience Link

|              |                                                                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Buyer preview and recipient experience use separate tokens and workflows.                                                                                               |
| **Why**      | The buyer approves the design before delivery. The recipient gets a different, more protected link with Memory Code. Mixing them would leak content or bypass approval. |
| **Enforced** | Separate tables: `preview_links.preview_token` and `experiences.experience_token`. Partial unique index ensures one active preview per experience.                      |

### Experience Immutable After Publish

|              |                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Once published, letter content and photos cannot be edited.                                                                                                      |
| **Why**      | The recipient receives a promise — "this is your gift." Allowing post-publish edits breaks trust. Admin can disable or archive, but not silently change content. |
| **Enforced** | `experiences.content_locked_at` set on publish. CHECK constraint requires publish status. Application layer must reject edits when `content_locked_at` is set.   |

### Maximum 6 Memory Photos

|              |                                                                                                    |
| ------------ | -------------------------------------------------------------------------------------------------- |
| **Decision** | Each experience allows at most 6 permanent memory photos.                                          |
| **Why**      | Quality over quantity. Six curated photos tell a story; unlimited uploads become a dumping ground. |
| **Enforced** | `experience_photos.sort_order` CHECK (1–6). UNIQUE `(experience_id, sort_order)`.                  |

### Photobooth Photos Never Stored

|              |                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Photobooth images exist only in the browser. Never uploaded to Supabase Storage.                                                                                               |
| **Why**      | Photobooth is ephemeral fun — a moment captured in the session, not a permanent record. Storing them increases liability, storage cost, and privacy risk for no product value. |
| **Enforced** | No photobooth storage bucket in migration 009. `analytics_event` tracks `photobooth_started`/`photobooth_completed` but no photo table exists.                                 |

### Gifts Archived After 365 Days Inactivity

|              |                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Experiences with no access for 365 days are automatically archived.                                                      |
| **Why**      | Storage and data minimization. Old gifts that nobody visits shouldn't consume resources indefinitely. Admin can restore. |
| **Enforced** | `experiences.status = 'archived'` with `archived_at` timestamp. Archival job not yet implemented (Future Work).          |

---

## Security Decisions

### Memory Code — Product Terminology

|              |                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | In all product and UI documentation, use **"Memory Code"** — not "Access Code."                                                                   |
| **Why**      | Branding and emotional framing. "Memory Code" fits the gift narrative; "Access Code" sounds technical.                                            |
| **Enforced** | Product docs, Studio labels, recipient UI copy. Engineering may retain technical names (`memory_key_hash`, `access_attempts`) in code and schema. |

### Memory Code Grace Period (24 Hours)

|                |                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | Memory Code must **not** interrupt the recipient's first emotional experience. After the **first successful access**, a **24-hour grace period** begins during which any device may open the experience without entering the Memory Code. Each device that successfully accesses during this window becomes a **Trusted Device**. After grace expires, existing Trusted Devices continue without interruption; **new** devices must enter the Memory Code. |
| **Why**        | Better first emotional moment; supports device changes (old phone → new phone); reduces friction during flower delivery; security begins after the emotional moment ends.                                                                                                                                                                                                                                                                                  |
| **Enforced**   | **Planned** — Sprint 07 (Recipient Experience). Application logic in `features/access/services/`. Grace computed from `first_opened_at + 24h` — **no new schema column**. See [04_SECURITY.md](./04_SECURITY.md) and [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md).                                                                                                                                                                       |
| **Supersedes** | Pre-V2 rule: "Memory Code required on first visit from each new device immediately."                                                                                                                                                                                                                                                                                                                                                                       |

**Flow summary:**

1. Recipient scans QR code.
2. **First 24 hours after first successful access:** any device opens without Memory Code; each successful access registers as Trusted Device.
3. **After grace expires:** Trusted Devices → no code; new devices → Memory Code required → on success, becomes Trusted Device.

### Memory Code Never Stored Plaintext

|              |                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Memory Code is hashed with `MEMORY_KEY_PEPPER` before storage. Never logged, never displayed after admin setup.                                         |
| **Why**      | If the database is compromised, plaintext codes would expose all gifts. Hashing with a server-side pepper means the attacker needs both DB and env var. |
| **Enforced** | Column named `memory_key_hash`. `MEMORY_KEY_PEPPER` in server-only env.                                                                                 |

### anon Has Zero Gift Domain Access

|              |                                                                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | The Supabase `anon` role has no RLS policies on experiences, photos, sessions, or analytics.                                                           |
| **Why**      | The anon key is bundled into the browser. Any RLS policy granting anon read access would expose all gift content to anyone inspecting network traffic. |
| **Enforced** | Migration 008: intentionally no anon policies on Gift domain. Migration 013: revoked anon DML grants.                                                  |

### All Recipient Reads via service_role

|              |                                                                                                                                                                 |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Server-side code using `service_role` fetches gift content only after Memory Code verification, grace-period rules, or valid trusted session.                   |
| **Why**      | Application-layer gate is the primary control. RLS is defense in depth, not the access mechanism for recipients.                                                |
| **Enforced** | Architecture documented in `lib/supabase/server.ts` and `lib/supabase/admin.ts` (Sprint 04). Recipient gate in `features/access/services/` (Planned Sprint 07). |

### Audit Logs Are Immutable

|              |                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Decision** | `audit_logs` rows can never be updated or deleted — by any role.                                                      |
| **Why**      | Audit integrity. If an admin (or attacker with service_role) could delete audit entries, accountability is destroyed. |
| **Enforced** | `prevent_audit_log_mutation()` trigger in migration 007. Fires for all roles including service_role.                  |

### Admin Email Never in Version Control

|              |                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Decision** | The real admin email exists only in `.env.local` and remote `app_settings`. Never committed to Git.              |
| **Why**      | Email in Git history is a permanent leak. Even in a private repo, it violates data minimization.                 |
| **Enforced** | Migration 015 has no INSERT. `.env.example` uses placeholder. Commit `264b2e9` removed email from tracked files. |

---

## Product Revision V2 Decisions (Sprint 05.5)

> Full context: [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md)

### Hybrid Database Design (Normalized + Limited JSONB)

|              |                                                                                                                                                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Use **normalized tables** as the primary structure (`experience_mode`, quiz questions, match pairs, envelopes, etc.). **JSONB only** for small auxiliary data that does not require query or complex analytics (e.g. quiz `options` array, simple metadata). JSONB must **not** be the primary storage for mode content. |
| **Why**      | Celebrate is not SaaS or marketplace — complex analytics are not required. Priorities: speed-to-market, maintainability, and security. Normalized tables keep validation and future extension clean.                                                                                                                     |
| **Enforced** | [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md). Migrations 016+ when approved.                                                                                                                                                                                                                           |

### Simple Analytics Only

|              |                                                                                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Analytics at **business level only**: experience opened, experience completed, mode used. **No** per-question, per-photo, or per-envelope analytics in V2. |
| **Why**      | Operational insight without dashboard complexity. Founder and marketing do not need engineering-grade funnel analytics.                                    |
| **Enforced** | `experience_analytics` records coarse events only. Mode-specific micro-events in prior docs are **withdrawn** unless added later as Future Idea.           |

### Connection Quiz Limits

|              |                                                                                     |
| ------------ | ----------------------------------------------------------------------------------- |
| **Decision** | Connection mode: **maximum 6 questions**, **multiple choice only** (A/B/C options). |
| **Why**      | Bounded admin effort; fast recipient completion; clear UX on mobile.                |
| **Enforced** | Application validation + Zod schemas at implementation.                             |

### Treasures Envelope Limit

|              |                                                              |
| ------------ | ------------------------------------------------------------ |
| **Decision** | Treasures mode: **maximum 6 envelopes** per experience.      |
| **Why**      | Aligns with 6-photo cap; prevents fatigue; bounded admin UX. |
| **Enforced** | Application validation at implementation.                    |

### Experience Templates (Studio)

|              |                                                                                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Studio must offer **templates** so admin does not author every experience from scratch. Example: **New Connection** → choose Anniversary, Graduation, Birthday, or Proposal template → pre-filled questions and copy to edit. |
| **Why**      | Scales admin workflow as order volume grows. Reduces time-per-order and errors.                                                                                                                                               |
| **Enforced** | **Planned** — Connection templates in Sprint 08; Memories/Treasures templates in Sprint 09A/09B. Templates live in application config or seed data, not customer-editable CMS.                                                |

### Moments Letter Animation

|                 |                                                                                   |
| --------------- | --------------------------------------------------------------------------------- |
| **Decision**    | Moments differentiation is sufficient for entry tier without mini-games.          |
| **Future Idea** | Optional letter-open animation for emotional polish — not required for V2 launch. |

### Pricing Ownership

|              |                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------ |
| **Decision** | Pricing and tier packaging are owned by **founder, marketing, and R&D** — not engineering. |
| **Why**      | Business strategy outside codebase scope.                                                  |
| **Enforced** | Engineering stores `experience_mode` for segmentation; no pricing engine in app.           |

---

## Architecture Decisions (Sprint 05.5 Review)

> Full technical detail: [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) · Review outcome: Architecture Review closed — Sprint 06 cleared to proceed.

### Feature-First Repositories

|              |                                                                                                                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Domain repositories live in `features/<domain>/repositories/`. `lib/repositories/` holds **only** cross-domain infrastructure (e.g. `Repository` base class) — **not** business repositories.                                            |
| **Why**      | Keeps each feature modular; prevents `lib/` from becoming a god folder; aligns repo ownership with feature ownership.                                                                                                                    |
| **Enforced** | `features/studio/repositories/`, `features/quiz/repositories/`, `features/match/repositories/`, `features/treasures/repositories/`, etc. `ThemesRepository` in `lib/repositories/` is legacy reference — new repos follow feature-first. |

### Hybrid Experience Mode Structure

|              |                                                                                                                                                                                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | `features/experience/` is the **shell / orchestrator** (routing, shared layout, letter, gallery, photobooth, mode registry, shared services). Each mode is an **independent feature**: `quiz/`, `match/`, `treasures/` — each with its own Studio editor, repository, actions, services, and validation. |
| **Why**      | Modes differ significantly in admin and recipient logic; forcing all mode code inside `experience/` would create an unmaintainable monolith within a monolith.                                                                                                                                           |
| **Enforced** | Mode registry in `features/experience/config/`. Mode features registered by `experience_mode` value.                                                                                                                                                                                                     |

### Feature Dependency Rules

|              |                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | `experience` may import mode modules **via registry only**. Mode modules must **not** import `studio`. Features must **not** import sibling features directly. |
| **Why**      | Prevents circular dependencies and keeps Studio admin surface separate from recipient/mode surfaces.                                                           |
| **Enforced** | Code review + AI guide. Violations block merge.                                                                                                                |

### Services Layer Owns Business Rules

|              |                                                                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Business logic (publish validation, mode routing, grace period, trusted device rules) lives in `features/<domain>/services/`. Server Actions are **thin entry points**. Repositories are **data access only**. |
| **Why**      | Prevents logic duplication across actions; keeps testable pure business rules; avoids fat repositories.                                                                                                        |
| **Enforced** | `features/studio/services/`, `features/access/services/`, `features/experience/services/`, mode feature services.                                                                                              |

---

## Database Design Decisions (Sprint 05.5 Review)

> Full technical detail: [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md) · Review outcome: Database Design Review closed — Sprint 06 cleared to proceed.

### `experience_mode` on `orders`

|              |                                                                                                                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Add `experience_mode` to `orders` for reporting/filtering before an experience row exists. After experience creation, `experiences.experience_mode` is source of truth. **No sync back** to `orders`. |
| **Why**      | Admin needs mode visibility at order stage; avoids false sync obligations after draft edits.                                                                                                          |
| **Enforced** | Migration 016. TEXT + CHECK on both tables.                                                                                                                                                           |

### `experience_mode` Type

|              |                                                                                        |
| ------------ | -------------------------------------------------------------------------------------- |
| **Decision** | TEXT + CHECK (`moments`, `connection`, `memories`, `treasures`) — not PostgreSQL ENUM. |
| **Why**      | Easier to extend for a fifth mode without enum migration complexity.                   |
| **Enforced** | Migration 016 CHECK constraints.                                                       |

### Mode Change Before Publish

|              |                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Auto-delete incompatible child data when admin changes mode on a draft. Studio shows **confirmation dialog** before deletion. |
| **Why**      | Prevents orphan rows; simpler than blocking mode changes.                                                                     |
| **Enforced** | `features/studio/services/` mode-change handler.                                                                              |

### Quiz Score Bands

|              |                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Decision** | Connection publish requires **≥ 1 score band**. Multiple bands optional — admin may use a single result message. |
| **Why**      | Supports simple quizzes without forcing tiered scoring.                                                          |
| **Enforced** | Publish validation in `features/studio/services/`.                                                               |

### `quiz_title` on `experiences`

|              |                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Decision** | Nullable `quiz_title` column on `experiences` — one title per experience, not per question. |
| **Why**      | Connection mode has one quiz heading; avoids redundant child table.                         |
| **Enforced** | Migration 016.                                                                              |

### `shuffle_seed` Deferred

|              |                                                                                                                   |
| ------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Decision** | No `shuffle_seed` column in V2 schema. New migration only if Memories requires deterministic shuffle persistence. |
| **Why**      | No current product need; avoids speculative schema.                                                               |
| **Enforced** | Not in migrations 016–019.                                                                                        |

### Child Table Immutability After Publish

|              |                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | After `content_locked_at` is set, mode child tables follow `experience_photos` pattern — **no UPDATE** via RLS or Studio. |
| **Why**      | Published gift content is a promise; same immutability rule as letter and photos.                                         |
| **Enforced** | RLS policies on new tables (migrations 017–019): INSERT in draft; no UPDATE policy.                                       |

### Grace Period — No `grace_expires_at`

|              |                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------- |
| **Decision** | Grace window computed dynamically: `first_opened_at + 24 hours`. No `grace_expires_at` column. |
| **Why**      | Existing column sufficient; avoids redundant stored value.                                     |
| **Enforced** | `features/access/services/` (Sprint 07). No grace-period migration.                            |

### Publish Validation Matrix

|              |                                                                                                                                                                                                                                                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Publish validation must enforce: child tables match `experience_mode`; `photo_sort_order` references have photos; exactly one final envelope; mode-specific minimums. Full matrix in [03_DATABASE.md](./03_DATABASE.md#planned-v2-schema-sprint-06) and [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md). |
| **Why**      | Integrity rules identified in Database Design Review; must be documented before Sprint 08–09 implementation.                                                                                                                                                                                                            |
| **Enforced** | `features/studio/services/` publish validation (Sprint 07+ publish; mode rules Sprint 08–09).                                                                                                                                                                                                                           |

---

## Studio UX Decisions (Sprint 05.5 Review)

> Full detail: [12_STUDIO_UX.md](./12_STUDIO_UX.md) · Review outcome: Studio Design Review closed — Sprint 06 cleared to proceed.

### Order-Centric Studio

|              |                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Studio is **order-centric**. Sidebar: **Dashboard** and **Orders** only. No Experiences, Themes, or Templates menus. |
| **Why**      | 1:1 order–experience; founder thinks in orders, not parallel entities.                                               |
| **Enforced** | [12_STUDIO_UX.md](./12_STUDIO_UX.md) route map; `features/studio/config/routes.ts` at implementation.                |

### Unified Order Editor

|              |                                                                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Primary workspace: `/studio/orders/[id]`. **Unified Order Editor** — same shell for all modes; dynamic mode panel only. No separate editor per mode. |
| **Why**      | Fewer clicks; one mental model; fifth mode adds a panel, not a new app.                                                                              |
| **Enforced** | Editor shell in `features/studio/`; mode panels composed from `features/quiz/`, `match/`, `treasures/`.                                              |

### Single Create Order Form

|              |                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Create Order is **one form**: mode, sender, recipient, theme, and basics together. Mode is a field, not a separate step. |
| **Why**      | Operational speed; mode chosen once early (immutable after publish).                                                     |
| **Enforced** | `/studio/orders/new`; single server action creates order + experience.                                                   |

### Atomic Order + Experience Creation

|              |                                                                                  |
| ------------ | -------------------------------------------------------------------------------- |
| **Decision** | Experience row created **with** order in the same operation — 1:1 from creation. |
| **Why**      | No orphan orders; `experiences.experience_mode` copied from order at creation.   |
| **Enforced** | `features/studio/services/` order creation; transaction in server action.        |

### Publish Is One Action

|              |                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------- |
| **Decision** | **Publish** = lock content + generate QR + prepare for recipient. No separate "Generate QR" step. |
| **Why**      | One button, one moment of commitment — matches founder workflow.                                  |
| **Enforced** | `features/studio/services/` publish (Sprint 07).                                                  |

### Buyer Approval Default + Skip Preview Override

|              |                                                                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | **Buyer approval** via preview link is the **default** before publish. **Skip Preview** override allowed for repeat customers or special cases. |
| **Why**      | Buyer must approve design; flexibility for trusted relationships.                                                                               |
| **Enforced** | Publish blocked until `approved` unless skip override recorded.                                                                                 |

### Premium Modes in Sprint 06–07

|              |                                                                                                                                                                                              |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Premium modes **selectable** at order creation. Admin edits full **Core Experience**. Premium panel shows **"Coming in Sprint X"** stub until editor ships. **Do not block** premium orders. |
| **Why**      | Record tier at sale time; core work can proceed before quiz/match/envelope UI exists.                                                                                                        |
| **Enforced** | Sprint 06–07 Studio UI; live panels in Sprint 08–09B.                                                                                                                                        |

### Dashboard Is Action Queue

|              |                                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Sprint 06 Dashboard = **action queue** (orders needing work, today's deliveries, New Order CTA) — **not** analytics charts. |
| **Why**      | Solo founder needs "what do I do next?" not dashboards without data.                                                        |
| **Enforced** | Sprint 06 `/studio` page. Analytics charts deferred to Sprint 10.                                                           |

---

## Sprint 05.5 Closure (Official Baseline)

> **Status:** **CLOSED** — Sprint 06 Readiness Review accepted by founder. No further design reviews required before Sprint 06.

| Review                     | Outcome                       |
| -------------------------- | ----------------------------- |
| Product Revision V2        | ✅ Baseline locked            |
| Architecture Review        | ✅ Baseline locked            |
| Database Design Review     | ✅ Baseline locked            |
| Studio Design Review       | ✅ Baseline locked            |
| Sprint 06 Readiness Review | ✅ **READY WITH MINOR NOTES** |

**Minor notes** (RPC atomic create, bootstrap draft values, photos shell-only, AI Guide sync, mode-change Sprint 06 behavior) are **engineering implementation checklist** items in [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md#sprint-06-implementation-checklist) — **not** specification revisions.

**Sprint 06 implementation is cleared to begin.**

---

## Content & Design Decisions

### Landing Page Content Is Static Config (V1)

|              |                                                                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Bouquet catalog, FAQ, nav items, and hero content live in TypeScript config files, not the database.                                           |
| **Why**      | Landing page changes infrequently and is edited by developers, not the admin via Studio. Database-driven CMS adds complexity without V1 value. |
| **Enforced** | `features/landing/config/` files. No `bouquets` or `faq` tables.                                                                               |

### Theme Visual Config in Application Code

|              |                                                                                                                                  |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Colors, emoji, flower, feeling, accent classes live in `features/themes/config/`. Database only stores slug, name, sort_order.   |
| **Why**      | Visual theming is a code concern (Tailwind classes, animations). Database themes are identity references for orders/experiences. |
| **Enforced** | Migration 010 seeds slug/name only. `types/theme.ts` defines the app-side type.                                                  |

### Five Themes, Fixed Set

|              |                                                                                                                                                                |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Exactly 5 themes: Bloom, Sky, Pure, Warm, Play. No custom theme creation.                                                                                      |
| **Why**      | Each theme is a designed experience with specific colors, animations, and mood. Open-ended theme creation would require a theme builder — far beyond V1 scope. |
| **Enforced** | Migration 010 seeds 5 rows. `features/themes/config/` has 5 files.                                                                                             |

---

## Operational Decisions

### No Order Deletion

|              |                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Decision** | Orders are never deleted from the database.                                                 |
| **Why**      | Business records and audit trail. An order represents a real transaction even if cancelled. |
| **Enforced** | No delete RLS policy on `orders`.                                                           |

### No Experience Deletion

|              |                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Experiences are disabled or archived, never deleted.                                                               |
| **Why**      | A published experience may have been opened by a recipient. Deletion would orphan analytics and break audit trail. |
| **Enforced** | No delete RLS policy on `experiences`. Status `disabled` available.                                                |

### No Preview Link Deletion

|              |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| **Decision** | Preview links are deactivated (`is_active = false`), never deleted. |
| **Why**      | Audit trail of what was sent to buyers and when.                    |
| **Enforced** | No delete RLS policy on `preview_links`. `disabled_at` timestamp.   |

### Orders via WhatsApp Only

|              |                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------- |
| **Decision** | The only order entry point is a WhatsApp conversation initiated from the landing page.   |
| **Why**      | Personal florist relationship. WhatsApp is the dominant messaging platform in Indonesia. |
| **Enforced** | `lib/whatsapp.ts` builds deep links. No order form on the website.                       |

---

## Complexity Decisions

### No Multi-Tenant

|              |                                                                                                                             |
| ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | No `tenant_id`, no florist partners, no white-label.                                                                        |
| **Why**      | See "Single Florist" above. Multi-tenant architecture is the most common source of accidental complexity in early products. |
| **Enforced** | Schema has no tenant columns.                                                                                               |

### No Marketplace

|              |                                                                     |
| ------------ | ------------------------------------------------------------------- |
| **Decision** | No florist directory, no comparison shopping, no vendor onboarding. |
| **Why**      | Celebrate is a brand, not a platform.                               |
| **Enforced** | No vendor/partner tables or routes.                                 |

### No Unnecessary Abstraction

|              |                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | No generic CRUD framework, no plugin system, no event bus, no message queue.                                                             |
| **Why**      | Every abstraction has a maintenance cost. Build exactly what the product needs.                                                          |
| **Enforced** | Direct Supabase queries in feature repositories. `Repository` base class in `lib/repositories/base.ts` is permitted (Sprint 04). No ORM. |

### No Speculative Features

|              |                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Do not build features, routes, or middleware behavior until the sprint that needs them.                                                           |
| **Why**      | Speculative code rots, adds review burden, and often guesses wrong.                                                                               |
| **Enforced** | Studio auth and proxy gate implemented when needed (Sprint 05). Experience routes deferred to Sprint 07. Empty feature scaffolds are intentional. |

---

## How to Challenge a Decision

If you believe a founder decision should change:

1. **Document the problem** — what specifically doesn't work?
2. **Propose an alternative** — with trade-offs, not just "let's use X instead."
3. **Get explicit founder approval** — a comment in a PR is not approval.
4. **Update this document** if the decision changes.

AI assistants must **never** unilaterally override a decision listed here.

---

## Related Documents

- [01_PROJECT_CONTEXT.md](./01_PROJECT_CONTEXT.md) — how decisions shape the product
- [03_DATABASE.md](./03_DATABASE.md) — schema enforcement of decisions
- [04_SECURITY.md](./04_SECURITY.md) — security decisions and implementation
- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) — technical architecture and code layout
- [12_STUDIO_UX.md](./12_STUDIO_UX.md) — Studio admin UX (order-centric, unified editor)
- [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md) — Product Revision V2 decisions
- [07_AI_GUIDE.md](./07_AI_GUIDE.md) — how AI assistants must respect these decisions
