# Sprint 12 — Phase 4

# Celebrate Surface Language

> **Status:** ✅ **APPROVED AND CLOSED** by Founder — 2026-07-19  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [03 — Design Foundations](./03_CELEBRATE_DESIGN_FOUNDATIONS.md) (**APPROVED AND CLOSED**)  
> **Next:** Phase 5 — Component System (**authorized**)  
> **Implementation:** **NOT AUTHORIZED**

---

## Purpose

Define how Celebrate **surfaces** behave: radius, borders, shadows, selective glass, elevation, hierarchy, and context rules — so Landing, Recipient, Preview, Studio, and utility feel like **one family** with different density.

This phase translates Visual DNA + Foundations into surface rules. It does **not** redesign pages, invent oversized taxonomies, or implement CSS.

**Evidence:** Landing cards (`rounded-3xl`, `shadow-soft`), hero (`rounded-[3rem]` / `[2.5rem]`, glass), navbar (`backdrop-blur-md`), Studio (`rounded-xl`/`2xl`, flat borders, little soft-shadow), experience cards (`rounded-2xl`).

---

## 1. Surface categories

| Category             | Job                               | Typical use                                         |
| -------------------- | --------------------------------- | --------------------------------------------------- |
| **Page field**       | Warm ambient ground               | Landing / experience / Studio main bg               |
| **Panel / card**     | Grouped content block             | Marketing cards, Studio sections, experience blocks |
| **Inset / nested**   | Secondary grouping inside a panel | Inner media wells, form clusters                    |
| **Chrome**           | Persistent UI shell               | Navbar, Studio sidebar/header                       |
| **Control**          | Interactive affordance            | Buttons, inputs, pills, badges                      |
| **Signature moment** | Rare celebratory framing          | Hero craft frame (**Celebration Frame**)            |
| **Utility**          | Simple task surfaces              | Login, gates, empty states, errors                  |

Decoration and glass attach to categories by rule — not by habit.

---

## 2. Radius scale

Small practical scale from current usage. Values are **specification targets** for later implementation — not CSS commits.

| Step            | Approx. evidence                                           | Role                                                           |
| --------------- | ---------------------------------------------------------- | -------------------------------------------------------------- |
| **R0**          | `rounded-none` / hairline                                  | Rare; tables, full-bleed dividers only if needed               |
| **R1**          | `rounded-lg` (~0.5–0.75rem family)                         | Inputs, small buttons, Studio nav items, compact controls      |
| **R2**          | `rounded-xl`                                               | Badges clusters, list shells, photobooth wells, small overlays |
| **R3**          | `rounded-2xl`                                              | Studio section cards, experience content cards, login card     |
| **R4**          | `rounded-3xl`                                              | Landing marketing cards, FAQ shell, final CTA block            |
| **R5 Pill**     | `rounded-full`                                             | Chips, avatar marks, brand icon discs, pill CTAs               |
| **R-Signature** | `rounded-[3rem]` outer / `[2.5rem]` inner / `[2rem]` media | **Celebration Frame** only — see §3                            |

**Rule:** Prefer the smallest step that still feels soft. Do not jump to R4 for Studio forms. Do not use R-Signature on ordinary cards.

Global shadcn `--radius: 1.25rem` remains a component baseline; product language maps roles above onto it later without erasing signature exceptions.

---

## 3. Celebration Frame

**Meaning (locked):** A signature framing principle reserved for **major celebratory moments**.

**Placement in scale:** **R-Signature** — outside the ordinary R1–R4 ladder. It is an exception, not “the biggest card radius.”

| Allowed                                                                   | Denied                                   |
| ------------------------------------------------------------------------- | ---------------------------------------- |
| Landing hero craft frame (current `3rem` / `2.5rem` / media `2rem` stack) | Studio order cards, tables, forms        |
| Future rare recipient “ceremony” moments — only if Founder later approves | Every theme card, every Gift cell        |
| Nested soft well inside the frame (inner radii slightly smaller)          | Applying glass + R-Signature to dense UI |

**Mechanics for later implementation (spec only):** Outer frame may combine soft border (`border-white/40` class of feel), light translucent fill, `shadow-soft-lg`, and **selective** blur. Inner media uses a slightly tighter radius. Do not invent additional signature sizes beyond this family without Founder review.

**Requires visual validation before implementation** when extending beyond the current hero.

---

## 4. Border roles

| Role                   | Evidence / direction               | Use                                         |
| ---------------------- | ---------------------------------- | ------------------------------------------- |
| **Hairline brand**     | `border-pink-soft` / `/40`         | Landing cards, soft marketing edges         |
| **Neutral UI**         | `border-border` (`#f3dee6` family) | Studio, experience functional cards, tables |
| **Input**              | `border-input`                     | Fields                                      |
| **Focus**              | `border-ring` + ring               | Keyboard/focus states                       |
| **Emphasis select**    | `border-primary`                   | Selected mode/photo tiles                   |
| **Danger**             | `border-destructive/30`            | Error callouts                              |
| **Dashed placeholder** | `border-dashed border-pink-soft`   | `PlaceholderMedia` / asset slots            |
| **Glass edge**         | `border-white/40`                  | Celebration Frame / rare frosted shells     |

Borders separate structure; they should stay soft. Avoid heavy black outlines.

---

## 5. Shadow roles

| Role                 | Evidence                            | Use                                |
| -------------------- | ----------------------------------- | ---------------------------------- |
| **None / flat**      | Studio lists, many functional cards | Default for dense operational UI   |
| **Soft**             | `.shadow-soft` (pink-tinted)        | Landing cards, light elevation     |
| **Soft large**       | `.shadow-soft-lg`                   | Hero frame, final CTA emphasis     |
| **Soft pink (CTA)**  | `.shadow-soft-pink`                 | Brand gradient floating actions    |
| **Utility / dialog** | shadcn `shadow-sm` / `shadow-lg`    | Sheets, popovers — keep restrained |

**Rule:** Soft pink shadows are part of Landing identity. Studio should stay mostly flat; introduce soft shadow only for rare emphasis (e.g. a single primary panel), not every section. Do not invent a five-level shadow ladder beyond these roles.

Exact rgba values stay as in `globals.css` until implementation clearance — Phase 4 owns **roles**, not new formulas.

---

## 6. Elevation levels

Conceptual stack (small):

| Level        | Feel                   | Typical surfaces                 |
| ------------ | ---------------------- | -------------------------------- |
| **E0**       | Page field             | Background                       |
| **E1**       | Resting panel          | Flat bordered card               |
| **E2**       | Lifted soft            | Landing card + `shadow-soft`     |
| **E3**       | Featured soft          | Hero / CTA + `shadow-soft-lg`    |
| **E-Chrome** | Sticky/floating chrome | Navbar over content; back-to-top |

Do not stack E3 on Studio dashboards. Recipient may use E1–E2; Preview similar; Studio mostly E0–E1.

---

## 7. Glass allow / deny

| Context                              | Glass?              | Notes                                                       |
| ------------------------------------ | ------------------- | ----------------------------------------------------------- |
| Landing sticky navbar                | **Allow**           | `bg-white/80 backdrop-blur-md` — proven                     |
| Celebration Frame / hero craft       | **Allow (light)**   | `backdrop-blur-sm` + translucent fill                       |
| Modal/sheet overlays                 | **Allow lightly**   | Existing sheet dim + blur — keep subtle                     |
| Landing body cards                   | **Deny by default** | Opaque `bg-card` + soft shadow                              |
| Studio panels / forms                | **Deny**            | Clarity over frost                                          |
| Recipient gift grids / letter bodies | **Deny by default** | Prefer solid soft cards; rare ceremony only with Founder OK |
| Preview approval chrome              | **Deny by default** | Solid, calm                                                 |
| Every panel “for premium”            | **Deny**            | Anti-pattern                                                |

Glass is **selective**, never universal.

---

## 8–12. Surface behavior by product area

### Landing (marketing)

- Cards: **R4** + brand hairline border + **soft** shadow (E2).
- Hero: **Celebration Frame** (R-Signature) + light glass + soft-lg.
- Navbar: glass chrome.
- Pills/CTAs: R5 + brand gradient / outline.
- Density: generous; decoration allowed when it supports hierarchy.

### Recipient Experience

- Content cards: **R3** + neutral or soft brand border; shadow **none → soft** (prefer restraint).
- Gift cells / interactive tiles: **R2–R3**; clear selected/opened states via border/fill — not glass.
- Avoid Landing R4 grids of marketing cards.
- Feel premium and intimate through framing, type, and pacing — not visual noise.
- Envelope emoji presentation remains **Replace Later** (components Phase 5); surface rules still apply to whatever Gift UI replaces it.

### Preview

- Same family as Recipient, **calmer**.
- Extra evaluative chrome (approve bars, notices) = flat **R2–R3** panels, neutral borders, minimal shadow.
- Do not add Landing glass chrome.

### Studio

- Section cards: **R3**, `border-border`, **flat** (E1).
- Controls: **R1**, clear focus rings.
- Lists/tables: **R2** shells or divided rows; no pink soft-shadow wallpaper.
- Sidebar/header: solid chrome, hairline borders — **no glass**.
- Warmth comes from page field + type + sparse pink accents (nav pill), not frosted decoration.
- Operational clarity > atmosphere (DNA 35–40%).

### Utility

- Login / gates / errors: **R3** single card, simple border, light or no soft shadow.
- Error surfaces: danger border + tint — high clarity.
- Minimally decorative.

---

## 13. Interactive surface states

| State                 | Surface behavior                                                                |
| --------------------- | ------------------------------------------------------------------------------- |
| **Rest**              | Default border + fill for category                                              |
| **Hover**             | Subtle: border strengthen, light bg tint, or Landing card micro-lift — not glow |
| **Focus**             | Visible ring (`ring` / pink-family) — accessibility required                    |
| **Selected / active** | `border-primary` + light primary fill (mode tiles, photo picks)                 |
| **Disabled**          | Reduced opacity; no strong shadow                                               |
| **Error**             | Destructive border/bg tint on the control or callout                            |
| **Opened (Gift)**     | Distinct from Closed via fill/border/label — exact Gift anatomy in Phase 5      |
| **Loading**           | Prefer muted inset; avoid pulsing glass                                         |

Do not use multi-layer neon glows. Soft-pink shadow on brand CTA hover opacity is enough.

---

## 14. Mobile / responsive surface adjustments

| Concern           | Rule                                                                                                            |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Radius            | Keep role; slight optical reduction optional later — do not drop to sharp rectangles                            |
| Shadows           | Soft-lg may step down to soft on small screens if needed — **Requires visual validation before implementation** |
| Glass navbar      | Keep; ensure contrast of nav text                                                                               |
| Cards             | Full-width stack; maintain R3/R4 roles                                                                          |
| Studio            | Stay flat; touch targets on R1 controls; no new glass                                                           |
| Celebration Frame | May scale down with viewport but remain recognizably signature                                                  |

---

## 15. Surface anti-patterns

| Anti-pattern                                      | Why                                     |
| ------------------------------------------------- | --------------------------------------- |
| Glass on every card                               | Dilutes signature; harms Studio clarity |
| Celebration Frame on forms/tables                 | Kills specialness                       |
| Soft-pink shadow on all Studio panels             | Marketing noise in workspace            |
| Harsh black Material shadows                      | Breaks soft-premium                     |
| Mixing R4 Landing cards into dense editors        | Wrong density                           |
| Neon / glow stacks                                | Rejected identity                       |
| Flattening hero to `rounded-xl` for “consistency” | Violates FD-S12-02                      |
| Decorative borders without hierarchy              | Clutter                                 |

---

## 16. Surface decision summary

| Decision          | Choice                                | Evidence                | Later owner         |
| ----------------- | ------------------------------------- | ----------------------- | ------------------- |
| Radius ladder     | R1–R4 + pill + R-Signature            | Landing/Studio classes  | Impl later          |
| Celebration Frame | R-Signature; hero-class only          | `rounded-[3rem]` stack  | Token/CSS later     |
| Borders           | Brand soft vs neutral UI              | pink-soft vs border     | Components          |
| Shadows           | soft / soft-lg / soft-pink / flat     | `globals.css` utilities | Impl later          |
| Elevation         | E0–E3 + chrome                        | Live inspect            | Surfaces/Components |
| Glass             | Navbar + signature (+ light overlays) | site-navbar, hero       | Impl later          |
| Studio default    | Flat R3 panels                        | Order editor            | Phase 7             |
| Recipient default | Soft R3, restrained shadow            | Experience cards        | Phase 5/8           |

---

## Founder review questions (max 6)

1. Does this surface language still feel like the Celebrate you see on the Landing today?
2. Is glass limited enough (navbar + signature moments, not everywhere)?
3. Does the Celebration Frame remain special — clearly not a normal card radius?
4. Does Studio stay clear and operational under these rules?
5. Does Recipient guidance feel warmer without becoming noisy or “marketing-carded”?
6. Is anything here unnecessarily complicated for V1?

---

## Phase 4 acceptance

| Criterion                                                 | Status                     |
| --------------------------------------------------------- | -------------------------- |
| Surface categories + small radius/shadow/elevation scales | ✅                         |
| Celebration Frame placed as signature exception           | ✅                         |
| Glass allow/deny + per-area behavior                      | ✅                         |
| Interactive + responsive surface rules                    | ✅                         |
| Anti-patterns + decision summary                          | ✅                         |
| No CSS/components/redesign/commits                        | ✅                         |
| Founder Surface Review                                    | ✅ **APPROVED 2026-07-19** |

**Next:** Phase 5 — Component System (authorized — documentation only).  
**Still not authorized:** implementation, styling, refactors, commits, pushes.
