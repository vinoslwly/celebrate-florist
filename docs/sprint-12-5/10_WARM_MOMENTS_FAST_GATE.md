# Warm Moments — Fast Gate

> **Date:** 2026-07-22  
> **Checkpoint compared:** `1d42443` — `docs(theme-lab): Bloom handoff and next-theme readiness`  
> **Scope:** Theme Lab Warm Moments only · **not** a full Warm theme audit · Connection / Memories / Treasures **not started**  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## Verdict

**WARM MOMENTS FAST GATE PASSED**

### Founder follow-up (2026-07-22) — lock & push

| Item                                   | Status                                                   |
| -------------------------------------- | -------------------------------------------------------- |
| Founder approval                       | ✅ Warm Moments **locked** in Theme Lab                  |
| Commit                                 | `5f193e7` + follow-up commit (hygiene / no-photo / docs) |
| Push target                            | `origin/rebuild/foundation`                              |
| Production `/e/[token]` Scene Engine   | ⛔ Still **unauthorized**                                |
| Warm Connection / Memories / Treasures | **Not started**                                          |
| Full Warm theme audit                  | Deferred — see **Carry-forward for full Warm audit**     |

---

## Change set (vs Bloom handoff `1d42443`)

### Warm Moments-specific (new)

| Area           | Paths                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------- |
| Route          | `app/(theme-lab)/theme-lab/warm/page.tsx`                                                   |
| Lab UI         | `features/theme-lab/components/warm-theme-lab-page.tsx`                                     |
| Fixtures       | `features/theme-lab/config/warm-moments-fixtures.ts` (synthetic)                            |
| Theme fixture  | `features/themes/config/warm-moments-lab-theme.ts` (does not mutate production `warmTheme`) |
| Engine         | `features/experience/scene-engine/warm/moments/**` — host + graph + Scenes 1–9 + gift SVG   |
| Shared helper  | `features/experience/scene-engine/scene-viewport.ts` — scroll viewport class tokens         |
| Runtime assets | `public/themes/warm/moments/`                                                               |
| Design refs    | `design-references/warm/moments/` (**not** under `public/`)                                 |
| Docs           | `docs/sprint-12-5/09_WARM_MOMENTS_SCENE_01_START.md`, this file                             |

### Bloom components reused (pattern only — no Warm fork of locked Bloom living trees)

Warm Moments ships **Warm-specific scene files**. It reuses:

- Moments **scene graph intent** (loading → gift → open → confirm → transition → letter → album unlock → gallery → ending → hold)
- Shared `MomentsSceneProps` / published photo types
- Theme contract via `Theme` + `withThemePresentationFallbacks`
- Scroll helper `scene-viewport.ts` also applied to Bloom hosts/scenes for mobile overflow

Warm does **not** wrap Bloom Moments scene components to recolor them.

### Shared files changed (scroll infrastructure — theme-safe)

| File                                                             | Change                                                                     | Bloom impact                                   |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------- |
| `app/(theme-lab)/layout.tsx`                                     | Title → `Theme Lab — Celebrate Florist`                                    | Additive; still `noindex`                      |
| `features/themes/components/bloom-moments-decorations.tsx`       | Content shell `overflow-hidden`                                            | Layout only; no visual tokens                  |
| `*-scene-host.tsx` (moments / connection / memories / treasures) | Host stage `overflow-hidden` + fill height                                 | Mobile scroll ownership; no copy/art change    |
| Bloom mode scenes (moments / connection / memories / treasures)  | Root/content overflow → single scrollport; gift-box mobile bubbles in-flow | Additive UX fix; Bloom pink identity unchanged |
| Docs `08`, `README`                                              | Warm status → in progress / Moments living                                 | Status only                                    |

**No FOUNDER DECISION REQUIRED** — shared diffs are scroll/layout only, not Bloom redesign or identity leak.

### Confirmed absent

- No `package.json` / lockfile changes
- No env / schema / migration / RLS
- No new API or server actions
- No `/e/[token]` or production Scene Engine wiring
- No order / publish / Preview / Studio / workflow changes
- No secrets, credentials, or private Canva URLs
- No real customer data (Theme Lab fixtures only)

---

## Bloom reuse & regression

| Check                                    | Result                                                      |
| ---------------------------------------- | ----------------------------------------------------------- |
| Locked Bloom behavior                    | Unchanged visually; scroll classes only                     |
| Warm styling leak into Bloom             | Spot-check: no Warm scene IDs / crimson tokens on Bloom lab |
| Shared changes additive                  | Yes — overflow / host height / in-flow bubbles              |
| No whole Bloom scene copy for color swap | Warm scenes are separate files under `warm/moments/`        |
| Mode logic outside shared presentation   | Warm host owns Warm graph only                              |
| No Bloom asset path hardcoded in Warm    | Warm assets under `/themes/warm/moments/`                   |

Bloom tabs (Moments / Connection / Memories / Treasures) still mount and show expected initial scenes.  
**Follow-up regression (2026-07-22):** Warm default → gift-box ✅ · Bloom Moments + Connection ✅ · no `warm.moments` on Bloom ✅

---

## Theme identity

| Check                               | Result                                                                  |
| ----------------------------------- | ----------------------------------------------------------------------- |
| Warm identity (not recolored Bloom) | ✅ Crimson/burgundy field, cream cards, champagne gold                  |
| Ceremonial Moments journey          | ✅ Preserved end-to-end in Theme Lab                                    |
| Dark rose atmosphere                | ✅ Intentional `#6B0F16` / `#4A0A10` family                             |
| Contrast on dark surfaces           | ✅ Cream/gold on crimson; dark ink on cream strips                      |
| Body/UI sans                        | ⚠️ See **Typography — Outfit usage** (carry-forward to full Warm audit) |
| Ceremonial display type             | ✅ Cormorant / Great Vibes / serif where appropriate                    |
| Real HTML/React text & controls     | ✅ No full-page Canva screenshots at runtime                            |
| Theme contract                      | ✅ `warmMomentsLabTheme` fixture; production `warmTheme` untouched      |
| Too similar to Bloom?               | No — dark romantic vs Bloom blush                                       |
| Disconnected from Celebrate family? | No — same ceremonial Moments beats                                      |

No redesign performed in this gate.

### Typography — Outfit usage (carry-forward)

**Locked design-system rule (unchanged):**

- **Poppins** — body text, labels, controls, long-form content
- **Fraunces** — approved ceremonial use
- Other expressive fonts — short, intentional accents only

**Current Warm Moments Outfit usage (exact):**

| Location            | Elements using `Outfit`                | Role                                            |
| ------------------- | -------------------------------------- | ----------------------------------------------- |
| `letter-scene.tsx`  | “To:” / closing uppercase micro-labels | Short ceremonial label accent                   |
| `letter-scene.tsx`  | “Unlock Memory Album” CTA button       | **Control / button** — broader than accent-only |
| `gallery-scene.tsx` | Gallery continue CTA button            | **Control / button** — broader than accent-only |

**Not Outfit:**

- Letter **body paragraphs** use Cormorant Garamond (`editorial`) — long-form is **not** Poppins yet (separate review item for full Warm audit vs Foundations rule)
- Lab chrome / awaiting hold use system / mono / serif defaults — not Outfit

**Conclusion:** Outfit is **not** a global Warm UI replacement for Poppins, but it **is** used on CTAs (buttons) plus short letter labels — **broader than “short decorative accent only.”**  
**Action now:** Document only — **no large typography redesign** before push.  
**Required before full Warm theme lock:** Align Warm Moments UI sans to Poppins; keep Fraunces / approved ceremonial fonts for short moments; retire Outfit from buttons/labels or formally approve a limited accent exception.

---

## Logic & security

| Check                          | Result                                                                                         |
| ------------------------------ | ---------------------------------------------------------------------------------------------- |
| DB / schema / migration / RLS  | None                                                                                           |
| API / server actions           | None                                                                                           |
| `/e/[token]` wiring            | None — lab badge `/e/ not authorized`                                                          |
| Fixtures synthetic             | ✅ `warm-moments-fixtures.ts`                                                                  |
| Deep-link `?warmMomentsScene=` | Not implemented → **ignored safely** (invalid query does not crash; journey starts at Scene 1) |
| No-photo Lab fixture           | ✅ `?noPhotos=1` → empty photos; host chrome shows `no-photos`                                 |
| Unsafe HTML                    | None observed                                                                                  |
| New dependency                 | None                                                                                           |
| Theme Lab `noindex`            | ✅ `(theme-lab)/layout.tsx`                                                                    |
| Absent from production nav     | ✅ Lab-only route                                                                              |

### Safe no-photo path (Founder follow-up)

**Graph:** `features/experience/scene-engine/warm/moments/graph.ts`  
`hasPhotos === false` after album unlock → **skip gallery + gallery-ending** → `warm.moments.awaiting-next`  
(photobooth not built — same hold terminus as the photo journey)

| Requirement                    | Result                                        |
| ------------------------------ | --------------------------------------------- |
| No blank scene                 | ✅                                            |
| No dead end                    | ✅ hold screen with restart                   |
| No undefined photo access      | ✅ gallery not entered; Replay Gallery hidden |
| No production action / DB      | ✅ Theme Lab fixtures only                    |
| Normal photo journey unchanged | ✅ default fixtures still enter gallery       |

**Verification (2026-07-22):**

1. Code: `resolveNextWarmMomentsScene(album-unlock, { hasPhotos: false })` → `awaiting-next`; with photos → `gallery`
2. Browser: `/theme-lab/warm?noPhotos=1` trail  
   `gift-opening → letter-confirmation → letter-transition → letter → album-unlock → awaiting-next`  
   (no gallery) · hold copy includes “no-photo path” · Replay Gallery absent

---

### `npm audit` baseline (exact — Founder follow-up)

**Command:** `npm audit` (full tree; no Warm lockfile changes)

| Metric    | Count |
| --------- | ----- |
| **Total** | **6** |
| Critical  | 0     |
| High      | 3     |
| Moderate  | 3     |
| Low       | 0     |
| Info      | 0     |

| Advisory package            | Severity | Direct?                      | Prod vs dev                                            | Chain / notes                                                                                                     |
| --------------------------- | -------- | ---------------------------- | ------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `next`                      | high     | **direct** (`next@16.2.10`)  | production framework                                   | Via nested `sharp@0.34.5` under Next (libvips CVEs). Fix via force would downgrade Next — **do not auto-upgrade** |
| `sharp`                     | high     | transitive (under `next`)    | production image pipeline (Next)                       | Same advisory family as above                                                                                     |
| `fast-uri`                  | high     | transitive                   | **dev-tooling** path via `shadcn` → `@dotenvx` / `ajv` | CLI/codegen tooling; not Warm runtime scene code                                                                  |
| `shadcn`                    | moderate | **direct** (`shadcn@4.13.0`) | **devDependency** CLI                                  | Via `@modelcontextprotocol/sdk` → `@hono/node-server`                                                             |
| `@modelcontextprotocol/sdk` | moderate | transitive                   | **dev** (via shadcn)                                   | MCP SDK for shadcn CLI                                                                                            |
| `@hono/node-server`         | moderate | transitive                   | **dev** (via MCP SDK)                                  | Path traversal advisory on Windows static serve                                                                   |

**Introduced by Warm Moments?** **No.**  
`git diff 1d42443 HEAD -- package.json package-lock.json` → **empty**. Same baseline class as prior Bloom gates.

**Action now:** None required for Warm Moments lock/push (no new Critical/High from Warm).  
**Defer:** Repo-wide dependency hygiene to a dedicated security pass (avoid `npm audit fix --force` breaking Next 16).  
**Warm Moments push block?** Not applicable — no Warm-introduced Critical/High.

---

## Warm Moments journey

| Beat              | Scene ID                               | Result                                           |
| ----------------- | -------------------------------------- | ------------------------------------------------ |
| 1 Loading         | `warm.moments.celebrate-loading`       | ✅                                               |
| 2 Gift intro      | `warm.moments.gift-box`                | ✅                                               |
| 3 Gift open       | `warm.moments.gift-opening`            | ✅                                               |
| 4 Letter confirm  | `warm.moments.letter-confirmation`     | ✅                                               |
| 5 Rose rain       | `warm.moments.letter-transition`       | ✅ (auto)                                        |
| 6 Letter          | `warm.moments.letter`                  | ✅                                               |
| 7 Album unlock    | `warm.moments.album-unlock-transition` | ✅ (auto)                                        |
| 8 Gallery         | `warm.moments.gallery`                 | ✅ (when photos present)                         |
| 9 Gallery ending  | `warm.moments.gallery-ending`          | ✅ (when photos present)                         |
| Hold              | `warm.moments.awaiting-next`           | ✅ (photobooth **not** built — intentional hold) |
| No-photo skip     | album unlock → awaiting                | ✅ (Founder follow-up)                           |
| Restart → Scene 1 | —                                      | ✅                                               |

No unintentional Bloom pink assets/classes in Warm scenes.

---

## Assets

### Runtime `public/themes/warm/moments/` (after hygiene)

| File                        | Consumer                      | Size    |
| --------------------------- | ----------------------------- | ------- |
| `scene-01-atmosphere.webp`  | `celebrate-loading-scene.tsx` | ~31 KB  |
| `scene-01-rose-icon.png`    | `celebrate-loading-scene.tsx` | ~158 KB |
| `scene-02-rose-bouquet.png` | `gift-box-scene.tsx`          | ~151 KB |
| `README.md`                 | docs                          | ~1 KB   |

| Metric             | Before  | After                     |
| ------------------ | ------- | ------------------------- |
| Runtime file count | 10      | **4** (3 images + README) |
| Runtime weight     | ~640 KB | **~341 KB**               |

**Removed unused runtime (safe — no consumers):**

- `scene-01-corner-{tl,tr,bl,br}.webp` (Bloom-style corners never wired in Warm Scene 1)
- `scene-01-rose-icon.webp` (PNG is the live consumer)
- `scene-03-gift-box.png` (gift is SVG in `warm-gift-box.tsx`)

**Preserved:** `design-references/warm/moments/` (~14 files / ~2.82 MB) — outside `public/`.

**500 KB guardrail:** Satisfied after cleanup (~341 KB). Rose PNG + bouquet PNG justify remaining weight (transparent brand mark + bouquet accent); no further optimization required for this lock.

---

## Spot-check

### Mobile ~390×844

Full journey S1→awaiting + restart + invalid query: **PASS**  
Scroll ownership: single scene scrollport (host `overflow-hidden`): **PASS**  
Contrast / no blank scenes: **PASS**

### Desktop ~1280×800

Warm load → gift-box → CTA advances: **PASS**  
Bloom Moments + Connection + Memories + Treasures tabs: **PASS**  
Warm leak into Bloom: **PASS** (none)  
No-photo fixture (`?noPhotos=1`): **PASS** (2026-07-22)

### Console

No material runtime **errors** during spot-check session.

---

## Technical gate

| Gate                        | Result                                                                    |
| --------------------------- | ------------------------------------------------------------------------- |
| `tsc --noEmit`              | ✅ Pass (fast gate + Founder follow-up)                                   |
| ESLint (Warm Moments paths) | ✅ Pass                                                                   |
| `next build`                | ✅ Pass — routes include `/theme-lab/warm` + `/theme-lab/bloom`           |
| Automated tests             | None in repo for Theme Lab scenes                                         |
| `npm audit`                 | **6** vulns (3 high, 3 moderate) — **pre-existing**; none Warm-introduced |

### Fixes applied during gate / follow-up

1. Nested scroll regression: host/shell no longer compete with scene scrollports
2. Lint blockers in Warm letter-transition / gallery-ending / album-unlock / gift-box / letter-confirmation
3. JSX comment textnodes (`{"// …"}`)
4. No-photo graph + Lab `?noPhotos=1` fixture
5. Unused runtime asset removal

---

## Carry-forward for full Warm audit (unresolved)

Keep visible until the **full Warm theme lock**:

1. **Typography discipline** — Outfit on CTAs/labels; letter body Cormorant vs Poppins Foundations rule — required review; no redesign in this push
2. **Photobooth terminal** — awaiting Founder reference (hold screen intentional)
3. **Optional:** Further asset compression of rose/bouquet PNGs only if needed later (currently under 500 KB guardrail)
4. **Repo `npm audit`** — 6 pre-existing advisories; dedicated security pass (do not force-upgrade Next via audit fix)
5. **Warm Connection / Memories / Treasures** — not started
6. **Production `/e/[token]` Scene Engine** — still **unauthorized**

---

## Documentation & git

- This file: `docs/sprint-12-5/10_WARM_MOMENTS_FAST_GATE.md` (updated for Founder lock follow-up)
- Progress pointers in sprint-12-5 README / handoff
- Production integration remains **unauthorized**
- Warm Connection / Memories / Treasures: **not started**
- Do **not** amend pushed Bloom commits

---

## Final checklist answers

1. **Verdict:** PASSED → Founder **locked**
2. **Warm changes:** Theme Lab Warm Moments stack + assets + graph skip + docs
3. **Bloom reuse:** Graph/types/theme contract + scroll helper; no recolored Bloom scene forks
4. **Shared impact:** Mobile scroll layout only — Bloom identity intact
5. **Visual identity:** Distinct Warm crimson luxury — Celebrate family aligned
6. **DB/API/workflow:** None
7. **Security:** Lab isolation + noindex + fixtures — OK; audit pre-existing only
8. **Journey:** S1–9 + awaiting + restart + no-photo skip OK
9. **Mobile spot-check:** PASS
10. **Desktop spot-check:** PASS
11. **Restart:** PASS
12. **Invalid deep-link:** Ignored safely
13. **Bloom regression:** PASS
14. **Console:** No material errors
15. **Assets:** Runtime **~341 KB / 4 files** after hygiene
16. **Tech:** tsc ✅ · Warm lint ✅ · build ✅ · audit 6 pre-existing
17. **Outfit:** Documented — carry-forward to full Warm audit
18. **No-photo:** Verified code + browser
19. **Docs:** This fast-gate doc updated
20. **Other Warm modes:** Not started
21. **`/e/[token]`:** Unauthorized

---

`WARM MOMENTS LOCKED — CARRY-FORWARD NOTES PRESERVED`
