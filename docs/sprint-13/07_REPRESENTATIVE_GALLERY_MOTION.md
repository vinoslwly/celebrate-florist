# Sprint 13 — Representative Gallery Motion

> **Date:** 2026-08-07  
> **Branch:** `rebuild/foundation`  
> **Prior on remote:** `609e673` (letter motion)  
> **Scope:** Moments gallery only (Bloom · Warm · Sky)  
> **Not started:** Camera · Photobooth · gift/letter mass-expansion

---

## 1. Surfaces selected

| Theme     | File                                    | Why                             |
| --------- | --------------------------------------- | ------------------------------- |
| **Bloom** | `moments/scenes/gallery-scene.tsx`      | Canonical soft polaroid gallery |
| **Warm**  | `warm/moments/scenes/gallery-scene.tsx` | Ceremonial scrapbook strips     |
| **Sky**   | `sky/moments/scenes/gallery-scene.tsx`  | Airy scrapbook album            |

Not edited: gallery-ending, gallery-unlock, album-unlock (except via shared reuse of Moments gallery).

---

## 2. Reuse / coupling map

| Edited surface          | Consumers                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------ |
| Bloom `GalleryScene`    | Moments · Connection gallery · Memories gallery · Treasures gallery (via Connection) |
| Warm `WarmGalleryScene` | Warm Moments · Warm Connection · Warm Memories/Treasures via Connection              |
| Sky `SkyGalleryScene`   | Sky Moments · Sky Connection · Sky Memories/Treasures via Connection                 |

Scene IDs · graphs · `?noPhotos=1` skip · photo contracts — **unchanged**.

Gallery completion → existing `gallery-ending` (or photobooth skip when no photos) — **unchanged**.

---

## 3. Before → after

| Behavior    | Before                              | After                                                         |
| ----------- | ----------------------------------- | ------------------------------------------------------------- |
| RM hook     | Framer `useReducedMotion`           | SSR-safe `useCelebrateReducedMotion`                          |
| Ambient     | Ad-hoc `!reduceMotion`              | `allowAmbientLoop`                                            |
| Bloom cards | y:28 + rotating entrance (`tilt-4`) | Soft y:16 + scale settle; design tilt preserved               |
| Warm strips | y:22 · 0.12+0.1i                    | Deliberate ceremony duration · 0.14s step · tiny scale settle |
| Sky cards   | y:26 + rotate entrance              | Faster base/fast · light settle; design tilt preserved        |
| Sky CTA     | Infinite scale pulse                | One-shot · hover/tap only                                     |
| Tokens      | Local `EASE` copies                 | `MOTION_DURATION` · `MOTION_EASE` · `MOTION_STAGGER`          |

---

## 4. Theme-specific timing

| Theme | Header enter     | Card reveal                        | Character             |
| ----- | ---------------- | ---------------------------------- | --------------------- |
| Bloom | base (~0.35s)    | whileInView · tight stagger · base | Soft luminous         |
| Warm  | ceremony (~0.85) | mount stagger · 0.14s/strip        | Intimate / deliberate |
| Sky   | base / fast      | whileInView · tight · fast         | Airy scrapbook        |

RM: all delays → 0 · ambient off · content immediate.

---

## 5. Motion Kit APIs

`useCelebrateReducedMotion` · `allowAmbientLoop` · `MOTION_DURATION` · `MOTION_EASE` · `MOTION_STAGGER`

No new gallery helper / choreography framework.

---

## 6. Reduced-motion behavior

- Gallery content immediate / near-immediate
- No long stagger · no flying/rotating entrances
- Ambient petals/stars off
- CTA visible and usable
- Same markup; simplified motion props
- Not claimed as full Sprint 13 RM certification

---

## 7. Browser / regression

| Check                            | Result                                                               |
| -------------------------------- | -------------------------------------------------------------------- |
| Warm Moments → gallery (mobile)  | ✅ photos · Celebrate CTA · advances to gallery-ending · no overflow |
| Sky Moments → gallery (mobile)   | ✅ Our Moments · photos · Celebrate after scroll · no overflow       |
| Bloom Moments → gallery (mobile) | ✅ Gallery · Celebrate CTA · no overflow                             |
| Gift → letter → gallery (Warm)   | ✅ continuity preserved                                              |
| Warm reduced motion gallery      | ✅ immediate content · CTA · `prefers-reduced-motion` · no overflow  |
| Warm desktop `1280×800`          | ✅ gallery scene · no overflow · CTA reachable after scroll          |
| Connection / Memories mounts     | ✅ mount (loading) · no overflow                                     |
| Warm `?noPhotos=1` after Unlock  | ✅ skips to `photobooth` (no gallery)                                |
| Graphs / scene IDs               | Unchanged                                                            |
| Bloom gift-box flake             | Remains automation-only (open; not marked fixed)                     |

Technical: `tsc` ✅ · ESLint (touched) ✅ · `next build` ✅ · `npm audit` **11** (8 high, 3 moderate).

---

## 8. Shared-wrapper regression

Shared Moments gallery consumers mount without scene-ID or photo-state changes. Empty-photo path still shows placeholder / skip via existing graph.

---

## 9. Gift → letter → gallery continuity

Warm Moments proven end-to-end: gift-opening → confirmation → letter → Unlock → album-unlock → gallery → Celebrate → gallery-ending. Journey logic untouched.

---

## 10. Remaining gallery debt

- `gallery-ending` / album-unlock not refined this pass
- Connection/Memories wrapper presentation inherits Moments only
- Continuous whileInView browsing is intentional (not forced full-sequence wait)

---

## 11. Remaining Sprint 13 debt (visible)

- Bloom/Sky quiz-introduction RM ambient
- Score / celebration fireworks
- Balloon / heart-rain loops
- Treasures explosion / final-unlock
- Connection letter-emergence
- Full RM certification
- Bloom gift-box automation flake (automation-only; open)
- Dependency audit triage before production

---

## 12. Next phase recommendation

Gallery pattern proven on three themes. Prefer **limited remaining Core Experience cleanup** (ending/unlock polish + known ambient RM debt) before a full representative regression / Sprint 13.5 lock — unless Founder prefers lock gate first.

---

## 13. Exclusions confirmed

Camera · Photobooth · Playful · Pure · Studio · Preview · `/e/[token]` · DB/API · production · gift/letter mass-expansion — **untouched**.
