# 09 — Architecture Impact

> **Sprint:** 05.5 — Product Revision V2 (documentation only)  
> **Related:** [Product Revision V2](./07_PRODUCT_REVISION_V2.md) · [Experience Modes](./08_EXPERIENCE_MODES.md) · [Database Revision Plan](./10_DATABASE_REVISION_PLAN.md) · [Architecture](./02_ARCHITECTURE.md)

---

## Document Legend

| Label                   | Meaning                             |
| ----------------------- | ----------------------------------- |
| **Already Implemented** | Built in Sprints 00–05              |
| **Planned**             | Required by Product Revision V2     |
| **Future Idea**         | Not required for initial V2 rollout |

**Impact levels:**

| Level            | Definition                                     |
| ---------------- | ---------------------------------------------- |
| **NO CHANGE**    | Existing design remains sufficient             |
| **MINOR CHANGE** | Extend existing modules; no structural rewrite |
| **MAJOR CHANGE** | New modules, schema, or flows required         |

---

## Summary Matrix

| Area                          | Impact                    | Priority sprint                                                             |
| ----------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| Database schema               | **MAJOR CHANGE**          | Sprint 06–07                                                                |
| Recipient experience UI       | **MAJOR CHANGE**          | Sprint 07–09                                                                |
| Studio dashboard              | **MAJOR CHANGE**          | Sprint 06–08                                                                |
| Admin workflow                | **MAJOR CHANGE**          | Sprint 06–08                                                                |
| Repositories                  | **MINOR CHANGE**          | Sprint 06+                                                                  |
| Server Actions / API          | **MINOR CHANGE**          | Sprint 06+                                                                  |
| Storage                       | **MINOR CHANGE**          | Sprint 06–07                                                                |
| Validation (Zod)              | **MINOR CHANGE**          | Sprint 06+                                                                  |
| Analytics                     | **MINOR CHANGE**          | Sprint 07 — coarse events only (opened, completed, mode)                    |
| Audit logs                    | **MINOR CHANGE**          | Sprint 06+                                                                  |
| Security / RLS                | **MINOR CHANGE**          | Sprint 06–07                                                                |
| Memory Code grace period      | **MAJOR CHANGE**          | Sprint 07                                                                   |
| Studio templates              | **MINOR CHANGE**          | Sprint 08 (Connection), 09A/09B (Memories/Treasures)                        |
| Landing page / marketing copy | **MINOR CHANGE**          | Phase C — Sprint 18 Production Readiness (landing readiness, SEO, metadata) |
| Proxy / auth                  | **NO CHANGE**             | —                                                                           |
| Photobooth architecture       | **NO CHANGE**             | —                                                                           |
| Preview vs experience tokens  | **NO CHANGE**             | —                                                                           |
| Supabase clients              | **NO CHANGE**             | —                                                                           |
| Deployment / Vercel           | **NO CHANGE**             | —                                                                           |
| Future scalability            | **MAJOR CHANGE** (design) | Ongoing                                                                     |

---

## Database

| Aspect                               | Impact           | Explanation                                                                                                                                              |
| ------------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `experiences` table                  | **MAJOR CHANGE** | **Planned:** `experience_mode` (or equivalent) to distinguish four products. V1 schema has no mode column.                                               |
| Child tables (quiz, match, envelope) | **MAJOR CHANGE** | **Planned:** Mode-specific normalized tables per [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md).                                         |
| `experience_photos`                  | **NO CHANGE**    | 6-photo limit applies to all modes. Memories mode references existing photos.                                                                            |
| `experience_analytics`               | **MINOR CHANGE** | **Planned:** Coarse business events only — opened, completed, mode. No per-question/photo/envelope events.                                               |
| `orders` table                       | **MINOR CHANGE** | **Planned:** `experience_mode` at order creation for reporting. `experiences.experience_mode` is source of truth after experience exists — no sync back. |
| RLS policies                         | **MINOR CHANGE** | New tables get same `authenticated` admin / `anon` zero-access pattern.                                                                                  |
| Migrations 001–015                   | **NO CHANGE**    | **Already Implemented.** Never edit applied migrations.                                                                                                  |

---

## Studio Dashboard (`/studio/*`)

| Aspect                   | Impact                       | Explanation                                                                                             |
| ------------------------ | ---------------------------- | ------------------------------------------------------------------------------------------------------- |
| Information architecture | **MAJOR CHANGE**             | **Final:** Order-centric — sidebar Dashboard + Orders only. Spec: [12_STUDIO_UX.md](./12_STUDIO_UX.md). |
| Order list / CRUD        | **MAJOR CHANGE**             | Single create form; atomic order + experience creation.                                                 |
| Unified Order Editor     | **MAJOR CHANGE**             | `/studio/orders/[id]` — core sections + dynamic mode panel (not separate routes per mode).              |
| Premium mode panels      | **MINOR CHANGE**             | Sprint 06–07: stubs ("Coming in Sprint X"); live editors Sprint 08–09B.                                 |
| Publish workflow         | **MINOR CHANGE**             | Single publish action (lock + QR); buyer approval default; Skip Preview override (Sprint 07).           |
| Dashboard                | **MAJOR CHANGE**             | Action queue — not analytics (Sprint 06). Charts Sprint 10.                                             |
| Studio home placeholder  | **Already Implemented**      | Sprint 05 shell — replaced by action-queue Dashboard (Planned).                                         |
| Navigation               | **NO CHANGE** to route count | Only Dashboard + Orders — no Experiences/Themes/Templates nav.                                          |

---

## Admin Workflow

| Step                  | Impact           | Explanation                                                                  |
| --------------------- | ---------------- | ---------------------------------------------------------------------------- |
| WhatsApp order intake | **NO CHANGE**    | Still offline; admin creates order manually in Studio.                       |
| Create order          | **MAJOR CHANGE** | **Final:** One form — mode + parties + theme. Experience created atomically. |
| Design experience     | **MAJOR CHANGE** | Unified Order Editor on order detail — not separate experience routes.       |
| Experience templates  | **MINOR CHANGE** | Inline in mode panel Sprint 08+ — not a Templates nav page.                  |
| Letter + photos       | **MINOR CHANGE** | Same content; Memories/Treasures add structured metadata when editors ship.  |
| Preview send          | **MINOR CHANGE** | Default before publish; Skip Preview override for special cases.             |
| Publish               | **MINOR CHANGE** | **Final:** One action — lock + QR + ready for recipient.                     |

---

## Repositories

| Aspect                  | Impact           | Explanation                                                                               |
| ----------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| `ThemesRepository`      | **NO CHANGE**    | **Already Implemented.** Read-only themes.                                                |
| `OrdersRepository`      | **MAJOR CHANGE** | **Planned:** CRUD not yet built; must include mode field.                                 |
| `ExperiencesRepository` | **MAJOR CHANGE** | **Planned:** Mode-aware reads/writes.                                                     |
| Mode-specific repos     | **MAJOR CHANGE** | **Planned:** `QuizRepository`, `MatchPairsRepository`, `EnvelopesRepository` (names TBD). |
| `Repository` base class | **NO CHANGE**    | **Already Implemented** pattern still applies.                                            |

---

## Server Actions / API

| Aspect                                  | Impact           | Explanation                                                                                    |
| --------------------------------------- | ---------------- | ---------------------------------------------------------------------------------------------- |
| `withAdminAction` / `withActionHandler` | **NO CHANGE**    | **Already Implemented.**                                                                       |
| Studio order actions                    | **MAJOR CHANGE** | **Planned:** Create/update order with mode.                                                    |
| Studio mode config actions              | **MAJOR CHANGE** | **Planned:** Save quiz questions, match pairs, envelopes.                                      |
| Recipient game actions                  | **MAJOR CHANGE** | **Planned:** Submit quiz answers, match attempts, open envelope — all post-Access-Code.        |
| Memory Code + grace period              | **MAJOR CHANGE** | **Planned Sprint 07:** 24h grace from first access; trusted devices; product term Memory Code. |
| Access Code verification (legacy term)  | —                | Superseded by Memory Code grace-period flow                                                    |
| Route Handlers                          | **MINOR CHANGE** | **Planned:** Possible signed URL endpoint; pattern unchanged.                                  |

---

## Storage

| Aspect                     | Impact           | Explanation                                                    |
| -------------------------- | ---------------- | -------------------------------------------------------------- |
| `experience-photos` bucket | **NO CHANGE**    | All modes use same bucket.                                     |
| `experience-qr` bucket     | **NO CHANGE**    | QR at publish unchanged.                                       |
| Treasures hidden photos    | **MINOR CHANGE** | Same bucket; access gated by envelope open state in app layer. |
| Photobooth                 | **NO CHANGE**    | **Founder Decision:** never stored.                            |
| New buckets                | **NO CHANGE**    | None required for V2.                                          |

---

## Validation (Zod)

| Aspect                     | Impact           | Explanation                                                    |
| -------------------------- | ---------------- | -------------------------------------------------------------- |
| `schemas/common.ts` enums  | **MINOR CHANGE** | **Planned:** `experienceModeSchema` with four values.          |
| Order / experience schemas | **MINOR CHANGE** | **Planned:** Extend with mode field.                           |
| Mode-specific schemas      | **MAJOR CHANGE** | **Planned:** Quiz question, match pair, envelope item schemas. |
| `studio-auth` schema       | **NO CHANGE**    | **Already Implemented.**                                       |

---

## Analytics

| Aspect                       | Impact           | Explanation                                                  |
| ---------------------------- | ---------------- | ------------------------------------------------------------ |
| `experience_analytics` table | **MINOR CHANGE** | Coarse events: opened, completed, mode — no micro-funnel     |
| Event recording service      | **MINOR CHANGE** | **Planned:** `features/analytics/` — simple business metrics |
| Studio reporting             | **Future Idea**  | Dashboard charts — post-V2                                   |
| Metadata JSON column         | **Future Idea**  | Only if needed for completion signal                         |

---

## Audit Logs

| Aspect               | Impact           | Explanation                                                                   |
| -------------------- | ---------------- | ----------------------------------------------------------------------------- |
| `audit_logs` table   | **NO CHANGE**    | **Already Implemented** immutable audit.                                      |
| New action verbs     | **MINOR CHANGE** | **Planned:** `experience.mode_set`, `quiz.saved`, `experience.published` etc. |
| Immutability trigger | **NO CHANGE**    | **Already Implemented.**                                                      |

---

## Security

| Aspect                                       | Impact           | Explanation                                                                      |
| -------------------------------------------- | ---------------- | -------------------------------------------------------------------------------- |
| Memory Code + grace period + trusted session | **MAJOR CHANGE** | **Planned Sprint 07** — see [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) |
| `anon` zero Gift domain                      | **NO CHANGE**    | New tables follow same rule.                                                     |
| `service_role` recipient reads               | **NO CHANGE**    | Game state validated server-side before revealing content.                       |
| CSP / headers                                | **NO CHANGE**    | **Already Implemented** Sprint 02B.                                              |
| Rate limiting                                | **MINOR CHANGE** | **Planned:** Quiz/match submission endpoints need throttling.                    |
| Preview link isolation                       | **NO CHANGE**    | Premium content must not leak via preview token.                                 |
| Anti-cheat (games)                           | **PLANNED**      | Server grades quiz; server validates match; envelope order server-enforced.      |

---

## Database Design (Founder Decision — Final)

| Aspect          | Impact         | Explanation                                                                                   |
| --------------- | -------------- | --------------------------------------------------------------------------------------------- |
| Storage pattern | **HYBRID**     | Normalized tables primary; JSONB only for auxiliary non-query data (e.g. quiz `options` JSON) |
| Analytics depth | **SIMPLIFIED** | Business-level only — no per-question/photo/envelope tracking                                 |

---

## Pricing & Landing Page

| Aspect                 | Impact           | Explanation                                 |
| ---------------------- | ---------------- | ------------------------------------------- |
| Static bouquet catalog | **MINOR CHANGE** | Marketing-owned copy; mode labels as needed |
| WhatsApp CTA           | **NO CHANGE**    | Still deep link                             |
| Pricing engine         | **NO CHANGE**    | Owned by marketing/R&D — not engineering    |
| CMS / database pricing | **Future Idea**  | Not V2                                      |

---

## Route Structure

| Route                    | Impact           | Explanation                                    |
| ------------------------ | ---------------- | ---------------------------------------------- |
| `(public)/`              | **MINOR CHANGE** | Marketing copy reflects four modes.            |
| `(studio)/`              | **MAJOR CHANGE** | Order + mode editor UI.                        |
| `(experience)/e/[token]` | **MAJOR CHANGE** | Mode router renders correct interactive layer. |
| `proxy.ts` matcher       | **NO CHANGE**    | `/studio/*` and `/e/*` unchanged.              |

---

## Feature Modules

| Module                                 | Impact           | Explanation                                               |
| -------------------------------------- | ---------------- | --------------------------------------------------------- |
| `features/landing/`                    | **MINOR CHANGE** | Copy and catalog tiers.                                   |
| `features/studio/`                     | **MAJOR CHANGE** | Order management + mode editors + templates               |
| `features/experience/`                 | **MAJOR CHANGE** | Core recipient shell + mode routing.                      |
| `features/access/`                     | **MINOR CHANGE** | Session payload includes mode.                            |
| `features/preview/`                    | **MINOR CHANGE** | Preview renders selected mode (buyer view).               |
| `features/photobooth/`                 | **NO CHANGE**    | Shared component all modes.                               |
| `features/analytics/`                  | **MINOR CHANGE** | New events.                                               |
| **Planned new:** `features/quiz/`      | **MAJOR CHANGE** | Connection mode — independent feature with Studio editor. |
| **Planned new:** `features/match/`     | **MAJOR CHANGE** | Memories mode — independent feature with Studio editor.   |
| **Planned new:** `features/treasures/` | **MAJOR CHANGE** | Treasures mode — independent feature with Studio editor.  |

**Founder decision (Sprint 05.5):** Hybrid structure — `features/experience/` is shell/orchestrator; mode features are top-level (`quiz/`, `match/`, `treasures/`). Domain repositories live in `features/<domain>/repositories/`; `lib/repositories/` is infrastructure only. See [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) and [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md).

---

## Future Scalability

| Concern              | Impact                    | Explanation                                                                           |
| -------------------- | ------------------------- | ------------------------------------------------------------------------------------- |
| Fifth mode           | **MAJOR CHANGE** (design) | Schema must allow new enum value + optional new child table without rewrite.          |
| Mode plugins         | **Future Idea**           | Explicitly rejected for V2 — no plugin system per founder decisions.                  |
| Multi-language       | **Future Idea**           | Not in scope.                                                                         |
| Performance at scale | **MINOR CHANGE**          | Moments mode remains default for high-volume events; premium modes heavier by design. |
| CDN / edge caching   | **NO CHANGE**             | Experience pages remain dynamic (Memory Code / grace rules)                           |

---

## What Explicitly Does NOT Change

**Already Implemented** — do not rewrite:

- Next.js 16 App Router monolith on Vercel
- Supabase PostgreSQL + Auth + Storage
- Three route groups: `(public)`, `(studio)`, `(experience)`
- `lib/supabase/client.ts`, `server.ts`, `admin.ts`
- `lib/actions/` handler pattern
- `lib/auth/` session and admin email gate
- `proxy.ts` Studio protection (Sprint 05)
- 1:1 `orders` ↔ `experiences`
- `preview_links` separate from `experience_token`
- 6-photo cap, no photobooth bucket
- Audit log immutability

---

## Related Documents

- [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md)
- [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md)
- [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md)
- [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md)
- [02_ARCHITECTURE.md](./02_ARCHITECTURE.md) — V1 architecture (still valid foundation)
