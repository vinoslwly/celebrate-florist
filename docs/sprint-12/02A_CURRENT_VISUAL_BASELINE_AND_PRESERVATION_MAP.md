# Sprint 12 — Phase 2A

# Current Visual Baseline & Preservation Map

> **Status:** ✅ **APPROVED** by Founder — 2026-07-19  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [01_BASELINE_AND_SCOPE_CLARIFICATION.md](./01_BASELINE_AND_SCOPE_CLARIFICATION.md)  
> **Next:** Phase 2B — Visual DNA (**authorized**)

---

## Inspection note

**Live visual verification completed 2026-07-19** via Playwright MCP against `http://localhost:3000` (authenticated Studio session).

| Surface inspected                             | Result vs Phase 2A map                                                                                                                                                                                                                                |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landing `/`**                               | Confirms protected baseline: warm cream `rgb(255,252,248)`, brown text `rgb(74,52,40)`, Fraunces h1 + Poppins body, glass nav (`blur(12px)`), brand gradient CTAs, bouquet illustration in large rounded hero frame, soft-shadow / `pink-ink` present |
| **Studio login**                              | Same warm root tokens; emotionally thin (no soft-shadow / pink-ink / brand gradient)                                                                                                                                                                  |
| **Studio Dashboard**                          | Order-centric shell works; Fraunces headings; pink nav pill + “New order”; **0** soft-shadow / pink-ink / brand gradient / glass — operational admin, not Landing emotion                                                                             |
| **Studio Orders list**                        | Dense table/list UI; same thin Celebrate identity                                                                                                                                                                                                     |
| **Studio Order editor** (Treasures)           | Long form (~28 inputs): Core letter → photos → **“Secret Envelopes”** → Memory Code → checklist. Form-heavy admin + envelope language (DDR-S12-004 Replace Later)                                                                                     |
| **Buyer Preview** (`/preview/...`)            | Warm cream + Fraunces; structure sound; **0** soft-shadow / pink-ink / brand gradient; copy still **“Secret envelopes”** — Refine (Phases 5, 8)                                                                                                       |
| **Recipient Experience** (`/e/...` Treasures) | Theme chip “🌸 BLOOM”; grid of **📬/✉️ Envelope** buttons (Opened / Closed / FINAL) — visually generic vs Landing; **emoji envelope UI confirmed** as Replace Later (DDR-S12-004)                                                                     |

Evidence (local): `phase2a-landing-hero-viewport.png`, `phase2a-studio-login.png`, `phase2a-studio-dashboard.png`, `phase2a-studio-orders.png`, `phase2a-studio-order-editor*.png`, `phase2a-buyer-preview.png`, `phase2a-recipient-experience.png`.  
Later major visual changes still require before–after Founder review.

---

## 1. Current Visual Baseline

| Surface                  | What already works                                                                                                     | What feels weak or generic                          | Classification                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Landing**              | Warm pastel identity, hero, type rhythm, soft shadows, glass navbar, brand CTA, bouquet illustration, generous spacing | Missing final photography (slots intentional)       | **Preserve** (primary baseline); assets = **Production Pending**                  |
| **Studio**               | Functional order editor, shadcn structure, workable workflows                                                          | Generic admin CMS; form-heavy; low Celebrate warmth | **Genuine Design Debt**; later **Refine** (Phase 7); do not clone Landing density |
| **Preview**              | Buyer preview routes; content structure sound                                                                          | Emotionally thin vs Landing                         | **Refine** (Phases 5, 8)                                                          |
| **Recipient Experience** | Four modes structurally complete; Sprint 11 journeys                                                                   | Visually generic; inconsistent elevation/forms      | **Genuine Design Debt** + **Refine** (Phases 5, 8)                                |
| **Gift / Treasures**     | Gift direction locked (Sprint 11)                                                                                      | Envelope emoji UI conflicts with Gift language      | **Reconsider** → **Refine / Replace Later** (Phase 5; DDR-S12-004)                |
| **Theme expression**     | Five themes named; thin `accentClassName`                                                                              | Not yet “worlds”; artwork missing                   | Rules = **Refine** (Phase 6); artwork = **Production Pending**                    |

**Official diagnosis (Founder-approved):** Celebrate already has **one shared visual foundation**. The current inconsistency comes from **uneven surface language and emotional expression**: Landing carries the mature Celebrate identity, while Studio, Preview, and Recipient surfaces remain structurally sound but visually underdeveloped. Do **not** describe Celebrate as two completely unrelated design systems. Landing remains the protected baseline; weaker surfaces improve later without redesigning what already works.

---

## 2. Protected Visual Qualities

Must survive Sprint 12. Do not replace without Founder before–after review.

| Quality                               | Why it works                                     | Where it appears                     | What would damage it                           |
| ------------------------------------- | ------------------------------------------------ | ------------------------------------ | ---------------------------------------------- |
| **Warm pastel atmosphere**            | Florist celebration, not SaaS                    | Landing, `globals.css` brand palette | Cool neutrals, purple defaults, harsh contrast |
| **Warm-white background**             | Soft field for type and photos                   | Landing page field                   | Cold white or dark-mode-first shells           |
| **Brown text**                        | Warm, personal readability                       | Landing body/foreground              | Corporate black/gray as default                |
| **Fraunces / Poppins / Fira Code**    | Expressive + friendly + mono accents             | `app/layout.tsx`, headings, labels   | Inter/Roboto/system-only stack                 |
| **Emotional, thoughtful tone**        | Gift product, not dashboard                      | Landing copy and pacing              | Utility/feature-list marketing voice           |
| **Generous Landing whitespace**       | Calm premium rhythm                              | Landing sections                     | Dense packing on marketing                     |
| **Soft pink-tinted shadows**          | Softness without chrome (`.shadow-soft*`)        | Cards, hero, CTAs                    | Harsh black shadows / glow stacks              |
| **Selective glass**                   | Premium when rare                                | Navbar, hero frame                   | Glass on every panel                           |
| **Hero composition**                  | Brand + message + CTA + frame (`rounded-[3rem]`) | `hero-section.tsx`                   | Overlays; normalizing hero radius to cards     |
| **Brand gradient button**             | Pink→peach emotional CTA                         | `variant="brand"`                    | Generic primary CTAs on marketing              |
| **Bouquet illustration**              | Florist craft before final photos                | Landing illustration slots           | Removing craft signal early                    |
| **Rounded, gentle surfaces**          | Soft, approachable feel                          | Landing cards, hero                  | Sharp zero-radius everywhere                   |
| **Accessible pink text (`pink-ink`)** | Pink that still reads (~4.9:1)                   | Labels, mono accents                 | Soft pink on cream for body text               |
| **Reduced-motion respect**            | Emotion without exclusion                        | Landing motion                       | Mandatory motion, no reduced path              |

**Also locked:** Sage = botanical support only; hero radius = **Celebration Frame** (do not erase as a magic number).

---

## 3. Weak Surfaces That May Be Improved Later

| Weak area                                                      | What may improve later                                         | What must stay protected                                            | Owning phase                                      |
| -------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| **Studio feels like generic admin**                            | Warmth, hierarchy, guided framing at ~35–40% Landing intensity | Operational clarity; order-centric workflow; Sprint 11 architecture | **Phase 7**                                       |
| **Recipient surfaces structurally sound but visually generic** | Shared Celebrate surface/component language                    | Journey order, mode rules, CF/Sprint 11 contracts                   | **Phases 5 & 8**                                  |
| **Theme expression too thin**                                  | Token/world model beyond `accentClassName`                     | Five theme identities; no invented final art                        | **Phase 6** (rules); artwork = Production Pending |
| **Gift language vs envelope emoji UI**                         | Generalized Gift presentation system                           | Gift states & business layer; envelope as one presentation only     | **Phase 5**                                       |
| **Visual rules not formally documented**                       | DNA → Foundations → Surfaces → Components                      | Landing evidence as source; no speculative tokens                   | **Phases 2B–5**                                   |

Do not redesign these surfaces in this document.

---

## 4. Production Pending

The following are **not design failures** and must not be scored as Genuine Design Debt:

- Hero photography
- Bouquet photography
- Theme preview assets
- Final illustrations and decorative motifs
- Canva / Design Studio assets
- Frames
- Photobooth visual production

Current `PhotoSlot` / `PlaceholderMedia` patterns and empty `public/` folders are **intentional asset slots** until Design Studio delivers production art. Sprint 12 defines slots and rules only — **do not request asset production here**.

---

## 5. Preservation Rules for Phase 2B

Phase 2B — Visual DNA must follow:

1. **Landing remains the baseline.**
2. **Preserve before replacing.**
3. **Evidence before preference.**
4. **Improve weak surfaces without redesigning strong ones.**
5. **One product family does not mean identical density** (Studio stays calmer).
6. **Production Pending is not Design Debt.**
7. **Studio must remain operationally clear.**
8. **Sprint 11 remains authoritative** for workflow and experience architecture.
9. **No major visual direction is final** until it can later be compared against the current website (before–after).
10. **Do not over-engineer** — describe what Celebrate already is; do not invent parallel systems.

---

## Phase 2A acceptance

| Criterion                                                 | Status                     |
| --------------------------------------------------------- | -------------------------- |
| Current surfaces classified with locked buckets only      | ✅                         |
| Protected qualities listed without proposing replacements | ✅                         |
| Weak surfaces deferred to owning phases                   | ✅                         |
| Production Pending confirmed as non-debt                  | ✅                         |
| Phase 2B preservation rules stated                        | ✅                         |
| Founder preservation review                               | ✅ **Approved 2026-07-19** |

**Next:** Phase 2B — Celebrate Visual DNA (authorized). Phase 3 Design Foundations remains **not authorized**.
