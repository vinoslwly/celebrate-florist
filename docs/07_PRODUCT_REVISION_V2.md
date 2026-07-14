# 07 — Product Revision V2

> **Sprint:** 05.5 — Product Revision (documentation only, no code)  
> **Status:** ✅ Approved product direction — **must be read before Sprint 06**  
> **Related:** [Experience Modes](./08_EXPERIENCE_MODES.md) · [Architecture Impact](./09_ARCHITECTURE_IMPACT.md) · [Database Revision Plan](./10_DATABASE_REVISION_PLAN.md) · [Implementation Roadmap V2](./11_IMPLEMENTATION_ROADMAP_V2.md)

---

## Document Legend

| Label                   | Meaning                                              |
| ----------------------- | ---------------------------------------------------- |
| **Already Implemented** | Exists in codebase or database today (Sprints 00–05) |
| **Planned**             | Approved direction documented here; not yet built    |
| **Future Idea**         | Possible extension; not committed to any sprint      |

---

## Executive Summary

**Already Implemented:** Celebrate Florist is a single-brand florist product with a landing page, Studio admin authentication, a PostgreSQL schema for orders and experiences, and a planned recipient flow (letter + gallery + photobooth).

**Planned (this revision):** Celebrate evolves from a **Digital Greeting Website** into an **Interactive Digital Experience Platform** with four selectable experience products — while preserving the original greeting flow as the entry-tier **Moments** mode.

**Future Idea:** Marketplace, multi-florist, payment gateway, and customer accounts remain out of scope per [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md).

---

## Why the Product Changed

### Investor Feedback

Investors identified that the original product — QR scan → greeting letter → photo gallery → photobooth — is **not sufficiently differentiated**. A motivated sender can approximate the same outcome with:

- **Canva** (designed letter / visual layout)
- **Google Drive** (photo sharing)
- **WhatsApp** (personal message delivery)

The physical bouquet remains valuable. The **digital layer** must deliver interaction, surprise, and emotional depth that generic tools cannot replicate in under 60 seconds.

### Strategic Response

Celebrate will compete on **curated interactivity**, not static content hosting:

| Old positioning                           | New positioning                                             |
| ----------------------------------------- | ----------------------------------------------------------- |
| Digital greeting card attached to flowers | Interactive digital experience platform attached to flowers |
| One experience shape for all bouquets     | Four experience modes with clear tiering                    |
| Content delivery                          | Content + participation + reveal mechanics                  |

The greeting letter, photo gallery, and photobooth **remain**. They become the foundation of **Moments Experience** (entry tier), not the entire product.

### Interactive Reward Philosophy (Sprint 08R — Locked)

Premium modes deliver emotional content **through interaction**, not immediately on open:

> **Game First → Reward → Letter → Gallery → Photobooth**

Recipients **earn** the letter and gallery by participating (quiz, match game, or envelope sequence). This is Celebrate's differentiation from static greeting tools.

| Mode           | Interactive gate              | Reward timing                                                       |
| -------------- | ----------------------------- | ------------------------------------------------------------------- |
| **Moments**    | None                          | Letter immediate on OPEN                                            |
| **Connection** | Quiz submit                   | Letter + gallery after any successful submit (CF-1)                 |
| **Memories**   | Match game (cinematic reveal) | Unlock message → letter → gallery — **always after submit** (FD-M5) |
| **Treasures**  | Envelope sequence             | Letter after final envelope                                         |

Full journey diagrams: [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) (SSOT). Founder decisions CF-1–CF-5: [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md).

### Replayable Experience (CF-R1 + CF-R2 — Locked)

| Principle | Rule                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------- |
| **CF-R1** | Digital Experience Gift — replayable lifetime; journey progress preserved until Photobooth trigger |
| **CF-R2** | CF-R2-A/B/C — Photobooth trigger, no visit inference, reload after trigger replays ✉️              |

SSOT: [14_REPLAYABLE_EXPERIENCE.md](./14_REPLAYABLE_EXPERIENCE.md) · Sprint 10: [15](./15_SPRINT_10_CF-R2_REPLAY_RESET.md). **CF-R2 shipped for Treasures.**

---

## New Positioning

### One-Line Value Proposition

> **Celebrate turns a bouquet into a private, interactive memory — not just a webpage.**

### Brand Promise (unchanged)

- Warm, personal, single-florist identity (Surakarta)
- Privacy by default (Memory Code after grace period, no public browsing)
- Offline WhatsApp commerce (no payment gateway)

### Brand Promise (added)

- **Choice:** Senders pick an experience mode that matches budget and relationship depth
- **Participation:** Recipients _do something_ — answer, match, open — not only read
- **Premium ladder:** Higher bouquet tiers unlock richer interactive mechanics

---

## Old vs New Comparison

| Dimension         | V1 Vision (pre-revision)          | V2 Vision (this document)                                                        |
| ----------------- | --------------------------------- | -------------------------------------------------------------------------------- |
| Product category  | Digital greeting website          | Interactive digital experience platform                                          |
| Experience shapes | 1 (implicit)                      | 4 explicit modes                                                                 |
| Differentiation   | Themed page + Memory Code         | Themed page + mode-specific games/reveals                                        |
| Pricing           | Per bouquet (marketing/R&D owned) | Experience mode stored for segmentation — **pricing not an engineering concern** |
| Photobooth        | ✅ Core feature                   | ✅ Core feature (all modes)                                                      |
| Greeting letter   | ✅ Core feature                   | ✅ Core feature (all modes)                                                      |
| Photo gallery     | ✅ Core feature                   | ✅ Core feature (all modes)                                                      |
| Mini-games        | ❌ None                           | ✅ Planned (3 premium modes)                                                     |
| Database          | Single `experiences` shape        | **Planned:** mode-aware schema extension                                         |
| Recipient route   | `/e/[token]`                      | `/e/[token]` (unchanged URL pattern)                                             |

**Already Implemented** items in the right column are **not built yet** at the application layer — only the V1 _schema intent_ exists. V2 changes _what_ gets built on top of that foundation.

---

## The Four Experience Products

| Mode           | Tier    | Interactive layer    | Details                                               |
| -------------- | ------- | -------------------- | ----------------------------------------------------- |
| **Moments**    | Entry   | None                 | Letter + gallery + photobooth. Fast, lightweight.     |
| **Connection** | Premium | Personal Couple Quiz | "How well do you know me?" — scored Q&A               |
| **Memories**   | Premium | Match The Memory     | Pair story captions with correct photos               |
| **Treasures**  | Premium | Secret Envelopes     | Sequential reveals; final envelope = biggest surprise |

Full mode specifications: [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md).

---

## Experience Comparison Table

| Capability                         | Moments | Connection | Memories |     Treasures     |
| ---------------------------------- | :-----: | :--------: | :------: | :---------------: |
| Greeting letter                    |   ✅    |     ✅     |    ✅    |        ✅         |
| Photo gallery (max 6)              |   ✅    |     ✅     |    ✅    |        ✅         |
| Photobooth (browser-only)          |   ✅    |     ✅     |    ✅    |        ✅         |
| Memory Code gate (after 24h grace) |   ✅    |     ✅     |    ✅    |        ✅         |
| Themed visual design               |   ✅    |     ✅     |    ✅    |        ✅         |
| Personal couple quiz               |   ❌    |     ✅     |    ❌    |        ❌         |
| Match-the-memory game              |   ❌    |     ❌     |    ✅    |        ❌         |
| Secret envelopes                   |   ❌    |     ❌     |    ❌    |        ✅         |
| Target open time                   |  Fast   |   Medium   |  Medium  | Slow (ceremonial) |
| Low-end phone suitability          |  High   |   Medium   |  Medium  |      Medium       |
| Admin setup complexity             |   Low   |   Medium   |   High   |       High        |
| Premium upsell                     |    —    |     ✅     |    ✅    |        ✅         |

---

## Customer Benefits

### Recipients

- **Emotional participation** — answering, matching, and opening creates agency, not passive scrolling
- **Surprise pacing** — premium modes stage reveals across multiple beats
- **Shareable moment** — photobooth remains available in every tier for instant delight

### Buyers (senders)

- **Clear tier choice** — pick experience depth that matches budget and relationship
- **Differentiation** — gift feels custom-built, not "a link in WhatsApp"
- **Preview workflow unchanged** — buyer still approves before delivery ([05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md))

### Admin (founder)

- **Upsell lever** — premium modes justify higher bouquet pricing without new infrastructure vendors
- **Same Studio surface** — one dashboard; mode selected per order
- **Analytics depth** — experience opened, completed, mode used (simple business metrics only)

---

## Business Benefits

| Benefit                | Mechanism                                                  |
| ---------------------- | ---------------------------------------------------------- |
| Higher ARPU            | Premium modes priced above Moments                         |
| Competitive moat       | Interactive mechanics hard to replicate with Canva + Drive |
| Investor narrative     | "Experience platform" not "greeting card SaaS"             |
| Operational simplicity | Still single admin, single brand, WhatsApp orders          |
| Beachhead preserved    | Moments keeps budget segment and event-volume use cases    |

---

## Pricing & Packaging

**Founder decision:** Pricing, tier packaging, and bouquet SKUs are owned by **founder, marketing, and R&D** — not engineering.

Engineering responsibility: store `experience_mode` on orders/experiences so Studio and coarse analytics can segment by mode. No pricing engine, no dynamic checkout.

---

## Memory Code & First Experience (Founder Decision)

Memory Code must **not** interrupt the recipient's first emotional moment.

| Phase                                            | Behavior                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------- |
| QR scan                                          | Recipient opens experience                                                 |
| **24-hour grace** (from first successful access) | Any device opens without Memory Code; each access registers Trusted Device |
| **After grace**                                  | Trusted Devices → no code; new devices → Memory Code → becomes trusted     |

**Terminology:** Product/UI = **Memory Code**. Engineering = `memory_key_hash`, `access_attempts`, etc.

**Implementation:** **Planned Sprint 07** — not Sprint 05.5 or Sprint 06. See [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) and [04_SECURITY.md](./04_SECURITY.md).

---

## Experience Templates (Founder Decision)

Admin must not author every order from scratch. **Planned:** mode-specific templates in Studio.

Example — **New Connection**:

- Template Anniversary
- Template Graduation
- Template Birthday
- Template Proposal

Pre-fills quiz questions and copy; admin edits before publish. Connection templates **Already Implemented** (Sprint 08). Memories/Treasures templates are **Future Idea** — out of Sprint 09 scope (founder kickoff A-5).

---

## Migration Philosophy

### What Stays Valid

All work through Sprint 05 remains authoritative unless this revision explicitly supersedes it:

- 1:1 order → experience relationship
- Memory Code hashing, grace-period rules, and trusted session model
- 6-photo limit, no photobooth storage
- Preview link ≠ experience link
- RLS strategy (`anon` zero Gift domain access)
- `service_role` recipient reads after gate
- Studio authentication and proxy protection

See [09_ARCHITECTURE_IMPACT.md](./09_ARCHITECTURE_IMPACT.md) for per-area classification.

### What Evolves (Planned)

- Product description in marketing copy and landing page
- Studio order creation — admin selects mode in **single create form**; atomic order + experience ([12_STUDIO_UX.md](./12_STUDIO_UX.md))
- Studio **Unified Order Editor** on `/studio/orders/[id]` — dynamic mode panels
- Buyer approval default; Skip Preview override; publish = lock + QR (one action)
- Studio mode change on draft — auto-delete incompatible child data with confirmation dialog
- Recipient UI — mode-specific interactive sections after shared greeting core
- Database — normalized tables + limited JSONB ([10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md); Database Design Review closed)
- Publish validation matrix — documented in [03_DATABASE.md](./03_DATABASE.md#planned-v2-schema-sprint-06)
- Analytics — coarse business events only (`experience_opened`, mode via JOIN); **no** `experience_completed` (OD-1 locked)
- Implementation sprint sequence — [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md) supersedes the pre-revision Sprint 06 scope

### What Does Not Change (Founder Decisions)

These remain locked unless founder explicitly amends [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md):

- No payment gateway
- No customer accounts
- No multi-tenant
- Photobooth never stored server-side
- Single administrator

---

## Relationship to Prior Documentation

| Document                  | Status after V2                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `01_PROJECT_CONTEXT.md`   | **Partially superseded** — V1 vision described single greeting; V2 adds modes. Do not delete; add cross-reference when updated in a future docs sprint. |
| `02_ARCHITECTURE.md`      | **Valid foundation** — route groups, clients, proxy. Mode-specific UI is Planned overlay.                                                               |
| `03_DATABASE.md`          | **Valid until migration 016+** — V1 schema live; Planned V2 section + publish validation matrix added.                                                  |
| `04_SECURITY.md`          | **Valid** — security model unchanged; grace period uses `first_opened_at + 24h` (no new column).                                                        |
| `05_FOUNDER_DECISIONS.md` | **Valid** — includes Architecture, Database, and Studio Design Review decisions.                                                                        |
| `06_DEVELOPMENT_GUIDE.md` | **Valid** — includes Sprint 08R and 09A verification tables.                                                                                            |
| `12_STUDIO_UX.md`         | **Authoritative** — Studio IA, workflow, unified editor (Sprint 06+).                                                                                   |
| `07_AI_GUIDE.md`          | **Valid** — read with Product Revision package before Sprint 06 (via index).                                                                            |

---

## Approval Record

| Field                      | Value                                                                                       |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| Sprint                     | 05.5 — Product Revision V2 (amended)                                                        |
| Founder amendments         | Memory Code grace period, hybrid DB, templates, quiz/envelope limits, simple analytics      |
| Architecture Review        | ✅ Closed (Sprint 05.5)                                                                     |
| Database Design Review     | ✅ Closed (Sprint 05.5) — publish validation matrix documented                              |
| Studio Design Review       | ✅ Closed (Sprint 05.5) — [12_STUDIO_UX.md](./12_STUDIO_UX.md)                              |
| Sprint 06 Readiness Review | ✅ Closed (Sprint 05.5) — READY WITH MINOR NOTES                                            |
| **Sprint 05.5 status**     | **CLOSED** — official implementation baseline                                               |
| Type                       | Documentation only                                                                          |
| Code changes               | None                                                                                        |
| SQL changes                | None                                                                                        |
| Founder approval           | ✅ Sprint 06 implementation cleared                                                         |
| Next step                  | **Sprint 06 active** — [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md) |

---

## Related Documents

- [08_EXPERIENCE_MODES.md](./08_EXPERIENCE_MODES.md) — per-mode product specification
- [09_ARCHITECTURE_IMPACT.md](./09_ARCHITECTURE_IMPACT.md) — engineering impact matrix
- [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md) — schema recommendations (no SQL)
- [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md) — sprint breakdown
- [12_STUDIO_UX.md](./12_STUDIO_UX.md) — Studio admin UX
- [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) — Experience Journey SSOT (includes FD-M1–FD-M5)
- [00_INDEX.md](./00_INDEX.md) — documentation entry point
