# Full Warm Theme Audit and Lock

> **Date:** 2026-07-23  
> **Branch:** `rebuild/foundation` · baseline `c18d235` on `origin/rebuild/foundation` (0/0)  
> **Mode locks:** Moments `5f193e7` · Connection `47a2c4e` · Memories `1b55c41` · Treasures `e78a48a`  
> **Auditor stance:** Cross-mode Theme Lab review (not an implementation pass)  
> **Scope:** Complete Warm Theme Lab (four modes) · **not** Playful / Sky · **not** production Scene Engine  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## 1. Executive verdict

**PASS — Warm is ready to lock as a complete Theme Lab theme.**

All four Warm modes are present, separable where required, shared only through presentation-safe reuse, fixture-isolated, and free of production wiring. Technical gate is green. Cross-mode browser matrix shows entry, mode-specific interaction, restart, no-photo badge, desktop mount, and no Warm leak into Bloom. No unexplained package, schema, RLS, API, server-action, or `/e/` changes.

| Readiness                              | Verdict                             |
| -------------------------------------- | ----------------------------------- |
| Theme Lab readiness                    | ✅ Ready                            |
| Warm theme lock readiness              | ✅ Ready to lock                    |
| Production Scene Engine / `/e/[token]` | ⛔ **Not authorized** — do not wire |

**No FOUNDER DECISION REQUIRED** blockers.

---

## 2. Cross-mode architecture

| Concern                          | Result                                                                                           |
| -------------------------------- | ------------------------------------------------------------------------------------------------ |
| Mode engines separate            | ✅ `warm/moments` · `warm/connection` · `warm/memories` · `warm/treasures` each own graph + host |
| Moments ceremony reuse           | ✅ Thin wrappers (Connection / Memories / Treasures) — not forks                                 |
| Connection quiz mode-specific    | ✅ Quiz scenes + host question index stay in Connection                                          |
| Memories match mode-specific     | ✅ Match transition / intro / memory scenes stay in Memories                                     |
| Treasures unlock mode-specific   | ✅ `openedSortOrders`, Final Gift lock, Final Reward dismiss stay in Treasures host              |
| Shared modules presentation-only | ✅ `WarmGiftBox` + Moments living scenes via wrappers                                            |
| `WarmGiftBox` API                | ✅ Optional `tone: "crimson" \| "gold"` (default **crimson**); gold only for Final Treasure      |
| Bloom unchanged                  | ✅ No Warm imports into Bloom trees; Bloom Theme Lab mounts without Warm leak                    |
| Scene IDs                        | ✅ Prefixed `warm.moments.*` / `warm.connection.*` / `warm.memories.*` / `warm.treasures.*`      |

**Family vs clone:** Shared crimson/cream/gold, gift motif, letter/gallery/photobooth ceremony — interactive cores differ (ceremony · quiz · match · gift grid). Not four text-swaps; not Bloom recolors.

**Note:** `WarmGiftOpeningScene` accepts `lockedOnly` for Connection’s three-shake ceremony. That is a small presentation branch in the Moments scene (same pattern as Bloom), not quiz/match/unlock business logic.

---

## 3. Shared-component map

| Shared asset                                                                                 | Consumers                                                                                            |
| -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `WarmGiftBox` (`tone` crimson\|gold)                                                         | Moments gift-opening; Treasures explosion / grid / content / final-unlock (`gold` = Final Gift only) |
| Moments celebrate-loading / gift-box / gift-opening / letter / gallery / ending / photobooth | Via Connection wrappers → Memories & Treasures wrappers                                              |
| Moments album-unlock / letter-confirmation / letter-transition                               | Connection / Memories / Treasures ceremony tails as wired per graph                                  |
| Warm Moments lab photos + Bloom gallery fixture webps                                        | Connection / Memories / Treasures gallery photo fixtures                                             |
| `warm-theme-lab-page.tsx`                                                                    | Mode tabs + `?mode=` + `?noPhotos=1`                                                                 |

Delegation is wrap-not-copy: Moments originals → Connection wrappers → Memories/Treasures wrappers.

---

## 4. Visual consistency

| Dimension                     | Result                                                                 |
| ----------------------------- | ---------------------------------------------------------------------- |
| Crimson / cream / gold        | ✅ Family palette across all four modes                                |
| Gift motif                    | ✅ Shared WarmGiftBox; Treasures gold Final Gift distinct              |
| Letter / gallery              | ✅ Shared Moments living scenes                                        |
| Atmosphere                    | ✅ Velvet / stationery / gold accents; mode cores remain distinct      |
| Shell / scroll                | ✅ Immersive Theme Lab shell; prior Moments scroll ownership preserved |
| Completion                    | ✅ Photobooth terminal (Sprint 14 placeholder) all modes               |
| Too similar?                  | ❌ Cores differ enough                                                 |
| Disconnected / Bloom recolor? | ❌ Warm-specific invitation, quiz, match, treasure grid                |

No redesign required for lock.

---

## 5. Final typography decision

**Outcome: Option 2 — Limited formal Warm Theme Lab exception (locked).**

Foundations baseline remains Poppins (`font-sans`) for functional UI and Fraunces (`font-serif`) for selective ceremonial use globally. Warm Theme Lab additionally uses local Google fonts in Moments letter/gallery scenes.

### Allowed in Warm Theme Lab (locked)

| Use                                              | Font                                                           |
| ------------------------------------------------ | -------------------------------------------------------------- |
| Theme Lab chrome (tabs, scene ID, badges)        | Mono / system UI                                               |
| Ceremonial titles, score numerals, invitation H1 | `font-serif` → Fraunces **or** scene-local Cormorant           |
| Long-form letter body / gallery editorial titles | Cormorant Garamond (Moments letter / gallery / album / ending) |
| Gallery script accents                           | Great Vibes (gallery ending only)                              |
| Letter + gallery primary CTAs                    | Outfit (existing Moments living scenes — shared by all modes)  |
| Decorative / atmospheric labels                  | Serif / Cormorant as already shipped                           |

### Not approved as a Warm-wide expansion

- Do **not** spread Outfit beyond the existing Moments letter/gallery CTA surfaces without Founder unlock.
- Do **not** add new display fonts for Playful/Sky by copying Warm’s exception blindly.

### Required before production integration (not Theme Lab blockers)

1. Primary **interactive controls** that are clearly functional UI (quiz options, match options, score CTA, grid UI chrome) should migrate to **Poppins (`font-sans`)** where they currently use `font-serif` for button/option text.
2. Revisit whether Outfit CTAs should become Poppins for Foundations alignment, or remain a Founder-approved Warm ceremonial CTA exception in production.
3. Keep Cormorant / Great Vibes limited to letter/gallery editorial moments.

**No typography code redesign in this audit** — changing locked mode CTA/option fonts would be a visual redesign, not a blocker fix.

---

## 6. Journey results

| Mode            | Graph | Spot-check (mobile + desktop)                                                                | Restart                               | Invalid / unknown params                         |
| --------------- | ----- | -------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------ |
| Moments 1–10    | ✅    | Loading → gift-box → gift-opening; no-photo badge; desktop mount                             | → `warm.moments.celebrate-loading`    | `?mode=bogus` → Moments default                  |
| Connection 0–15 | ✅    | Gift-intro → locked-gift → challenge-invitation; no-photo badge; desktop mount               | → `warm.connection.celebrate-loading` | Unknown mode ignored                             |
| Memories 0–15   | ✅    | Welcome → locked → gift-locked → match-transition (START CHALLENGE); no-photo; desktop mount | → `warm.memories.celebrate-loading`   | Unknown mode ignored                             |
| Treasures 0–13  | ✅    | Welcome → grid; Final Gift locked; gift-content.1; deep-link ignored; no-photo; desktop      | → `warm.treasures.celebrate-loading`  | `?warmTreasuresScene=` not implemented → Scene 0 |

**Final Gift vs Final Reward (Treasures):** Final Gift = gold grid item locked until non-finals opened. Final Reward (unlock → letter → gallery/photobooth) starts only after Final Gift content dismiss. Locked terminology.

**No-photo:** `?noPhotos=1` badge on all modes; graphs skip gallery when `hasPhotos === false` (verified in prior mode gates + Treasures graph unit check).

---

## 7. Security and fixture truth

| Check                                        | Result                          |
| -------------------------------------------- | ------------------------------- |
| Synthetic fixtures only                      | ✅                              |
| No real customer data                        | ✅                              |
| No DB client / schema / migration / RLS      | ✅                              |
| No Theme Lab APIs / server actions           | ✅                              |
| No production quiz / match / Gift actions    | ✅                              |
| No `/e/[token]` Warm Scene Engine wiring     | ✅                              |
| No Studio / Preview production changes       | ✅                              |
| No `dangerouslySetInnerHTML` in Warm engines | ✅                              |
| No secrets / private Canva URLs              | ✅                              |
| Theme Lab `noindex`                          | ✅ `app/(theme-lab)/layout.tsx` |
| Absent from production nav                   | ✅                              |
| Unknown scene fallback                       | ✅ Host / graph safe            |

### Fixture truthfulness

| Mode             | Behavior                      | Live production claim? |
| ---------------- | ----------------------------- | ---------------------- |
| Connection score | Fixture score result          | ❌ Lab only            |
| Memories score   | Fixture score result          | ❌ Lab only            |
| Treasures unlock | Host-local `openedSortOrders` | ❌ Lab only            |
| Gallery photos   | Warm Moments + Bloom webps    | ❌ Synthetic           |

UI may reuse Moments CTA copy (“Unlock Memory Album”) across modes — presentation reuse, not a claim of live Memories unlock. Non-blocking copy debt for production.

---

## 8. Asset and performance findings

| Bucket                                   | Count           | Weight         |
| ---------------------------------------- | --------------- | -------------- |
| Runtime `public/themes/warm/moments/`    | 4               | **~341 KB** ✅ |
| Runtime `public/themes/warm/connection/` | 3               | **~333 KB** ✅ |
| Runtime Memories / Treasures             | 1 each (README) | ~1 KB          |
| Refs Moments                             | 14              | ~2.76 MB       |
| Refs Connection                          | 11              | ~10.5 MB       |
| Refs Memories                            | 3               | ~1.7 MB        |
| Refs Treasures                           | 4               | ~1.68 MB       |

- Design references stay under `design-references/warm/**` (not deploy-facing).
- Runtime Moments bouquet PNG is intentional deploy copy of a design-ref asset (acceptable).
- Non-blocking: Connection design-ref duplicate pair (`scene-07-score-calculation-ref.png` ≈ baked mockup) — clean in a future asset hygiene pass.
- Client-heavy Framer scenes (explosion, match, quiz transitions) acceptable for Theme Lab; revisit before production wrap.
- No Warm package/lockfile change.

---

## 9. Accessibility findings

| Finding                                                                                  | Class                                                                               |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Interactive gift-grid / match / quiz scenes use labels + reduced-motion in living scenes | Non-blocking Theme Lab debt when wrappers omit local a11y (delegate to Moments)     |
| Gallery CTA below the fold                                                               | Non-blocking Theme Lab debt · **required before production** discoverability review |
| Match option C / hint may need scroll                                                    | Non-blocking · revisit density before production                                    |
| Dark crimson contrast on cream                                                           | Non-blocking Theme Lab · **required before production** contrast pass               |
| Photobooth placeholder                                                                   | Safe deferral (Sprint 14)                                                           |
| Mode-generic reused CTA copy                                                             | Non-blocking copy debt                                                              |
| Full WCAG claim                                                                          | ❌ Not claimed                                                                      |

No Theme Lab lock blockers.

---

## 10. Production-impact verdict

| Surface              | Verdict                          |
| -------------------- | -------------------------------- |
| `/e/[token]`         | Unchanged · no Warm Scene Engine |
| Recipient production | Does not use Warm Scene Engine   |
| Preview / Studio     | Unchanged                        |
| DB / workflows       | Unchanged                        |
| Bloom Theme Lab      | Unchanged                        |
| Playful / Sky        | **Not started**                  |

| Readiness              | Verdict         |
| ---------------------- | --------------- |
| Theme Lab              | ✅ Ready        |
| Warm theme lock        | ✅ Ready        |
| Production integration | ⛔ Unauthorized |

---

## 11. Technical gate

| Check          | Result                                                                |
| -------------- | --------------------------------------------------------------------- |
| `tsc --noEmit` | ✅ Pass                                                               |
| ESLint (Warm)  | ✅ Pass                                                               |
| `next build`   | ✅ Pass                                                               |
| `npm audit`    | **Baseline unchanged:** **6** advisories (**3 high**, **3 moderate**) |

### `npm audit` baseline detail

| Severity | Count | Packages (production-relevant)                                |
| -------- | ----- | ------------------------------------------------------------- |
| High     | 3     | `next` (incl. nested `sharp` advisories via Next image stack) |
| Moderate | 3     | `next` advisories (cache / SSRF / DoS / disclosure class)     |

- **Production-relevant:** `next` and Next’s `sharp` dependency (image optimization).
- **Dev-only new advisories from Warm:** none — Warm introduced **no** package or lockfile change.
- Do **not** auto-run `npm audit fix --force` (would jump Next outside stated range).

---

## 12. Remaining non-blocking issues

1. Typography production follow-up (Poppins on functional controls) — see §5
2. Gallery CTA below-fold discoverability
3. Memories match vertical density / option C scroll
4. Photobooth Sprint 14 placeholder
5. Reused Moments CTA copy across modes
6. Connection design-ref duplicate PNG pair
7. Pre-existing npm audit baseline (6)
8. Production a11y / performance wrap pending

---

## 13. Required before production integration

1. Founder authorization to wire Warm Scene Engine to `/e/[token]`
2. Typography production pass (§5)
3. Accessibility / contrast / keyboard pass on immersive journeys
4. Performance wrap for Framer-heavy scenes + image strategy
5. Replace photobooth placeholder (Sprint 14)
6. Live quiz / match / Gift domain wiring (not fixtures)
7. Resolve or formally accept npm audit baseline under production policy

---

## 14. Final Warm lock decision

**Warm Theme Lab (Moments + Connection + Memories + Treasures) is APPROVED AND LOCKED as a complete visual theme pilot.**

Further Theme Lab changes require Founder unlock (regression / shared infra / security / a11y / explicit instruction).

**Playful may begin only after Founder approval** (and after this audit commit is pushed if Founder authorizes). Sky remains not started. Production `/e/[token]` remains **NOT AUTHORIZED**.

---

## 15. Lessons for Playful

1. Lock one mode at a time; run one full cross-mode audit before theme lock.
2. Prefer thin wrappers over forked scene copies.
3. Keep shared components presentation-only; put quiz/match/unlock logic in mode hosts.
4. Keep design references out of `public/`; reuse Moments runtime assets where possible.
5. Document fixture vs production truth in every mode gate.
6. Decide typography early against Foundations — avoid accumulating Outfit/serif CTA drift.
7. Do not wire `/e/` until the full theme audit passes and Founder authorizes production integration.
8. Reuse Bloom/Warm process docs; do not copy Warm crimson art into Playful.
