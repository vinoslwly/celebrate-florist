# Full Bloom Theme Audit and Lock

> **Date:** 2026-07-21  
> **Branch:** `rebuild/foundation`  
> **Baseline:** Moments `b96c1b2` → Connection `d056513` → Memories `dda7efe` → Treasures `df262bc`  
> **Auditor stance:** Independent senior engineer · security · devil’s advocate (not the implementing author)  
> **Scope:** Theme Lab Bloom complete theme (four modes) · **not** Warm / Playful / Sky · **not** production Scene Engine  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## 1. Executive verdict

**PASS — Bloom is ready to lock as a complete Theme Lab theme.**

All four modes are present, separable where required, shared only where reuse is justified, fixture-isolated, and free of production wiring. Technical gate is green. Cross-mode browser matrix shows no blank scenes and no material console errors.

| Readiness                              | Verdict                             |
| -------------------------------------- | ----------------------------------- |
| Theme Lab readiness                    | ✅ Ready                            |
| Bloom theme lock readiness             | ✅ Ready to lock                    |
| Production Scene Engine / `/e/[token]` | ⛔ **Not authorized** — do not wire |

No unexplained package, schema, RLS, API, server-action, or `/e/` changes. **No FOUNDER DECISION REQUIRED** blockers.

---

## 2. Cross-mode architecture

| Concern                              | Result                                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------------------------- |
| Mode engines separate                | ✅ `moments/` · `connection/` · `memories/` · `treasures/` each own graph, host, registry     |
| Moments ceremony reuse               | ✅ Thin wrappers only (loading, flower, locked gift, letter, gallery chain)                   |
| Connection quiz mode-specific        | ✅ Quiz scenes + host question index stay in Connection                                       |
| Memories match mode-specific         | ✅ Match transition/intro/memory scenes stay in Memories                                      |
| Treasures unlock mode-specific       | ✅ Grid `openedSortOrders`, Final Gift lock, Final Reward dismiss path stay in Treasures host |
| Shared modules presentation-only     | ✅ Only `shared/bloom-gift-box.tsx` (+ `MomentsPersistentShell` decorations)                  |
| No scoring/workflow leak into shared | ✅ Confirmed — shared gift SVG has no quiz/match/openEnvelope logic                           |
| No unjustified forks                 | ✅ Reuse is wrap-not-copy; originals are mode-specific living scenes                          |
| Scene IDs unique / predictable       | ✅ Prefixed `moments.*` / `connection.*` / `memories.*` / `treasures.*`                       |

**Family vs clone check:** Modes share Bloom palette, gift motif, letter/gallery/photobooth ceremony — but interactive cores differ (ceremony open · quiz · match · gift grid). Not four text-swaps; not four unrelated themes.

---

## 3. Shared-component map

| Shared asset                                                               | Consumers                                                                                                                         |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `BloomGiftBox` (`tone` bloom\|gold)                                        | Moments gift-opening; Connection quiz/score/letter-emergence; Memories match-intro; Treasures explosion/grid/content/final-unlock |
| `MomentsPersistentShell` / Bloom decorations                               | All four Theme Lab hosts                                                                                                          |
| Moments gallery fixtures (`public/themes/bloom/moments/gallery-fixtures/`) | Connection / Memories / Treasures gallery photo re-exports                                                                        |
| Moments letter / gallery / photobooth scenes                               | Via Connection wrappers → Memories & Treasures wrappers                                                                           |

**Shared change since Moments lock:** additive `tone?: "bloom" | "gold"` (default bloom) — safe for locked modes.

---

## 4. Journey results

| Mode            | Graph | Spot-check                                                        | Restart                          | Invalid deep-link                                      |
| --------------- | ----- | ----------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------ |
| Moments 1–10    | ✅    | Entry + restart OK (mobile); desktop entry OK                     | → `moments.celebrate-loading`    | `?momentsScene=` ignored (no parser) → Moments default |
| Connection 0–15 | ✅    | Quiz Q1→Q2, letter-emergence, photobooth                          | → `connection.celebrate-loading` | Unknown → Moments fallback                             |
| Memories 0–15   | ✅    | Match memory advance, letter-emergence, photobooth                | → `memories.celebrate-loading`   | Unknown → Moments fallback                             |
| Treasures 0–13  | ✅    | Final locked until non-finals; content; letter→binder; photobooth | → `treasures.celebrate-loading`  | Unknown → Moments fallback                             |

**Final Gift vs Final Reward (Treasures):** Final Gift = gold grid item locked until five non-finals opened. Final Reward path (unlock → letter → gallery → photobooth) starts only after Final Gift content dismiss.

**Empty-photo skip:** Implemented in all four graphs (`hasPhotos === false` skips gallery). Theme Lab fixtures always include photos — path not browser-exercised (non-blocking).

---

## 5. Security result

| Check                                           | Result                                                  |
| ----------------------------------------------- | ------------------------------------------------------- |
| Synthetic fixtures only                         | ✅                                                      |
| No real customer data / production tokens       | ✅                                                      |
| No DB client in Theme Lab / scene-engine        | ✅                                                      |
| No schema / migration / RLS for lab             | ✅                                                      |
| No Theme Lab server actions / production submit | ✅ No `openEnvelopeAction` / match/quiz submit from lab |
| No `/e/[token]` Scene Engine wiring             | ✅ Recipient still mode-registry / legacy flows         |
| No unsafe HTML in Bloom engines                 | ✅ No `dangerouslySetInnerHTML`                         |
| Theme Lab `noindex`                             | ✅ `app/(theme-lab)/layout.tsx`                         |
| Absent from production nav                      | ✅                                                      |
| Deep-links whitelisted                          | ✅ Connection / Memories / Treasures                    |
| `npm audit`                                     | ✅ **0 vulnerabilities**                                |

---

## 6. Fixture truthfulness

| Mode             | Behavior                      | Documented as fixture?                    |
| ---------------- | ----------------------------- | ----------------------------------------- |
| Connection score | Fixed `92%` lab result        | ✅ Not live quiz grading                  |
| Memories score   | Fixed `92%` lab result        | ✅ Not `submitMatchAnswersAction`         |
| Treasures unlock | Host-local `openedSortOrders` | ✅ Not `openEnvelopeAction` / Gift domain |
| Gallery photos   | Moments local webp paths      | ✅ Synthetic                              |

UI reuses Moments letter CTA **“Unlock Memories”** on Connection / Treasures letter — presentation reuse, not a claim that Memories mode unlocked. Non-blocking copy debt.

---

## 7. Asset and performance result

| Bucket                                    | Count | Weight       |
| ----------------------------------------- | ----- | ------------ |
| Runtime `public/themes/bloom/moments/`    | 10    | **~0.07 MB** |
| Runtime connection / memories / treasures | **0** | —            |
| Refs Moments                              | 15    | ~4.6 MB      |
| Refs Connection                           | 10    | ~3.48 MB     |
| Refs Memories                             | 4     | ~0.98 MB     |
| Refs Treasures                            | 7     | ~2.21 MB     |

- Design references stay under `design-references/bloom/**` (not deploy-facing).
- No unnecessary runtime asset copies across modes.
- Client-heavy Framer scenes exist (album unlock, celebration, match, gift explosion) — acceptable for Theme Lab; revisit before production wrap.
- Gallery uses `next/img` eslint exceptions for local fixtures — known, non-blocking.

---

## 8. Accessibility result

| Area               | Finding                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------- |
| Interactive labels | Gift grid, flower unwrap, quiz/match options generally labeled                          |
| Decorative SVG     | Mostly `aria-hidden`                                                                    |
| Reduced motion     | Present on major Framer scenes                                                          |
| Confirmed blockers | **None** for Theme Lab lock                                                             |
| Likely / manual    | Photobooth placeholder chrome; letter CTA mode-agnostic copy; contrast not instrumented |
| Claim              | **Not** full WCAG — focused review only                                                 |

---

## 9. Production-impact result

| Surface                        | Impact                           |
| ------------------------------ | -------------------------------- |
| `/e/[token]`                   | Unchanged — no Scene Engine host |
| Preview / Studio / Landing     | No Bloom Scene Engine wiring     |
| DB contracts / publish / order | Unchanged by Theme Lab           |
| Other themes / Pure            | Untouched                        |

---

## 10. Technical gate

| Gate                                    | Result               |
| --------------------------------------- | -------------------- |
| `npm run typecheck`                     | ✅                   |
| ESLint (Bloom scene-engine + theme-lab) | ✅ (no new errors)   |
| `npm run build`                         | ✅                   |
| Project tests                           | N/A for this surface |
| `npm audit`                             | ✅ 0 vulnerabilities |

---

## 11. Remaining non-blocking issues

1. Letter CTA still says **“Unlock Memories”** across Connection / Treasures (Moments copy reuse).
2. Photobooth still labels **“Scene 10”** (Moments numbering) in all modes.
3. Static Preview tab not built for Connection / Memories / Treasures.
4. No `?momentsScene=` deep-link parser (param ignored safely) — optional parity later.
5. Empty-photo gallery skip not browser-exercised with empty fixtures.
6. Sprint 14 photobooth redesign still deferred.

---

## 12. Required before production integration

1. Explicit Founder authorization for Scene Engine wrap on `/e/[token]`.
2. Replace lab fixtures with live quiz / match / envelope domain actions.
3. Mode-specific letter CTAs and photobooth production design.
4. Accessibility measurement pass + performance budget for production.
5. Empty-content / error-path product QA on real published experiences.

---

## 13. Final Bloom lock decision

**Bloom Theme Lab (Moments + Connection + Memories + Treasures) is APPROVED AND LOCKED as a complete visual theme pilot.**

Further Theme Lab changes require Founder unlock (regression / shared infra / security / a11y / explicit instruction).

**Next theme (Warm / Playful / Sky) may begin only after Founder approval** — not started in this audit.

---

## 14. Lessons for the next theme

1. Lock one mode at a time; run a final cross-mode audit before declaring the theme complete.
2. Prefer thin wrappers over forked scene copies.
3. Keep shared components presentation-only; put unlock/score/match logic in mode hosts.
4. Keep design references out of `public/`; reuse Moments runtime assets where possible.
5. Document fixture vs production truth in every mode gate doc.
6. Do not wire `/e/` until the full theme audit passes and Founder authorizes production integration.
