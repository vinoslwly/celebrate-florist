# Sprint 13 — Focused RM + Interactive Motion Pass

> **Date:** 2026-08-05  
> **Branch:** `rebuild/foundation`  
> **Prior on remote:** `db80bbc` (12-host fade + celebrate-loading RM)  
> **This pass:** Interactive quiz / match / gift-grid hardening  
> **Not started:** Gift / envelope / letter / gallery ceremony · camera · Photobooth

---

## 1. Scenes inspected

| Surface                  | Files                                                |
| ------------------------ | ---------------------------------------------------- |
| Connection quiz question | Bloom · Warm · Sky `quiz-question-scene.tsx`         |
| Memories match memory    | Bloom · Warm · Sky `match-memory-scene.tsx`          |
| Treasures gift grid      | Bloom · Warm · Sky `gift-grid-scene.tsx`             |
| Warm quiz introduction   | `warm/connection/scenes/quiz-introduction-scene.tsx` |
| Motion kit               | `getProgressNodePulseAnimation` added                |

Also reviewed (ambient retained, no rewrite): Sky quiz decorative bob/sparkle under `allowAmbientLoop`; gift-grid petal falls.

---

## 2. Hydration risks found

| Risk                                           | Mitigation                                            |
| ---------------------------------------------- | ----------------------------------------------------- |
| Framer `useReducedMotion` on interactive trees | → `useCelebrateReducedMotion`                         |
| `{!reduceMotion ? ambient : null}` branches    | → `allowAmbientLoop(reduceMotion)` with SSR-safe hook |
| Celebrate-loading                              | Already fixed in `db80bbc`                            |

---

## 3. CTA / node-pulse changes

| Control                     | Before                      | After                                                         |
| --------------------------- | --------------------------- | ------------------------------------------------------------- |
| Quiz progress current node  | CSS `… infinite`            | One-shot via `getProgressNodePulseAnimation`                  |
| Match progress current node | CSS `… infinite`            | One-shot                                                      |
| Gift grid tappable gifts    | Infinite y-bob + glow pulse | Static rest (`y: 0`) + static soft glow; hover/tap scale kept |
| Warm quiz intro lock        | Infinite pulse              | One-shot                                                      |
| Warm quiz Start CTA         | Continuous shimmer/arrow    | Static                                                        |

---

## 4. Ambient loops intentionally retained

- Decorative petal / sparkle / sky bob **behind** interactive chrome (gated by `allowAmbientLoop`)
- Gift-grid background petal falls (not on buttons)
- Non-interactive score/celebration scenes outside this pass (remaining debt)

---

## 5. Browser / gate results

| Check                               | Result                                            |
| ----------------------------------- | ------------------------------------------------- |
| `tsc --noEmit`                      | ✅                                                |
| ESLint (touched)                    | ✅                                                |
| `next build`                        | ✅                                                |
| `npm audit`                         | **10** (7 high, 3 moderate) — no force-fix        |
| Theme Lab mounts                    | All 12 modes ✅                                   |
| Mobile `390×844` matrix             | ✅ no overflow · `infiniteBtns: 0` · no hydration |
| Warm/Sky/Bloom RM samples           | ✅ no hydration                                   |
| Desktop Bloom Connection `1280×800` | ✅                                                |

---

## 6. Remaining P2 debt

- Bloom / Sky quiz-introduction still on Framer RM + ambient gift-float
- Score reveal / calculation / celebration-transition ambient fireworks
- Balloon / heart-rain decorative loops
- Full reduced-motion certification not claimed

---

## 7. Gift / envelope readiness

**Yes — safe to begin** Founder-authorized gift/envelope ceremony work on representative surfaces. Host fades and interactive control loops no longer block that phase.

---

## 8. Exclusions confirmed

Gift-opening / letter / gallery ceremony files · camera · Photobooth · Playful · Pure · Studio · Preview · `/e/[token]` · DB/API — **untouched**.
