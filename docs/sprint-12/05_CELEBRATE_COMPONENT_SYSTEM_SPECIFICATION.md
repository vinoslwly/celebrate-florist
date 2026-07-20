# Sprint 12 — Phase 5

# Celebrate Component System Specification

> **Status:** ✅ **APPROVED AND CLOSED** by Founder — 2026-07-19  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [04 — Surface Language](./04_CELEBRATE_SURFACE_LANGUAGE.md) (**APPROVED AND CLOSED**)  
> **Next:** Phase 6 — Theme System (**authorized**)  
> **Implementation:** **NOT AUTHORIZED**

---

## 1. Purpose and boundaries

Define the **smallest reusable set of components** that carries Celebrate identity across Landing, Studio, Preview, and Recipient — by extending shadcn and existing shared pieces, not by inventing a parallel library or redesigning pages.

**Builds on:** repo inventory · Visual DNA · Foundations · Surface Language · Sprint 11 architecture · real V1 usage.

**Out of scope:** React/CSS changes · new libraries · page redesigns · Studio UX rewrite (Phase 7) · theme token sets (Phase 6) · Photobooth feature redesign (Sprint 14) · motion · artwork · commits.

---

## 2. Component design principles

1. **Preserve before replacing** — keep what already works on Landing.
2. **Extend shadcn** — wrap/style; do not fork primitives without need.
3. **One family, contextual density** — same primitives; Studio flatter/denser.
4. **Editorial before decoration** — hierarchy over ornament.
5. **Real use only** — no speculative components.
6. **Gift language** — generalized Gift family; emoji envelopes = Replace Later.
7. **Sprint 11 owns journeys** — components serve scenes; they do not redefine workflows.
8. **V1 proportional** — prefer composition of few families over many one-offs.

---

## 3. Existing component inventory (meaningful)

| Area             | Current pieces (repo)                                                                                                                                                                                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **UI (shadcn)**  | `Button`, `Sheet`, `Accordion`                                                                                                                                                                                                                                                                        |
| **Shared**       | `SectionHeading`, `ScrollReveal`, `PhotoSlot`, `PlaceholderMedia`                                                                                                                                                                                                                                     |
| **Landing**      | `HeroSection`, `SiteNavbar`, `MobileNav`, `SiteFooter`, section cards, `FinalCtaSection`, `BouquetIllustration`, `BackToTopButton`                                                                                                                                                                    |
| **Studio**       | `StudioShell`, `LoginForm`, `OrdersTable`, `OrdersListFilters`, `OrderEditorForm`, `CreateOrderForm`, `OrderActionBar`, `DashboardActionQueue`, `MemoryCodePanel`, `PublishChecklist`, `PhotosUploadPanel` / `PhotosShell`, mode builders (quiz/match/treasures), raw `<input>`/`<textarea>` patterns |
| **Experience**   | Mode flows, `LetterView`, `PhotoGallery`, `MemoryCodeGate`, `RecipientModeUnavailable`                                                                                                                                                                                                                |
| **Quiz / Match** | `QuizPlayer`, score/result blocks, `PhotoChoice`, `StoryCard`, game/builder panels                                                                                                                                                                                                                    |
| **Treasures**    | `EnvelopeGrid`, envelope editors/content, buyer preview treasures                                                                                                                                                                                                                                     |
| **Preview**      | `BuyerPreviewShell` + mode preview panels                                                                                                                                                                                                                                                             |
| **Photobooth**   | `Photobooth` feature component                                                                                                                                                                                                                                                                        |

---

## 4. Classification matrix

Classes: **Preserve** · **Extend** · **Refine** · **Replace Later** · **Out of Scope**

### Shared / UI

| Component          | Class        | shadcn stance                    | Notes                                               |
| ------------------ | ------------ | -------------------------------- | --------------------------------------------------- |
| Button (+ `brand`) | **Extend**   | Celebrate styling on shadcn      | Keep variants; clarify when `brand` is allowed (§7) |
| Sheet              | **Preserve** | shadcn as-is + surface restraint | Overlays; light blur OK per Phase 4                 |
| Accordion          | **Preserve** | shadcn                           | FAQ                                                 |
| SectionHeading     | **Preserve** | Shared local                     | Landing section rhythm                              |
| ScrollReveal       | **Preserve** | Shared local                     | Landing motion helper; respect reduced-motion       |
| PhotoSlot          | **Extend**   | Shared local                     | Asset slot; themes/Studio/Recipient                 |
| PlaceholderMedia   | **Preserve** | Shared local                     | Production Pending slots                            |

### Landing

| Component / pattern                         | Class            | Notes                              |
| ------------------------------------------- | ---------------- | ---------------------------------- |
| Hero + Celebration Frame composition        | **Preserve**     | Do not flatten; Frame is signature |
| Marketing cards (collections, why-us, etc.) | **Preserve**     | R4 + soft shadow identity          |
| SiteNavbar / MobileNav                      | **Preserve**     | Glass chrome allowed               |
| SiteFooter                                  | **Preserve**     | Simple                             |
| Final CTA / brand CTA pattern               | **Preserve**     | Brand button moments               |
| BouquetIllustration                         | **Preserve**     | Craft until photos land            |
| BackToTopButton                             | **Preserve**     | Soft-pink CTA shadow OK            |
| Landing page sections as wholes             | **Out of Scope** | Compositions, not new primitives   |

### Studio

| Component / pattern                        | Class             | Notes                                        |
| ------------------------------------------ | ----------------- | -------------------------------------------- |
| StudioShell                                | **Refine**        | Warm + flat; Phase 7 owns UX polish          |
| LoginForm                                  | **Refine**        | Move toward shared form primitives           |
| OrdersTable / filters / dashboard queue    | **Refine**        | Functional; surface language E0–E1           |
| OrderEditorForm + action bar + checklist   | **Refine**        | Form-heavy; shared fields (§6)               |
| Mode builder panels (quiz/match/treasures) | **Extend**        | Feature composition on shared forms/tiles    |
| Raw inputs (inline classes)                | **Replace Later** | Consolidate into shared Input/Textarea/Field |
| ExperienceModeBadge                        | **Preserve**      | Small status chip                            |

### Recipient / Preview

| Component / pattern                        | Class             | Notes                                                                                                                    |
| ------------------------------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Mode experience flows / shells             | **Refine**        | Structure sound; surface/type underdeveloped                                                                             |
| LetterView                                 | **Refine**        | Keep letter hierarchy; align surfaces to Phase 4 (less accidental glass); Fraunces for intimate passages per Foundations |
| PhotoGallery                               | **Refine**        | Shared media family                                                                                                      |
| MemoryCodeGate / unavailable               | **Refine**        | Utility clarity                                                                                                          |
| QuizPlayer + score/result                  | **Extend**        | Interaction + result family                                                                                              |
| Match PhotoChoice / StoryCard / game panel | **Extend**        | Interaction tile family                                                                                                  |
| EnvelopeGrid + emoji presentation          | **Replace Later** | → Gift family (§10)                                                                                                      |
| Envelope editors (Studio)                  | **Refine**        | Keep workflow; rename/present as Gift later                                                                              |
| BuyerPreviewShell + approval chrome        | **Refine**        | Evaluative, calmer than Recipient                                                                                        |
| Mode-specific buyer preview panels         | **Extend**        | Compose shared blocks                                                                                                    |

### Photobooth

| Component  | Class                               | Notes                                                                                                                                                                                                               |
| ---------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Photobooth | **Out of Scope** (feature redesign) | Sprint 14 owns redesign. Phase 5: shell may host it; use shared Button/surfaces only. **Compatibility:** treat as feature island inside experience/Studio photo flows — no new Celebrate photobooth primitives now. |

---

## 5. Core primitives

| Primitive           | Purpose                 | Required  | Optional           | Surface        | Map                          |
| ------------------- | ----------------------- | --------- | ------------------ | -------------- | ---------------------------- |
| **Button**          | Actions                 | Label     | Icon, loading      | Control        | `components/ui/button`       |
| **Panel**           | Grouped content         | Container | Title, actions     | Panel R3–R4    | Pattern, not always a file   |
| **Chip / Badge**    | Status/mode             | Text      |                    | Control pill   | Mode badge, filters          |
| **MediaSlot**       | Photo/illustration hole | Frame     | Label, placeholder | Inset          | PhotoSlot + PlaceholderMedia |
| **Overlay (Sheet)** | Temporary layer         | Content   | Title, close       | Chrome/utility | shadcn Sheet                 |

Do not invent IconButton, Card, Modal families beyond these unless reuse appears twice+ in V1.

---

## 6. Shared form system

**Problem:** Studio (and some gates) use repeated raw inputs — inconsistent and hard to theme.

**Minimal set (V1):**

| Piece                    | Purpose                          | Anatomy                         | States                              |
| ------------------------ | -------------------------------- | ------------------------------- | ----------------------------------- |
| **Label**                | Field name                       | Text; optional required marker  | —                                   |
| **Input**                | Single-line                      | Control R1, border-input        | Rest, hover, focus, disabled, error |
| **Textarea**             | Multi-line                       | Same                            | Same                                |
| **Select**               | Choice lists                     | Same                            | Same (+ open)                       |
| **Helper text**          | Guidance                         | Supporting body / XS muted      | —                                   |
| **Validation message**   | Error/success copy               | Destructive or calm success     | Error, success                      |
| **Field group**          | Label + control + helper/error   | `space-y-2`                     | —                                   |
| **Form section**         | Card of related fields           | Panel R3, section heading       | —                                   |
| **Repeated field group** | Envelope/Gift editors, quiz rows | Section + add/remove            | —                                   |
| **Checkbox / Switch**    | Only if already needed           | Prefer existing patterns        | —                                   |
| **Save / readiness**     | Busy + checklist feedback        | Button loading + checklist list | Loading, ready, blocked             |

**Hierarchy:** Section title (Fraunces/page) → Field labels (Poppins sm) → Control → Helper → Validation.

**Studio vs Recipient:** Studio denser, flat panels, functional buttons. Recipient/gates: fewer fields, more whitespace, utility card. Same primitives; different density (Foundations §8).

**Accessibility:** Labels associated; errors tied to controls; focus rings visible; do not use decorative pink as field text.

**Not a form framework** — no schema engine, no generic CRUD kit.

---

## 7. Action / button system

Existing `Button` variants (repo): `default`, `brand`, `outline`, `secondary`, `ghost`, `destructive`, `link`.

| Role                    | Variant       | When                                                           |
| ----------------------- | ------------- | -------------------------------------------------------------- |
| **Primary brand**       | `brand`       | Emotional CTAs: Landing Order/Watch, rare celebratory confirms |
| **Standard functional** | `default`     | Primary Studio/Recipient task actions                          |
| **Secondary**           | `secondary`   | Alternate fills                                                |
| **Outline**             | `outline`     | Secondary Landing/Studio actions                               |
| **Ghost**               | `ghost`       | Low emphasis (Sign out adjacent, tertiary)                     |
| **Destructive**         | `destructive` | Irreversible/dangerous                                         |
| **Text / link**         | `link`        | Inline navigation                                              |

### Brand gradient appropriateness

| Surface   | Brand CTA                                                                                                                              |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Landing   | **Primary** emotional actions                                                                                                          |
| Recipient | Rare climax actions only — not every tap                                                                                               |
| Preview   | Prefer functional `default` for Approve; brand optional if Founder wants warmth — **Requires visual validation before implementation** |
| Studio    | **Avoid** for routine Save/Publish/filters; use `default` / `outline`                                                                  |
| Utility   | Login submit = functional, not brand gradient                                                                                          |

Sizes: keep current `sm` / `default` / `lg`; Landing CTAs often `lg`.

---

## 8. Content and media components

| Family                    | Purpose                    | Elements                                    | Map                              |
| ------------------------- | -------------------------- | ------------------------------------------- | -------------------------------- |
| **Section heading block** | Eyebrow + title + subtitle | Mono eyebrow, Fraunces title                | `SectionHeading`                 |
| **Letter block**          | Emotional reading          | Greeting, body, closing, optional theme cue | `LetterView` — Refine            |
| **Gallery block**         | Photo set                  | Grid/slots, captions optional               | `PhotoGallery`                   |
| **Media slot**            | Single image hole          | Frame, placeholder, optional label          | `PhotoSlot` / `PlaceholderMedia` |
| **Craft illustration**    | Florist signal             | BouquetIllustration                         | Preserve until assets            |

Letter: Poppins default for long body; Fraunces for titles / short ceremonial lines (Foundations clarification). Current `LetterView` already uses serif for body — **Refine** toward rule with visual validation.

---

## 9. Recipient / Preview component families

Shared families (contextual variants — **not** one system per mode):

| Family                         | Purpose                                               | Modes                           |
| ------------------------------ | ----------------------------------------------------- | ------------------------------- |
| **Experience header**          | Name, theme chip, short context                       | All                             |
| **Letter block**               | Core letter                                           | Moments + rewards               |
| **Gallery block**              | Photos                                                | Moments / shared                |
| **Interaction tile**           | Tap targets (quiz options, match choices, gift cells) | Connection, Memories, Treasures |
| **Progress / score block**     | Feedback after play                                   | Connection, Memories            |
| **Completion / final state**   | Journey resolution                                    | All                             |
| **Gate / unavailable / error** | Access + failure                                      | Memory Code, mode unavailable   |
| **Preview chrome**             | Approve, notices                                      | Buyer preview only              |

Sprint 11 scenes compose these; Phase 5 does not redesign scene graphs.

Preview = same content families + calmer evaluative chrome (flat R2–R3 panels).

---

## 10. Gift component direction

**Official language: Gift.** Envelope emoji UI (`EnvelopeGrid` 📬/✉️) = **Replace Later**.

### Gift family (conceptual)

| State                   | Emotional job | Surface / a11y                                        |
| ----------------------- | ------------- | ----------------------------------------------------- |
| **Closed**              | Anticipation  | Interaction tile; clear name; not emoji-dependent     |
| **Opened**              | Discovery     | Distinct fill/border/label; `aria` reflects opened    |
| **Final Gift / Reward** | Culmination   | Distinct weight; not color-named “gold” in this phase |

**Anatomy (spec only):** container · optional motif slot (asset later) · title/index · state label · optional preview snippet when opened · focusable control.

**Content hierarchy:** State → identity (Gift N / title) → affordance (Open / View).

**Responsive:** 2-col mobile / 3-col desktop grids OK (current pattern); keep touch targets.

**Do not specify:** final icons, illustrations, animation, production art, code APIs.

Studio envelope editors remain workflow-valid; presentation/copy migrate toward Gift when implementing later.

---

## 11. Studio component rules

| Rule         | Detail                                                       |
| ------------ | ------------------------------------------------------------ |
| Shell        | Sidebar + main; flat chrome; no glass                        |
| Sections     | Form sections as R3 panels                                   |
| Actions      | Functional buttons; brand rare/never for routine             |
| Tables/lists | Divided rows or R2 shells; readable density                  |
| Mode panels  | Feature composition on shared forms + media slots            |
| Intensity    | 35–40% Landing emotion via hierarchy/spacing, not decoration |
| Workflow     | Order-centric editor unchanged (Sprint 11 / Studio UX docs)  |

Phase 7 will deepen Studio design language; Phase 5 only constrains components.

---

## 12. Component states

Use only when product needs them:

| State                 | Typical components           |
| --------------------- | ---------------------------- |
| Rest / Hover / Focus  | Controls, tiles, buttons     |
| Active / selected     | Mode tiles, photo picks, nav |
| Disabled / Loading    | Buttons, Gift open, approve  |
| Empty                 | Tables, galleries, slots     |
| Error / Success·ready | Forms, checklist, validation |
| Opened                | Gift only                    |

Do not force every component through every state.

---

## 13. Responsive and accessibility rules

- Stack form grids on small screens; labels above fields.
- Primary actions touch-friendly (full-width where Landing already does).
- Interaction tiles: minimum comfortable tap size.
- Focus visible on all interactive components.
- `pink-ink` for pink text; decorative pink never as body.
- Reduced-motion: ScrollReveal / Landing motion already patterns — keep.
- Gift/tiles: accessible names without relying on emoji alone.

---

## 14. Anti-patterns

- Replacing shadcn without need
- Dozens of speculative components
- Landing R4 cards copied into Studio
- Brand gradient on every Studio action
- Emoji envelopes as final Gift system
- Per-theme component forks
- Decoration hiding weak hierarchy
- Componentizing whole pages
- Over-abstract APIs / pseudocode specs
- Photobooth redesign in Sprint 12
- Changing Sprint 11 workflows via component docs

---

## 15. Decision summary

| Decision                 | Choice                                             | Later owner    |
| ------------------------ | -------------------------------------------------- | -------------- |
| shadcn                   | Extend Button/Sheet/Accordion                      | Impl           |
| Shared forms             | Minimal field set; replace raw inputs              | Impl / Phase 7 |
| Brand button             | Emotional moments; not Studio default              | Impl           |
| Letter / gallery / media | Refine existing                                    | Impl / Phase 8 |
| Gift family              | Closed / Opened / Final Gift; replace EnvelopeGrid | Phase 5→impl   |
| Studio shell/editor      | Refine; flat surfaces                              | Phase 7        |
| Photobooth               | Out of scope feature redesign                      | Sprint 14      |
| Landing hero/nav/cards   | Preserve                                           | —              |

---

## 16. Founder review questions (max 6)

1. Does this component system preserve what already works on the Landing?
2. Is anything being replaced that you would rather keep longer (besides emoji envelopes)?
3. Does Studio stay clear and practical under these rules?
4. Do Recipient/Preview families feel more Celebrate without becoming decorative?
5. Does the Gift direction (Closed / Opened / Final Gift) feel broader and more appropriate than envelopes?
6. Is the component scope still small enough for V1?

---

## Phase 5 acceptance

| Criterion                                           | Status                     |
| --------------------------------------------------- | -------------------------- |
| Inventory + five-class matrix                       | ✅                         |
| shadcn extend rule + form + button systems          | ✅                         |
| Experience families + Gift direction                | ✅                         |
| Studio rules + anti-patterns                        | ✅                         |
| No code / no page redesign / no Photobooth redesign | ✅                         |
| Founder Component Review                            | ✅ **APPROVED 2026-07-19** |

**Next:** Phase 6 — Theme System (authorized — documentation only).  
**Still not authorized:** implementation, styling, refactors, commits, pushes.
