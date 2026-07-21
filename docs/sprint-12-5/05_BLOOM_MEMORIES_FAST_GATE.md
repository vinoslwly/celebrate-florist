# Bloom Memories — Fast Gate

> **Date:** 2026-07-21  
> **Checkpoint compared:** `d056513` — `feat(theme-lab): add and lock Bloom Connection pilot`  
> **Scope:** Theme Lab only · **not** a full theme audit · Treasures **not started**  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## Verdict

**BLOOM MEMORIES FAST GATE PASSED**

Ready for git push (Founder authorize separately). Ready to lock Theme Lab Memories.

---

## Change set (vs Connection lock)

### Memories-specific (new)

- `features/experience/scene-engine/memories/**` — graph, host, registry, wrappers, match scenes
- `features/theme-lab/config/bloom-memories-fixtures.ts` — synthetic lab fixtures
- `design-references/bloom/memories/` — Founder refs (3 PNGs · ~1.0 MB) — **not** under `public/`

### Shared / Theme Lab

| File                                                        | Impact                                                                                                                  |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `features/theme-lab/components/bloom-theme-lab-page.tsx`    | Enables Memories tab · `?memoriesScene=` whitelist · host wiring                                                        |
| `features/themes/components/bloom-moments-decorations.tsx`  | Additive: `fillParent && "min-h-0"` on inner shell flex child — safe for Moments/Connection (`fillParent` already used) |
| Docs (`sprint-11/03`, `sprint-12-5/*`, DDR-S12-036, `16_…`) | Memories 0–15 numbering · pilot status                                                                                  |

### Confirmed absent

- No `package.json` / lockfile changes
- No env / schema / migration / RLS
- No new API or server actions
- No `/e/[token]` or production Scene Engine wiring
- No secrets / Canva private URLs / real customer data

---

## Reuse map

| Memories | Source                                                    |
| -------- | --------------------------------------------------------- |
| 0–2      | Moments loading / gift / locked gift                      |
| 3        | Connection challenge-invitation                           |
| 4–6      | **New** match-transition / match-intro / match.memory.{n} |
| 7–8      | Connection calculating + score-reveal                     |
| 9        | Moments letter-transition (origami)                       |
| 10       | Connection letter-emergence (To/From head)                |
| 11–15    | Moments letter → binder → gallery → ending → photobooth   |

Wrappers only for locked modes — no Moments/Connection forks of living scenes.

Gallery photos reuse Moments fixtures (`/themes/bloom/moments/gallery-fixtures/…`).  
**Runtime `public/themes/bloom/memories/`:** none (refs moved out of `public/` during this gate).

---

## Logic & security

| Check                         | Result                                                      |
| ----------------------------- | ----------------------------------------------------------- |
| DB / schema / migration / RLS | None                                                        |
| New API / server action       | None                                                        |
| Production `/e/` wiring       | None                                                        |
| Lab fixtures                  | Synthetic (`theme-lab-memories`)                            |
| Deep-link whitelist           | Static IDs + `memories.match.memory.{n}` with integer index |
| Unknown `?memoriesScene=`     | Ignored → default Moments journey                           |
| Unknown in-host scene         | Safe “Unknown lab scene” + Restart                          |
| Unsafe HTML                   | None found in Memories engine                               |
| Dependencies                  | Unchanged · `npm audit` → **0 vulnerabilities**             |

**Fixture note:** Score / match answers are lab fixtures (no live `submitMatchAnswersAction`). Gallery skip (`hasPhotos === false`) is implemented in graph; Theme Lab fixtures always include photos.

---

## Spot-check (Playwright)

| Check                                  | Mobile ~390×844      | Desktop ~1280×800                                |
| -------------------------------------- | -------------------- | ------------------------------------------------ |
| Full journey → photobooth              | ✅                   | ✅ (deep-link samples + Connection/Moments tabs) |
| CTAs / transitions                     | ✅                   | ✅                                               |
| Restart → `memories.celebrate-loading` | ✅                   | —                                                |
| Invalid `?memoriesScene=`              | ✅ ignored → Moments | —                                                |
| Letter-emergence To/From               | ✅ Alex / Jordan     | —                                                |
| Moments tab                            | ✅ no regression     | ✅                                               |
| Connection tab + letter-emergence      | ✅ To/From intact    | ✅                                               |
| Console errors (fresh sessions)        | ✅ none material     | ✅                                               |
| Blank scene                            | ✅ none              | ✅                                               |

---

## Technical gate

| Gate                                          | Result                                               |
| --------------------------------------------- | ---------------------------------------------------- |
| `npm run typecheck`                           | ✅ pass                                              |
| ESLint (Memories + touched Theme Lab / shell) | ✅ pass (fixed `set-state-in-effect` in match timer) |
| `npm run build`                               | ✅ pass                                              |
| Automated tests                               | N/A (no project test script for this surface)        |
| `npm audit`                                   | ✅ 0 vulnerabilities                                 |

---

## Fixes applied during gate

1. Moved unused `*-ref.png` from `public/themes/bloom/memories/` → `design-references/bloom/memories/`
2. Hardened `parseMemoriesLabScene` to require a parseable match index
3. Match timer: derive `timeUp` / reduced-motion elapsed (lint `react-hooks/set-state-in-effect`)
4. Import order fix on Theme Lab page

---

## Non-blocking leftovers

- Reused Moments photobooth chrome still labels **“Scene 10”** (Moments numbering inside locked placeholder).
- Memories Preview (static) surface not built (same pattern as Connection).
- Empty-photo gallery-skip path not browser-exercised (fixtures always have photos).

---

## Pending / out of scope

- Full Founder visual theme audit
- Bloom Treasures
- Production Scene Engine / `/e/[token]`

---

## Git readiness

Commit prepared (not pushed unless Founder authorizes):

`feat(theme-lab): add and lock Bloom Memories pilot`
