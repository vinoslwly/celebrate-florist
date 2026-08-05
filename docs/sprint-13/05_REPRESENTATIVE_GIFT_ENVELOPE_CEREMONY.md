# Sprint 13 — Representative Gift / Envelope Ceremony

> **Date:** 2026-08-05  
> **Branch:** `rebuild/foundation`  
> **Prior on remote:** `6d0f80a` (focused P2)  
> **Scope:** Moments gift-opening ceremony only (Bloom · Warm · Sky)  
> **Not started:** Letter-reading · gallery · camera · Photobooth

---

## 1. Surfaces selected

| Theme     | Surface                                                                   | Why                                                             |
| --------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **Bloom** | `moments/scenes/gift-opening-scene.tsx` + `shared/bloom-gift-box.tsx` lid | Canonical soft floral open                                      |
| **Warm**  | `warm/moments/scenes/gift-opening-scene.tsx` + `warm-gift-box.tsx` lid    | Deliberate stationery / crimson ceremony                        |
| **Sky**   | `sky/moments/scenes/gift-opening-scene.tsx` + `sky-gift-box.tsx` lid      | Distinct airy pearl/sky open (genuinely different art + timing) |

No other gift scenes modified (grid, explosion, final unlock, etc.).

---

## 2. Reuse / coupling map

| Edited file                 | Consumers                                                           |
| --------------------------- | ------------------------------------------------------------------- |
| Bloom `GiftOpeningScene`    | Moments · Connection `locked-gift` · Memories `locked-gift`         |
| Warm `WarmGiftOpeningScene` | Warm Moments · Warm Connection `locked-gift`                        |
| Sky `SkyGiftOpeningScene`   | Sky Moments · Sky Connection `locked-gift`                          |
| `BloomGiftBox` lid timing   | Also Treasures grid/content/unlock (presentation-only lid duration) |
| Warm/Sky gift-box lid       | Theme-local Moments + locked wrappers                               |

`lockedOnly` shake / fail-count progression **unchanged**.

---

## 3. Before → after

| Behavior                    | Before                              | After                                                |
| --------------------------- | ----------------------------------- | ---------------------------------------------------- |
| Reduced motion              | Bloom missing; Warm/Sky Framer hook | `useCelebrateReducedMotion`                          |
| Gift CTA                    | Infinite y-bob                      | One-shot enter (`getGentleZoom`) · hover/tap only    |
| Ambient petals/glow/chevron | Always / Framer-gated               | `allowAmbientLoop`                                   |
| Lid open                    | Hardcoded `0.8s`                    | `MOTION_DURATION.ceremony` + `MOTION_EASE.out`       |
| Letter handoff delay        | ~950ms all                          | Bloom ~950 · Warm **1100** · Sky **900** · RM ~160ms |
| Stage crossfade             | Ad-hoc                              | `MOTION_DURATION.base` / `MOTION_EASE.out`           |
| Letter body reading         | N/A                                 | **Not started** (tap-to-continue handoff only)       |

---

## 4. Shared kit APIs used

`useCelebrateReducedMotion` · `allowAmbientLoop` · `MOTION_DURATION` · `MOTION_EASE` · `getGentleZoom`

---

## 5. Reduced-motion behavior

- Snap / short handoff (~160ms) to letter stage
- Lid static open pose (no lid flight)
- Ambient loops off
- Letter card still appears; continue CTA usable
- No structural SSR/client tree swap beyond ambient gating with SSR-safe preference

---

## 6. Browser / regression

| Check                                        | Result                                                                                                 |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Warm / Sky Moments → `gift-opening` (mobile) | ✅ reached ceremony scene · no overflow · no hydration · `infiniteBtns: 0`                             |
| Bloom Moments gift-box advance               | ⚠️ known Theme Lab CTA automation flake (stays on `gift-box`); ceremony code path matches Warm/Sky kit |
| Connection wrappers Bloom/Warm/Sky           | ✅ mount · no overflow · no hydration                                                                  |
| Bloom Memories · Warm `?noPhotos=1`          | ✅ mount                                                                                               |
| Desktop Bloom mount                          | ✅ no overflow · no hydration                                                                          |
| Graphs / scene IDs / lockedOnly              | Unchanged                                                                                              |

Technical: `tsc` ✅ · ESLint (touched) ✅ · `next build` ✅ · `npm audit` **10** (7 high, 3 moderate).

---

## 7. Remaining gift/envelope debt

- Treasures explosion / final unlock ceremonies not refined
- Connection letter-emergence (Warm) not in this pass
- Decorative ambient still present under normal motion (intentional)
- Pattern expansion to other gift scenes awaits Founder authorization

---

## 8. Expansion + letter phase

| Question                                      | Answer                                                         |
| --------------------------------------------- | -------------------------------------------------------------- |
| Pattern safe to expand?                       | **Yes** — limited surfaces, coupling documented, CTA stable    |
| Letter-motion phase ready for Founder review? | **Yes** — gift open/handoff proven; letter-reading not started |

---

## 9. Exclusions confirmed

Letter-reading · gallery · camera · Photobooth · Playful · Pure · Studio · Preview · `/e/[token]` · DB/API — **untouched**.
