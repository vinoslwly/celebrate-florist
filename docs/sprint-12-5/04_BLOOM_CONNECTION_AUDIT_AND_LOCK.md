# Bloom Connection — Independent Audit and Lock

> **Date:** 2026-07-21  
> **Branch:** `rebuild/foundation`  
> **Baseline (last pushed Bloom Moments):** `b96c1b2` — `feat(theme-lab): add and lock Bloom Moments pilot`  
> **Auditor stance:** Independent senior engineer / security / regression (devil’s advocate)  
> **Overall verdict:** **PASS** — Theme Lab Connection ready to lock

---

## 1. Executive verdict

Bloom Connection Theme Lab (Scenes **0–15**) is complete as a presentation pilot: living scenes, synthetic fixtures, no production `/e/[token]` wiring, no schema/API/server-action changes, and Moments journey preserved under explicit reuse wrappers plus one safe shared gift motif.

**Production Scene Engine / `/e/[token]` remain NOT AUTHORIZED.**  
**Bloom Memories and Treasures remain NOT STARTED.**

---

## 2. Exact change set (vs `b96c1b2`)

### 2.1 Connection-specific (created)

| Path                                                     | Classification                           |
| -------------------------------------------------------- | ---------------------------------------- |
| `features/experience/scene-engine/connection/**`         | Connection-specific                      |
| `features/theme-lab/config/bloom-connection-fixtures.ts` | Connection-specific · synthetic fixtures |
| `design-references/bloom/connection/**`                  | Reference only (not deploy-facing)       |

### 2.2 Shared / Moments-compatible (modified)

| Path                                                                     | Classification              | Effect                                                                                                       |
| ------------------------------------------------------------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `features/experience/scene-engine/shared/bloom-gift-box.tsx`             | Shared infrastructure (new) | Canonical gift SVG for Moments + Connection                                                                  |
| `features/experience/scene-engine/moments/scenes/gift-opening-scene.tsx` | Shared compatibility        | Uses `BloomGiftBox`; optional `lockedOnly` for Connection Scene 2 (default `false` — Moments path unchanged) |
| `features/theme-lab/components/bloom-theme-lab-page.tsx`                 | Theme Lab                   | Connection tab + lab deep-link `?connectionScene=`                                                           |
| `app/(theme-lab)/theme-lab/bloom/page.tsx`                               | Shared Theme Lab route      | `Suspense` for `useSearchParams` (build requirement)                                                         |

### 2.3 Documentation

Connection architecture, Sprint 12.5 README/pilot plan, DDR-S12-035, FD notes, ADR S11-006 trigger wording — documentation only.

### 2.4 Unrelated / clutter cleaned before lock

Working-tree CRLF “modified” noise on Sprint 12 Core UI docs and `components/ui/*` had **empty content diffs** vs HEAD — restored to clean. **No package/lockfile changes.** **No supabase / API / `/e/` diffs.**

### 2.5 Requires Founder review (non-blocking)

| Item                                                         | Note                                                                |
| ------------------------------------------------------------ | ------------------------------------------------------------------- |
| Letter CTA copy **“Unlock Memories”** on Connection Scene 11 | Intentional Moments reuse; mode-specific CTA later if Founder wants |
| Photobooth Scene 15                                          | Moments placeholder; Sprint 14 redesign deferred                    |
| Connection Preview (static) tab                              | Not built — Scene journey only                                      |
| Lab score is fixture (`92%`)                                 | Not computed from answers (Theme Lab CF-1 warm path)                |

---

## 3. Moments reuse findings

| Connection scene    | Moments source                    | Safe?                                  |
| ------------------- | --------------------------------- | -------------------------------------- |
| 0 celebrate-loading | `CelebrateLoadingScene` wrapper   | ✅ Thin wrap                           |
| 1 gift-introduction | `GiftBoxScene` wrapper            | ✅ Thin wrap                           |
| 2 locked-gift       | `GiftOpeningScene` + `lockedOnly` | ✅ Default Moments open path unchanged |
| 11 letter-reveal    | `LetterScene`                     | ✅ Thin wrap (CTA copy Moments-native) |
| 12 gallery-unlock   | `AlbumUnlockTransitionScene`      | ✅ Thin wrap                           |
| 13 gallery          | `GalleryScene`                    | ✅ Thin wrap                           |
| 14 gallery-ending   | `GalleryEndingScene`              | ✅ Thin wrap                           |
| 15 photobooth       | `PhotoboothScene`                 | ✅ Thin wrap / placeholder             |

**Photos:** Connection gallery re-exports `BLOOM_MOMENTS_LAB_PHOTOS` — no duplicate assets.

**Shell:** `MomentsPersistentShell` reused for lab chrome consistency (bare for immersive scenes).

---

## 4. Shared-code impact

- **`BloomGiftBox`:** Extracted Moments gift visual; Connection closed/ajar/open variants. Moments gift-opening now imports shared component — visual continuity, not a Moments redesign.
- **`lockedOnly`:** Additive prop; Moments registry does not pass it.
- **Theme Lab page Suspense:** Required for Next.js `useSearchParams`; Moments tab unaffected.

---

## 5. Database / API / workflow

| Area                               | Result                                    |
| ---------------------------------- | ----------------------------------------- |
| Schema / migrations / RLS          | ❌ Unchanged                              |
| APIs / server actions              | ❌ Unchanged                              |
| Order / publish / preview approval | ❌ Unchanged                              |
| Production `/e/[token]`            | ❌ Unchanged · Scene Engine **not** wired |
| Theme Lab data                     | Synthetic fixtures only · no DB client    |

---

## 6. Security

| Check                                | Result                                                  |
| ------------------------------------ | ------------------------------------------------------- |
| Secrets / private Canva URLs         | ❌ None in Connection tree                              |
| Real user data                       | ❌ Synthetic names/IDs                                  |
| Unsafe HTML                          | ❌ No `dangerouslySetInnerHTML`                         |
| Query params                         | Lab deep-link whitelisted to known Connection scene IDs |
| DB / production actions in Theme Lab | ❌ None                                                 |
| New dependencies                     | ❌ None                                                 |
| `npm audit`                          | **0 vulnerabilities**                                   |

---

## 7. Quiz logic (Theme Lab)

| Behavior           | Result                                                                  |
| ------------------ | ----------------------------------------------------------------------- |
| Question order     | Fixture `sortOrder` 0–4 · graph advances `quiz.question.{n}`            |
| Answer selection   | Tap → brief hold → next · no Correct/Wrong                              |
| Score calculation  | Lab uses static `BLOOM_CONNECTION_LAB_SCORE_RESULT` (not live submit)   |
| Score-band mapping | Fixture headline/message only                                           |
| Completion path    | Score → celebration → letter emergence → letter → gallery* → photobooth |
| Restart            | Lab chrome “Restart journey”                                            |
| Empty quiz         | Graph skips to score-calculation if `count === 0`                       |
| No photos          | Gallery unlock → photobooth (skip gallery/ending)                       |

Production `submitQuizAnswersAction` is **not** called from Theme Lab (authorized isolation).

---

## 8. Visual / journey

Theme Lab route `/theme-lab/bloom` · Connection tab · Scene journey 0–15 living.  
Founder iterative visual review during implementation (Scenes 2–4, 7 gift continuity).  
Deep-link: `?connectionScene=connection.*` (held when not initial for timed scenes).

Automated full mobile/desktop browser matrix not re-run in this audit pass; production build + typecheck + lint gate the engineering surface. Founder visual lock remains the visual authority.

---

## 9. Moments regression

- Moments path: `lockedOnly` defaults false → open + letter unchanged.
- Gift SVG moved to shared module with same geometry/colors.
- Moments tab still enabled and locked in Theme Lab UI.

---

## 10. Asset hygiene

| Location                              | Count / weight                           | Role                                   |
| ------------------------------------- | ---------------------------------------- | -------------------------------------- |
| `public/themes/bloom/connection/`     | **Absent (0)**                           | Correct — no Connection runtime copies |
| `public/themes/bloom/moments/`        | Reused for Scenes 0–1 / gallery fixtures | Existing Moments runtime               |
| `design-references/bloom/connection/` | **10 files · ~3.48 MB**                  | Founder references only                |

No private Canva links in README.

---

## 11. Quality gate

| Gate                | Result                            |
| ------------------- | --------------------------------- |
| `npm run typecheck` | ✅ Pass                           |
| `npm run lint`      | ✅ Pass (Connection errors fixed) |
| `npm run build`     | ✅ Pass                           |
| `npm test`          | ⏸ No test script                  |
| `npm audit`         | ✅ 0 vulnerabilities              |

### Fixes applied during audit

1. Suspense boundary for Theme Lab `useSearchParams` (build blocker).
2. Whitelist Connection deep-link scene IDs.
3. Guard unknown lab scene in `ConnectionSceneHost`.
4. ESLint `react-hooks/set-state-in-effect`: celebration mount → `useSyncExternalStore`; quiz selection reset via host remount; score count-up no sync setState when reduced-motion.
5. Import order cleanups.
6. Restored CRLF-only noise files unrelated to Connection.

---

## 12. Remaining non-blocking issues

- Connection letter CTA still says “Unlock Memories” (Moments copy).
- Photobooth remains Moments placeholder.
- Connection Preview surface not implemented.
- Lab score not derived from answers (by design for Theme Lab).
- Manual Founder visual spot-check recommended after pull on target devices.

---

## 13. Documentation synchronized

- This file: `docs/sprint-12-5/04_BLOOM_CONNECTION_AUDIT_AND_LOCK.md`
- Sprint 12.5 README updated to Connection **LOCKED** status after this audit
- Pilot plan / architecture already describe Scene 0–15 Theme Lab scope

---

## 14. Lessons for next mode (Memories)

**Reuse that worked**

- Thin wrappers over locked Moments scenes (no fork).
- Shared gift motif (`BloomGiftBox`) instead of per-scene SVG forks.
- Static Theme Lab fixtures + host graph separate from production submit.

**Do not copy again**

- Do not invent alternate gift/box SVG per scene.
- Do not wire production submit/DB into Theme Lab “to feel real.”
- Do not paste Founder PNGs as full interactive screens.

**Now considered locked / shared**

- `features/experience/scene-engine/shared/bloom-gift-box.tsx`
- Moments scenes reused by Connection wrappers (still Moments-locked)

**Must stay mode-specific**

- Connection quiz graph, question UI, score copy, challenge invitation, celebration fireworks
- Memories gate / binder logic (when started) must not share Connection quiz graph

---

## 15. Git / push readiness

See commit after this document lands. Push is **not** automatic — Founder must authorize.

**Memories may begin only after Founder approval** of this lock + explicit Memories start instruction.

---

## Final line

`BLOOM CONNECTION LOCKED — WORKING TREE CLEAN — READY FOR GIT PUSH`
