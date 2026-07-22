# Warm Connection — Fast Gate

> **Date:** 2026-07-22  
> **Checkpoint compared:** `d6ce7e7` — `docs(theme-lab): lock Warm Moments with no-photo path and carry-forwards`  
> **Scope:** Theme Lab Warm Connection only · **not** a full Warm theme audit · Memories / Treasures **not started**  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## Verdict

**WARM CONNECTION FAST GATE PASSED**

### Founder follow-up (2026-07-22) — lock & push

| Item                                 | Status                                                            |
| ------------------------------------ | ----------------------------------------------------------------- |
| Founder approval                     | ✅ Warm Connection **APPROVED AND LOCKED** in Theme Lab           |
| Pilot commit                         | `47a2c4e` — `feat(theme-lab): add and lock Warm Connection pilot` |
| Docs follow-up                       | (this update) — lock notes + carry-forwards                       |
| Push target                          | `origin/rebuild/foundation`                                       |
| Production `/e/[token]` Scene Engine | ⛔ Still **unauthorized**                                         |
| Warm Memories / Treasures            | **Not started**                                                   |
| Full Warm theme audit                | Required after all four Warm modes — see **Carry-forward** below  |

Working tree prepared for Founder-authorized push after the documentation follow-up commit.

---

## Change set (vs Warm Moments lock `d6ce7e7`)

### Warm Connection-specific (new)

| Area           | Paths                                                                                           |
| -------------- | ----------------------------------------------------------------------------------------------- |
| Engine         | `features/experience/scene-engine/warm/connection/**` — graph, host, types, Scenes 0–15         |
| Fixtures       | `features/theme-lab/config/warm-connection-fixtures.ts` (synthetic quiz + score + experience)   |
| Lab UI         | `features/theme-lab/components/warm-theme-lab-page.tsx` — `?mode=connection`, no-photo for both |
| Runtime assets | `public/themes/warm/connection/` (`quiz-question-bg.webp`, `score-reveal-bg.webp`, README)      |
| Design refs    | `design-references/warm/connection/` (**not** under `public/`)                                  |
| Docs           | This file                                                                                       |

### Warm Moments reused / extended (additive, theme-safe)

| Change                                                   | Why                                                              |
| -------------------------------------------------------- | ---------------------------------------------------------------- |
| `WarmGiftOpeningScene` + `lockedOnly`                    | Connection Scene 2 locked gift (3 failed taps)                   |
| `WarmGiftBox` + `ajar` variant                           | Connection score-calculation glow                                |
| Moments letter / album unlock / gallery / gallery-ending | Connection Scenes 11–14 wrappers                                 |
| New `warm.moments.photobooth` stub                       | Completes Moments terminal; Connection Scene 15 reuses same stub |
| Moments graph: awaiting-next → photobooth                | Aligns Moments terminus with Connection reuse                    |

Default Moments path (`lockedOnly=false`) still opens gift → letter as before.

### Bloom / shared (outside Warm)

| Area                                                    | Result                     |
| ------------------------------------------------------- | -------------------------- |
| Bloom Moments / Connection / Memories / Treasures trees | **Unchanged** vs `d6ce7e7` |
| `package.json` / lockfile                               | **Unchanged**              |
| schema / migration / RLS / API / server actions         | **None**                   |
| `/e/[token]`, Studio, Preview, orders, publish          | **None**                   |

**No FOUNDER DECISION REQUIRED** — Warm Moments diffs are explained Connection-enabling extensions; Bloom identity untouched.

### Clutter removed during gate

- Unused runtime PNG archives (`quiz-question-bg.png`, `score-reveal-bg.png` — ~6.5 MB)
- One-off preview refs `_s8-bg-*.png`
- One-off scripts `scripts/clean-score-reveal-bg.mjs`, `scripts/clear-s8-cta-ghost.mjs`

---

## Shared-code impact

| Consumer         | Impact                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| Warm Moments     | Additive: photobooth stub terminal; optional `lockedOnly` / `ajar` unused by default Moments journey |
| Bloom Moments    | None                                                                                                 |
| Bloom Connection | None                                                                                                 |
| Bloom Memories   | None                                                                                                 |
| Bloom Treasures  | None                                                                                                 |

Quiz logic stays in Warm Connection host/graph + lab fixtures. No Connection quiz logic leaked into Moments presentation components beyond the intentional `lockedOnly` prop.

---

## Warm identity

| Check                                 | Result                                                                    |
| ------------------------------------- | ------------------------------------------------------------------------- |
| Crimson / cream / gold family         | ✅                                                                        |
| Distinct from Warm Moments            | ✅ Relational quiz + score beats; Moments remains ceremonial gift→letter  |
| Not merely Bloom Connection recolored | ✅ Warm gift SVG, scrapbook quiz BG, crimson celebration — not blush pink |
| Real HTML/React text & controls       | ✅ No full-page Canva screenshots at runtime                              |
| Full-page mockup plates               | Avoided; Scene 8 uses blank flat-lay atmosphere only                      |

---

## Typography

| Rule                               | Observation                                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| Poppins default for UI/labels/body | Warm Connection scenes mostly use `font-sans` / theme defaults + `font-serif` for headlines |
| Outfit expansion                   | **None in Warm Connection** (Outfit remains only in reused Warm Moments letter/gallery)     |
| Ceremonial fonts                   | Serif on quiz prompts, score headlines, CTAs (editorial Moments-style)                      |
| Long-form                          | Letter body comes from Moments letter scene (Cormorant carry-forward from Moments gate)     |

**Carry-forward to full Warm audit:** CTA / quiz option serif vs Poppins Foundations discipline (same family of issue as Moments Outfit notes). No redesign in this gate.

---

## Logic & security

| Check                                 | Result                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------ |
| DB / schema / migration / RLS         | None                                                                     |
| APIs / server actions                 | None                                                                     |
| Production quiz submit                | None — fixture score only                                                |
| `/e/[token]` wiring                   | Unauthorized / untouched                                                 |
| Secrets / private Canva / credentials | None in tree                                                             |
| Unsafe HTML                           | None                                                                     |
| Fixtures                              | Synthetic (`theme-lab-warm-connection`)                                  |
| Theme Lab `noindex`                   | ✅ `app/(theme-lab)/layout.tsx`                                          |
| Outside production nav                | ✅ Theme Lab routes only                                                 |
| Deep-link `?warmConnectionScene=`     | **Not implemented** — invalid values ignored (journey starts at Scene 0) |
| Invalid scene IDs in graph            | `resolveNext` → `null`; host unknown-scene fallback                      |
| Dependencies                          | No lockfile change                                                       |

### `npm audit` baseline (unchanged)

**6** vulnerabilities: **3 high**, **3 moderate**, **0 critical** — pre-existing (`next`/`sharp`, `fast-uri`, `@hono/node-server` chain via tooling). **Warm Connection introduced no new advisory and no lockfile change.**

---

## Warm Connection journey

| Beat                | Scene ID                                 | Result                              |
| ------------------- | ---------------------------------------- | ----------------------------------- |
| 0 Loading           | `warm.connection.celebrate-loading`      | ✅ timed                            |
| 1 Gift intro        | `warm.connection.gift-introduction`      | ✅ CTA                              |
| 2 Locked gift       | `warm.connection.locked-gift`            | ✅ 3 shakes → advance               |
| 3 Challenge         | `warm.connection.challenge-invitation`   | ✅ Start Challenge                  |
| 4 Quiz transition   | `warm.connection.quiz-transition`        | ✅ auto ~2s                         |
| 5 Quiz intro        | `warm.connection.quiz-introduction`      | ✅ Start quiz                       |
| 6 Questions         | `warm.connection.quiz.question.{n}`      | ✅ 5 lab Qs, tap advances           |
| 7 Score calc        | `warm.connection.score-calculation`      | ✅ timed                            |
| 8 Score reveal      | `warm.connection.score-reveal`           | ✅ fixture 92%                      |
| 9 Celebration       | `warm.connection.celebration-transition` | ✅ auto ~2.3s                       |
| 10 Letter emergence | `warm.connection.letter-emergence`       | ✅ auto ~1.4s, **no CTA**           |
| 11 Letter           | `warm.connection.letter-reveal`          | ✅ Moments letter                   |
| 12 Gallery unlock   | `warm.connection.gallery-unlock`         | ✅ Moments album unlock             |
| 13 Gallery          | `warm.connection.gallery`                | ✅ when photos                      |
| 14 Gallery ending   | `warm.connection.gallery-ending`         | ✅                                  |
| 15 Photobooth       | `warm.connection.photobooth`             | ✅ Moments stub (Sprint 14 pending) |
| No-photo            | unlock → photobooth                      | ✅ graph + Lab `?noPhotos=1`        |
| Restart             | → Scene 0                                | ✅                                  |

### Quiz scoring truth

**Fixture-based** — `WARM_CONNECTION_LAB_SCORE_RESULT` (`percent: 92`). Theme Lab does **not** call production quiz actions. Answers are not graded live.

### Edge cases

| Case                                 | Result                                |
| ------------------------------------ | ------------------------------------- |
| Empty quiz (`quizQuestionCount: 0`)  | intro → score-calculation             |
| Invalid question index / bogus scene | parse → null; resolve → null          |
| Repeated answer taps                 | selection locks; single timed advance |
| Invalid `?warmConnectionScene=`      | ignored                               |
| No photos                            | gallery skipped                       |
| Restart after photobooth             | celebrate-loading → gift-introduction |

---

## Assets

### Runtime `public/themes/warm/connection/` (after hygiene)

| File                    | Consumer                          | Size    |
| ----------------------- | --------------------------------- | ------- |
| `quiz-question-bg.webp` | quiz-question + score-calculation | ~188 KB |
| `score-reveal-bg.webp`  | score-reveal                      | ~145 KB |
| `README.md`             | docs                              | ~1 KB   |

| Metric             | Value                     |
| ------------------ | ------------------------- |
| Runtime file count | **3** (2 images + README) |
| Runtime weight     | **~333 KB**               |

Under the existing ~500 KB Moments-style guardrail. PNG archives removed (unused at runtime).

### Design references `design-references/warm/connection/`

| Metric     | Value        |
| ---------- | ------------ |
| File count | **11**       |
| Weight     | **~10.7 MB** |

Outside `public/`. Includes Founder refs + baked mockups kept for design history (not runtime).

---

## Spot-check

### Mobile ~390×844

Full journey gift-intro → photobooth + restart: **PASS**  
Quiz CTAs / answer selection: **PASS**  
Invalid deep-link ignored: **PASS**  
Scroll usable: **PASS**

### Desktop ~1280×800

Warm Connection load → gift CTA → locked-gift: **PASS**  
Warm Moments still advances to gift-box: **PASS**  
Bloom Moments + Connection tabs: **PASS** (`moments.*` / `connection.*` — no `warm.` leak)

### Console

No material runtime **errors** during spot-check (DevTools / HMR info only).

---

## Technical gate

| Gate                                           | Result                                      |
| ---------------------------------------------- | ------------------------------------------- |
| `tsc --noEmit`                                 | ✅                                          |
| ESLint (Warm Connection + touched Moments/lab) | ✅                                          |
| `next build`                                   | ✅ — `/theme-lab/warm` + `/theme-lab/bloom` |
| Automated Theme Lab tests                      | None in repo                                |
| `npm audit`                                    | 6 pre-existing; no Warm-introduced change   |

### Fixes applied during gate

1. Removed unused runtime PNGs (~6.5 MB)
2. Removed preview clutter + one-off scripts
3. Wired `?noPhotos=1` for Connection gallery skip (parity with Moments)

---

## Carry-forward for full Warm audit

Keep visible until the **full Warm theme lock** (after Moments + Connection + Memories + Treasures):

### Typography

- Warm Connection introduced **no new Outfit** usage
- Serif is still used on some quiz prompts, score headings, CTAs, and reused letter content
- Full Warm audit must decide whether functional controls return to **Poppins** or receive a formal Warm exception
- Do **not** allow typography drift to spread silently into Memories or Treasures

### Fixture truth

- Connection score remains fixed at **`92%`**
- Answers are **not** graded live
- No production quiz action is called
- Do **not** treat Theme Lab scoring as production-ready

### Shared Warm components

- `lockedOnly`, `ajar`, and the Warm photobooth stub are **additive**
- Warm Moments **default** journey must remain unchanged
- Bloom remains unaffected
- Shared components must stay **presentation-only**

### Deferred items

- Gift-introduction emoji/helper chrome needs later polish
- Photobooth remains a **Sprint 14** stub
- Optional Warm Connection deep-link whitelist is **not** implemented
- Repo dependency audit still has **6** pre-existing advisories (**3 high**, **3 moderate**)
- Production `/e/[token]` integration remains **unauthorized**

### Asset rules

- Runtime Connection assets remain approximately **333 KB**
- Design references stay **outside** `public/`
- Do **not** restore removed PNG archives or one-off preview files
- Reuse shared Warm assets instead of duplicating them in future modes

### Modes not started

- Warm Memories — **not started**
- Warm Treasures — **not started**
- Full Warm theme audit — **required** after all four modes

---

## Documentation & git

- This file: `docs/sprint-12-5/11_WARM_CONNECTION_FAST_GATE.md`
- Progress pointers in sprint-12-5 README / handoff
- Pilot commit: `47a2c4e`
- Follow-up docs commit: `docs(theme-lab): lock Warm Connection and preserve carry-forwards`
- Do **not** amend pushed Bloom or Warm Moments commits
- Push authorized by Founder to `origin/rebuild/foundation`

---

## Final checklist answers

1. **Verdict:** PASSED → Founder **APPROVED AND LOCKED**
2. **Warm Connection changes:** Engine 0–15 + fixtures + assets + lab mode
3. **Reuse:** Warm Moments gift/letter/gallery/photobooth + additive Moments props/graph
4. **Shared impact:** Warm Moments only (additive); Bloom unchanged
5. **Visual identity:** Warm crimson family; Connection quiz identity preserved
6. **Typography:** No new Outfit; serif CTA drift recorded for full audit
7. **DB/API/workflow:** None
8. **Security:** Lab isolation + fixtures + noindex; audit baseline unchanged
9. **Quiz scoring:** Fixture-based (not live) — **not** production-ready
10. **Mobile spot-check:** PASS
11. **Desktop spot-check:** PASS
12. **Full journey:** PASS
13. **Restart:** PASS
14. **Invalid deep-link:** Ignored safely
15. **No-photo path:** PASS (graph + lab fixture)
16. **Warm Moments regression:** PASS
17. **Bloom regression:** PASS
18. **Console:** No material errors
19. **Assets:** Runtime ~333 KB / 3 files; refs outside `public/`
20. **Tech:** tsc ✅ · lint ✅ · build ✅ · audit 6 pre-existing
21. **Fixes:** Asset hygiene + Connection `noPhotos`
22. **Non-blocking / carry-forward:** See section above
23. **Docs:** This file + README/handoff pointers (lock follow-up)
24. **Git:** Pilot `47a2c4e` + docs follow-up on `rebuild/foundation`
25. **Push:** Authorized — sync to `origin/rebuild/foundation`
26. **Locked:** ✅ Theme Lab Warm Connection
27. **Memories / Treasures:** Not started · `/e/[token]` unauthorized

---

`WARM CONNECTION LOCKED AND PUSHED — CARRY-FORWARD NOTES PRESERVED`
