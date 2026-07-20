# Sprint 12 — Phase 8

# Cross-Experience Consistency Matrix

> **Status:** ✅ **APPROVED AND CLOSED** by Founder — 2026-07-19  
> **Date:** 2026-07-19  
> **Parent:** [00_SPRINT_12_UI_SYSTEM_PLAN.md](./00_SPRINT_12_UI_SYSTEM_PLAN.md)  
> **Prior:** [07 — Studio Design Language](./07_CELEBRATE_STUDIO_DESIGN_LANGUAGE_AND_UX_RULES.md) (**APPROVED AND CLOSED**)  
> **Evidence:** Phases 2A–7 + Phase 2A live Playwright inspect (Landing, Studio, Preview, Recipient)  
> **Next:** Phase 9 — Design QA & Closure (**authorized**)  
> **Implementation:** **NOT AUTHORIZED**

---

## Purpose

Verify that Landing, Studio, Preview, Recipient, Theme System, Gift direction, and utility surfaces feel like **one Celebrate product family** while preserving intentional differences in density, emotion, and function.

This phase **evaluates and documents** — it does not redesign pages or implement code.

**Status labels:** Aligned · Partially Aligned · Gap · Intentional Difference · Production Pending

---

## Overall consistency verdict

Celebrate already shares **one visual foundation** (warm cream, brown text, Fraunces/Poppins/Fira Code). Landing carries the mature surface language. Studio, Preview, and Recipient remain structurally sound but **visually underdeveloped** relative to DNA/Foundations/Surfaces/Components specs.

**Verdict:** One family with uneven expression — mostly **Partially Aligned**, with clear **Gaps** (forms, Gift emoji, thin themes, Recipient/Studio surface polish) and many **Intentional Differences** that must not be “fixed” into sameness.

---

## 1. Consistency matrix (by surface)

| Surface                  | Shared Celebrate Signals                                                                                         | Intentional Differences                   | Current Gap                                                                                | Later Owner                          | Status                                                      |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------- |
| **Landing**              | Warm field, brown text, Fraunces/Poppins, soft shadows, glass nav, brand CTA, Celebration Frame, generous rhythm | Highest emotion (100%); marketing framing | Missing final photos/art                                                                   | Design Studio                        | **Aligned** (+ **Production Pending** assets)               |
| **Studio login**         | Warm field, brown text, Fraunces title                                                                           | Utility density; no soft-shadow/brand     | Thin Celebrate surface language                                                            | Impl after Phase 7/9                 | **Partially Aligned**                                       |
| **Studio dashboard**     | Warm field, Fraunces headings, pink nav pill                                                                     | Flat, operational, denser (35–40%)        | Little soft language; reads admin                                                          | Impl / Phase 7 rules                 | **Partially Aligned**                                       |
| **Orders list**          | Same foundation                                                                                                  | Table density; functional chrome          | Generic table feel vs family                                                               | Impl                                 | **Partially Aligned**                                       |
| **Order Editor**         | Same foundation; sectioned long form                                                                             | Mode→Photos grouping (Phase 7); flat R3   | Raw inputs; form-heavy; envelope copy in Treasures                                         | Shared forms + Gift rename (Phase 5) | **Gap** (forms/Gift language) + **Partially Aligned** shell |
| **Buyer Preview**        | Warm field, Fraunces, structure                                                                                  | Calmer evaluative chrome; Approve         | Thin emotion; “Secret envelopes” copy                                                      | Impl / Phase 5–6                     | **Partially Aligned**                                       |
| **Recipient Experience** | Theme chip, Fraunces titles, journey structure                                                                   | Strongest theme _intent_; sequential      | Generic cards; emoji Gift grid; LetterView serif body vs Foundations rule needs validation | Impl / Phase 5–6                     | **Gap** (Gift + surface expression)                         |
| **Gift states**          | Closed/Opened/Final Gift direction approved                                                                      | N/A — product language                    | EnvelopeGrid 📬/✉️ still live                                                              | Phase 5 Replace Later → Impl         | **Gap**                                                     |
| **Theme expression**     | Five worlds + slot model approved                                                                                | Recipient strongest; Studio minimal       | Still mostly `accentClassName`; Warm/Sky/Pure interim accents risky                        | Phase 6 → Impl + Bloom pilot post-P9 | **Partially Aligned**                                       |
| **Utility states**       | Warm foundation                                                                                                  | Clarity-first, minimal décor              | Generally OK                                                                               | —                                    | **Aligned** / **Intentional Difference**                    |
| **Photobooth shell**     | Can use Button/surfaces                                                                                          | Feature island                            | Feature redesign out of Sprint 12                                                          | Sprint 14                            | **Intentional Difference** (compatible, not redesigned)     |

---

## 2. Consistency by dimension

| Dimension               | Finding                                                                                                        | Status                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Personality**         | Landing = Celebrate; others share warmth but under-express soft-premium                                        | Partially Aligned                                  |
| **Typography**          | Global trio present; LetterView uses serif for body (needs validation vs Poppins-default + selective Fraunces) | Partially Aligned                                  |
| **Color foundation**    | Shared cream/brown; no second Studio palette                                                                   | Aligned foundation / Gap theme accents             |
| **Surface language**    | Landing matches Phase 4; Studio flat (intentional) but Recipient under-soft                                    | Partially Aligned                                  |
| **Components**          | shadcn + shared pieces; forms not unified                                                                      | Gap (raw inputs)                                   |
| **Emotional intensity** | Landing ≫ Recipient intent ≫ Preview ≫ Studio — model correct; execution uneven                                | Intentional Difference (targets) + Gap (execution) |
| **Density**             | Landing low · Studio high — correct                                                                            | Intentional Difference                             |
| **Theme expression**    | Spec OK; impl thin; Studio correctly limited                                                                   | Partially Aligned                                  |
| **Interaction states**  | Buttons OK; Gift open states emoji-led                                                                         | Gap (Gift)                                         |
| **Responsive**          | Landing patterns OK; Studio mobile shell unvalidated                                                           | Partially Aligned                                  |
| **Accessibility**       | pink-ink rule exists; formal WCAG re-verify deferred                                                           | Partially Aligned                                  |
| **Microcopy tone**      | Landing thoughtful; Studio/Preview more utilitarian                                                            | Partially Aligned                                  |
| **Gift language**       | Spec = Gift; UI = Envelope                                                                                     | Gap                                                |
| **Production Pending**  | Placeholders intentional                                                                                       | Production Pending (not debt)                      |

---

## 3. Intentional differences (preserve — not defects)

| Surface   | Keep                                                                        |
| --------- | --------------------------------------------------------------------------- |
| Landing   | 100% intensity, generous space, soft-lg, selective glass, Celebration Frame |
| Recipient | Intimate, sequential, strongest theme _when implemented_                    |
| Preview   | Near Recipient + calmer approve chrome                                      |
| Studio    | Denser, flat, 35–40%, badge/swatch/preview only                             |
| Utility   | Simple, clarity-first                                                       |

One family ≠ identical appearance.

---

## 4. Real gaps (actionable)

| Gap                                                | Why it matters                                       | Protected                   | Owner                                                   | Visual validation?        |
| -------------------------------------------------- | ---------------------------------------------------- | --------------------------- | ------------------------------------------------------- | ------------------------- |
| Raw Studio inputs vs shared form system            | Inconsistent controls; hard to theme                 | Workflow/data               | Impl (Phase 5 forms)                                    | Yes after unify           |
| EnvelopeGrid emoji vs Gift family                  | Conflicts with FD-S12-04 / Phase 5                   | Gift states meaning; API    | Impl Replace Later                                      | Yes                       |
| Recipient/Preview thin surfaces                    | Fails recognition vs Landing                         | Sprint 11 journeys          | Impl Surfaces/Components                                | Yes                       |
| Theme = accent bar only                            | Worlds not atmospheres yet                           | Five theme IDs; slot model  | Impl Phase 6 tokens                                     | Yes (Bloom pilot post-P9) |
| Warm `red-400` / Pure `neutral-100` / Sky bare sky | Harmony & visibility risks                           | Theme boundaries            | Impl retarget accents                                   | Yes                       |
| LetterView long serif body                         | May conflict with Foundations emotional-reading rule | Letter hierarchy            | Impl Refine                                             | Yes vs current Recipient  |
| Studio mobile shell undefined                      | Task completion risk                                 | Order-centric IA            | Impl; validate                                          | **Required**              |
| Soft-shadow / pink-ink rare outside Landing        | Uneven family signal                                 | Studio flatness intentional | Selective Recipient/Preview lift — not Studio wallpaper | Yes                       |
| WCAG claims not re-measured                        | Readability brand quality                            | pink-ink established        | Phase 9 QA                                              | Measure                   |

---

## 5. Production Pending (not gaps / not debt)

Hero photography · bouquet photos · theme preview/Canva art · motifs · illustrations · frames · photobooth visual production · empty `public/` slots.

Placeholders (`PhotoSlot` / `PlaceholderMedia`) remain correct until Design Studio delivers.

---

## 6. Gift and Theme consistency

| Topic                         | Spec                      | Live                               | Status                |
| ----------------------------- | ------------------------- | ---------------------------------- | --------------------- |
| Gift Closed/Opened/Final Gift | Approved                  | Emoji envelopes + “Your envelopes” | **Gap**               |
| Theme atmospheres             | Slot model approved       | Thin accent                        | **Partially Aligned** |
| Studio theme limits           | Badge/swatch/preview      | Mostly badges — OK direction       | **Aligned** (limits)  |
| Expressive theme font         | Optional; ceremonial only | Not implemented                    | Spec only             |
| accentText harmony            | Contrast + harmony        | Not implemented                    | Spec only             |

---

## 7. Preview bridge assessment

Preview correctly sits **between** Studio (create) and Recipient (receive): same content structures, Approve chrome, calmer than full Recipient emotion.

**Bridge works structurally.** Emotionally/thematically it still under-expresses Celebrate (same gaps as Recipient + envelope copy). Do not force Preview = Landing marketing.

---

## 8. Photobooth compatibility

Photobooth remains a **feature island** (Sprint 14 redesign). Phase 5/8: compatible if it consumes shared Button/surfaces/slots — **not** redesigned here. Status: **Intentional Difference** / Out of Scope for Sprint 12 UI System closure.

---

## 9. Bloom pilot — Phase 8 checklist (future only)

After Phase 9 closes, Bloom pilot (Sprint 12.5) should validate:

- [ ] Four modes feel like one Bloom world
- [ ] Optional expressive font stays controlled
- [ ] Accent + accentText harmonious and readable
- [ ] Preview ↔ Recipient alignment
- [ ] Mobile + desktop readability
- [ ] Canva assets use approved slots

**Do not start** Theme Lab or Bloom implementation in Phase 8.

---

## 10. Answers to required questions

1. **Celebrate without logo/pink only?** Landing yes; others partially — need surface/Gift/theme execution.
2. **Differences intentional?** Yes for density/intensity/theme limits; no for emoji Gift / raw forms.
3. **Studio calmer but related?** Yes directionally; still too generic in expression.
4. **Preview bridges?** Structurally yes; visually thin.
5. **Same component/surface family across modes?** Mostly shared flows; presentation uneven.
6. **Gift language consistent?** Spec yes; UI no.
7. **Themes as atmospheres?** Spec yes; impl not yet.
8. **Pending ≠ debt?** Yes, consistently in Sprint 12 docs.
9. **Unexplained generic shadcn?** Raw inputs + flat experience cards — documented as Gaps.
10. **Photobooth compatible?** Yes as shell-compatible island until Sprint 14.

---

## 11. Anti-patterns (Phase 8)

- Forcing identical look across surfaces
- Treating intentional density as a defect
- Reopening Phases 2–7 without evidence
- Rubber-stamping everything Aligned
- Oversized scoring
- Redesigning inside the matrix
- Pending assets as inconsistency
- Ignoring form/Gift gaps
- Changing Sprint 11 workflows
- Implementation disguised as QA

---

## 12. Founder review questions (max 6)

1. Do these surfaces feel like **one Celebrate family** with room to grow?
2. Are the **intentional differences** (Landing vs Studio vs Recipient) understandable?
3. Is Studio **related enough** without becoming decorative?
4. Does Preview **bridge** editing and receiving properly for V1?
5. Are any listed **gaps misclassified** (too harsh or too soft)?
6. Is the remaining gap list **reasonable for V1** implementation after Sprint 12 closes?

---

## Phase 8 acceptance

| Criterion                              | Status                     |
| -------------------------------------- | -------------------------- |
| Matrix + dimension review              | ✅                         |
| Intentional differences preserved      | ✅                         |
| Real gaps with owners                  | ✅                         |
| Gift/Theme/Preview/Photobooth assessed | ✅                         |
| Bloom pilot deferred with checklist    | ✅                         |
| No code / redesign                     | ✅                         |
| Founder Consistency Review             | ✅ **APPROVED 2026-07-19** |

**Next:** Phase 9 — Design QA & Closure (authorized — documentation only).  
**Still not authorized:** implementation, styling, commits, pushes, Bloom pilot.
