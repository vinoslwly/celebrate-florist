# Sprint 12 Implementation Pass

# UI System Implementation Plan

> **Status:** ✅ **APPROVED AND CLOSED** — Sprint 12 Implementation Pass **CLOSED**  
> **Core UI verdict:** **PASS WITH FOLLOW-UP** — **IMPLEMENTED AND APPROVED**  
> **Date:** 2026-07-19  
> **V1 themes:** Bloom · Warm · Playful · Sky — Pure **frozen**  
> **Sprint 12.5:** Bloom Theme Validation Pilot — **AUTHORIZED FOR PLANNING** (implementation **NOT YET AUTHORIZED**)

---

## Purpose

Turn approved Sprint 12 gaps (Phases 5–9) into a **small, dependency-ordered implementation roadmap** for V1. No tickets for every CSS value. No Landing redesign. No Bloom/Motion/Photobooth execution in this pass.

**Status:** Batches 1–7 **APPROVED AND CLOSED**. Core UI System **IMPLEMENTED AND APPROVED**. Sprint 12.5 Bloom pilot planning authorized separately.

---

## Goals and non-goals

| Goals                                                      | Non-goals                               |
| ---------------------------------------------------------- | --------------------------------------- |
| Shared forms + Studio flat surfaces + Mode→Photos grouping | Landing redesign                        |
| Stronger Recipient/Preview surfaces                        | Sprint 11 workflow changes              |
| Gift family replacing emoji envelopes                      | Final artwork / Canva production        |
| Theme infrastructure beyond accent-only                    | Full five-theme polish / Bloom pilot    |
| A11y + responsive validation                               | Motion (S13), Photobooth redesign (S14) |

**Protect:** Landing identity · Sprint 11 journeys · order/data/routes · accessibility · mobile Studio tasks · Production Pending boundaries. Major visuals → before–after review.

---

## Batch overview

```
B1 Foundations/primitives → B2 Studio → B3 Recipient/Preview → B4 Gift
         → B5 Theme infra → B6 Responsive/a11y → B7 Impl QA → (later) Bloom 12.5
```

---

## Batch 1 — Foundations and shared primitives

> **Status:** ✅ **APPROVED AND CLOSED** (2026-07-19)  
> **Delivered:** `components/ui/input.tsx`, `textarea.tsx`, `label.tsx`, `field.tsx`, `form-control-styles.ts`

|                 |                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Objective**   | Ship shared form primitives, typography roles, global surface/state rules, safe foreground usage — no page redesign                  |
| **Affected**    | `components/` shared + ui; `app/globals.css` usage patterns (later); Studio/experience consumers                                     |
| **Likely repo** | New/extend under `components/ui` or `components/shared` (Input, Textarea, Label, Field); `button.tsx` roles; SectionHeading patterns |
| **Depends on**  | Sprint 12 Bible Phases 3–5                                                                                                           |
| **Protected**   | Landing look; shadcn extend-not-replace; no workflow change                                                                          |
| **Validation**  | Focus rings; pink-ink; form label association                                                                                        |
| **Done when**   | Primitives exist and are documented for Studio adoption; Landing unchanged visually                                                  |
| **Risk**        | **Low**                                                                                                                              |

---

## Batch 2 — Studio foundation

> **Status:** ✅ **APPROVED AND CLOSED** (2026-07-19)  
> **Delivered:** Studio form migration; Order Editor grouping; removed duplicate input class constants.

|                 |                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Objective**   | Replace raw inputs; flat Studio surfaces; Order Editor order: Identity → Core → Mode → Photos → Access → Readiness → Actions                           |
| **Affected**    | Studio shell, login, orders, order editor, mode builders                                                                                               |
| **Likely repo** | `features/studio/components/*` (order-editor-form, login-form, create-order-form, memory-code-panel, action bars); mode panels in quiz/match/treasures |
| **Depends on**  | Batch 1                                                                                                                                                |
| **Protected**   | Sprint 11 / `12_STUDIO_UX` workflow; data contracts; publish/readiness logic; no theme skins                                                           |
| **Validation**  | Editor section order; Save/Publish functional (not brand); before–after Studio screenshots                                                             |
| **Done when**   | No critical raw-input sprawl in editor; grouping matches Phase 7; shell stays flat/warm                                                                |
| **Risk**        | **Medium** (large form surface area)                                                                                                                   |

---

## Batch 3 — Recipient and Preview surfaces

> **Status:** ✅ **APPROVED AND CLOSED** (2026-07-19)  
> **Delivered:** Shared recipient/preview shells; LetterView typography; PhotoGallery tone; preview frame; memory gate; surface cards.

|                 |                                                                                                                 |
| --------------- | --------------------------------------------------------------------------------------------------------------- |
| **Objective**   | Strengthen shared surface language; keep journeys; Preview calmer than Recipient; validate LetterView body type |
| **Affected**    | Experience shells, LetterView, PhotoGallery, gates, BuyerPreviewShell                                           |
| **Likely repo** | `features/experience/components/*`; `features/preview/components/buyer-preview-shell.tsx`; mode flows           |
| **Depends on**  | Batch 1 (surfaces/type); preferably after B2 patterns stable                                                    |
| **Protected**   | Sprint 11 scene order; Preview bridge structure; no Landing marketing clone                                     |
| **Validation**  | **Required:** LetterView Poppins-default vs selective Fraunces; Preview vs Recipient intensity; before–after    |
| **Done when**   | Recipient/Preview feel same family as Landing without noise; journeys unchanged                                 |
| **Risk**        | **Medium**                                                                                                      |

---

## Batch 4 — Gift family

> **Status:** ✅ **APPROVED AND CLOSED** (2026-07-19)  
> **Delivered:** Shared Gift presentation; CSS motif fallbacks; Closed / Opened / Final Gift states; Recipient grid; Preview overview; Studio Gift terminology.

|                 |                                                                                                                              |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Objective**   | Replace envelope emoji presentation with Closed → Opened → Final Gift / Reward; keep business states                         |
| **Affected**    | Treasures recipient grid, copy, Studio builders labels, Preview treasures                                                    |
| **Likely repo** | `features/treasures/components/envelope-grid.tsx` (+ related); buyer-preview-treasures; envelope editors (copy/presentation) |
| **Depends on**  | Batch 3 surface language helpful; can parallel after B1 if scoped tightly                                                    |
| **Protected**   | `experience_envelopes` / open APIs; FD-T / Sprint 11 Gift states; no final artwork dependency                                |
| **Validation**  | Accessible names without emoji; state clarity; before–after Treasures                                                        |
| **Done when**   | No emoji-envelope identity in recipient UI; Gift language consistent                                                         |
| **Risk**        | **Medium** (user-facing)                                                                                                     |

---

## Batch 5 — Theme infrastructure

> **Status:** ✅ **APPROVED AND CLOSED** (2026-07-19)  
> **Delivered:** `ThemePresentation` contract; theme fallbacks/surfaces; five theme token configs; `ThemePageAtmosphere`; consumers; Studio accent swatch.

|                 |                                                                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Objective**   | Expand beyond `accentClassName`; support accent, accentText, atmosphere, surfaceTint, optional slots; prepare for Bloom pilot — **not** five final themes |
| **Affected**    | `types/theme.ts`, `features/themes/config/*`, resolve-theme, LetterView accent bar, Studio swatches                                                       |
| **Likely repo** | Theme type + configs + resolve; consumers of `accentClassName`                                                                                            |
| **Depends on**  | B1–B3 for consumption; B4 optional                                                                                                                        |
| **Protected**   | Five theme IDs; Studio not fully themed; Production Pending slots; global UI fonts                                                                        |
| **Validation**  | accentText contrast **and** harmony; Pure visibility; Warm not harsh red; Sky not SaaS — sample surfaces                                                  |
| **Done when**   | Token/slot model wired with safe fallbacks; Bloom-ready without completing all themes                                                                     |
| **Risk**        | **Medium–High** (cross-cutting)                                                                                                                           |

---

## Batch 6 — Responsive and accessibility validation

> **Status:** ✅ **APPROVED AND CLOSED** (2026-07-19)  
> **Delivered:** Four-theme V1 scope; Pure frozen/hidden from new orders; neutral global fallback; targeted a11y/responsive fixes. Landing catalog aligned (DDR-S12-028).

|                 |                                                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------- |
| **Objective**   | Studio mobile shell, touch targets, contrast measurement, theme-safe accentText, Recipient/Preview mobile |
| **Affected**    | Studio shell, experience layouts, theme-accented UI                                                       |
| **Likely repo** | `studio-shell`, mobile nav patterns, experience wrappers, theme consumers                                 |
| **Depends on**  | B2–B5 substantially complete                                                                              |
| **Protected**   | Mobile task completion; no desktop-only traps                                                             |
| **Validation**  | **Required:** Studio mobile; WCAG-oriented contrast checks; touch sizes                                   |
| **Done when**   | Validation notes recorded; blockers fixed or explicitly deferred with Founder OK                          |
| **Risk**        | **Medium**                                                                                                |

---

## Batch 7 — Implementation QA

> **Status:** ✅ **APPROVED AND CLOSED** (2026-07-19)  
> **Verdict:** **PASS WITH FOLLOW-UP** (DDR-S12-029, closure DDR-S12-030)  
> **Delivered:** QA across Landing/Studio/Recipient/Preview/Themes; targeted fixes; Production Pending inventory; no route/schema/API changes. Core UI **IMPLEMENTED AND APPROVED**.

|                 |                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| **Objective**   | Before/after vs Landing preservation; cross-experience consistency; regression; decide Bloom pilot readiness |
| **Affected**    | All prior batches (review, not new features)                                                                 |
| **Likely repo** | QA checklist against Phase 8/9 docs; Playwright smoke optional                                               |
| **Depends on**  | B1–B6                                                                                                        |
| **Protected**   | Landing must not regress                                                                                     |
| **Validation**  | Full before–after pack; Consistency matrix re-check                                                          |
| **Done when**   | Founder can authorize Bloom pilot **or** require fixes; coding pass considered complete                      |
| **Risk**        | **Low** (process)                                                                                            |

---

## Dependencies and risks (summary)

| Dependency                | Why                                                  |
| ------------------------- | ---------------------------------------------------- |
| B1 before B2              | Forms must exist before Studio migration             |
| B2 before heavy B3 polish | Shared surface habits                                |
| B5 after consumers exist  | Avoid abstract tokens unused                         |
| B6/B7 last                | Validate real UI                                     |
| Bloom after Core UI       | Founder: pilot only after Core UI System implemented |

| Risk                              | Mitigation                        |
| --------------------------------- | --------------------------------- |
| Scope creep into Landing redesign | Explicit non-goal; preserve list  |
| Workflow drift in Studio          | Phase 7 FOUNDER DECISION REQUIRED |
| Theme over-build                  | Infra only; Bloom later           |
| Gift without art                  | Motif slots empty OK              |
| A11y claims                       | Measure in B6; no false Pass      |

---

## Recommended first batch

**Start with Batch 1 — Foundations and shared primitives.**  
Lowest risk, unblocks Studio and everything downstream, Landing untouched.

---

## Explicitly deferred

| Work                         | When                                                                 |
| ---------------------------- | -------------------------------------------------------------------- |
| Bloom Theme Validation Pilot | Sprint 12.5 — **planning authorized**; implementation not authorized |
| Motion System                | Sprint 13                                                            |
| Photobooth redesign          | Sprint 14                                                            |
| Full five-theme art polish   | Design Studio + post-Bloom                                           |

---

## Founder review (planning)

1. Is this batch order right for V1?
2. Should Gift (B4) start before Theme infra (B5), or after Recipient surfaces (B3)? _(Plan default: B3 then B4 then B5.)_
3. Authorize **coding Batch 1 only**, or full B1–B7 when ready?

---

## Plan acceptance

| Criterion                                  | Status                                                 |
| ------------------------------------------ | ------------------------------------------------------ |
| Seven batches with objectives, deps, risks | ✅                                                     |
| Protects Landing / Sprint 11 / Pending     | ✅                                                     |
| Founder planning review                    | ✅                                                     |
| Batch 1 primitives                         | ✅ Approved and closed                                 |
| Batch 2 Studio foundation                  | ✅ Approved and closed                                 |
| Batch 3 Recipient/Preview                  | ✅ Approved and closed                                 |
| Batch 4 Gift family                        | ✅ Approved and closed                                 |
| Batch 5 Theme infrastructure               | ✅ Approved and closed                                 |
| Batch 6 Responsive/a11y                    | ✅ Approved and closed                                 |
| Batch 7 Implementation QA                  | ✅ **APPROVED AND CLOSED**                             |
| Sprint 12 Implementation Pass              | ✅ **CLOSED**                                          |
| Core UI System                             | **IMPLEMENTED AND APPROVED** (PASS WITH FOLLOW-UP)     |
| Sprint 12.5 Bloom pilot                    | 📋 **AUTHORIZED FOR PLANNING** — coding not authorized |
| Bloom deferred until Core UI               | ✅                                                     |
