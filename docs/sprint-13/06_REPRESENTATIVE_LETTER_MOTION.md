# Sprint 13 — Representative Letter Motion

> **Date:** 2026-08-07  
> **Branch:** `rebuild/foundation`  
> **Prior on remote:** `736f2e7` (gift ceremony)  
> **Scope:** Moments letter reading only (Bloom · Warm · Sky)  
> **Not started:** Gallery · camera · Photobooth · gift mass-expansion

---

## 1. Surfaces selected

| Theme     | File                                   | Why                                     |
| --------- | -------------------------------------- | --------------------------------------- |
| **Bloom** | `moments/scenes/letter-scene.tsx`      | Canonical soft floral letter            |
| **Warm**  | `warm/moments/scenes/letter-scene.tsx` | Strongest ceremonial stationery letter  |
| **Sky**   | `sky/moments/scenes/letter-scene.tsx`  | Airy scrapbook letter (distinct rhythm) |

Not edited: letter-confirmation, letter-transition, letter-emergence, final-letter wrappers (except via shared Moments letter reuse).

---

## 2. Reuse / coupling map

| Edited surface         | Consumers                                                                                                        |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Bloom `LetterScene`    | Moments · Connection `letter-reveal` · Memories `letter-reveal` · Treasures final-letter (via Connection reveal) |
| Warm `WarmLetterScene` | Warm Moments · Warm Connection `letter-reveal` · Warm Memories/Treasures via Connection reveal                   |
| Sky `SkyLetterScene`   | Sky Moments · Sky Connection `letter-reveal` · Sky Memories/Treasures via Connection reveal                      |

Scene IDs / graphs / letter copy — **unchanged**.

---

## 3. Before → after

| Behavior           | Before                       | After                                                    |
| ------------------ | ---------------------------- | -------------------------------------------------------- |
| Bloom RM           | Missing                      | `useCelebrateReducedMotion` · snap content · ambient off |
| Warm/Sky RM hook   | Framer `useReducedMotion`    | SSR-safe `useCelebrateReducedMotion`                     |
| Bloom body stagger | ~1.05s/sentence (theatrical) | ~0.26s soft rhythm                                       |
| Warm body stagger  | ~0.35s                       | ~0.40s deliberate stationery                             |
| Sky body stagger   | ~0.36s                       | ~0.18s airy / lighter                                    |
| Ambient loops      | Often always-on              | `allowAmbientLoop`                                       |
| Sky primary CTA    | Infinite scale pulse         | One-shot enter · hover/tap only                          |
| Kit tokens         | Ad-hoc easings/durations     | `MOTION_DURATION` · `MOTION_EASE`                        |

---

## 4. Timing choices by theme

| Theme | Card enter    | Body step | Character                      |
| ----- | ------------- | --------- | ------------------------------ |
| Bloom | ceremony      | 0.26s     | Soft luminous gentle flow      |
| Warm  | ceremony      | 0.40s     | Intimate / slightly slower     |
| Sky   | base (faster) | 0.18s     | Airy scrapbook · no heavy blur |

Reduced motion: all delays → `0`; content immediate; ambient omitted.

---

## 5. Shared kit APIs

`useCelebrateReducedMotion` · `allowAmbientLoop` · `MOTION_DURATION` · `MOTION_EASE`

---

## 6. Reduced-motion behavior

- Full letter content visible immediately
- No stagger chains
- Ambient petals / rain / plane / heart pulse off
- Continue CTA visible and usable
- Same markup; motion props simplified (no SSR tree fork)

---

## 7. Browser / regression

| Check                                        | Result                                                                     |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| Warm Moments → letter (mobile)               | ✅ full letter · Unlock CTA · no overflow · gift→letter handoff OK         |
| Sky Moments → letter (mobile)                | ✅ full letter · Unlock CTA · no overflow                                  |
| Bloom Moments → letter (mobile)              | ✅ full letter · Unlock CTA · no overflow                                  |
| Warm letter Unlock CTA                       | ✅ advances to album-unlock-transition                                     |
| Warm desktop `1280×800`                      | ✅ letter readable · CTA visible · no overflow                             |
| Warm reduced motion                          | ✅ letter + CTA immediate · `prefers-reduced-motion` matched · no overflow |
| Connection / Memories / `?noPhotos=1` mounts | ✅ mount (loading then journey) · no overflow                              |
| Graphs / scene IDs                           | Unchanged                                                                  |
| Console                                      | No material errors (React DevTools / HMR only)                             |

Technical: `tsc` ✅ · ESLint (touched) ✅ · `next build` ✅ · `npm audit` **11** (8 high, 3 moderate).

---

## 8. Bloom gift-box CTA flake

**Classification: automation-only flake** (not marked fixed).

This pass: Bloom gift-box advanced successfully with correct CTA matcher (`Tap the flower to unwrap`). Prior failures remain consistent with automation timing/selector mismatch, not a confirmed user-facing blocker. No UX fix attempted.

---

## 9. Remaining letter-motion debt

- Confirmation / transition / emergence scenes not refined
- Connection letter-emergence choreography not in scope
- Final Treasures letter wrappers inherit Moments letter only
- Pattern expansion awaits Founder authorization

---

## 10. Expansion readiness

| Question                         | Answer                                                          |
| -------------------------------- | --------------------------------------------------------------- |
| Letter pattern proven?           | **Yes** — three themes, kit-aligned, RM-safe, CTA stable        |
| Gallery Motion ready for review? | **Yes** — letter phase complete for Founder gate before gallery |

---

## 11. Exclusions confirmed

Gallery · camera · Photobooth · Playful · Pure · Studio · Preview · `/e/[token]` · DB/API · gift mass-expansion — **untouched**.
