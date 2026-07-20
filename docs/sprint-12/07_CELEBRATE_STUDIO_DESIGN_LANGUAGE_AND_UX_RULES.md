# Sprint 12 — Phase 7

# Celebrate Studio Design Language and UX Rules

> **Status:** ✅ **APPROVED AND CLOSED** by Founder — 2026-07-19 (editor grouping revision applied)  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [06 — Theme System](./06_CELEBRATE_THEME_SYSTEM_SPECIFICATION.md) (**APPROVED AND CLOSED**)  
> **Related IA:** [12_STUDIO_UX.md](../12_STUDIO_UX.md) (order-centric workflow — authoritative)  
> **Next:** Phase 8 — Cross-Experience Consistency (**authorized**)  
> **Implementation:** **NOT AUTHORIZED**

---

## 1. Studio purpose and perception shift

**Today:** Studio works as an order-centric admin tool, but visually reads as a generic CMS.

**Target perception:**

> A warm, calm, guided creative workspace for preparing celebrations — still operationally clear.

| Should feel                                               | Must not feel                                                                                       |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| Warm, calm, guided, prepared, creative, reassuring, clear | Generic CMS, cold dashboard, Landing clone, scrapbook, fully themed Recipient, decorative form maze |

**Warmth sources (primary):** hierarchy · grouping · spacing · section framing · thoughtful microcopy · preview context · readiness feedback · sparse accents.  
**Not:** glass everywhere · brand gradients on every button · florals on every form · marketing whitespace · full theme skins.

**Emotional intensity:** ~**35–40% of Landing** (FD-S12-03 / Visual DNA). Density may be medium–high while remaining warm (Foundations).

---

## 2. What must remain operationally protected

Any change to the following is **`FOUNDER DECISION REQUIRED`** — do not silently redesign:

| Protected                                                   | Source                    |
| ----------------------------------------------------------- | ------------------------- |
| Order-centric IA (Dashboard + Orders only)                  | `12_STUDIO_UX.md`         |
| Unified Order Editor as primary workspace                   | Studio UX                 |
| Mode + parties + theme on create; core + mode panel on edit | Studio UX                 |
| Preview → approve / skip → publish → deliver flow           | Studio UX                 |
| Sprint 11 experience architecture & mode rules              | Sprint 11 docs            |
| Data requirements, schema, business logic                   | Product / DB              |
| Form completeness & publish readiness logic                 | Existing Studio           |
| Table readability & task completion (incl. mobile)          | Foundations + live Studio |

Phase 7 changes **presentation and guidance**, not product behavior.

---

## 3. Emotional intensity (35–40%)

| Dial           | Studio target                                               |
| -------------- | ----------------------------------------------------------- |
| Warmth         | Soft cream field + brown text; sparse pink accents          |
| Premium        | Calm section framing (R3 flat), not soft-lg marketing cards |
| Romance / play | Near-zero in shell; only inside Recipient preview content   |
| Decoration     | Minimal — badges, theme swatch, checklist clarity           |

If a visual choice does not help the florist finish an order faster or with fewer mistakes, omit it.

---

## 4. Studio shell visual language

| Element          | Rule                                                    |
| ---------------- | ------------------------------------------------------- |
| Page field       | Warm white / foundation default                         |
| Sidebar + header | Solid chrome, hairline borders, **no glass**            |
| Nav              | Two items; active = soft pink pill (current pattern OK) |
| Main panels      | R3, `border-border`, **flat** (E0–E1)                   |
| Controls         | R1; functional button hierarchy (Phase 5)               |
| Brand gradient   | **Not** for Save/Publish/filters                        |
| Type             | Fraunces page titles; Poppins UI; Fira rare             |

Shell stays foundation-first. Theme skins of the whole workspace are forbidden (Phase 6).

---

## 5. Navigation and page hierarchy

Preserve routes:

`/studio` → Dashboard · `/studio/orders` → list · `/studio/orders/new` · `/studio/orders/[id]` editor · `/studio/login`

| Page         | Hierarchy job                                                          |
| ------------ | ---------------------------------------------------------------------- |
| Dashboard    | “What needs action today?” — queues first                              |
| Orders list  | Find + filter + open                                                   |
| Create       | One form; clear primary submit                                         |
| Order editor | Recipient context → Core → Mode → Photos → Codes → Readiness → Actions |
| Login        | Utility card; calm                                                     |

Page title (Fraunces) + one-line purpose always visible. Sign out remains low-emphasis (ghost/link).

---

## 6. Order editor grouping

Recommended section order (presentation grouping — **not** a new workflow; Founder-approved Mode before Photos):

1. **Order identity** — code, parties, selected mode, selected theme, status
2. **Core letter** — greeting, main message, closing
3. **Mode experience** — Quiz, Match, Moments, or Gift/Treasures-specific content
4. **Memory photos** — uploads, slots, captions, and mode-relevant media
5. **Access** — Memory Code and access-related settings
6. **Readiness** — pre-publish checklist and blockers
7. **Workflow actions** — Preview, publish, deliver, and rare overrides

**Why Mode before Photos:** First understand what kind of experience is being prepared, then add the photos that support that experience. Presentation/grouping only — does not change routes, workflow stages, schemas, data requirements, business logic, publish behavior, or Sprint 11 architecture.

**Mode–photo relationship:** The Mode section establishes experience context before Photos. The Photos section may adapt helper copy, labels, or grouping to the selected mode without changing its underlying data contract. Conceptual only: Moments → sequence support · Connection → quiz/connection support where applicable · Memories → Match/StoryCard support · Gift/Treasures → Gift or final reward presentation. Do not redesign mode logic, introduce dynamic schemas, or hide required photo fields.

Each section = Form section panel (Phase 5) with a clear heading and short helper line. Mode-specific content stays **inside** the mode panel — do not scatter mode fields across the shell.

---

## 7. Form section hierarchy

Inside a section:

1. Section title (+ optional one-line why)
2. Field groups (`space-y-2` fields, denser Studio spacing)
3. Repeated groups (add/remove) when needed
4. Section-level validation summary if useful

Use shared form primitives (Phase 5). Labels above fields. Helpers muted. Errors tied to controls — clear, not harsh (soft destructive tint, plain language).

---

## 8. Progressive disclosure rules

| Always visible                          | Disclose when needed                                       |
| --------------------------------------- | ---------------------------------------------------------- |
| Order identity, status, primary actions | Advanced/rare overrides (e.g. skip preview) behind confirm |
| Core letter + mode panel essentials     | Long template pickers after “Start from template”          |
| Checklist items that block publish      | Historical/debug detail                                    |
| Current theme badge + swatch            | Full theme catalog only at create/change-theme             |

Do **not** hide required fields for visual cleanliness. Disclosure reduces noise, not completeness.

Complex multi-step wizards that replace the unified editor = **FOUNDER DECISION REQUIRED** (anti-pattern without evidence).

---

## 9. Preview placement and relationship

Preview is the **emotional mirror** of the edit — not a separate product.

| Rule         | Detail                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------------------------------------ |
| Relationship | Edit prepares → Preview evaluates (buyer) → Revise or Publish                                                      |
| In editor    | Clear “Send / Open Preview” near readiness, not buried                                                             |
| Visual       | Preview content may show theme atmosphere + optional expressive font; **Studio chrome around it stays foundation** |
| Tone         | Microcopy: “See what they will receive” — reassuring, not marketing hype                                           |

Do not embed a full Recipient clone inside every scroll position; one intentional preview entry point is enough for V1.

---

## 10–11. Progress, readiness, save, validation, publish

| Pattern               | Rule                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| **Progress**          | Lightweight: checklist + status badges — not a gamified stepper          |
| **Readiness**         | Publish checklist lists blockers in plain language                       |
| **Save**              | Functional `default` button; loading state; no brand gradient            |
| **Validation**        | Inline field errors + optional section summary; calm destructive styling |
| **Publish / deliver** | High-clarity functional primary; confirm when irreversible               |
| **Success**           | Short confirmation; return focus to next useful action                   |

Oversized progress systems and enterprise “metrics dashboards” without florist value = rejected.

---

## 12. Empty, loading, error, success

| State   | Studio treatment                                      |
| ------- | ----------------------------------------------------- |
| Empty   | Clear next step (“Create first order”) — utility tone |
| Loading | Disable double-submit; quiet busy on buttons/lists    |
| Error   | Specific, fixable, non-alarmist                       |
| Success | Brief; no confetti                                    |

---

## 13. Theme-preview behavior inside Studio

**Allowed:** theme badge · swatch · selected-theme sample · small preview panel · opening Recipient/buyer preview · optional expressive font **only inside preview content**.

**Denied:** Bloom/Warm/Sky/Pure/Play as full workspace skins · themed sidebars/tables/forms · glass themed panels.

Theme picker remains inline (create/editor) — not a top-level nav item (`12_STUDIO_UX.md`).

---

## 14. Mobile Studio principles

| Principle   | Detail                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------- |
| Task first  | Complete create/edit/publish without desktop-only traps                                         |
| Stack forms | Labels above; full-width primary actions                                                        |
| Shell       | Sidebar may collapse — **Requires visual validation before implementation** for any new pattern |
| Tables      | Horizontal scroll or stacked row cards — readability over decoration                            |
| Touch       | Comfortable targets; no hover-only critical actions                                             |
| Intensity   | Even calmer; never add Landing-scale whitespace                                                 |

---

## 15. Studio microcopy tone

Warm, direct, guide-like — Indonesian/English as product already mixes.

| Prefer                                             | Avoid                                       |
| -------------------------------------------------- | ------------------------------------------- |
| “Siap dikirim ke penerima” / “Lengkapi surat dulu” | “Error 422 payload invalid” as only message |
| “Pratinjau untuk pembeli”                          | Hype (“Magical journey unlocked!!”)         |
| Short section helpers                              | Long marketing paragraphs in the editor     |

Tone = thoughtful florist assistant, not SaaS onboarding bot.

---

## 16. Anti-patterns

- Rewriting Sprint 11 / Studio UX workflow
- New mandatory product steps without Founder Decision
- Studio-as-Landing or Studio-as-Recipient
- Full theme skins · glass form panels · gradient buttons everywhere
- Excessive decorative cards · hiding required controls
- Enterprise metrics without value · oversized progress/wizards
- Schema/data changes via UX docs
- Implementation disguised as specification

---

## 17. Decision summary

| Decision        | Choice                                                             | Later owner     |
| --------------- | ------------------------------------------------------------------ | --------------- |
| Perception      | Creative workspace @ 35–40% intensity                              | Impl / polish   |
| Workflow        | Unchanged; FOUNDER DECISION REQUIRED to alter                      | Founder         |
| Shell           | Flat, warm, no glass                                               | Surfaces + Impl |
| Editor groups   | Identity → Core → **Mode** → Photos → Access → Readiness → Actions | Impl            |
| Disclosure      | Hide rare/advanced only                                            | Impl            |
| Preview         | Connected entry; themed content only inside preview                | Impl            |
| Actions         | Functional hierarchy; brand rare                                   | Phase 5         |
| Theme in Studio | Badge/swatch/preview only                                          | Phase 6         |
| Mobile          | Task completion first                                              | Impl validation |

---

## Answers to required Studio UX questions

1. **Creative without decorative?** Hierarchy, grouping, microcopy, preview context — not florals/glass.
2. **Where in preparation?** Status badges + readiness checklist + clear section order.
3. **Long forms?** Grouped Form sections (§6–7); Mode before Photos.
4. **Visible vs disclosed?** Required always visible; rare overrides disclosed (§8).
5. **Preview vs editing?** Mirror relationship; intentional entry near readiness (§9).
6. **Save/readiness/publish?** Functional buttons + checklist + calm validation (§10–11).
7. **Mode distinct?** Mode panel content only; shell stable.
8. **Mobile?** Stack, touch, task-first (§14).
9. **Errors?** Clear, fixable, soft-destructive — not harsh.
10. **One family?** Same foundation/tokens/components; lower intensity than Landing/Recipient.

---

## 18. Founder review questions (max 6)

1. Does this direction make Studio feel more like a **creative workspace** without losing the tool you use daily?
2. Does it stay **easy and practical** for finishing orders?
3. Is anything still **too decorative** for how you work?
4. Is the **form grouping** (identity → letter → mode → photos → readiness → actions) understandable?
5. Does **Preview** feel connected enough to editing?
6. Is this scope still appropriate for **V1**?

---

## Phase 7 acceptance

| Criterion                                            | Status                                                   |
| ---------------------------------------------------- | -------------------------------------------------------- |
| Perception shift + 35–40% intensity                  | ✅                                                       |
| Protected ops + FOUNDER DECISION REQUIRED gate       | ✅                                                       |
| Shell, hierarchy, forms, disclosure, preview, states | ✅                                                       |
| Theme limits + mobile + microcopy + anti-patterns    | ✅                                                       |
| No code / no workflow rewrite                        | ✅                                                       |
| Founder Studio Review                                | ✅ **APPROVED 2026-07-19** (Mode before Photos grouping) |

**Next:** Phase 8 — Cross-Experience Consistency (authorized — documentation only).  
**Still not authorized:** implementation, styling, route/schema changes, commits, pushes.
