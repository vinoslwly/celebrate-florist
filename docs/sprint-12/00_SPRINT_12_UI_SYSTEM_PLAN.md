# Sprint 12 — UI System Plan

> **Status:** ✅ **CLOSED — Documentation / UI System Baseline** (Founder 2026-07-19)  
> **Phases 1–9:** ✅ **APPROVED AND CLOSED**  
> **Bible:** [CELEBRATE_UI_SYSTEM_BIBLE.md](./CELEBRATE_UI_SYSTEM_BIBLE.md) — **OFFICIAL INDEXED BASELINE**  
> **Implementation:** Planning authorized — [sprint-12-implementation/00_UI_SYSTEM_IMPLEMENTATION_PLAN.md](../sprint-12-implementation/00_UI_SYSTEM_IMPLEMENTATION_PLAN.md) · **coding NOT YET AUTHORIZED**  
> **Bloom pilot / Sprint 13 Motion / Sprint 14 Photobooth:** **NOT STARTED**  
> **Diagnosis:** One Celebrate family, uneven expression  
> **Parent roadmap:** [11_IMPLEMENTATION_ROADMAP_V2.md](../11_IMPLEMENTATION_ROADMAP_V2.md)  
> **Prior architecture:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) (closed)

---

## Sprint 12 North Star

Celebrate UI System exists to ensure that every future screen — whether marketing, Studio, Preview, or Recipient Experience — feels **unmistakably Celebrate** without requiring designers or engineers to invent new visual rules.

When uncertainty appears in later phases, evaluate decisions against this North Star **before** personal preference.

_(Founder approved — DDR-S12-005)_

---

## Executive summary

Sprint 12 defines **how Celebrate looks, feels, and behaves** across the product. It is **not** a zero-based redesign: the **landing page is the visual baseline**, formalized into tokens, surfaces, components, theme rules, and Studio language.

Celebrate has **one shared visual foundation** with uneven surface language and emotional expression (Landing mature; Studio / Preview / Recipient underdeveloped). Sprint 12 extends Landing identity into one product family with intentional density differences. Missing photography and Canva theme art are **Production Pending**, not design debt.

**Nine phases** produced the specification baseline and the **Celebrate UI System Bible** (official indexed map). Sprint 12 documentation is **closed**. Coding of the UI System requires separate Founder authorization via the [implementation plan](../sprint-12-implementation/00_UI_SYSTEM_IMPLEMENTATION_PLAN.md).

---

## Founder decisions (Sprint 12)

| ID            | Decision                                                                                           | Document                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FD-S12-01** | **Keep Sage** — supporting botanical color; must not compete with pink/peach/cream                 | [DDR-S12-001](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-001--sage-palette-role) → Phase 3 Foundations                                                                  |
| **FD-S12-02** | **Do not normalize** hero radius — promote to **Celebration Frame** (or Hero Frame) official token | [DDR-S12-002](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-002--hero--celebration-frame-radius) → Phase 4 Surfaces                                                        |
| **FD-S12-03** | Studio **~35–40%** of Landing emotional intensity; warm/calm/guided, not decorative/marketing-like | [DDR-S12-003](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-003--studio-emotional-intensity) → Phase 7 Studio                                                              |
| **FD-S12-04** | **Gift** is official language; envelope UI = **Refine/Replace Later**; generalized Gift system     | [DDR-S12-004](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-004--gift-product-language-treasures--beyond) → Phase 5 Components                                             |
| **FD-S12-05** | **Celebrate Design Decision Register** — living append-only founder decision log                   | [Register](./CELEBRATE_DESIGN_DECISION_REGISTER.md) · [DDR-S12-009](./CELEBRATE_DESIGN_DECISION_REGISTER.md#ddr-s12-009--celebrate-design-decision-register-living-document) |
| **FD-S12-06** | Roadmap + nine phases + North Star — **approved** 2026-07-19                                       | This document                                                                                                                                                                |

Full register: [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#sprint-12--ui-system-founder-approved)

---

## Working principles

1. **Preserve before replacing** — landing baseline is evidence.
2. **System before screens** — rules before page designs.
3. **Emotion with clarity** — Celebrate must remain usable.
4. **One product family, different contexts** — density may differ; identity must not.
5. **Themes are worlds, not accent strips** — artwork is separate (Design Studio).
6. **Studio is a creative workspace** — ~35–40% landing intensity (FD-S12-03).
7. **Extend shadcn** — do not restart component architecture for novelty.
8. **Avoid over-engineering** — tokens must map to real screens.
9. **Evidence + founder decisions** over taste.
10. **North Star** resolves ambiguity.

---

## Sprint objective

Build one coherent, reusable, responsive, emotionally appropriate **UI system** that preserves landing identity and extends it to Studio, Preview, Recipient Experience, shared components, and five theme **structures** — without producing assets, motion, or code in Sprint 12 planning.

---

## Scope

### In scope

- Phases 1–9 planning deliverables
- Celebrate Design Decision Register (living)
- UI System Bible structure (consolidation after Phase 9)
- Canva MCP as **export path for slot artwork** (motifs, photos) when authorized — not for pasting full UI screens as Recipient scenes (see DDR-S12-033: image → living composition)

### Out of scope

- Final photography, theme artwork, Canva production, motion (S13), photobooth feature (S14)
- Implementation, CSS changes, refactors, commits (unless explicitly authorized)
- Experience Architecture / workflow / schema changes
- Dark mode rollout, logo redesign

---

## Nine-phase roadmap

| Phase  | Name                                       | Status                     | Deliverable                                                                                                  | Founder gate                 |
| ------ | ------------------------------------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| **1**  | Current Visual Audit / Baseline            | ✅ **Complete**            | [01_BASELINE_AND_SCOPE_CLARIFICATION.md](./01_BASELINE_AND_SCOPE_CLARIFICATION.md)                           | Done                         |
| **2A** | Current Visual Baseline & Preservation Map | ✅ **APPROVED**            | [02A_CURRENT_VISUAL_BASELINE_AND_PRESERVATION_MAP.md](./02A_CURRENT_VISUAL_BASELINE_AND_PRESERVATION_MAP.md) | Done                         |
| **2B** | Visual DNA                                 | ✅ **APPROVED**            | [02B_CELEBRATE_VISUAL_DNA.md](./02B_CELEBRATE_VISUAL_DNA.md)                                                 | Done                         |
| **3**  | Design Foundations                         | ✅ **APPROVED AND CLOSED** | [03_CELEBRATE_DESIGN_FOUNDATIONS.md](./03_CELEBRATE_DESIGN_FOUNDATIONS.md)                                   | Done                         |
| **4**  | Surface Language                           | ✅ **APPROVED AND CLOSED** | [04_CELEBRATE_SURFACE_LANGUAGE.md](./04_CELEBRATE_SURFACE_LANGUAGE.md)                                       | Done                         |
| **5**  | Component System                           | ✅ **APPROVED AND CLOSED** | [05_CELEBRATE_COMPONENT_SYSTEM_SPECIFICATION.md](./05_CELEBRATE_COMPONENT_SYSTEM_SPECIFICATION.md)           | Done                         |
| **6**  | Theme System                               | ✅ **APPROVED AND CLOSED** | [06_CELEBRATE_THEME_SYSTEM_SPECIFICATION.md](./06_CELEBRATE_THEME_SYSTEM_SPECIFICATION.md)                   | Done                         |
| **7**  | Studio Experience                          | ✅ **APPROVED AND CLOSED** | [07_CELEBRATE_STUDIO_DESIGN_LANGUAGE_AND_UX_RULES.md](./07_CELEBRATE_STUDIO_DESIGN_LANGUAGE_AND_UX_RULES.md) | Done                         |
| **8**  | Cross-Experience Consistency               | ✅ **APPROVED AND CLOSED** | [08_CROSS_EXPERIENCE_CONSISTENCY_MATRIX.md](./08_CROSS_EXPERIENCE_CONSISTENCY_MATRIX.md)                     | Done                         |
| **9**  | Design QA & Closure                        | ✅ **APPROVED AND CLOSED** | [09_SPRINT_12_DESIGN_QA_AND_CLOSURE.md](./09_SPRINT_12_DESIGN_QA_AND_CLOSURE.md)                             | Done — Sprint 12 docs closed |

### Phase notes (founder-locked)

**Phase 3 — Foundations:** Document Sage as botanical supporting color (leaves, eucalyptus, subtle surfaces, florist accents). Pink/peach/cream remain emotional primary.

**Phase 4 — Surfaces:** `rounded-[3rem]` / hero framing → official **Celebration Frame** token; not normalized to card radius scale.

**Phase 5 — Components:** Generalized **Gift** component taxonomy (Closed / Opened / Final Gift–Reward / future types). Classify `EnvelopeGrid`, ✉️ icons as **Refine/Replace Later**.

**Phase 7 — Studio:** Emotional intensity **35–40%** of landing. Expression via hierarchy, framing, copy, spacing — not illustration-heavy decoration. Workflow unchanged unless **Founder Decision Required**.

---

## Deliverables matrix

| Deliverable              | Phase   | Founder approve | Implementation relevance     |
| ------------------------ | ------- | --------------- | ---------------------------- |
| Baseline & Scope         | 1       | ✅              | Scope guard                  |
| Visual DNA               | 2       | Yes             | Personality anchor           |
| Design Foundations       | 3       | Yes             | CSS/token source             |
| Surface Language         | 4       | Yes             | Elevation/glass/radius       |
| Component System         | 5       | Yes             | Build order                  |
| Theme System             | 6       | Yes             | Theme CSS architecture       |
| Studio Language          | 7       | Yes             | Studio UI priority           |
| Consistency Matrix       | 8       | Yes             | Gap list                     |
| Design QA Report         | 9       | Yes             | Implementation clearance     |
| Design Decision Register | Ongoing | Per entry       | Prevents reopening decisions |
| UI System Bible          | Post-9  | Yes             | SSOT handoff                 |

---

## Dependencies

```
Phase 1 ✅ → Phase 2 (DNA) → Phase 3 (Foundations) → Phase 4 (Surfaces) → Phase 5 (Components)
                                                      ↘ Phase 6 (Themes, finalize after 4–5)
Phase 2–5 → Phase 7 (Studio) → Phase 8 → Phase 9 → Bible
```

Theme artwork never blocks theme **system** closure.

---

## Decision hierarchy

1. Founder Decisions & [Design Decision Register](./CELEBRATE_DESIGN_DECISION_REGISTER.md)
2. Approved Product Vision
3. Sprint 11 Experience Architecture
4. Repository evidence
5. Sprint 12 quality / North Star
6. Template patterns

---

## Open questions (resolved at planning lock)

| Question               | Resolution                                            |
| ---------------------- | ----------------------------------------------------- |
| Sage keep or remove?   | **Keep** — botanical supporting (FD-S12-01)           |
| Hero radius normalize? | **No** — Celebration Frame token (FD-S12-02)          |
| Studio emotional %?    | **35–40%** landing (FD-S12-03)                        |
| Envelope vs Gift?      | **Gift** official; envelope Replace Later (FD-S12-04) |
| Decision log format?   | **Celebrate Design Decision Register** (FD-S12-05)    |

Remaining open items defer to Phase 2 (Visual DNA) — e.g. exact Celebration Frame token name, Gift component anatomy details.

---

## Risks and mitigations

| Risk                           | Mitigation                                 |
| ------------------------------ | ------------------------------------------ |
| Over-redesign landing          | North Star + preserve list + FD-S12-08     |
| Studio decorative but unusable | FD-S12-03 intensity cap + clarity criteria |
| Theme fragmentation            | Global immutable rules + token model       |
| Token over-engineering         | Real-screen mapping only                   |
| Asset dependency blocking S12  | Production Pending policy                  |
| S12/S13 motion bleed           | Surfaces static; motion deferred           |
| Reopening settled decisions    | Design Decision Register                   |

---

## Sprint completion criteria

Sprint 12 **planning** locked when: roadmap approved ✅, Phase 1 baseline ✅, founder decisions registered ✅.

Sprint 12 **design system** complete when Phase 9 QA passes and founder approves — then separate **implementation clearance**.

---

## UI System Bible (future structure)

| Section                                        | Source phase                      |
| ---------------------------------------------- | --------------------------------- |
| Executive summary + North Star                 | This plan                         |
| Founder decisions                              | Register + `05_FOUNDER_DECISIONS` |
| Preserve/Refine/Reconsider/Debt/Pending        | Phase 1                           |
| Visual DNA                                     | Phase 2                           |
| Typography, color, spacing, layout, responsive | Phase 3                           |
| Surfaces                                       | Phase 4                           |
| Components                                     | Phase 5                           |
| Theme system                                   | Phase 6                           |
| Studio rules                                   | Phase 7                           |
| Cross-experience                               | Phase 8                           |
| Accessibility, anti-patterns, QA               | Phase 9                           |
| **Appendix: Design Decision Register**         | Living doc                        |

**Bible:** [CELEBRATE_UI_SYSTEM_BIBLE.md](./CELEBRATE_UI_SYSTEM_BIBLE.md) — **OFFICIAL INDEXED BASELINE** (consolidation map, not a monolith).

---

## Recommended working order

1. ✅ Phases 1–9 — approved and closed; Sprint 12 documentation **CLOSED**
2. 📋 [Implementation plan](../sprint-12-implementation/00_UI_SYSTEM_IMPLEMENTATION_PLAN.md) — Founder planning review
3. **No** CSS/React/theme coding, commits, or pushes until separate Founder coding authorization
4. **No** Bloom pilot until Core UI System is implemented (Sprint 12.5)

---

## Related documents

| Doc                                                                                                                                | Purpose                        |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| [README.md](./README.md)                                                                                                           | Sprint 12 index                |
| [CELEBRATE_UI_SYSTEM_BIBLE.md](./CELEBRATE_UI_SYSTEM_BIBLE.md)                                                                     | UI System Bible index          |
| [../sprint-12-implementation/00_UI_SYSTEM_IMPLEMENTATION_PLAN.md](../sprint-12-implementation/00_UI_SYSTEM_IMPLEMENTATION_PLAN.md) | Implementation Pass (planning) |
| [01_BASELINE_AND_SCOPE_CLARIFICATION.md](./01_BASELINE_AND_SCOPE_CLARIFICATION.md)                                                 | Phase 1                        |
| [02A_CURRENT_VISUAL_BASELINE_AND_PRESERVATION_MAP.md](./02A_CURRENT_VISUAL_BASELINE_AND_PRESERVATION_MAP.md)                       | Phase 2A                       |
| [02B_CELEBRATE_VISUAL_DNA.md](./02B_CELEBRATE_VISUAL_DNA.md)                                                                       | Phase 2B                       |
| [03_CELEBRATE_DESIGN_FOUNDATIONS.md](./03_CELEBRATE_DESIGN_FOUNDATIONS.md)                                                         | Phase 3                        |
| [04_CELEBRATE_SURFACE_LANGUAGE.md](./04_CELEBRATE_SURFACE_LANGUAGE.md)                                                             | Phase 4                        |
| [05_CELEBRATE_COMPONENT_SYSTEM_SPECIFICATION.md](./05_CELEBRATE_COMPONENT_SYSTEM_SPECIFICATION.md)                                 | Phase 5                        |
| [06_CELEBRATE_THEME_SYSTEM_SPECIFICATION.md](./06_CELEBRATE_THEME_SYSTEM_SPECIFICATION.md)                                         | Phase 6                        |
| [07_CELEBRATE_STUDIO_DESIGN_LANGUAGE_AND_UX_RULES.md](./07_CELEBRATE_STUDIO_DESIGN_LANGUAGE_AND_UX_RULES.md)                       | Phase 7                        |
| [08_CROSS_EXPERIENCE_CONSISTENCY_MATRIX.md](./08_CROSS_EXPERIENCE_CONSISTENCY_MATRIX.md)                                           | Phase 8                        |
| [09_SPRINT_12_DESIGN_QA_AND_CLOSURE.md](./09_SPRINT_12_DESIGN_QA_AND_CLOSURE.md)                                                   | Phase 9                        |
| [CELEBRATE_DESIGN_DECISION_REGISTER.md](./CELEBRATE_DESIGN_DECISION_REGISTER.md)                                                   | Living decisions               |
