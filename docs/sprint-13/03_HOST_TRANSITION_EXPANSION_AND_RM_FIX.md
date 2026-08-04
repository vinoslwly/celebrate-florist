# Sprint 13 — Host Transition Expansion + RM Hydration Fix

> **Date:** 2026-08-04  
> **Branch:** `rebuild/foundation`  
> **Pilots on remote:** `01d3fe3` · `558eab9` (pushed)  
> **This pass:** Expand host fade to all 12 · fix celebrate-loading RM hydration  
> **Not started:** Gift / letter / gallery ceremony · CTA cull · camera · Photobooth · `/e/[token]`

---

## 1. Nine hosts added (this pass)

| Theme | Mode       | Host                                             |
| ----- | ---------- | ------------------------------------------------ |
| Bloom | Connection | `connection/connection-scene-host.tsx`           |
| Bloom | Memories   | `memories/memories-scene-host.tsx`               |
| Bloom | Treasures  | `treasures/treasures-scene-host.tsx`             |
| Warm  | Connection | `warm/connection/warm-connection-scene-host.tsx` |
| Warm  | Memories   | `warm/memories/warm-memories-scene-host.tsx`     |
| Warm  | Treasures  | `warm/treasures/warm-treasures-scene-host.tsx`   |
| Sky   | Connection | `sky/connection/sky-connection-scene-host.tsx`   |
| Sky   | Memories   | `sky/memories/sky-memories-scene-host.tsx`       |
| Sky   | Treasures  | `sky/treasures/sky-treasures-scene-host.tsx`     |

Prior pilots (unchanged pattern): Bloom / Warm / Sky **Moments**.

---

## 2. Final 12-host coverage

All Theme Lab mode hosts now use:

- `useCelebrateReducedMotion()`
- `getHostSceneFade(reduceMotion)`
- `AnimatePresence mode="wait"` with kit enter/exit

Layout, graphs, quiz/match/gift state, and theme art remain local.

---

## 3. Reduced-motion strategy (hosts + loading)

| Layer                        | Behavior                                                           |
| ---------------------------- | ------------------------------------------------------------------ |
| Host fade                    | RM → duration `0`, no fade gap                                     |
| SSR preference               | `getServerSnapshot()` → `false` (hydrate match)                    |
| Celebrate loading (Warm/Sky) | SSR-safe hook + `allowAmbientLoop` gates petals / infinite shimmer |

---

## 4. Hydration root cause and fix

**Cause:** Warm/Sky `celebrate-loading` used Framer `useReducedMotion()`, which can resolve to `true` on the client during hydrate while SSR rendered the full-motion tree (`{!reduceMotion ? petals : null}` structural branch).

**Fix:**

- Switch to `useCelebrateReducedMotion()`
- Gate ambient petals / infinite loops with `allowAmbientLoop(reduceMotion)`
- Static opacity when ambient is off

**Result:** Warm / Sky / Bloom Moments and Warm Connection under `prefers-reduced-motion: reduce` — **no hydration errors** in Playwright matrix.

---

## 5. Browser matrix

| Suite                                     | Result                                     |
| ----------------------------------------- | ------------------------------------------ |
| 12 mode hosts · mobile `390×844` · normal | ✅ mount · no overflow · no console errors |
| Warm / Sky / Bloom Moments · reduced      | ✅ no hydration                            |
| Warm Connection · reduced                 | ✅ no hydration                            |
| Sky desktop `1280×800`                    | ✅                                         |
| Restart                                   | ✅                                         |

---

## 6. Shared-wrapper regression

Connection / Memories / Treasures Theme Lab pages mount via their own hosts (now on kit). Moments celebrate-loading wrappers still re-export Warm/Sky Moments scenes — fixed at source. Gift/letter/gallery scene files **untouched**.

---

## 7. Remaining P2 reduced-motion debt

- Many quiz / score / explosion / balloon scenes still use Framer `useReducedMotion` with structural branches
- Bloom Moments celebrate-loading still runs ambient loops without the SSR-safe kit (no hydration mismatch observed; polish later)
- Primary CTA node-pulse infinite motion not yet culled (planned later phase)
- Full reduced-motion certification **not** claimed

---

## 8. Technical gate

| Check                 | Result                                                  |
| --------------------- | ------------------------------------------------------- |
| `tsc --noEmit`        | ✅                                                      |
| ESLint (scene-engine) | ✅                                                      |
| `next build`          | ✅                                                      |
| `npm audit`           | **10** (7 high, 3 moderate) — report only; no force-fix |

---

## 9. Exclusions confirmed

Gift / envelope / letter / gallery ceremony **not started**. Photobooth · Playful · Pure · Studio · Preview · `/e/[token]` · DB/API — **untouched**.
