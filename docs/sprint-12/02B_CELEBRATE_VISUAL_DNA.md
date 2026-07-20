# Sprint 12 — Phase 2B

# Celebrate Visual DNA

> **Status:** ✅ **APPROVED** by Founder — 2026-07-19 (personality wording revised same day)  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [02A — Preservation Map](./02A_CURRENT_VISUAL_BASELINE_AND_PRESERVATION_MAP.md) (**APPROVED**)  
> **Next:** Phase 3 — Design Foundations (**authorized to prepare / document only** — implementation not authorized)

---

## Purpose

Define the intentional personality, emotional rules, composition principles, and visual boundaries that make a screen feel **unmistakably Celebrate** — without relying only on the logo, pink color, or decorative flowers.

This document **extracts and formalizes** qualities already present on the Landing baseline. It does **not** invent a new identity from zero.

**Out of scope:** hex values, type scales, spacing, radii, shadows, token names, component APIs, Studio page redesign, theme artwork, motion rules, CSS/React, commits.

---

## Grounding

| Source                            | Role                                                                        |
| --------------------------------- | --------------------------------------------------------------------------- |
| Landing (live + repo)             | Primary evidence of mature Celebrate identity                               |
| Phase 2A Preservation Map         | Protected qualities and rules                                               |
| Founder decisions FD-S12-01–06    | Color roles, Celebration Frame, Studio intensity, Gift language, North Star |
| Sprint 11 Experience Architecture | Workflow and scene structure (authoritative; not redesigned here)           |
| Product purpose                   | Physical bouquet + digital emotional experience for Surakarta florist brand |

**Official 2A diagnosis (locked):** Celebrate has **one shared visual foundation**. Inconsistency comes from **uneven surface language and emotional expression** — not from two unrelated design systems.

---

## 1. Brand personality statement

**Celebrate is a warm, thoughtful celebration brand rooted in the florist world, turning a physical bouquet into a personal digital experience — premium without cold luxury, romantic without melodrama, and playful without childishness.**

A Celebrate screen should feel like someone carefully prepared a gift for one person: calm enough to read, soft enough to linger, clear enough to act.

---

## 2. Core emotional traits

| Trait            | Meaning in product                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------ |
| **Warm**         | Cream fields, brown text, pink–peach accents — never clinical white or cool gray-first UI  |
| **Thoughtful**   | Hierarchy and copy suggest care; pacing is unhurried; nothing feels thrown together        |
| **Personal**     | Addresses a recipient or moment, not a crowd of users or a SaaS account                    |
| **Soft-premium** | Elevated through softness, framing, and restraint — not chrome, gloss, or status signaling |

---

## 3. Supporting traits

| Trait           | Role                                                                      |
| --------------- | ------------------------------------------------------------------------- |
| **Gentle**      | Rounded surfaces, soft edges, quiet elevation                             |
| **Guided**      | Clear next step; especially Studio and experience flows                   |
| **Botanical**   | Florist world via Sage support, craft signals, floral motif _when earned_ |
| **Celebratory** | Moments of delight at the right beat — not constant festivity             |
| **Readable**    | Emotion never excuses illegible pink or dense clutter                     |

---

## 4. Rejected identities

Celebrate must **never** become:

| Rejected                                        | Why                                      |
| ----------------------------------------------- | ---------------------------------------- |
| Cold SaaS / admin-default UI                    | Erases gift meaning                      |
| Purple / indigo “AI product” look               | Not Celebrate’s florist world            |
| Harsh black-shadow material UI                  | Breaks soft-premium                      |
| Loud party / confetti carnival                  | Exhausts; conflicts with thoughtful tone |
| Dark luxury / black-gold nightclub              | Wrong emotional register for V1          |
| Newspaper / broadsheet starkness                | Wrong shape language                     |
| Childish sticker chaos                          | Undermines premium personal gift         |
| Generic template landing with Inter + blue CTAs | Interchangeable; fails North Star        |
| Illustration-heavy marketing inside Studio      | Damages operational clarity (FD-S12-03)  |

---

## 5. Intensity bands

Use these as **relative dials**, not scores to optimize.

| Band         | Low           | Mid                        | High (ceiling)                             |
| ------------ | ------------- | -------------------------- | ------------------------------------------ |
| **Warmth**   | Neutral paper | Soft cream + brown         | Cream + pink–peach atmosphere (Landing)    |
| **Premium**  | Plain utility | Soft elevation, calm type  | Signature framing + craft (hero moments)   |
| **Romantic** | Friendly      | Personal gift tone         | Intimate recipient beats — never melodrama |
| **Playful**  | Neutral       | Light sparkle / theme chip | Rare delight beats — never carnival        |
| **Youthful** | Adult calm    | Fresh, modern florist      | Avoid teen-social or meme energy           |

**Rule:** Raise intensity for **moment**, not for **chrome**. If adding decoration doesn’t clarify the beat, omit it.

---

## 6. Editorial vs illustrative balance

| Mode                       | Where                                               | Guidance                                                                        |
| -------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Editorial-first**        | Most UI: Studio, forms, lists, checklists, approval | Type, spacing, hierarchy, framing carry emotion                                 |
| **Illustration-supported** | Landing craft, theme world cues, Gift moments       | Illustration / photo _supports_ the story; never replaces clarity               |
| **Asset-dependent**        | Hero photo, bouquet shots, theme art                | **Production Pending** — placeholders remain valid until Design Studio delivers |

**Do not** fill emotional gaps with random decorative florals. Prefer structure first; art second.

---

## 7. Controlled softness

Softness is a **discipline**, not a blur filter.

| Allow                                                      | Avoid                                                  |
| ---------------------------------------------------------- | ------------------------------------------------------ |
| Soft pink-tinted shadows where Landing already proves them | Multi-layer glow stacks                                |
| Selective glass (nav / rare hero moments)                  | Glass on every panel                                   |
| Gentle radii as the default shape language                 | Sharp broadsheet everywhere _or_ blob-everything       |
| Warm cream fields                                          | Cold white or gray app chrome as the emotional default |

Softness must still pass accessibility (`pink-ink` for pink text; clear contrast for actions).

---

## 8. Composition and focal-point philosophy

One primary focus per viewport or major beat.

| Principle             | Practice                                                                                                                             |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero moments**      | Brand + one message + one CTA group + one dominant frame (Landing hero pattern)                                                      |
| **Celebration Frame** | A **signature framing principle** reserved for major celebratory moments — not ordinary cards (meaning only; radius/token → Phase 4) |
| **No hero clutter**   | No floating promo chips, stat strips, or sticker overlays on the primary visual                                                      |
| **Experience beats**  | One emotional job per scene/step (aligns with Sprint 11 scene intent)                                                                |
| **Studio**            | Focal point = current task and status; decoration must not compete with the form                                                     |

---

## 9. Whitespace philosophy

| Context                 | Whitespace role                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| **Landing**             | Generous — premium calm; section breathing room is part of identity                                    |
| **Recipient / Preview** | Comfortable — room to feel the gift; not marketing-section padding copied wholesale                    |
| **Studio**              | Efficient but not cramped — clarity over spectacle; whitespace guides the eye to the next field/action |

Whitespace is emotional when it creates **rest**; wasteful when it creates **distance from the task**.

---

## 10. Decoration limits

Decoration is earned by the beat.

| Allowed (sparingly)                              | Not allowed as identity crutches           |
| ------------------------------------------------ | ------------------------------------------ |
| Theme chip / short atmospheric label             | Emoji grids as the product metaphor        |
| Craft illustration where Landing already uses it | Constant sparkles, confetti, sticker piles |
| Soft botanical support (Sage role — see §13)     | Pink + flowers = “done” branding           |
| Selective glass / soft shadow                    | Glow, neon, heavy drop shadows             |

**If removing decoration still feels like Celebrate, the structure is healthy. If removing it collapses identity, identity was fake.**

---

## 11. Emotional intensity by surface

Relative to Landing = **100%** emotional intensity (marketing inspiration).

| Surface                  | Target intensity       | Job                         | Expression via                                                                 |
| ------------------------ | ---------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| **Landing**              | **100%**               | Inspire; prove the brand    | Full protected Landing language                                                |
| **Recipient Experience** | **70–85%**             | Deliver emotion of the gift | Hierarchy, framing, Gift states, theme atmosphere — not Landing section clones |
| **Buyer Preview**        | **55–70%**             | Trust + approval clarity    | Same family as recipient, slightly more evaluative/clear                       |
| **Studio**               | **35–40%** (FD-S12-03) | Prepare the celebration     | Warmth, guided hierarchy, calm premium — **not** decorative/marketing-like     |

**One product family ≠ identical density.** Studio must stay operationally clear; Sprint 11 workflow unchanged without a separate Founder Decision.

---

## 12. Global theme constants

These remain true across **all five themes** (Bloom, Sky, Pure, Warm, Play):

- Warm foundation (cream field + brown readable text)
- Soft-premium shape language
- Personal, thoughtful tone
- Accessible pink text discipline when pink is used for words
- Selective, controlled softness
- Gift language (not envelope-as-identity)
- Reduced-motion respect
- North Star: unmistakably Celebrate without inventing new rules

Themes change **atmosphere**, not **product identity**.

---

## 13. Theme-variable qualities

Themes may vary:

- Accent mood and atmospheric tint
- Motif personality (within florist / celebration world)
- Lightness of playfulness vs romance
- Supporting botanical presence (including **Sage** as a botanical supporting quality that reinforces the florist world **without competing** with pink, peach, and cream)

Themes must **not** vary:

- Core personality (warm, thoughtful, personal, soft-premium)
- Rejected identities
- Studio intensity band
- Gift emotional state meanings
- Workflow / Sprint 11 architecture

**Sage:** meaning only here. Shades, contrast pairs, detailed usage → Phase 3 Foundations.  
**Theme artwork:** Production Pending; system rules → Phase 6.

---

## 14. Gift emotional states

**Gift** is official product language. Envelope emoji UI is **Refine / Replace Later** — not protected identity.

Phase 2B defines **emotion and concept only** (no anatomy, icons, layout, colors, radius, animation, or implementation):

| State                         | Emotional job                                              |
| ----------------------------- | ---------------------------------------------------------- |
| **Closed**                    | Anticipation — something personal is waiting               |
| **Opened**                    | Discovery — a memory or message is revealed                |
| **Final Gift / Reward State** | Culmination — the experience resolves with care and weight |

Avoid naming that implies premature color decisions (e.g. “Final Gold”). Visual/token design → later phases (Components / Surfaces).

Future gift presentations (bouquet, voucher, ticket, QR, photo, memory object, etc.) share these emotional states; presentation may differ.

---

## 15. Anti-patterns

| Anti-pattern                                                 | Failure mode                     |
| ------------------------------------------------------------ | -------------------------------- |
| Logo + pink = “branded enough”                               | Fails recognition test           |
| Cloning Landing decoration into Studio                       | Exhaustion; harms ops clarity    |
| Treating Preview/Recipient as admin tables with serif titles | Underdeveloped surface language  |
| Envelope emoji as the Gift system                            | Conflicts with FD-S12-04         |
| Scoring missing photos as design debt                        | Misroutes effort                 |
| Inventing a second palette for “app UI”                      | Breaks one foundation            |
| Over-tokenizing before DNA/Foundations lock                  | Over-engineering                 |
| Finalizing look from docs alone                              | Violates before–after protection |
| Raising romantic/playful dials everywhere                    | Noise; loses thoughtful core     |

---

## 16. Celebrate recognition test

A screen passes Visual DNA when **all** are true:

1. **Blind test:** With logo removed, it still feels like the same florist gift brand as Landing — not a generic dashboard or another startup.
2. **Warmth test:** Field and type feel warm and personal, not clinical.
3. **Soft-premium test:** Elevation and shape feel gentle; no harsh SaaS chrome.
4. **Focus test:** One clear emotional or task focus; no sticker clutter.
5. **Surface-fit test:** Intensity matches §11 (Studio calm; Recipient more emotional; Landing fullest).
6. **Gift test (when applicable):** Interaction reads as Gift states (Closed / Opened / Final Gift), not envelope emoji identity.
7. **Restraint test:** Removing optional decoration does not erase Celebrate-ness.

Fail any → revise surface language in the owning phase; do not invent a new brand.

---

## Conceptual anchors (non-technical)

### Celebration Frame

A **signature framing principle** reserved for major celebratory moments (e.g. Landing hero-class compositions). Ordinary cards and Studio panels must not casually inherit it.  
**Not in this phase:** final radius value, token name implementation → Phase 4 Surface Language.

### Sage

A **botanical supporting quality** that reinforces the florist world without competing with pink, peach, and cream.  
**Not in this phase:** shades, contrast pairs, detailed usage → Phase 3 Design Foundations.

---

## Founder review outcome

| #   | Topic                                              | Outcome                                                                       |
| --- | -------------------------------------------------- | ----------------------------------------------------------------------------- |
| 1   | Personality statement                              | ✅ Approved with wording revision (celebration brand rooted in florist world) |
| 2   | Recipient 70–85% / Preview 55–70% / Studio 35–40%  | ✅ Approved (relative guide — not literal formulas)                           |
| 3   | Gift states: Closed / Opened / Final Gift / Reward | ✅ Approved (concept only)                                                    |
| 4   | Editorial-first default                            | ✅ Approved                                                                   |
| 5   | Recognition test as future QA input                | ✅ Approved (Phases 8–9; practical checklist only)                            |

---

## Phase 2B acceptance

| Criterion                                             | Status                     |
| ----------------------------------------------------- | -------------------------- |
| Personality, traits, rejected identities defined      | ✅                         |
| Intensity bands + surface model defined               | ✅                         |
| Composition, whitespace, decoration, softness defined | ✅                         |
| Theme constants vs variables defined                  | ✅                         |
| Gift emotional states (concept only) defined          | ✅                         |
| Anti-patterns + recognition test defined              | ✅                         |
| No hex / tokens / components / motion / code          | ✅                         |
| Founder Visual DNA review                             | ✅ **APPROVED 2026-07-19** |

**Next:** Phase 3 — Design Foundations (**documentation / specification only**).  
**Still not authorized:** CSS implementation, component changes, page redesigns, commits, or pushes.
