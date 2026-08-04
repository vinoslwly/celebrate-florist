# Sprint 13 — Motion Foundation + Host Pilots (P0 / representative P1)

> **Date:** 2026-08-04  
> **Branch:** `rebuild/foundation`  
> **Entry plan:** [01_SPRINT_13_MOTION_ENTRY_PLAN.md](./01_SPRINT_13_MOTION_ENTRY_PLAN.md) (Founder approved · `01d3fe3`)  
> **Scope:** P0 Motion Kit + **three** Moments host pilots only  
> **Not started:** Full 12-host expansion · gift/letter/gallery ceremony · Photobooth · Playful · `/e/[token]`

---

## 1. Files changed

### Motion foundation (`features/experience/scene-engine/shared/motion/`)

| File                              | Role                                                                                                   |
| --------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `tokens.ts`                       | `MOTION_DURATION`, `MOTION_EASE`, `MOTION_STAGGER`                                                     |
| `use-celebrate-reduced-motion.ts` | SSR-safe `useSyncExternalStore` preference hook                                                        |
| `host-scene-fade.ts`              | `getHostSceneFade(reduceMotion)`                                                                       |
| `presets.ts`                      | `getBlurReveal`, `getGentleZoom`, stagger helpers, `allowAmbientLoop`, `allowPrimaryCtaInfiniteMotion` |
| `index.ts`                        | Barrel exports                                                                                         |

### Representative P1 hosts

| Theme | Host file                                  | Prior fade            | Pilot fade                                           |
| ----- | ------------------------------------------ | --------------------- | ---------------------------------------------------- |
| Bloom | `moments/moments-scene-host.tsx`           | wait · 0.45s          | `getHostSceneFade` · wait · scene 0.45s / RM instant |
| Warm  | `warm/moments/warm-moments-scene-host.tsx` | sync · exit-only 0.2s | **aligned** to wait · enter+exit via kit             |
| Sky   | `sky/moments/sky-moments-scene-host.tsx`   | wait · 0.28s          | **aligned** to kit scene 0.45s / RM instant          |

No graph IDs, scene order, scoring, or business state changes.

---

## 2. Tokens / helpers introduced

| API                                                  | Purpose                                                   |
| ---------------------------------------------------- | --------------------------------------------------------- |
| `MOTION_DURATION.{instant,fast,base,scene,ceremony}` | Shared timing                                             |
| `MOTION_EASE.{out,soft,pop}`                         | Shared easing                                             |
| `MOTION_STAGGER.{tight,base,loose}`                  | Letter/gallery stagger                                    |
| `useCelebrateReducedMotion()`                        | Hydration-safe preference (`getServerSnapshot` → `false`) |
| `getHostSceneFade(rm)`                               | Host enter/exit opacity                                   |
| `getBlurReveal` / `getGentleZoom`                    | Supporting tools (unused by pilots yet)                   |
| `getStaggerContainer` / `getStaggerItem`             | Supporting tools (unused by pilots yet)                   |
| `allowAmbientLoop(rm)`                               | Gate decorative infinite loops                            |
| `allowPrimaryCtaInfiniteMotion()`                    | Always `false` — documents CTA rule                       |

No DSL, timeline engine, particle system, or virtual camera.

---

## 3. Reduced-motion strategy

1. Hosts read `useCelebrateReducedMotion()` (SSR snapshot `false` → client updates after hydrate).
2. `getHostSceneFade(true)` → duration `0`, `initial: false`, exit stays opaque (no fade gap / dead click).
3. Child scene reduced-motion remains **pre-existing** (many scenes still use Framer `useReducedMotion` and branch trees).

---

## 4. Browser results

Playwright one-off (temp; not in repo) against local Theme Lab:

| Check                                                  | Result                                                                                                                                             |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bloom / Warm / Sky Moments · `390×844` normal          | ✅ mount · no overflow · no console errors · restart OK                                                                                            |
| Same · reduced motion                                  | ✅ hosts mount · no overflow · **Bloom RM clean**                                                                                                  |
| Warm / Sky Moments · reduced motion                    | ⚠️ **hydration mismatch inside celebrate-loading child scenes** (petal/particle branch) — **not** introduced by host fade kit; host still SSR-safe |
| Bloom desktop `1280×800`                               | ✅                                                                                                                                                 |
| Warm Connection / Sky Memories / Bloom Treasures mount | ✅ (separate hosts unchanged; still mount)                                                                                                         |

---

## 5. Shared-coupling impact

| Surface                                 | Impact                          |
| --------------------------------------- | ------------------------------- |
| Moments host fade only                  | Theme Lab Moments journeys only |
| Gift / letter / gallery scene files     | **Untouched**                   |
| Connection / Memories / Treasures hosts | **Untouched** — still mount     |
| Shared gift-box components              | **Untouched**                   |

Pilot risk is low: host wrapper motion only. Expansion to other hosts is the same pattern and does not require Moments art edits.

---

## 6. Issues found

1. **Pre-existing:** Warm/Sky (and similar) celebrate-loading scenes hydrate poorly when `prefers-reduced-motion: reduce` because Framer `useReducedMotion` branches markup before/during hydrate. Track for **P2 reduced-motion pass** — not a blocker for host-kit expansion.
2. Loading auto-advance timing unchanged; automation may still sample mid-loading scene (expected).

---

## 7. Technical gate

| Check            | Result                                                  |
| ---------------- | ------------------------------------------------------- |
| `tsc --noEmit`   | ✅                                                      |
| ESLint (touched) | ✅                                                      |
| `next build`     | ✅                                                      |
| `npm audit`      | **10** (7 high, 3 moderate) — report only; no force-fix |

---

## 8. Expansion recommendation

**Safe to expand P1 host fade to the remaining 9 hosts** using the same `getHostSceneFade` + `useCelebrateReducedMotion` pattern.

Do **not** yet claim full reduced-motion certification — that requires P2 scene-level work (especially loading/ambient branches).

Broader Sprint 13 (gift/letter/gallery ceremony, CTA pulse cull) **not started**.

---

## 9. Exclusions confirmed

- Photobooth · Playful · Pure · Studio · Preview · `/e/[token]` — untouched
- No package/lockfile changes
- No `npm audit fix --force`
