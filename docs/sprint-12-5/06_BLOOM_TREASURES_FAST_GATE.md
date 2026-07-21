# Bloom Treasures — Fast Gate

> **Date:** 2026-07-21  
> **Checkpoint compared:** `dda7efe` — `feat(theme-lab): add and lock Bloom Memories pilot`  
> **Scope:** Theme Lab only · **not** a full Bloom theme audit · no other theme started  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## Verdict

**BLOOM TREASURES FAST GATE PASSED**

Ready for git push (Founder authorize separately). Ready to lock Theme Lab Treasures.  
All four Bloom modes are ready for the **full Bloom theme audit** (next required step).

---

## Change set (vs Memories lock)

### Treasures-specific (new)

- `features/experience/scene-engine/treasures/**` — graph, host, registry, wrappers, living scenes 3–8
- `features/theme-lab/config/bloom-treasures-fixtures.ts` — synthetic lab fixtures + envelopes
- `design-references/bloom/treasures/` — Founder refs (6 PNGs + README · **~2.21 MB**) — **not** under `public/`

### Shared / Theme Lab

| File                                                         | Impact                                                                                   |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| `features/theme-lab/components/bloom-theme-lab-page.tsx`     | Enables Treasures tab · `?treasuresScene=` whitelist · host wiring                       |
| `features/experience/scene-engine/shared/bloom-gift-box.tsx` | Additive optional `tone?: "bloom" \| "gold"` (default `"bloom"`) — safe for locked modes |
| Docs (`sprint-11/04`, `sprint-12-5/*`, DDR-S12-037)          | Treasures 0–13 numbering · pilot status                                                  |

### Confirmed absent

- No `package.json` / lockfile changes
- No env / schema / migration / RLS
- No new API or server actions
- No `/e/[token]` or production Scene Engine wiring
- No secrets / Canva private URLs / real customer data
- No `public/themes/bloom/treasures/` runtime folder (SVG gift motif + Moments gallery fixtures reused)

### Locked mode trees

`features/experience/scene-engine/{moments,connection,memories}/**` — **unchanged** vs `dda7efe`.

---

## Reuse map

| Treasures | Source                                                                    |
| --------- | ------------------------------------------------------------------------- |
| 0–2       | Moments loading / gift / locked gift (`lockedOnly`)                       |
| 3         | **New** gift-locked SPECIAL MESSAGE                                       |
| 4–5       | **New** gift-explosion (one beat)                                         |
| 6–7       | **New** gift-grid + gift-content                                          |
| 8         | **New** final-gift-unlock (KF1 glow → KF2 To/From)                        |
| 9–13      | Connection letter-reveal → gallery-unlock → gallery → ending → photobooth |

Wrappers only for locked modes — no Moments/Connection/Memories forks of living scenes.

Gallery photos reuse Moments fixtures (`/themes/bloom/moments/gallery-fixtures/…`).  
**Runtime `public/themes/bloom/treasures/`:** none.

### Final Gift vs Final Reward

| Term             | Behavior                                                                                |
| ---------------- | --------------------------------------------------------------------------------------- |
| **Final Gift**   | Gold grid item · locked until all non-final gifts opened · content scene when tapped    |
| **Final Reward** | After Final Gift dismiss → Scene 8 unlock → Scene 9+ letter / gallery / photobooth path |

---

## Logic & security

| Check                         | Result                                                               |
| ----------------------------- | -------------------------------------------------------------------- |
| DB / schema / migration / RLS | None                                                                 |
| New API / server action       | None                                                                 |
| Production `/e/` wiring       | None                                                                 |
| Lab fixtures                  | Synthetic (`theme-lab-treasures`) · **no** `openEnvelopeAction`      |
| Deep-link whitelist           | Static IDs + `treasures.gift-content.{n}` with integer sortOrder ≥ 1 |
| Unknown `?treasuresScene=`    | Ignored → default Moments journey                                    |
| Unknown in-host scene         | Safe “Unknown lab scene” + Restart                                   |
| Unsafe HTML                   | None found in Treasures engine                                       |
| Dependencies                  | Unchanged · `npm audit` → **0 vulnerabilities**                      |

**Fixture note:** Gift unlock / envelope content / Final Reward letter are Theme Lab fixtures only — not production Gift-domain logic.

---

## Spot-check (Playwright)

| Check                                    | Mobile ~390×844      | Desktop ~1280×800                     |
| ---------------------------------------- | -------------------- | ------------------------------------- |
| Full journey → photobooth                | ✅                   | ✅ (deep-link samples + grid/content) |
| Final Gift locked until 5 opened         | ✅                   | ✅                                    |
| Final Gift → unlock → Final Letter order | ✅                   | ✅ (unlock To/From visible)           |
| CTAs / transitions                       | ✅                   | ✅                                    |
| Restart → `treasures.celebrate-loading`  | ✅                   | —                                     |
| Invalid `?treasuresScene=`               | ✅ ignored → Moments | —                                     |
| Moments / Connection / Memories tabs     | ✅                   | ✅ letter-emergence intact            |
| Console errors (fresh sessions)          | ✅ none material     | ✅                                    |
| Blank scene                              | ✅ none              | ✅                                    |

---

## Technical gate

| Gate                                            | Result                                                |
| ----------------------------------------------- | ----------------------------------------------------- |
| `npm run typecheck`                             | ✅ pass                                               |
| ESLint (Treasures + touched shared / Theme Lab) | ✅ pass (fixed `set-state-in-effect` in final unlock) |
| `npm run build`                                 | ✅ pass                                               |
| Automated tests                                 | N/A (no project test script for this surface)         |
| `npm audit`                                     | ✅ 0 vulnerabilities                                  |

---

## Assets

| Bucket                                         | Count          | Weight       |
| ---------------------------------------------- | -------------- | ------------ |
| Runtime `public/themes/bloom/treasures/`       | **0**          | —            |
| Reference `design-references/bloom/treasures/` | 6 PNG + README | **~2.21 MB** |
| Duplicated Moments/Connection runtime copies   | None           | —            |

---

## Fixes applied during gate

1. Final Gift unlock: derive reduced-motion letter phase (lint `react-hooks/set-state-in-effect`)

---

## Non-blocking leftovers

- Reused Moments photobooth chrome still labels **“Scene 10”** (Moments numbering inside locked placeholder).
- Treasures Preview (static) surface not built (same pattern as Connection/Memories).
- Empty-photo gallery-skip path implemented in graph; Theme Lab fixtures always include photos (not browser-exercised).

---

## Pending / out of scope

- **Full Bloom theme audit** (next required step — all four modes)
- Production Scene Engine / `/e/[token]`
- No other theme started

---

## Git readiness

Commit prepared (not pushed unless Founder authorizes):

`feat(theme-lab): add and lock Bloom Treasures pilot`
