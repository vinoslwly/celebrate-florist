# Warm Treasures — Fast Gate

> **Date:** 2026-07-23  
> **Checkpoint compared:** `6829b40` — `docs(theme-lab): record Warm Memories mobile QA and lock` (`origin/rebuild/foundation`)  
> **Scope:** Theme Lab Warm Treasures · **APPROVED AND LOCKED** · Playful / Sky **not started**  
> **Pilot commit:** `e78a48a`  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## Verdict

**WARM TREASURES APPROVED AND LOCKED — THEME LAB**

Founder approved Warm Treasures as **APPROVED AND LOCKED** in Theme Lab after fast gate.  
Pilot commit: `e78a48a` — `feat(theme-lab): add and lock Warm Treasures pilot` on `rebuild/foundation`.

All four Warm modes (Moments, Connection, Memories, Treasures) are **complete and locked** in Theme Lab.  
**Next required step:** full Warm theme audit.  
Playful and Sky remain **not started**.  
Production `/e/[token]` Scene Engine remains **NOT AUTHORIZED**.

---

## Change set (vs Warm Memories lock `6829b40`)

### Warm Treasures-specific (new)

| Area           | Paths                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| Engine         | `features/experience/scene-engine/warm/treasures/**` — graph, host, types, Scenes 0–13 + gift-content.{n} |
| Fixtures       | `features/theme-lab/config/warm-treasures-fixtures.ts` (synthetic experience + 6 envelopes)               |
| Lab UI         | `features/theme-lab/components/warm-theme-lab-page.tsx` — `?mode=treasures` + fixtures wiring             |
| Runtime assets | `public/themes/warm/treasures/README.md` only — **no image plates**                                       |
| Design refs    | `design-references/warm/treasures/` (3 PNG refs + README, ~1.68 MB)                                       |
| Docs           | This file                                                                                                 |

### Warm Moments / Connection / Memories / Bloom reused

| Beat                      | Reuse                                                                                  |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Scenes 0–2                | Warm Connection wrappers (loading, welcome, locked-gift → Moments gift-opening locked) |
| Scene 3 gift-locked       | **Warm Treasures–specific** invitation / wax-seal card                                 |
| Scenes 4–5 explosion      | **Warm Treasures–specific** (crimson/gold only)                                        |
| Scene 6 gift-grid         | **Warm Treasures–specific** (5 crimson + Final Gold)                                   |
| Scene 7 gift-content      | **Warm Treasures–specific** stationery over softened grid                              |
| Scene 8 final-gift-unlock | **Warm Treasures–specific**                                                            |
| Scenes 9–13               | Warm Connection wrappers → Moments letter / binder / gallery / ending / photobooth     |
| Gift box presentation     | Warm Moments `WarmGiftBox` with optional `tone`                                        |

### Shared files changed

| File                                                              | Impact                                                                                                   |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `features/experience/scene-engine/warm/moments/warm-gift-box.tsx` | Additive optional `tone: "crimson" \| "gold"` (default **crimson**). Moments/Connection omit → unchanged |
| `features/theme-lab/components/warm-theme-lab-page.tsx`           | Additive Treasures tab + fixtures; Moments / Connection / Memories paths intact                          |

### Outside Warm Treasures

| Area                                                      | Result                                     |
| --------------------------------------------------------- | ------------------------------------------ |
| Warm Moments engine / fixtures (aside from gift-box tone) | **Unchanged** behavior when `tone` omitted |
| Warm Connection engine / fixtures                         | **Unchanged**                              |
| Warm Memories engine / fixtures                           | **Unchanged**                              |
| Bloom mode trees                                          | **Unchanged**                              |
| `package.json` / lockfile                                 | **Unchanged**                              |
| schema / migration / RLS / API / server actions           | **None**                                   |
| `/e/[token]`, Studio, Preview, orders, publish            | **None**                                   |

**No FOUNDER DECISION REQUIRED** — shared changes are additive and theme-safe.

### Clutter removed during gate

- One-off graph check script `scripts/tmp-warm-treasures-graph-check.mjs` (not committed)

---

## Shared-code impact

| Consumer        | Impact                                                       |
| --------------- | ------------------------------------------------------------ |
| Warm Moments    | Gift box default path unchanged (`tone` defaults to crimson) |
| Warm Connection | Same — reused Moments gift box without `tone`                |
| Warm Memories   | None                                                         |
| Bloom modes     | None                                                         |

Unlock / Final Gift / Final Reward state lives only in `warm/treasures` host + gift-grid.  
No Final Gift / Final Reward logic leaked into shared Moments presentation components.

---

## Final Gift vs Final Reward

| Term             | Meaning                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------- |
| **Final Gift**   | Locked gold grid item; disabled until all required non-final gifts open                                   |
| **Final Reward** | Post-unlock journey: final-gift-unlock → final-letter → binder → gallery (or photobooth if no photos) → … |

Ordering verified: Final Gift content dismiss → `final-gift-unlock` (not hold on grid). Final Reward does **not** start before Final Gift content is dismissed.

---

## Warm identity

| Check                                  | Result                                                              |
| -------------------------------------- | ------------------------------------------------------------------- |
| Crimson / cream / gold family          | ✅                                                                  |
| Distinct from Warm Moments             | ✅ Gift-grid progressive unlock vs single ceremonial gift→letter    |
| Distinct from Warm Connection          | ✅ Treasure grid vs relational quiz                                 |
| Distinct from Warm Memories            | ✅ Gift envelopes vs memory-match scrapbook                         |
| Not merely Bloom Treasures recolored   | ✅ Warm invitation card, crimson/gold explosion, stationery letters |
| Real HTML/React text & controls        | ✅                                                                  |
| Full-page Canva screenshots at runtime | ❌ None                                                             |

---

## Typography

| Rule                          | Observation                                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------------------ |
| Poppins default for UI/labels | Lab chrome + functional controls                                                                 |
| Outfit expansion              | **None new in Treasures-specific scenes**; reused Moments gallery/letter CTAs still carry Outfit |
| Serif / editorial             | Gift-locked / grid / content / unlock headlines use `font-serif` (intentional stationery luxury) |

**Carry-forward to full Warm audit:** Outfit on reused Moments CTAs; serif density on Treasures stationery beats vs Poppins Foundations discipline. No redesign in this gate.

---

## Logic & security

| Check                                 | Result                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------- |
| DB / schema / migration / RLS         | None                                                                              |
| APIs / server actions                 | None                                                                              |
| Production Gift-domain actions        | None — Theme Lab only                                                             |
| `/e/[token]` wiring                   | Unauthorized / untouched                                                          |
| Secrets / private Canva / credentials | None                                                                              |
| Unsafe HTML                           | None                                                                              |
| Fixtures                              | Synthetic only                                                                    |
| Deep-link `?warmTreasuresScene=`      | **Not implemented** — invalid / unknown params ignored; journey starts at Scene 0 |
| Unknown scene IDs                     | Host shows safe unknown fallback; graph returns `null`                            |
| Theme Lab                             | `noindex`; absent from production navigation                                      |
| New dependencies                      | **None**                                                                          |

---

## Assets

| Location                            | Count | Weight               |
| ----------------------------------- | ----- | -------------------- |
| `public/themes/warm/treasures/`     | 1     | ~815 B (README only) |
| `design-references/warm/treasures/` | 4     | ~1.68 MB             |

No unused runtime plates. No duplicated Warm Moments / Connection / Memories / Bloom runtime copies. Gift box SVG remains shared via Moments component.

---

## Spot-check (Theme Lab)

| Check                                      | Mobile ~390×844    | Desktop ~1280×800    |
| ------------------------------------------ | ------------------ | -------------------- |
| Full journey → photobooth                  | ✅                 | Grid + path smoke ✅ |
| Gift-grid / CTAs                           | ✅                 | ✅                   |
| Final Gift locked until 5 non-final opened | ✅                 | —                    |
| Final Reward after Final Gift dismiss      | ✅                 | —                    |
| Restart → celebrate-loading                | ✅                 | —                    |
| Invalid `?warmTreasuresScene=`             | ✅ ignored         | —                    |
| `?noPhotos=1` badge + binder→photobooth    | ✅ (badge + graph) | —                    |
| Warm Moments / Connection / Memories       | ✅ no regression   | —                    |
| Bloom Moments (no Warm leak)               | ✅                 | ✅                   |
| Blank scene / material console errors      | ❌ none            | ❌ none              |
| Horizontal overflow                        | ❌ none            | ❌ none              |

---

## Technical gate

| Check                               | Result                                                                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc --noEmit`                      | ✅ Pass                                                                                                                                       |
| ESLint (Treasures + shared touched) | ✅ Pass                                                                                                                                       |
| `next build`                        | ✅ Pass (prior gate run; no package change since)                                                                                             |
| `npm audit`                         | **Baseline unchanged:** 6 vulnerabilities (3 high, 3 moderate) — Next/sharp inherited; **no new** package/lockfile change from Warm Treasures |

---

## Carry-forwards for full Warm audit

Do not expand these here — the full Warm audit will review them:

- Final typography decision: Poppins vs limited Warm serif / Outfit exception
- `WarmGiftBox` `tone` remains presentation-only; default `crimson`
- **Final Gift** and **Final Reward** terminology and order remain locked
- Photobooth remains Sprint 14 placeholder
- `npm audit` baseline remains **6** pre-existing advisories (unchanged by Treasures)
- Production accessibility / performance review remains pending
- Cross-mode Warm visual consistency (Moments → Connection → Memories → Treasures)
- Production `/e/[token]` remains unauthorized

---

## Git readiness

- Pilot commit: `e78a48a` — `feat(theme-lab): add and lock Warm Treasures pilot`
- Lock-record commit (this update): `docs(theme-lab): record Warm Treasures lock`
- Founder authorized push to `origin/rebuild/foundation`

---

## Confirmations

- Warm Treasures is **APPROVED AND LOCKED** in Theme Lab (`e78a48a`)
- All four Warm modes are locked in Theme Lab
- Full Warm theme audit is the **next required step**
- Playful and Sky were **not** started
- Production Scene Engine / `/e/[token]` remains **NOT AUTHORIZED**
