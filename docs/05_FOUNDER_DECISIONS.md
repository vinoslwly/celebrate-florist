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

### Sprint 08 — OD-1 Analytics (Locked)

|              |                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | **No migration 020.** Do **not** add `experience_completed` to `analytics_event`. Continue recording `experience_opened` on granted recipient access. Segment by mode via JOIN on `experiences.experience_mode` at query time. |
| **Why**      | Coarse business insight without enum migration. Mode is already stored on `experiences`; duplicating it on analytics rows adds schema churn with no V2 benefit.                                                                |
| **Enforced** | `features/analytics/services/record-analytics.service.ts`; recipient page `app/(experience)/e/[token]/page.tsx`. Dashboard queries join `experience_analytics` → `experiences`.                                                |

### Connection Quiz Limits

|              |                                                                                     |
| ------------ | ----------------------------------------------------------------------------------- |
| **Decision** | Connection mode: **maximum 6 questions**, **multiple choice only** (A/B/C options). |
| **Why**      | Bounded admin effort; fast recipient completion; clear UX on mobile.                |
| **Enforced** | Application validation + Zod schemas at implementation.                             |

### CF-1 — Quiz Score Never Blocks Reward (Sprint 08R)

|              |                                                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Quiz score **never** blocks reward. **Any successful submit** unlocks: score display, band message, letter, gallery, and photobooth. Score affects band message only — not access to emotional content.                   |
| **Why**      | Connection is an emotional interaction, not an evaluation gate. Recipients should always receive the sender's letter after participating.                                                                                 |
| **Enforced** | `submitQuizAnswers()` always returns reward payload on successful submit; `ConnectionExperienceFlow` renders letter/gallery after unlock regardless of score. See [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md). |

### CF-2 — Connection Unlock Persistence (Sprint 08R)

|              |                                                                                                                                           |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Connection unlock state uses **`sessionStorage` only** — key `cf_connection_unlock_${experienceId}`. **No database state. No migration.** |
| **Why**      | Emotional replay-friendly UX; avoids server-side completion tracking for V2; new tab replays quiz (accepted trade-off).                   |
| **Enforced** | `features/experience/lib/connection-unlock-session.ts`; no unlock columns on `experiences`.                                               |

### CF-3 — Gallery Is Part of Reward (Sprint 08R)

|              |                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Gallery is part of the **reward tier**. Gallery **never** appears before unlock. Signed photo URLs are withheld from initial Connection payload. |
| **Why**      | Photos are emotional continuation after the letter — same gate as letter content in game-first modes.                                            |
| **Enforced** | `ConnectionExperienceFlow` renders `PhotoGallery` only when `isUnlocked === true`; reward payload mints signed URLs post-submit.                 |

### CF-4 — Connection Gate Payload / Reward Payload Split (Sprint 08R)

|              |                                                                                                                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Connection recipient flow uses **Gate Payload** on initial load → **Reward Payload** after successful quiz submit. Letter fields and signed photo URLs **never** exist in the initial payload.              |
| **Why**      | Security and product timing — quiz earns the emotional reveal; prevents letter/photo leak in HTML, RSC, or first network response.                                                                          |
| **Enforced** | `fetchConnectionGatePayload()` on Connection branch only; `buildConnectionRewardPayload()` via `submitQuizAnswersAction`. Connection does **not** call `fetchPublishedExperience()` on live recipient path. |

### CF-5 — Premium Experience Philosophy: Game First (Sprint 08R)

|              |                                                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Premium interactive modes follow: **Game First → Reward → Letter → Gallery → Photobooth**. Applies to **Connection** and **Memories**. **Treasures** uses envelope ceremony before letter (any order per FD-T1).     |
| **Why**      | Interactive gifting differentiates Celebrate; emotional content is earned through participation, not delivered immediately. Treasures uses ceremony pacing via envelopes instead of a single game gate.              |
| **Enforced** | Connection: Sprint 08R implemented. Memories: FD-M1–FD-M5 locked (Phase 5.5); gate/reward Phase 6A–6C. Treasures: Sprint 09B per-envelope fetch (A-4). SSOT: [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md). |

### CF-R1 — Replayable Experience ✅ LOCKED

|                         |                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**            | Celebrate Florist is a **Digital Experience Gift**. Recipients must be able to reopen an experience weeks, months, or years later and experience the **same emotional journey from the beginning** — like reopening a physical gift box, not a completed game save. |
| **Journey progress**    | Progress before the replay trigger (Photobooth) **must be preserved** via server state.                                                                                                                                                                             |
| **Lifetime replay**     | Progress **must not** permanently lock the experience as completed. After CF-R2 trigger, reload intentionally replays from ✉️.                                                                                                                                      |
| **Evaluation question** | _"If the recipient comes back one year later, what experience should they feel?"_                                                                                                                                                                                   |
| **Approved**            | Founder — 2026-07-14                                                                                                                                                                                                                                                |
| **Sprint 10 scope**     | Treasures only                                                                                                                                                                                                                                                      |

### CF-R2 — Replay Reset ✅ LOCKED (Final Revision)

|                         |                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **CF-R2-A**             | Replay trigger: **first Photobooth reach** after all envelopes complete → silent `DELETE FROM experience_envelope_opens`.                                                |
| **CF-R2-B**             | Permanently rejected: inactivity timers, `last_accessed_at` logic, visit detection, session cookies, replay sessions, browser lifecycle hooks, analytics visit tracking. |
| **CF-R2-C**             | Reload after replay trigger (refresh, reopen, return later) **intentionally** starts ✉️ fresh. Not a bug. No post-trigger state preservation.                            |
| **No visit concept**    | Product does not detect same visit vs new visit. Only Current Experience or New Experience (page load).                                                                  |
| **No additional UX**    | No Finish button, Replay button, confirmation dialog, or completion popup. Photobooth is the natural endpoint.                                                           |
| **Invisible reset**     | Current page continues — letter, gallery, photobooth uninterrupted until reload.                                                                                         |
| **Approved**            | Founder — 2026-07-14 (CF-R2 final revision)                                                                                                                              |
| **Implementation plan** | [15_SPRINT_10_CF-R2_REPLAY_RESET.md](./15_SPRINT_10_CF-R2_REPLAY_RESET.md) — ✅ shipped Sprint 10                                                                        |
| **Enforced**            | ✅ Treasures recipient flow (Sprint 10)                                                                                                                                  |

**Permanent engineering guideline:** Favor product simplicity over technical sophistication. Future experience modes must evaluate against CF-R1 and CF-R2 before shipping.

---

## Sprint 11 — Experience Architecture (Founder Approved)

> **Status:** **Architecture complete** — **implementation NOT authorized**  
> **Core architecture approval:** 2026-07-15 (FD-S11-01–06)  
> **Mode docs:** [sprint-11/README.md](./sprint-11/README.md)  
> **Specification:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](./16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md)

Sprint 11 is an **architecture planning sprint only**. No production code, backend changes, database changes, animation implementation, UI redesign, or implementation spikes.

### FD-S11-01 — Wrap Architecture ✅ APPROVED

|                      |                                                                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**         | **Option A — Wrap.** Scene Engine MUST wrap the existing ExperienceFlow architecture. It is a **presentation orchestration layer only**. |
| **Must NOT replace** | Repositories, services, server actions, gate/reward logic, business state, existing payload contracts.                                   |
| **ADR**              | [adr/S11-001-wrap-architecture.md](./adr/S11-001-wrap-architecture.md)                                                                   |

### FD-S11-02 — Treasures Navigation ✅ APPROVED

|              |                                                                                                                                                                                                                           |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | **Back Edge.** Treasures is the **only** mode allowed to navigate Envelope Content → Envelope Grid. Preserves FD-T3 while keeping the overall journey forward-only. No other mode gains backward navigation after reward. |
| **ADR**      | [adr/S11-005-treasures-back-edge.md](./adr/S11-005-treasures-back-edge.md)                                                                                                                                                |

### FD-S11-03 — Persistent Shell ✅ APPROVED

|              |                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Persistent Shell architecture. Theme, layout frame, and global UI remain **mounted** while individual scenes mount/unmount inside the shell. Minimizes rerenders; stable foundation for Sprint 13 Motion System. |
| **ADR**      | [adr/S11-002-persistent-shell.md](./adr/S11-002-persistent-shell.md)                                                                                                                                             |

### FD-S11-04 — Parameterized Scene Graph ✅ APPROVED

|              |                                                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Scene graphs MUST support parameterized structures (e.g., Treasures with 2–6 envelopes) without changing the Scene Engine. New modes require only a new scene graph + registry entry. |
| **ADR**      | [adr/S11-004-parameterized-scene-graph.md](./adr/S11-004-parameterized-scene-graph.md)                                                                                                |

### FD-S11-05 — Initial Scene Ownership ✅ APPROVED

|              |                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | The **server** determines the initial scene. Scene Engine MUST never guess. Server state (existing Phase A contracts) determines progress, unlock status, reward availability, and initial scene. Keeps SSR/RSC deterministic. |
| **ADR**      | [adr/S11-003-initial-scene-server-owned.md](./adr/S11-003-initial-scene-server-owned.md)                                                                                                                                       |

### FD-S11-06 — Scene Contract ✅ APPROVED

|              |                                                                                                                                                                                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Every scene (Quiz, Match, Envelope, Letter, Gallery, Photobooth, future scenes) MUST implement the same architecture contract from the Scene Engine perspective: equivalent of **onEnter**, **onExit**, **canLeave**, **onComplete**. Exact API naming flexible. New scene types MUST NOT require Scene Engine modification. |
| **ADR**      | [adr/S11-006-scene-contract.md](./adr/S11-006-scene-contract.md) — dedicated ADR per architectural review (consolidates lifecycle, hooks, type contracts)                                                                                                                                                                    |

**CF-R2 at Photobooth scene:** [adr/S11-007-cf-r2-photobooth-scene.md](./adr/S11-007-cf-r2-photobooth-scene.md)

### FD-S11-DOC — Incremental Documentation Strategy ✅ APPROVED

|              |                                                                                                                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Sprint 11 Experience Architecture is documented **incrementally, one mode at a time** — not as one monolithic document. Order: Moments → Connection → Memories → Treasures → Cross-mode Review → Final SSOT merge. Each mode locked independently before continuing. |
| **Why**      | Easier founder review, easier audit, less document complexity.                                                                                                                                                                                                       |
| **Index**    | [sprint-11/README.md](./sprint-11/README.md)                                                                                                                                                                                                                         |

### FD-S11-07 — Moments Scene Flow ✅ APPROVED

|              |                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Official Moments presentation scene graph: Scenes 0–10 (QR Access outside engine; Celebrate Loading → Gift Box → Gift Opening → Letter Confirmation → Letter Transition → Letter → Album Unlock Transition → Gallery → Gallery Ending → Photobooth). Gift Opening: letter **physically appears** from gift box; sender revealed before full letter read. Gallery skipped when zero photos. |
| **Spec**     | [sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md](./sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md)                                                                                                                                                                                                                                                                                                 |
| **Note**     | Doc 13 business journey (Letter → Gallery → Photobooth) preserved; intro/transition scenes are presentation layer only.                                                                                                                                                                                                                                                                    |

### FD-S11-08 — Connection Scene Flow ✅ APPROVED

|              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Official Connection presentation scene graph: Scenes 0–14 (Celebrate Loading → Gift Introduction → Locked Gift → Challenge Invitation → Quiz Transition → Quiz Introduction → parameterized Quiz questions → Score Calculation → Score Reveal → Celebration Transition → Letter Reveal → Gallery Unlock → Gallery → Gallery Ending → Photobooth). Locked Gift reveals nothing (CF-4). One question per screen; no back navigation; batch submit after last answer. Use **"gift"** not **"letter"** until Letter Reveal. Score tone warm/celebratory (CF-1). |
| **Spec**     | [sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md](./sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md)                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| **Note**     | Doc 13 business journey (Quiz → Submit → Score + Band → Letter → Gallery → Photobooth) preserved; ceremony scenes are presentation layer only. Unlock restore → Scene 8 via sessionStorage (CF-2).                                                                                                                                                                                                                                                                                                                                                          |

### FD-S11-09 — Memories Presentation Reversal ✅ APPROVED

|              |                                                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Reverse match game presentation: **Photo first → choose Story** (Phase A was Story → choose Photo). Submit payload `{ storySortOrder, selectedPhotoSortOrder }` unchanged. |
| **Spec**     | [sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)                                                                               |

### FD-S11-10 — One Memory per Scene ✅ APPROVED

|              |                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------- |
| **Decision** | Each memory pair is one Scene (`gate-dynamic`). Scene-based progression — not all memories on one page. |
| **Spec**     | [sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)            |

### FD-S11-11 — 20-Second Countdown per Memory ✅ APPROVED

|              |                                                                                                      |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **Decision** | Each memory scene has a 20-second countdown. Presentation-layer emotional pressure — not punishment. |
| **Spec**     | [sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)         |

### FD-S11-12 — Progressive Photo Reveal ✅ APPROVED

|              |                                                                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Photo starts ~10% visible; every 5 seconds increases clarity (~15% → 20% → 25% → 30%). Photo **never** fully visible during gameplay. Presentation only — extends FD-M2 principle. |
| **Spec**     | [sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)                                                                                       |

### FD-S11-13 — Timer Expiration Auto-Advance ✅ APPROVED

|              |                                                                                                                                                                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Timer reaching zero auto-advances to next memory. No restart, no reset, no backend changes. Implicit story selection when no tap (Sprint 12 default: first story option) preserves batch submit contract. |
| **Spec**     | [sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)                                                                                                              |

### FD-S11-14 — Treasures Scene Flow ✅ APPROVED

|              |                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Official Treasures presentation scene graph: Scenes 0–13 (Celebrate Loading → Welcome → Locked Gift → Gift Locked → Transition → Gift Explosion → Gift Grid ⇄ Individual Gift → Final Gift Unlock → Final Letter → Gallery Transition → Gallery → Gallery Ending → Photobooth). Pre-grid ceremony (Scenes 0–5) mirrors Moments/Connection locked-gift pattern. Gallery skipped when zero photos. |
| **Spec**     | [sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)                                                                                                                                                                                                                                                                                                   |
| **Note**     | Doc 13 business journey (Grid → Open any → All opened → Letter → Gallery → Photobooth) preserved; ceremony and explosion scenes are presentation layer only.                                                                                                                                                                                                                                     |

### FD-S11-15 — Gift Presentation Icon ✅ APPROVED

|              |                                                                                                                                                                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | **Gift** replaces **envelope icon** during Treasures gameplay. Envelope icon MUST NOT appear during gameplay. Letter **object** appears only after opening a gift (Scene 7 micro-reveal). Three visual states: Closed / Opened / Final Gold. Business layer remains `experience_envelopes` + `openEnvelopeAction`. |
| **Spec**     | [sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)                                                                                                                                                                                                                     |

### FD-S11-16 — Gift Explosion Transition ✅ APPROVED

|              |                                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Scene 5 replaces balloon transition. One mysterious gift becomes **N** discoverable gifts (parameterized **2–6**, not hard-coded 6). Max duration **3 seconds**. Presentation only — no gameplay. |
| **Spec**     | [sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)                                                                                                    |

### FD-S11-17 — Final Gold Gift Rules ✅ APPROVED

|              |                                                                                                                                                                                                                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Final Gold gift (`isFinal`) is **presentation-locked** on grid until all non-final gifts opened. Elegant premium reveal on open — no fireworks or confetti. Scene 7 letter object is envelope micro-content (FD-T5); primary reward letter remains Scene 9. FD-T1 API order preserved. |
| **Spec**     | [sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)                                                                                                                                                                                         |

---

## Global Experience Rules (GER)

> **Status:** **LOCKED** — 2026-07-16 · Cross-mode presentation standards · **Revised 2026-07-16** (gameplay timers → Memories only)  
> **ADR:** [adr/S11-008-global-experience-rules.md](./adr/S11-008-global-experience-rules.md)  
> **Applies to:** All modes for GER-01/GER-06; GER-02/03/05 per mode (V1: Memories Match only)

### GER-01 — Transition Duration ✅ APPROVED

|              |                                                                                                                                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | All **`transition`** scenes use consistent logical duration: approximately **1.0–1.5 seconds** (Preparing…, Calculating…, Opening…, etc.). Presentation only — not gameplay. Mode-specific overrides allowed for cinematic bridges (e.g., binder 2–3 s). |
| **ADR**      | [S11-008](./adr/S11-008-global-experience-rules.md)                                                                                                                                                                                                      |

### GER-02 — Gameplay Countdown ✅ APPROVED (Revised 2026-07-16)

|              |                                                                                                                                                                                                                                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Gameplay countdown is **NOT a global rule**. It applies only to modes intentionally designed as time-based challenges. **V1: Memories Match only** (20 seconds per memory, FD-S11-11). **Connection Quiz: no countdown.** Moments and Treasures: no gameplay timer. Future modes require explicit Founder Decision to enable timers. |
| **Why**      | Connection is reflective — longer questions need unhurried reading. Memories is a lightweight mini-game where countdown enhances pacing without harming the emotional arc.                                                                                                                                                           |
| **ADR**      | [S11-008](./adr/S11-008-global-experience-rules.md)                                                                                                                                                                                                                                                                                  |

### GER-03 — Timer Expiration Behavior ✅ APPROVED (Revised 2026-07-16)

|              |                                                                                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | **Memories Match only.** On gameplay timer expiry: show short message (e.g., _Time's up._) for ~**0.8–1 second**, then auto-continue. No restart, popup, blocking dialog, or progress reset. Connection: N/A (no timer). |
| **ADR**      | [S11-008](./adr/S11-008-global-experience-rules.md)                                                                                                                                                                      |

### GER-04 — Backend Preservation ✅ APPROVED

|              |                                                                                                                                          |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Timer expiration MUST NOT change Phase A business logic: no schema, payload, submit action, scoring, unlock, or sessionStorage redesign. |
| **ADR**      | [S11-008](./adr/S11-008-global-experience-rules.md)                                                                                      |

### GER-05 — Auto Selection Strategy ✅ APPROVED (Revised 2026-07-16)

|              |                                                                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | **Memories Match only.** If timer expires before story selection: client auto-selects **first story option by `sortOrder`**. No randomization. Invisible to business logic — included in existing batch submit payload. Grades incorrect if wrong. Connection: N/A (no timer). |
| **ADR**      | [S11-008](./adr/S11-008-global-experience-rules.md)                                                                                                                                                                                                                            |

### GER-06 — UX Philosophy ✅ APPROVED

|              |                                                                                                                                                                                                          |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Gameplay timers create **pacing**, not punishment. No fail screen, restart, lost progress, or penalty animation. Celebrate is an emotional experience, not a competitive game. Aligns with CF-1 / FD-M5. |
| **ADR**      | [S11-008](./adr/S11-008-global-experience-rules.md)                                                                                                                                                      |

### Treasures Envelope Limit

|              |                                                              |
| ------------ | ------------------------------------------------------------ |
| **Decision** | Treasures mode: **maximum 6 envelopes** per experience.      |
| **Why**      | Aligns with 6-photo cap; prevents fatigue; bounded admin UX. |
| **Enforced** | Application validation at implementation.                    |

### Experience Templates (Studio)

|              |                                                                                                                                                                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Studio must offer **templates** so admin does not author every experience from scratch. Example: **New Connection** → choose Anniversary, Graduation, Birthday, or Proposal template → pre-filled questions and copy to edit.                         |
| **Why**      | Scales admin workflow as order volume grows. Reduces time-per-order and errors.                                                                                                                                                                       |
| **Enforced** | Connection templates **Already Implemented** (Sprint 08). Memories/Treasures templates are **Future Idea** — explicitly **out of Sprint 09 scope** per founder kickoff. Templates live in application config or seed data, not customer-editable CMS. |

---

## Sprint 09 Kickoff Decisions (Locked)

> Full product detail: [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md) · Database: [03_DATABASE.md](./03_DATABASE.md)

### A-1 — Match Pair Limits (Memories)

|              |                                                                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | **Minimum 2**, **maximum 6** match pairs per experience. Each `photo_sort_order` (1–6) may be used **at most once** per experience. |
| **Why**      | Aligns with Gift V2 immutable 1–6 photo slot architecture.                                                                          |
| **Enforced** | Application validation + DB constraints at publish; migration for `experience_match_pairs`. **Formalized as FD-M4** (Phase 5.5).    |

### A-2 — Match Interaction Model (Memories)

|              |                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | **Batch submit** only. Recipient completes all pair selections → Submit → server validates all answers → returns final result. **No** incremental per-pair validation. |
| **Why**      | Consistent with Connection quiz (OD-5 stateless grading); simpler API; server-side validation; easier maintenance and security.                                        |
| **Enforced** | `features/match/services/` — single submit action; no per-pair server round-trips.                                                                                     |

### A-3 — Buyer Preview (Memories & Treasures)

|              |                                                                                                                                                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Buyer preview **shows** all stories, all uploaded photos, and overall game structure. Buyer preview **must NOT reveal** correct story–photo mappings, hidden answers, or any information that allows solving the game. |
| **Why**      | Buyer understands the experience without spoiling the recipient experience.                                                                                                                                            |
| **Enforced** | Preview-safe DTOs in `features/match/services/` and `features/treasures/services/` (Sprint 09A/09B).                                                                                                                   |

### A-4 — Treasures API Design

|              |                                                                                                                                                                                    |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | **Per-envelope fetch.** Server returns content of the **next unlocked envelope only** after validation. **Do not** preload all envelopes or hidden content in the initial payload. |
| **Why**      | Security and surprise experience take priority.                                                                                                                                    |
| **Enforced** | Recipient envelope open action + server-side unlock order validation (Sprint 09B).                                                                                                 |

### A-5 — Templates Out of Sprint 09

|              |                                                                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Memories/Treasures **starter templates are out of Sprint 09 scope.** Sprint 09 focuses on core gameplay, Studio, publish, buyer preview, recipient experience, security, and architecture quality only. |
| **Why**      | Ship core V2 experience first; templates after four-mode baseline is complete.                                                                                                                          |
| **Enforced** | No `features/match/config/templates/` or `features/treasures/config/templates/` in Sprint 09 unless founder reopens scope.                                                                              |

### D-1 — Migration Naming

|              |                                                                                                                                                                                                                                                       |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Use **timestamp-based migration filenames** only (e.g. `20260713160000_experience_match_pairs.sql`). **Do not** use logical ordinals such as "018" or "019" during implementation or in new documentation. Reference the **actual filename** in docs. |
| **Why**      | Hotfix migration consumed ambiguous ordinal numbering; filename is source of truth.                                                                                                                                                                   |
| **Enforced** | `supabase/migrations/` + [03_DATABASE.md](./03_DATABASE.md) migration history table.                                                                                                                                                                  |

### Match Retry (Memories) — SUPERSEDED

> **Status:** **SUPERSEDED** by **FD-M3** (Sprint 09A Phase 5.5 — 2026-07-13). Retained for audit trail only.

|              |                                                                                                                                                                      |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Recipients may **retry the Match game unlimited times.** This is an emotional experience, not a competitive game.                                                    |
| **Why**      | Reduce frustration; no anti-retake semantics required for Memories (contrast with optional MED-05 hardening for Connection quiz brute-force).                        |
| **Enforced** | ~~Client may re-submit batch; server re-grades each attempt. No server-side attempt cap for Memories in V2.~~ **Withdrawn** — replaced by FD-M3 (single submission). |

**Superseded by:** [FD-M3 — Single Submission](#fd-m3--single-submission-sprint-09a-phase-55)

---

## Sprint 09A Phase 5.5 — Memories Founder Decisions (Locked)

> **Status:** **LOCKED** — 2026-07-13 · **SSOT journey:** [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) · **Extends:** CF-1 (Connection) → FD-M5 (Memories)

### FD-M1 — Single Reveal Style

|              |                                                                                                                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Memories uses **exactly one** reveal mechanic for every experience. **No** difficulty selector, reveal style selector, Studio configuration, random reveal modes, or future strategy pattern. |
| **Why**      | Emotional consistency; cleaner Studio; simpler UX; premium feel without cognitive load.                                                                                                       |
| **Enforced** | Recipient UI Phase 6B — single `MatchCinematicReveal` presentation component; no admin config fields.                                                                                         |

### FD-M2 — Cinematic Reveal Window

|              |                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Decision** | Recipient **never** sees the full photo during the match game. Every photo is shown through a **cinematic reveal window**: ~20–30% visible, centered window, soft feathered edges, premium cinematic feel. Creates curiosity and nostalgia — **not** a difficulty mechanic. **Presentation layer only** — no database fields, no Studio configuration, no per-photo customization. Buyer preview continues showing **full photos** (no masking). |
| **Why**      | Emotional teaser — _"looking through a tiny window into an old memory"_ — rather than a visual puzzle or Saweria-style random blocks.                                                                                                                                                                                                                                                                                                            |
| **Enforced** | `MatchCinematicReveal` in recipient UI (Phase 6B); CSS mask client-side only.                                                                                                                                                                                                                                                                                                                                                                    |

### FD-M3 — Single Submission

|                |                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | **One submission only** after a successful submit in the same browser session. **No** retry button, try again, re-grade, or second attempt. Wrong answers remain wrong; score is part of the memory. Unlock persistence mirrors **CF-2**: `sessionStorage` only — key `cf_memories_unlock_${experienceId}`; same-tab refresh preserves unlock; new tab / cleared sessionStorage starts fresh (accepted). **No server persistence. No migration.** |
| **Why**        | Memories is an emotional interaction, not an examination. Single commitment moment before reward.                                                                                                                                                                                                                                                                                                                                                 |
| **Enforced**   | `memories-unlock-session.ts` (Phase 6C); `MemoriesExperienceFlow` (Phase 6B). **Supersedes** [Match Retry (Memories)](#match-retry-memories--superseded).                                                                                                                                                                                                                                                                                         |
| **Supersedes** | Match Retry — unlimited retries (Sprint 09 kickoff)                                                                                                                                                                                                                                                                                                                                                                                               |

### FD-M4 — Maximum Photos (Memories Pairs)

|              |                                                                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Memories match pairs: **minimum 2**, **maximum 6**. No difficulty scaling. No additional configuration. Aligns with global 6-photo cap — not a separate Memories-only limit. |
| **Why**      | Consistent with Gift V2 photo slot architecture (A-1). Example discussions using 4 photos were illustrative only.                                                            |
| **Enforced** | `MATCH_MIN_PAIRS` / `MATCH_MAX_PAIRS` in `schemas/studio-match.ts`; `validateMatchConfigPublish()`; publish validation (Phase 5 ✅).                                         |

### FD-M5 — Reward Never Blocked (Memories)

|                |                                                                                                                                                                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**   | **Extends CF-1 to Memories.** Score is emotional feedback only — **never** blocks unlock message, letter, gallery, or photobooth. After any **valid** batch submit, recipient always receives: Score → Unlock Message → Letter → Gallery → Photobooth. Correctness affects score presentation only. |
| **Why**        | Same emotional philosophy as Connection — participation earns the gift, not perfect recall.                                                                                                                                                                                                         |
| **Enforced**   | `gradeMatchAnswers()` + `buildMemoriesRewardPayload()` (Phase 6A); `MemoriesExperienceFlow` (Phase 6B). **Supersedes** prior design where `finalUnlockMessage` required `allCorrect`.                                                                                                               |
| **Supersedes** | Reward only after all pairs correct (pre–Phase 5.5 grading design)                                                                                                                                                                                                                                  |

### Treasure Navigation (Treasures) — PARTIALLY SUPERSEDED

> **CF-R1 update:** Lifetime replay requirement may change how "revisit" works across future visits. See [14_REPLAYABLE_EXPERIENCE.md](./14_REPLAYABLE_EXPERIENCE.md). **Within an active visit**, revisit behavior below remains valid.

|              |                                                                                                                                                                                                                                       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision** | Recipients may open envelopes in **any order** (FD-T1). Recipients may **revisit** previously opened envelopes during the same visit. Reward unlocks when **all** envelopes are opened — `is_final` is creator metadata only (FD-T4). |
| **Why**      | Surprise and freedom — no forced sequence. Ceremony without rigid progression.                                                                                                                                                        |
| **Enforced** | Sprint 09B — `openEnvelope` service; no sequential validation. **Supersedes** prior "skip ahead blocked" language in older docs.                                                                                                      |

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
- [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) — Experience Journey SSOT (CF-1–CF-5, FD-M1–FD-M5)
- [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](./16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) — Sprint 11 Scene Engine core (FD-S11-01–06)
- [sprint-11/README.md](./sprint-11/README.md) — Sprint 11 incremental mode docs + GER
- [adr/S11-008-global-experience-rules.md](./adr/S11-008-global-experience-rules.md) — Global Experience Rules (GER-01–06)
- [07_AI_GUIDE.md](./07_AI_GUIDE.md) — how AI assistants must respect these decisions
