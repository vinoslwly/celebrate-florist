# Sprint 12 — Phase 6

# Celebrate Theme System Specification

> **Status:** ✅ **APPROVED AND CLOSED** by Founder — 2026-07-19 (two clarifications applied)  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [05 — Component System](./05_CELEBRATE_COMPONENT_SYSTEM_SPECIFICATION.md) (**APPROVED AND CLOSED**)  
> **Next:** Phase 7 — Studio Experience (**authorized**)  
> **Implementation:** **NOT AUTHORIZED**

---

## 1. Purpose and boundaries

Define the **smallest structural theme system** so Bloom, Warm, Sky, Pure, and Play feel like **distinct Celebrate worlds** — not five separate products, and not dependent on final artwork to close.

**Builds on:** Visual DNA · Foundations (incl. theme-equivalent atmosphere flexibility) · Surfaces · Components · `types/theme.ts` · five config files · Production Pending policy.

**Out of scope:** code/CSS changes · Canva/artwork · per-theme component forks · full Studio theming · motion · Photobooth redesign · commits.

---

## 2. Current theme baseline

| Theme     | Feeling / flower (config) | Current accent      | Risk                                                         |
| --------- | ------------------------- | ------------------- | ------------------------------------------------------------ |
| **Bloom** | Romantic · Cherry Blossom | `bg-pink-300`       | Closest to Landing; must not be the only polished world      |
| **Warm**  | Close Friendship · Rose   | `bg-red-400`        | Too harsh as dominant — move toward peach/rose/golden warmth |
| **Sky**   | Achievement · Hydrangea   | `bg-sky-300`        | Easy drift into cold blue SaaS                               |
| **Pure**  | Calm · Lily               | `bg-neutral-100`    | Near-invisible on warm white                                 |
| **Play**  | Fun · Daisy               | `bg-amber-400` + 🧸 | Cheerful OK; must not become childish/emoji-led              |

**Structural gap:** Theme type is mostly metadata + single `accentClassName` + optional preview image paths. LetterView uses accent as a thin top bar. Landing uses placeholders when preview images missing. This interim thinness is **expected**, not an engineering failure (DDR-S12-007).

Themes are **content/mood**, not features (`types/theme.ts`).

---

## 3. Immutable global rules

These **do not change** between themes:

| Immutable                  | Meaning                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Core UI typography         | Fraunces / Poppins / Fira Code for body, long-form, nav, buttons, forms, labels, helpers, metadata, errors, Studio ops, tables, utility — **stable across themes** |
| Component anatomy          | Shared families (Button, forms, Letter, Gift states, etc.)                                                                                                         |
| Spacing / density logic    | Landing generous · Studio denser · etc.                                                                                                                            |
| Layout hierarchy           | Focal point, editorial-first                                                                                                                                       |
| Accessibility              | Contrast, focus, `pink-ink` for pink text, status clarity                                                                                                          |
| Responsive behavior        | Default breakpoints; hierarchy preserved                                                                                                                           |
| Gift emotional states      | Closed / Opened / Final Gift–Reward                                                                                                                                |
| Controlled softness        | Selective glass; no glow stacks                                                                                                                                    |
| Surface categories         | Page / panel / chrome / control / signature / utility                                                                                                              |
| Studio operational rules   | Flat, clear, ~35–40% Landing emotion; no glass routine                                                                                                             |
| Celebrate Recognition Test | Identity without logo/pink alone                                                                                                                                   |
| Sprint 11 journeys         | Scene graphs and workflows unchanged                                                                                                                               |
| Default foundation         | Warm white + brown remain **defaults**; theme equivalents must stay readable and in-family (Foundations clarification)                                             |

**Forbidden:** per-theme component forks · workflow forks · replacing the global UI type system with five unrelated font stacks.

**Theme expressive typography (Founder-approved):** Core UI typography remains global and stable across all themes. Each theme may **optionally** introduce **one** expressive display font for limited emotional or ceremonial moments, subject to readability, loading cost, fallback behavior, and visual validation.

| May use optional expressive font                                                                                                                                | Must stay on global trio                                                                                        |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Recipient greeting; short ceremonial heading; brief emotional quote; Gift reveal title; completion/climax line; theme display moment; short decorative headline | Body, long-form, nav, buttons, forms, labels, helpers, metadata, errors, Studio operational UI, tables, utility |

**Restrictions:** max one expressive font per theme · not for long body · not throughout Studio · readable on mobile · fallback preferably Fraunces (or another global role) · optional not mandatory · final selection + licensing/loading reviewed before implementation · no multiple decorative fonts in one theme · no final font files in Phase 6. Conceptual mood only: Bloom romantic/floral · Warm intimate · Sky airy · Pure restrained · Play cheerful/crafted.

---

## 4. Theme-variable properties

Controlled variation only:

| Variable                         | Intent                                                            |
| -------------------------------- | ----------------------------------------------------------------- |
| Atmospheric page background      | Soft tint of the page field (theme-equivalent, not a new product) |
| Soft surface tint                | Card/panel wash                                                   |
| Primary accent                   | Emotional accent (bar, chip, selected)                            |
| Supporting accent                | Secondary warmth/coolth beside primary                            |
| Border tint                      | Soft edge family                                                  |
| Selective gradient               | Rare hero/Gift framing — not every panel                          |
| Motif slot                       | Optional decorative motif (asset or empty)                        |
| Illustration slot                | Theme illustration (asset or placeholder)                         |
| Photo treatment                  | Soft crop/frame mood — not filters that harm photos               |
| Decorative intensity             | Low → medium by theme personality                                 |
| Ceremonial surface (optional)    | Rare Recipient climax framing                                     |
| Optional expressive display font | Limited ceremonial moments only (§3)                              |

**Not theme-variable for V1:** global UI typography roles · Studio shell chrome · form anatomy · Gift state meanings · button role taxonomy.

---

## 5. Minimum V1 theme token model

Expand beyond a single `accentClassName` **only** where V1 has real use. Spec slots (documentation) — not CSS yet.

| Slot                       | Purpose                                             | Where used                                                                                     | Req.?                                          | Fallback                                                       | Artwork?       |
| -------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------- | -------------- |
| **accent**                 | Primary mood color                                  | Swatches, Letter accent bar, chips, selected tiles                                             | **Required**                                   | Bloom-like soft pink family if missing                         | No             |
| **accentText**             | Theme-harmonious readable ink for accented contexts | Chips, badges, accent labels, selected states, theme headers, accent bars, selected Gift/tiles | **Required** when accented UI shows text/icons | One primary theme ink (not auto-brown); see harmony rule below | No             |
| **expressiveDisplayFont**  | Optional ceremonial display face                    | Limited Recipient/Gift moments only                                                            | Optional                                       | Fraunces (or global role)                                      | No             |
| **surfaceTint**            | Soft panel wash                                     | Recipient panels, preview content cards                                                        | Optional                                       | Transparent / default card white                               | No             |
| **pageAtmosphere**         | Page field tint                                     | Recipient / Preview page                                                                       | Optional                                       | Default warm white                                             | No             |
| **borderTint**             | Soft borders                                        | Experience cards                                                                               | Optional                                       | Global `border` / pink-soft family                             | No             |
| **gradient**               | Selective celebratory wash                          | Rare Gift/hero-adjacent                                                                        | Optional                                       | Solid accent                                                   | No             |
| **motifSlot**              | Decorative motif region                             | Header / Gift optional                                                                         | Optional                                       | Empty (no motif)                                               | **Pending**    |
| **illustrationSlot**       | Theme illustration                                  | Landing theme cards, experience moments                                                        | Optional                                       | `PlaceholderMedia` / PhotoSlot                                 | **Pending**    |
| **photoTreatment**         | Frame/softness guidance                             | Gallery / Gift photo                                                                           | Optional                                       | Neutral soft frame (R2–R3)                                     | Pending frames |
| **decorativeIntensity**    | Enum: `low` \| `medium`                             | Guides how much motif/gradient                                                                 | Optional                                       | `low`                                                          | No             |
| **greetingPreviewImage**   | Already on Theme type                               | Landing theme preview                                                                          | Optional                                       | Placeholder                                                    | **Pending**    |
| **photoboothPreviewImage** | Already on Theme type                               | Landing                                                                                        | Optional                                       | Placeholder                                                    | **Pending**    |

**accentText harmony (Founder-approved):** Each theme’s `accentText` must be selected intentionally using **both readability and color harmony**. It should belong to the same theme family while remaining distinct from the accent or surface beneath it. Global brown remains default **body/UI** foreground — it must **not** automatically become every theme’s accent text.

| Step | Action                                                    |
| ---- | --------------------------------------------------------- |
| 1–2  | Identify accent + undertone/emotion                       |
| 3    | Choose one primary readable theme ink that harmonizes     |
| 4    | Verify contrast on real surfaces                          |
| 5    | Apply consistently in accented contexts                   |
| 6    | Use global foreground only when still visually harmonious |

Conceptual relationships (not final hex): Bloom → deep rose/berry · Warm → deep terracotta/warm rose · Sky → muted deep blue/blue-gray · Pure → deep stone/muted olive · Play → deep coral/burnt amber. Prefer **one** primary `accentText` per theme — no BloomInk1/2/3 sprawl. Final values need contrast **and** harmony tests in real components before implementation.

**Not V1 tokens:** full per-theme UI type scales, shadow sets, radius sets, Studio sidebar colors, five complete UI kits.

**Metadata retained:** `id`, `name`, `feeling`, `flower`. Emoji may remain for **Studio scanning only** — not Recipient Gift identity (Gift Replace Later for emoji envelopes).

---

## 6. Fallback and Production Pending behavior

Final illustrations, motifs, frames, Canva packs, photos, preview art = **Production Pending** — not design debt.  
**Note:** “Canva packs” here means **slot artwork** (motifs, gifts, photos). Recipient scenes are **not** pasted Canva pages — presentation uses the locked **Founder image → living composition** workflow ([DDR-S12-033](./CELEBRATE_DESIGN_DECISION_REGISTER.md)).

| Missing asset        | Fallback                                                                          |
| -------------------- | --------------------------------------------------------------------------------- |
| Preview images       | Existing `PlaceholderMedia` / PhotoSlot                                           |
| Motif / illustration | Empty slot or soft atmospheric shape using accent/surfaceTint — no fake final art |
| Frames               | Shared soft radius frame                                                          |
| Canva packs          | System closes without them                                                        |

**Phase 6 can close** when slots + rules + world boundaries are clear. Artwork never blocks theme **system** closure (DDR-S12-007).

**Future validation (not started):** Bloom will become the first full theme validation pilot **after Sprint 12 Phase 9 is approved and closed** (Post–Sprint 12 Bloom Theme Validation Pilot / Sprint 12.5). It will validate four modes, optional Bloom expressive font, Bloom accent/accentText harmony, Canva slots, mobile/desktop, readability, cross-mode consistency, and reusability of this Theme System. Do **not** create a Theme Lab, implement Bloom, pause Sprint 12, or move this pilot into Sprint 13 Motion now.

---

## 7. Theme world definitions

### Bloom

Romantic botanical; soft pink and floral warmth; **closest to Landing baseline**. Must set the quality bar — **must not** be the only fully designed theme. Others inherit the same slot model.

### Warm

Intimate, comforting; peach / rose / golden warmth. **Must not** use harsh red as the dominant expression (current `bg-red-400` is interim — retarget in implementation toward soft rose/peach, not alarm red).

### Sky

Airy, hopeful, light. Soft sky/mist with **warmth preserved** (cream undertone or soft peach neighbor). **Must not** become cold blue SaaS (no corporate `#2563eb` UI).

### Pure

Restrained, elegant, quiet. Visibility via structure: refined borders, subtle surface separation, gentle non-white atmosphere (ivory/soft stone), restrained botanical or neutral accent — **not** empty gray-on-cream. **Must not** disappear on warm-white.

### Play

Cheerful, energetic, crafted. Soft amber/coral playfulness with clear hierarchy. **Must not** become childish, carnival, confetti-led, or emoji-dependent as the identity system.

Keep definitions short; artwork briefs stay at slot + mood only.

---

## 8. Theme behavior by product area

| Area          | Theme expression                                                                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landing**   | Remains **one** visual baseline. Theme picker shows swatches + placeholders — **do not** ship five full Landing redesigns unless product later requires it.                             |
| **Recipient** | **Strongest** expression: pageAtmosphere, surfaceTint, accent, optional motif/illustration, Gift framing, photo treatment, decorativeIntensity. Journey structure + readability stable. |
| **Preview**   | Closely mirrors Recipient content theming; evaluative chrome stays calmer/flatter.                                                                                                      |
| **Studio**    | **Limited:** theme badge, small accent samples, preview panel, swatches in create/edit. **Do not** theme sidebar, tables, or whole workspace.                                           |
| **Utility**   | Minimal — gates/login stay foundation-first.                                                                                                                                            |

---

## 9. Pure theme visibility rule

Pure must read as **intentional restraint**, not “missing theme.”

Use **combinations**, not gray spam:

1. Slight atmospheric shift off pure warm-white (ivory / soft mist).
2. Refined borders with higher separation than Bloom’s pink-soft haze.
3. Surface tint barely cooler or clearer than page — still soft.
4. Accent that is visible but quiet (soft sage-adjacent or soft stone — **Sage remains botanical support**, not Pure’s only trick).
5. Typography and whitespace carry elegance (editorial-first).
6. Optional thin ceremonial line (like Letter accent bar) with sufficient contrast.

Exact shades = later validation; direction is structure + subtle atmosphere. Current `bg-neutral-100` alone is **insufficient**.

---

## 10. Accessibility and responsive rules

- Theme accents used as **text** need `accentText` or brown — never pale accent as body.
- Atmospheric backgrounds must keep brown/muted text readable (Foundations pairings).
- Selected/focus states remain clear across all five worlds.
- Status colors (error/success) stay global — themes do not recolor destructive.
- Responsive: theme tokens scale with surfaces; do not add theme-specific breakpoints.
- Motifs must not reduce tap-target clarity on Gift/interaction tiles.

---

## 11. Anti-patterns

- Five separate component systems
- Replacing global UI typography with five unrelated type systems (optional ceremonial display font is allowed per §3)

- Per-theme workflow changes
- Hard-coded generic Tailwind accents as the **final** system (`bg-red-400`, bare `sky-300`, invisible `neutral-100`)
- Sky → blue SaaS
- Warm → harsh red dominant
- Pure → invisible
- Play → childish / emoji identity
- Bloom → only polished theme
- Artwork required to close the system
- Theme forks of Button/Letter/Gift
- Huge speculative token schemas
- Theming the full Studio workspace

---

## 12. Decision summary

| Decision              | Choice                                                                                                 | Later owner                  |
| --------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------- |
| Immutable vs variable | §3 / §4 split                                                                                          | All phases                   |
| V1 slots              | accent, accentText, optional atmosphere/tint/border/gradient/slots/intensity + existing preview images | Impl / types later           |
| Fallbacks             | Placeholders + empty motif; no art dependency                                                          | Design Studio / Prod Pending |
| Worlds                | Bloom baseline · Warm soft · Sky warm-airy · Pure structured quiet · Play crafted cheer                | Impl + art                   |
| Application           | Recipient strongest · Studio minimal · Landing single baseline                                         | Phase 7/8                    |
| Pure                  | Structure + subtle atmosphere                                                                          | Impl validation              |
| Current accents       | Interim; Warm/Sky/Pure need retargeting guidance above                                                 | Impl                         |

---

## 13. Founder review questions (max 6)

1. Do these five themes still feel like **one Celebrate family** with different atmospheres?
2. Is the token model small enough for V1 (not an enterprise schema)?
3. Does Sky’s guidance clearly avoid cold blue SaaS?
4. Does Pure’s visibility approach feel intentional rather than “empty”?
5. Does Play’s boundary clearly avoid childish/carnival energy?
6. Is Studio theme expression limited enough (badge/preview only)?

---

## Answers to Phase 6 required questions (index)

1. **Immutable** → §3
2. **Variable** → §4
3. **V1 slots** → §5
4. **Atmosphere vs foundation** → defaults stay; optional `pageAtmosphere` / tints in-family
5. **By area** → §8
6. **Placeholders** → §6
7. **Pure visible** → §9
8. **Sky not SaaS** → §7 Sky
9. **Play not childish** → §7 Play
10. **Warm not harsh red** → §7 Warm
11. **Bloom not only complete** → same slot model for all; Bloom sets quality bar only

---

## Phase 6 acceptance

| Criterion                          | Status                                                                           |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| Immutable / variable split         | ✅                                                                               |
| Minimal V1 token model + fallbacks | ✅                                                                               |
| Five world boundaries + Pure rule  | ✅                                                                               |
| Application by product area        | ✅                                                                               |
| Anti-patterns + Founder questions  | ✅                                                                               |
| No code / art / Studio full theme  | ✅                                                                               |
| Founder Theme Review               | ✅ **APPROVED 2026-07-19** (expressive font + accentText harmony clarifications) |

**Next:** Phase 7 — Studio Design Language and UX Rules (authorized — documentation only).  
**Still not authorized:** implementation, styling, theme config edits, commits, pushes.
