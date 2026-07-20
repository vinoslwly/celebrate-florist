# Sprint 12 — Phase 3

# Celebrate Design Foundations

> **Status:** ✅ **APPROVED AND CLOSED** by Founder — 2026-07-19  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [02B — Visual DNA](./02B_CELEBRATE_VISUAL_DNA.md) (**APPROVED**)  
> **Next:** Phase 4 — Surface Language (**authorized**)  
> **Implementation:** **NOT AUTHORIZED**

---

## Purpose

Translate approved Visual DNA into a **small, measurable foundation** for the whole product: type roles, color roles, accessibility pairings, spacing, containers, layout, responsive behavior, and density.

This is **not** a redesign, not a CSS token dump, and not a second “app palette.” One foundation serves Landing, Studio, Preview, Recipient, and utility surfaces — with **different density**, not different identity.

**Out of scope:** shadows, radius scale, glass/elevation, components, themes, Studio redesign, Gift anatomy, motion, CSS/Tailwind/React implementation.

---

## Evidence sources

| Source                                     | Use                                                                  |
| ------------------------------------------ | -------------------------------------------------------------------- |
| `app/layout.tsx`                           | Fraunces / Poppins / Fira Code load + weights                        |
| `app/globals.css`                          | Brand palette, warmwhite, pink-ink, semantic `:root`                 |
| Landing sections / `SectionHeading` / hero | Type sizes, `max-w-6xl` / `max-w-2xl` / `max-w-md`, `py-20 sm:py-28` |
| Experience shells                          | `max-w-3xl`, `max-w-md` / `max-w-lg` reading                         |
| Studio editors                             | `space-y-6`, `p-6` cards, `text-sm` forms                            |
| Phase 2A live inspect                      | Cream `rgb(255,252,248)`, brown `rgb(74,52,40)`, Fraunces headings   |
| Visual DNA + FD-S12                        | Intensity, Sage, Celebration Frame meaning, Studio 35–40%            |

---

## 1. Typography foundations

### Font trio (locked)

| Family                                | Role                                          | Evidence                                       |
| ------------------------------------- | --------------------------------------------- | ---------------------------------------------- |
| **Fraunces** (`font-serif` / heading) | Emotional display and page/section titles     | Hero h1, Studio “Dashboard”, SectionHeading h2 |
| **Poppins** (`font-sans`)             | Body, UI, forms, navigation                   | Global body                                    |
| **Fira Code** (`font-mono`)           | Eyebrows, step markers, playful label accents | `SectionHeading` eyebrow, how-it-works numbers |

Do **not** add fonts. Do **not** replace this trio without a serious a11y/tech reason.

### Roles by surface

| Role                           | Family                                           | Typical size (evidence)           | Landing               | Studio                      | Preview / Recipient    | Utility          |
| ------------------------------ | ------------------------------------------------ | --------------------------------- | --------------------- | --------------------------- | ---------------------- | ---------------- |
| **Display / hero**             | Fraunces                                         | `text-4xl` → `sm:text-5xl`        | Yes                   | Rare                        | Rare (gift title)      | No               |
| **Section heading**            | Fraunces                                         | `text-2xl` → `sm:text-3xl`        | Yes                   | Optional section titles     | Yes                    | Rare             |
| **Page heading**               | Fraunces                                         | ~`text-2xl`–`3xl`                 | —                     | Primary (Dashboard, Orders) | Primary                | Primary          |
| **Card / block heading**       | Poppins semibold _or_ Fraunces small             | `text-base`–`lg`                  | Card h3 often Poppins | Card section titles         | Block titles           | Yes              |
| **Body**                       | Poppins                                          | `text-base` / hero lead `text-lg` | Yes                   | Prefer `text-sm`–`base`     | `text-base`            | `text-sm`–`base` |
| **Supporting body**            | Poppins                                          | `text-sm`–`base` muted            | Yes                   | Yes                         | Yes                    | Yes              |
| **Label / eyebrow**            | Fira Code bold + `pink-ink` + uppercase tracking | `text-xs` / `text-[11px]`         | Yes                   | Sparingly                   | Sparingly              | Rare             |
| **Letter / emotional reading** | See rule below                                   | Body `text-base`+                 | Demo/letter           | Editor preview              | Core letter beat       | —                |
| **Form label**                 | Poppins medium                                   | `text-sm`                         | Contact-like forms    | Primary                     | Memory Code / approval | Login            |
| **Helper / metadata**          | Poppins                                          | `text-xs` muted                   | Captions              | Badges, IDs, status         | Theme chip, status     | Footer           |

### Practical type scale (small)

| Step | Approx. Tailwind           | Primary use                   |
| ---- | -------------------------- | ----------------------------- |
| XS   | `text-xs`                  | Meta, badges, eyebrows        |
| SM   | `text-sm`                  | Studio UI, helpers, secondary |
| MD   | `text-base`                | Default body, form controls   |
| LG   | `text-lg`                  | Hero lead, emphasized body    |
| XL   | `text-2xl` / `sm:text-3xl` | Section / page titles         |
| 2XL  | `text-4xl` / `sm:text-5xl` | Landing hero only             |

Weights already loaded: Poppins 400/500/700 · Fraunces 500/600/700 · Fira Code 700. Prefer these; do not invent unused weights.

**Emotional reading rule (Founder-approved):** Poppins is the default body font for readable long-form and interface content. Fraunces may be used selectively for short, intimate, ceremonial, or emotionally significant passages when readability remains strong. Long letters and dense reading prioritize Poppins. Fraunces remains appropriate for letter titles, short emotional lines, ceremonial introductions, meaningful quotations, and brief reveal moments — not for long body copy merely for decoration. Final usage must later be visually validated against the current Recipient Experience.

---

## 2. Color foundations

### Emotional core (preserve)

| Role                         | Meaning                                 | Evidence / values (reference)                                                             |
| ---------------------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Primary emotional**        | Pink family — celebration warmth        | `pink`, `pink-soft`, `pink-deep`; interactive primary `#f0a8c7`                           |
| **Supporting emotional**     | Peach family — warmth beside pink       | `peach`, `peach-soft`, `peach-deep`                                                       |
| **Highlight / soft field**   | Cream family — gentle tinted zones      | `cream`, `cream-soft`; muted surfaces                                                     |
| **Page background**          | Warm white                              | `warmwhite` / `--background: #fffcf8`                                                     |
| **Foreground**               | Brown readable text                     | `--foreground: #4a3428`                                                                   |
| **Muted foreground**         | Secondary text                          | `--muted-foreground: #6b5347` (~safer AA after Sprint 01C)                                |
| **Accent text (pink words)** | Accessible pink for labels              | **`pink-ink: #b8497a`** — never use decorative pink as body text                          |
| **Botanical support**        | Sage family — florist world only        | `sage`, `sage-soft`, `sage-deep` — **must not compete** with pink/peach/cream (FD-S12-01) |
| **Interactive**              | Brand gradient CTA + soft borders/rings | `brand` button pink→peach; `--ring` pink-deep; borders `#f3dee6`                          |
| **Surface / card**           | White card on warm field                | `--card: #ffffff`                                                                         |

### Semantic status (shared foundation)

| State                   | Role                           | Note                                                                                                      |
| ----------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------- |
| **Error / destructive** | Failure, blocking validation   | Keep existing `--destructive` clarity                                                                     |
| **Success**             | Confirmations, ready/published | Calm green adjacent to Sage — not neon; **Requires visual validation before implementation** if new shade |
| **Warning**             | Caution, draft risk            | Soft amber/peach-adjacent; **Requires visual validation before implementation**                           |
| **Information**         | Neutral guidance               | Muted brown / cream — not default blue SaaS info                                                          |

**Theme foundation rule (Founder-approved):** Warm white and brown remain the **default global foundation**. Phase 6 may define approved theme-equivalent atmospheric backgrounds and foreground pairings, provided readability, accessibility, and Celebrate identity remain intact. Do not create a separate Studio palette or five unrelated theme palettes — theme variation stays inside one Celebrate family. Pink, peach, cream, and Sage retain their approved roles. Phase 6 owns theme-specific color behavior; Phase 3 only protects the global foundation and its boundaries.

---

## 3. Accessibility pairings

| Pairing                            | Guidance                                                                             | Verification                                                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| Primary text on warm white / cream | Brown `#4a3428` on `#fffcf8` / cream                                                 | Live Phase 2A used these; treat as **approved direction**. Exact ratio **Requires later verification** if claimed as WCAG |
| Secondary text                     | `#6b5347` on warm white                                                              | Documented as improved in Sprint 01C (~7:1 intent) — **re-verify before lock**                                            |
| Pink text on light                 | **Only `pink-ink`**                                                                  | Repo note: pink-deep ~1.9:1 as text — **forbidden for body/labels**                                                       |
| Text on pink / peach fills         | Prefer brown foreground on soft pink/peach surfaces (matches `--primary-foreground`) | Brand CTA uses brown on gradient — preserve                                                                               |
| Text on white cards                | Brown / muted brown                                                                  | Standard                                                                                                                  |
| Status surfaces                    | Error text must stay high-contrast on tinted error bg                                | Keep destructive pattern; don’t pastel-wash errors                                                                        |
| Buttons                            | Brand: brown on pink→peach; Outline: brown on white; destructive: high contrast      | Preserve pattern                                                                                                          |

**Do not** approve pretty pastels that fail readable text. Softness never excuses illegible pink.

---

## 4. Spacing foundations

### Role scale (extracted — not every Tailwind step)

| Role                          | Typical evidence                                             | Use                                 |
| ----------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| **Inline**                    | `gap-2`–`gap-3`                                              | Icons + labels, badge clusters      |
| **Control**                   | `gap-3`, input `px-3 py-2`                                   | Buttons, fields side-by-side        |
| **Card padding**              | Landing `p-4`–`p-6`; Studio sections `p-6`                   | Content blocks                      |
| **Form group**                | Studio `space-y-2` fields, `space-y-4`–`6` sections          | Labels → control → helper           |
| **Section spacing (Landing)** | `py-20 sm:py-28`, horizontal `px-4 sm:px-6`                  | Marketing rhythm — **preserve**     |
| **Major page rhythm**         | Hero `pt-14/20` + `pb-20/28`; Studio `space-y-8` page blocks | Page-level breathing                |
| **Emotional reveal**          | Experience `space-y-8`, `py-10`                              | Between beats — not Landing `py-28` |
| **Studio working density**    | Tighter vertical: `space-y-3`–`6`, list rows `py-3`          | Operational clarity                 |

**Rule:** Landing keeps generous vertical rhythm. Studio must **not** inherit marketing section padding. Recipient/Preview sit between: room to feel, not brochure spacing.

Signature one-offs (hero frame, Celebration Frame) may remain exceptions — do not normalize them away for theoretical purity (Phase 4 owns frame mechanics).

---

## 5. Container and reading widths

| Role                             | Approx. width                                                      | Evidence                           | Surfaces              |
| -------------------------------- | ------------------------------------------------------------------ | ---------------------------------- | --------------------- |
| **Landing content**              | `max-w-6xl`                                                        | Navbar, grids, most sections       | Landing               |
| **Narrow editorial / FAQ / CTA** | `max-w-2xl`                                                        | SectionHeading, FAQ, final CTA     | Landing, utility copy |
| **Hero lead / short read**       | `max-w-md`                                                         | Hero subtitle                      | Landing               |
| **Recipient experience**         | `max-w-3xl` (+ `px-4`)                                             | Moments/Connection/Memories shells | Recipient             |
| **Gate / focused utility**       | `max-w-md`–`lg`                                                    | Memory Code gate, unavailable      | Recipient utility     |
| **Preview**                      | Align with Recipient (`max-w-3xl` family)                          | Same family, evaluative chrome     | Preview               |
| **Studio workspace**             | Full main column beside sidebar; content not forced to `max-w-6xl` | Dashboard/orders/editor            | Studio                |
| **Tables / dense editors**       | Full available width                                               | Orders table, long forms           | Studio                |
| **Letter reading**               | Narrower than full experience (`max-w-md`–`2xl` intent)            | Preserve intimate letter feel      | Recipient / Preview   |

**Do not** force one universal max-width. Emotional reading stays narrower than marketing grids and Studio tables.

---

## 6. Layout foundations

### Shared principles

1. **Clear focal point** — one primary job per viewport/section.
2. **Editorial hierarchy** — type and spacing before decoration.
3. **Controlled asymmetry** — allowed (Landing hero); not chaotic.
4. **Intentional whitespace** — rest vs task (see density).
5. **Readable grouping** — related controls/content cluster.
6. **One primary moment per section** where appropriate.
7. **Decoration secondary** to structure (Visual DNA).

| Context       | Layout character                                              |
| ------------- | ------------------------------------------------------------- |
| **Landing**   | Generous, emotional, promotional; hero composition protected  |
| **Recipient** | Focused, intimate, sequential (Sprint 11); one beat at a time |
| **Preview**   | Near Recipient, calmer; light approval chrome                 |
| **Studio**    | Operational, grouped, guided, denser; sidebar + main          |
| **Utility**   | Simple, readable, minimal decoration                          |

Rules only — no page redesign.

---

## 7. Responsive foundations

Use **existing Tailwind defaults** (`sm` / `md` / `lg`…). No custom breakpoints unless later evidence demands them.

| Concern                 | Principle                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| **Hierarchy**           | Title/CTA stay strongest when stacked; decoration never buries the action                         |
| **Reading width**       | Narrow on mobile; keep `max-w-*` caps on large screens                                            |
| **Grid / cards**        | `md:grid-cols-2` → stack; fewer columns, full-width cards on small screens                        |
| **Forms**               | `sm:grid-cols-2` → stack; labels above fields                                                     |
| **Touch**               | Primary actions full-width on small screens (`w-full sm:w-auto` pattern)                          |
| **Nav / Studio mobile** | Keep Landing mobile nav; Studio shell changes **Require visual validation before implementation** |
| **Media & decoration**  | Scale media in-frame; reduce motif before reducing type hierarchy; placeholders OK                |
| **Studio mobile**       | Task completion first; denser OK, warmth remains                                                  |

Preserve **emotional hierarchy**, not only shrink layout.

---

## 8. Density model

Emotional intensity (DNA) ≠ layout density.

| Surface       | Density                   | Emotional intensity (DNA) | Note                         |
| ------------- | ------------------------- | ------------------------- | ---------------------------- |
| **Landing**   | Low / generous            | 100%                      | Wide section padding         |
| **Recipient** | Low–medium / focused      | 70–85%                    | Spacious beats, not brochure |
| **Preview**   | Medium / evaluative       | 55–70%                    | Slightly tighter chrome      |
| **Studio**    | Medium–high / operational | 35–40%                    | Denser **and** warm          |
| **Utility**   | Low–medium / simple       | Low                       | Clarity first                |

Studio may be denser while remaining warm. Recipient may be spacious without becoming decorative.

---

## 9. Signature exceptions

Foundation scales must **coexist** with a few protected exceptions (not normalized away):

| Exception                        | Meaning                                         | Later owner                   |
| -------------------------------- | ----------------------------------------------- | ----------------------------- |
| **Celebration Frame**            | Signature framing for major celebratory moments | Phase 4 (radius/token)        |
| **Hero composition**             | Brand + message + CTA + dominant frame          | Preserve; Surfaces/Components |
| **Selective asymmetry**          | Hero two-column / offset craft                  | Preserve where it works       |
| **Emotional reading width**      | Narrow letter/gift reading                      | Preserve                      |
| **Bouquet illustration context** | Craft signal until photos land                  | Production Pending + Landing  |

Do not invent many new exceptions.

---

## 10. Foundations decision summary

| Foundation           | Decision                                                | Evidence                         | Applies to        | Later owner                   |
| -------------------- | ------------------------------------------------------- | -------------------------------- | ----------------- | ----------------------------- |
| Type trio            | Fraunces / Poppins / Fira Code locked                   | `layout.tsx`                     | All surfaces      | Phase 5 usage                 |
| Type scale           | 6 practical steps (XS→2XL)                              | Landing + Studio                 | All               | Implementation later          |
| Color core           | Pink/peach/cream + warmwhite + brown                    | `globals.css`                    | All               | Phase 6 themes tint only      |
| Pink text            | `pink-ink` only for pink words                          | Sprint 01C note                  | All               | Foundations/a11y              |
| Sage                 | Botanical support only                                  | FD-S12-01                        | Accents           | Phase 3 detail → usage in 4–6 |
| Spacing              | Role-based; Landing generous ≠ Studio dense             | `py-20/28` vs Studio `space-y-*` | All               | Surfaces/Studio               |
| Containers           | Multi-width model (`6xl` / `3xl` / `2xl` / full Studio) | Repo widths                      | All               | Layout impl later             |
| Density              | Landing low → Studio medium-high                        | DNA + live Studio                | All               | Phase 7 Studio                |
| Responsive           | Preserve hierarchy; default breakpoints                 | Landing patterns                 | All               | Impl later                    |
| A11y pairings        | Direction set; formal WCAG claims need re-check         | Repo + Phase 2A                  | All               | Phase 9 QA                    |
| Signature exceptions | Celebration Frame + hero/letter widths                  | DNA + 2A                         | Marketing/moments | Phase 4                       |

---

## Founder review questions (max 6)

1. Does this type hierarchy still feel like the Celebrate you see on the Landing today?
2. Does the color-role model (pink/peach/cream core, brown text, Sage support only) protect the current atmosphere?
3. Is it clear that Studio stays warmer **and** denser — without becoming a separate “admin palette”?
4. Do the density differences (Landing generous → Studio operational) feel sensible for how you work day to day?
5. Is anything here unnecessarily complicated for a V1 product?
6. Does any foundation decision appear to threaten the current Landing identity?

---

## Phase 3 acceptance

| Criterion                                             | Status                                                  |
| ----------------------------------------------------- | ------------------------------------------------------- |
| Typography roles + small scale                        | ✅                                                      |
| Color roles + Sage boundary                           | ✅                                                      |
| Accessibility pairings (honest verification notes)    | ✅                                                      |
| Spacing / containers / layout / responsive / density  | ✅                                                      |
| Signature exceptions listed without Phase 4 mechanics | ✅                                                      |
| No CSS, components, shadows, radius, themes, commits  | ✅                                                      |
| Founder Foundations Review                            | ✅ **APPROVED 2026-07-19** (two clarifications applied) |

**Next:** Phase 4 — Surface Language (authorized — documentation only).  
**Still not authorized:** implementation, styling changes, refactors, commits, pushes.
