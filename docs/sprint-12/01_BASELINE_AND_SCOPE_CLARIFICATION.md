# Sprint 12 — Baseline and Scope Clarification

> **Status:** **Locked** — Phase 1 complete  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Source audit:** Celebrate Current Website Audit (repository-based, 2026-07-18)

---

## Purpose

Establish the factual baseline and **founder-approved interpretation** of the current website before Visual DNA (Phase 2). This document locks what is preserved, refined, reconsidered, genuine debt, and production pending.

---

## Repository baseline (summary)

| Area          | Evidence                                                                |
| ------------- | ----------------------------------------------------------------------- |
| Stack         | Next.js 16, Tailwind v4, shadcn (`radix-nova`), Framer Motion (landing) |
| Tokens        | `app/globals.css` — brand palette + shadcn semantic `:root`             |
| Typography    | `app/layout.tsx` — Poppins, Fraunces, Fira Code                         |
| Landing       | `features/landing/components/*` — strongest visual identity             |
| Functional UI | Studio shell, experience flows — shadcn semantic, lower emotion         |
| Themes        | `features/themes/config/*.ts` — metadata + thin `accentClassName`       |
| Assets        | `public/*` mostly empty — **Production Pending**                        |

---

## Classification (founder-approved)

### A. Preserve

- Warm pastel palette, warm white, brown text, **`pink-ink`** for accessible pink text
- Fraunces / Poppins / Fira Code typography trio
- Soft pink shadows (`.shadow-soft*`), frosted navbar, selective glass
- Section rhythm (`max-w-6xl`, `py-20 sm:py-28`), **`brand`** button variant
- `SectionHeading`, `ScrollReveal`, `PhotoSlot`, `PlaceholderMedia`, `BouquetIllustration`
- Reduced-motion patterns in landing motion
- Landing as **primary visual baseline** (DDR-S12-008)

### B. Refine

- Experience shells (letter, gallery, quiz, match, treasures grids)
- Theme token model (expand beyond `accentClassName`)
- Studio shell and order editor (emotional framing per DDR-S12-003)
- Shared form components (replace raw inputs)
- Shadow/radius consistency across contexts
- **Sage** — keep with **botanical supporting role** (DDR-S12-001)

### C. Reconsider

- Treasures **envelope emoji UI** → **Gift system** (DDR-S12-004: Refine/Replace Later)
- Studio as acceptable “admin CMS” → rejected; creative workspace required
- Cloning landing decoration density onto Studio → rejected
- Dark mode CSS without product use → out of Sprint 12 scope unless reopened

### D. Genuine design debt

| ID    | Issue                                                                                                      | Severity |
| ----- | ---------------------------------------------------------------------------------------------------------- | -------- |
| DD-01 | Uneven surface language (Landing mature; Studio/Preview/Recipient underdeveloped) on one shared foundation | High     |
| DD-02 | Studio confusion / form-heaviness                                                                          | High     |
| DD-03 | Recipient surfaces generic vs landing family                                                               | High     |
| DD-04 | Inconsistent components (buttons, shadows, forms)                                                          | Medium   |
| DD-05 | No formal documented token system                                                                          | Medium   |
| DD-06 | Arbitrary radii without official tokens (except hero → DDR-S12-002)                                        | Medium   |

### E. Production Pending (NOT design debt)

- Hero photo, bouquet catalog images, theme preview/photobooth strips
- Canva theme packs (e.g. **Bloom Celebrate**, 11 pages — MCP read verified)
- Illustrations, frames, decorative florals from Design Studio
- Empty `public/bouquets`, `public/themes`, `public/illustrations`, `public/frames`

**Slot pattern:** `PhotoSlot` + `PlaceholderMedia` remain intentional until assets land.

---

## Founder decisions incorporated (Phase 1 lock)

| ID        | Decision                                                    | Register                                                                                                    |
| --------- | ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| FD-S12-01 | Sage = supporting botanical; pink = emotional core          | [DDR-S12-001](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-001--sage-palette-role)                       |
| FD-S12-02 | Hero radius → **Celebration Frame** token; do not normalize | [DDR-S12-002](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-002--hero--celebration-frame-radius)          |
| FD-S12-03 | Studio ~35–40% landing emotional intensity                  | [DDR-S12-003](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-003--studio-emotional-intensity)              |
| FD-S12-04 | Gift language; envelope UI Replace Later                    | [DDR-S12-004](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-004--gift-product-language-treasures--beyond) |
| FD-S12-05 | Living **Celebrate Design Decision Register**               | This register + ongoing append                                                                              |

---

## Scope boundaries (unchanged)

**In:** Design system specs Phases 2–9; Decision Register; UI System Bible structure later.  
**Out:** Asset production, motion (S13), photobooth feature (S14), implementation, commits unless authorized.

---

## Phase 1 acceptance

| Criterion                                       | Status |
| ----------------------------------------------- | ------ |
| Audit reinterpreted with founder clarifications | ✅     |
| Five-bucket classification locked               | ✅     |
| Production Pending ≠ debt                       | ✅     |
| Founder decisions DDR-S12-001–008 recorded      | ✅     |
| Ready for Phase 2 Visual DNA                    | ✅     |

**Next:** Phase 2A Preservation Map → Phase 2B Visual DNA (founder review required before Phase 3 Foundations).
