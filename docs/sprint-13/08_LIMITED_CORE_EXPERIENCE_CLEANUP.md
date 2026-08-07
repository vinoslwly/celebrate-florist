# Sprint 13 — Limited Core Experience Cleanup (Pre-Lock)

> **Date:** 2026-08-08  
> **Branch:** `rebuild/foundation`  
> **Prior on remote:** `b3e5b0f` (representative gallery motion) — pushed  
> **This commit (local, unpushed until Founder approval):** `fix(scene-engine): complete pre-lock motion cleanup`  
> **Scope:** Limited high-impact motion debt only  
> **Not started:** Connection letter-emergence mass polish · camera · Photobooth · Playful/Pure · `/e/[token]` · dependency force-fix

---

## 1. Surfaces inspected

| Area                                  | Surfaces                                                                                                         | Action                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| **A. Quiz-intro RM**                  | Bloom `connection/scenes/quiz-introduction-scene.tsx` · Sky `sky/connection/scenes/quiz-introduction-scene.tsx`  | Fixed                                     |
| **B. Celebration ambient**            | Bloom + Warm `celebration-transition-scene.tsx` · Bloom `score-reveal-scene.tsx` · Sky `balloon-burst-scene.tsx` | Fixed (loops gated; personality retained) |
| **C. Treasures unlock**               | Bloom `treasures/scenes/final-gift-unlock-scene.tsx` (representative)                                            | Polished                                  |
| Gift / Letter / Gallery proven passes | Not broadly reworked                                                                                             | Retained                                  |
| Warm/Sky Treasures final-unlock       | Inspected as siblings only                                                                                       | Left as non-blocking debt                 |

---

## 2. Fixes made

### A. Quiz-intro (Bloom + Sky)

- Migrated Framer `useReducedMotion` → `useCelebrateReducedMotion` + `allowAmbientLoop`
- Ambient (petals/stars/sparkles/gift float/bob) gated via `ambient`
- Enter timings use `MOTION_DURATION` / `MOTION_EASE`
- Sky Start CTA: `whileHover` / `whileTap` gated under reduced motion (was unconditional hover scale)
- Bloom Start CTA: hover gated; no continuous CTA motion

### B. Celebration ambient

- Bloom/Warm fireworks + sparkle loops: kit RM + `allowAmbientLoop`; static burst retained under RM via existing CSS reduce rules
- Bloom score-reveal sparkles: ambient-gated; CTA stable (hover/tap only when motion allowed)
- Sky balloon-burst: twinkle `repeat: Infinity` no longer runs under RM; float/confetti/pulse gated; kit tokens for enters

### C. Treasures final unlock (Bloom)

- Kit RM + ambient gating for petal/sparkle/glow infinite loops
- Anticipation: KF1 glow/rays still breathe under normal motion
- Reveal: letter uses `MOTION_DURATION.ceremony` + `MOTION_EASE.pop`
- Resting: open gold gift + letter; RM skips to letter immediately (same markup path — no structural hydration branch)
- Graph / duration constant / Final Gift semantics unchanged

---

## 3. Ambient intentionally retained

Under **normal motion**, theme personality kept:

- Bloom quiz petals / gift float / glow breathe
- Sky quiz falling stars / sticker bob / gift float
- Bloom/Warm firework launches + sparkles
- Bloom score soft sparkles
- Sky balloon fountain + float loops + twinkles
- Treasures petals / sparkles / gold glow breathe

These stop or simplify under reduced motion; they are not removed from the product.

---

## 4. Reduced-motion result

| Check                          | Result                                                           |
| ------------------------------ | ---------------------------------------------------------------- |
| Bloom quiz-intro               | ✅ CTA reachable · CSS ambient `animatingNodes: 0` · no overflow |
| Sky quiz-intro                 | ✅ reached via journey · Start CTA · ambient off                 |
| Bloom celebration              | ✅ static burst / no loop spam · no overflow                     |
| Bloom score CTA                | ✅ stable · reachable                                            |
| Bloom Treasures unlock         | ✅ letter immediate · no petal/sparkle loops                     |
| Sky balloon (code)             | ✅ infinite twinkle transition disabled under RM                 |
| Hydration structural branching | ✅ avoided (SSR-safe hook; displayPhase derived)                 |

Not claimed as full Sprint 13 RM certification of every scene.

---

## 5. Treasures result

**Selected:** Bloom `treasures.final-gift-unlock`

| Beat                | Result                                                      |
| ------------------- | ----------------------------------------------------------- |
| Anticipation (KF1)  | Open gold gift + glow/rays                                  |
| Unlock/reveal (KF2) | Letter To/From emerges with ceremony timing                 |
| Rest                | Letter + open gift settled                                  |
| Reduced motion      | Letter-first; ambient off; lid not animated                 |
| Semantics           | Unchanged (`TREASURES_FINAL_UNLOCK_DURATION_MS` still 3500) |

---

## 6. Browser / gate results

| Check                                                                   | Result                           |
| ----------------------------------------------------------------------- | -------------------------------- |
| Mobile `390×844` quiz / celebration / score / treasures                 | ✅                               |
| Desktop `1280×800` quiz / treasures                                     | ✅                               |
| Normal + reduced motion (representative)                                | ✅                               |
| 12 hosts mount (Bloom/Warm/Sky × Moments/Connection/Memories/Treasures) | ✅                               |
| `?noPhotos=1` (Warm)                                                    | ✅ still loads                   |
| Overflow                                                                | ✅ none on tested surfaces       |
| Hydration / console errors                                              | ✅ none (0 hydration mismatches) |
| Journey graphs / scene IDs                                              | Unchanged                        |
| Gift / Letter / Gallery proven patterns                                 | Not broadly reworked             |
| Excluded areas                                                          | Untouched                        |

**Gates**

| Gate                   | Result                                                  |
| ---------------------- | ------------------------------------------------------- |
| `tsc --noEmit`         | ✅                                                      |
| ESLint (touched files) | ✅                                                      |
| `next build`           | ✅                                                      |
| `npm audit`            | **11** (8 high, 3 moderate) — report only; no `--force` |

---

## 7. Remaining debt

### BLOCKING

**None** for Sprint 13.5 entry.

### NON-BLOCKING

- Connection-specific letter-emergence polish (beyond representative letter pass)
- Bloom gift-box automation-only flake (open path)
- Optional camera polish (not required for lock)
- Warm/Sky Treasures final-unlock kit migration (sibling parity)
- Remaining Framer `useReducedMotion` on non-focused Connection scenes (quiz-transition, score-calculation, letter-emergence)
- Dependency vulnerability remediation (`npm audit` 11 — do not force)

---

## 8. Camera recommendation

**Skip** for Sprint 13.5. Not a motion-lock blocker; defer to optional / later sprint.

---

## 9. Recommendation for Sprint 13.5

**Ready for Sprint 13.5 — Regression & Lock.**

Pre-lock cleanup addressed confirmed quiz-intro RM debt, celebration ambient infinite-loop hygiene, and one representative Treasures unlock polish without expanding scope into proven Gift/Letter/Gallery or excluded product areas.
