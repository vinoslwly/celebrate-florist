# Full Sky Theme Audit and Lock

> **Date:** 2026-08-02  
> **Branch:** `rebuild/foundation` · baseline `54a3b6a` on `origin/rebuild/foundation` (0/0)  
> **Mode locks:** Moments `42a6c88` · Connection `6941977` · Memories `8652d50` · Treasures `d67bee2`  
> **Auditor stance:** Independent cross-mode Theme Lab review (challenge fast-gate claims; verify from code + browser)  
> **Scope:** Complete Sky Theme Lab (four modes) + direct shared Sky Moments presentation APIs  
> **Not in scope:** Playful · production Scene Engine · Bloom/Warm deep audit · broad redesign  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## 1. Executive verdict

**PASS — Sky is ready to lock as a complete Theme Lab theme.**

All four Sky modes own separable graphs/hosts, share only presentation-safe Moments APIs (`lockedOnly`, `ajar`, `tone`), keep mode business state local, use synthetic fixtures only, and stay outside `/e/[token]`. Technical gate is green. Cross-mode mounts, graph edges, no-photo skips, and Treasures Final Gift lock behavior are verified. No unexplained package, schema, API, or production-facing changes since the Treasures lock.

| Readiness                              | Verdict                             |
| -------------------------------------- | ----------------------------------- |
| Theme Lab visual readiness             | ✅ Ready                            |
| Complete Sky theme lock readiness      | ✅ Ready to lock                    |
| Production Scene Engine / `/e/[token]` | ⛔ **Not authorized** — do not wire |

**No FOUNDER DECISION REQUIRED** blockers.

### Founder follow-up (2026-08-04) — Sky lock, Playful freeze, push

| Item                                 | Status                                                                |
| ------------------------------------ | --------------------------------------------------------------------- |
| Founder approval                     | ✅ Full Sky Theme Lab **APPROVED AND LOCKED**                         |
| Audit commit                         | `43c65f3` — `docs(theme-lab): audit and lock complete Sky theme`      |
| Scope-freeze docs                    | `docs(project): freeze Playful and record three-theme release scope`  |
| Push target                          | `origin/rebuild/foundation`                                           |
| Release scope                        | **3 themes × 4 modes** — Bloom · Warm · Sky only                      |
| Playful                              | 🧊 **FROZEN** — not a concept rejection; post-publication phase later |
| Production `/e/[token]` Scene Engine | ⛔ Still **unauthorized**                                             |

### Preserved Sky carry-forwards (production / later)

- Sky Moments is effectively a **shared presentation surface**; changes can affect Connection / Memories / Treasures.
- `lockedOnly`, `ajar`, and `tone` must remain **small presentation APIs**.
- Quiz and match option text require a **Poppins/sans** pass before production.
- Memories empty dataset requires an **explicit fallback** before live data.
- Continuous-motion CTAs require **reduced-motion and usability** review.
- Sky gallery photos still use **fixture stand-ins** (Bloom Moments paths).
- Photobooth remains the **Sprint 14** placeholder.
- Current `npm audit` baseline is **7 vulnerabilities: 5 high, 2 moderate** — do not run `npm audit fix --force`.
- Live scoring, Gift actions, and production persistence are **not implemented**.
- `/e/[token]` remains **unauthorized**.

---

## 2. Critical findings

| Severity             | Finding                                                                    | Disposition                                                                            |
| -------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Medium (coupling)    | `lockedOnly` fail-count → `onComplete` lives inside Moments `gift-opening` | Accept for Theme Lab; **Playful lesson** — prefer thinner ceremony APIs                |
| Medium (Foundations) | Quiz + match **option controls** use `font-serif` (Fraunces)               | **Not a Theme Lab lock blocker** — named production requirement (see typography)       |
| Low (edge)           | Memories empty match-set: intro `Start` → `resolveNext` `null` (stay)      | **Accept for Theme Lab** (fixtures always have pairs); production must add empty-state |
| Low (debt)           | No Scene 12 gallery-ending; gallery → photobooth                           | Documented Sky Moments path; intentional                                               |
| Low (debt)           | Photobooth = Moments Sprint 14 placeholder                                 | Family-wide; production redesign deferred                                              |
| Low (fixtures)       | Gallery photos borrow Bloom Moments webp paths                             | Accept for Theme Lab; dedicated Sky gallery fixtures = production follow-up            |
| Info                 | Continuous-motion CTAs flake under Playwright (force-click)                | Non-blocking; discoverability OK in manual/force paths                                 |
| Info                 | `npm audit` **7** (5 high, 2 moderate)                                     | Pre-existing / tooling chain — **not introduced by Sky**; do not `fix --force`         |

---

## 3. Independent baseline (vs `54a3b6a`)

| Check                                   | Result                                                               |
| --------------------------------------- | -------------------------------------------------------------------- |
| Working tree at audit start             | Clean · tracking `origin/rebuild/foundation` 0/0                     |
| Package / lockfile delta                | None                                                                 |
| Four engines present                    | `sky/moments` · `sky/connection` · `sky/memories` · `sky/treasures`  |
| Lab wiring                              | `sky-theme-lab-page.tsx` · four mode tabs · `?mode=` · `?noPhotos=1` |
| Unrelated / destructive / `/e/` changes | None found                                                           |
| Playful                                 | Not started / not modified                                           |

---

## 4. Architecture and wrapper-coupling verdict

| Concern                                                                | Result                                                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| Each mode owns graph + host                                            | ✅                                                                                       |
| Quiz index / questions in Connection                                   | ✅ Host + `quiz.question.{n}`                                                            |
| Match pairs / timer answers in Memories                                | ✅ Host + match scenes                                                                   |
| `openedSortOrders`, Final Gift lock, Final Reward dismiss in Treasures | ✅ Host-local                                                                            |
| Shared Moments APIs                                                    | ✅ `lockedOnly` · `ajar` · `tone` (default `sky`) — presentation-sized                   |
| No live quiz/match/Gift submit in Moments                              | ✅                                                                                       |
| Wrapper maintainability                                                | ⚠ Acceptable for Theme Lab; chain Moments→Connection→Memories/Treasures is real coupling |

**Verdict:** Coupling is **understandable and safe enough to lock**, but fragile if Moments ceremony scenes change casually. Full audit must treat Moments as a shared platform surface.

**Terminology preserved:** **Final Gift** = locked final grid item · **Final Reward** = journey after Final Gift content dismiss.

---

## 5. Cross-mode identity verdict

| Mode       | Core                                    | Distinct?                                |
| ---------- | --------------------------------------- | ---------------------------------------- |
| Moments    | Ceremony gift → letter → rain → gallery | ✅ Soft sky ceremony                     |
| Connection | Relational quiz + fixture score         | ✅ Not a Moments recolor                 |
| Memories   | Reflective timed match + fixture score  | ✅ Distinct from quiz                    |
| Treasures  | Progressive gift grid + Final Pearl     | ✅ Pearl final (not gold); not text-swap |

Palette (soft blue / cream / denim / stars), scrapbook, balloons, and gift language read as one family. Decorative density is higher on invitation/quiz surfaces than on Treasures grid (intentional quiet field). Gallery → photobooth without gallery-ending is consistent across Sky modes.

**Verdict:** Family-consistent and mode-distinct — **not** four blue recolors.

---

## 6. Final typography decision

**Global stack:** Poppins → `--font-sans` · Fraunces → `--font-serif` (root `app/layout.tsx`). No Warm Cormorant / Great Vibes / Outfit.

| Surface                                                         | Observation                                  |
| --------------------------------------------------------------- | -------------------------------------------- |
| Primary CTAs (Tap / Yes / Start Challenge / Unlock / Celebrate) | Predominantly **sans** / bold tracking       |
| Letter / stationery / ceremonial headlines                      | **Serif** — intentional editorial            |
| Gift-grid item controls                                         | Visual gift buttons (SVG); headline serif OK |
| Quiz option rows                                                | **`font-serif`** on option text              |
| Match story options                                             | **`font-serif`** on titles/bodies            |

### Decision (Theme Lab lock)

**Sky follows Foundations well enough to lock for Theme Lab** without a typography code change in this audit.

Rationale: family fonts are correct; primary actions are sans; serif on quiz/match options is a **consistent scrapbook-card treatment**, not accidental Warm drift.

### Named production requirement (not vague carry-forward)

Before `/e/[token]` wiring: move **quiz option** and **match option** control text to `font-sans` (Poppins). Keep serif for question headlines, letter bodies, and ceremonial titles only.

---

## 7. Journey and empty-match decision

### Graph checks (independent)

`ALL_GRAPHS_OK` — Moments/Connection/Memories/Treasures photo + no-photo tails; Connection empty quiz → score-calculation; Treasures binder no-photo → photobooth.

### Empty-match decision

| Option                                           | Choice                                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Stay on match-intro when `memoryPairCount === 0` | ✅ **Accept for Theme Lab lock**                                                             |
| Small safe empty-state fallback now              | Not required for Theme Lab (fixtures always ship pairs; `null` is fail-safe, no blank/crash) |

**Production requirement:** empty match-set must show an explicit empty state or skip to a safe terminal — Start must not be a silent no-op.

### Mode journeys (code + browser + prior mode locks)

| Mode       | Photo / no-photo                 | Restart | Terminal      | Core interaction                                                                      |
| ---------- | -------------------------------- | ------- | ------------- | ------------------------------------------------------------------------------------- |
| Moments    | Graph ✅ · badge ✅              | ✅      | Photobooth ✅ | Ceremony mounts ✅                                                                    |
| Connection | Graph ✅ · badge ✅              | ✅      | Photobooth ✅ | Reached challenge → quiz path (automation flake on continuous CTA); score fixture 92% |
| Memories   | Graph ✅                         | ✅      | Photobooth ✅ | Reached **match-intro** this audit                                                    |
| Treasures  | Graph ✅ · prior full browser ✅ | ✅      | Photobooth ✅ | Final Gift lock FD-S11-17 in code + prior gate                                        |

Invalid `?mode=` → Moments. Unknown scene → safe host fallback strings. No production Gift actions.

---

## 8. Browser results

| Check                                      | Result                               |
| ------------------------------------------ | ------------------------------------ |
| Mobile `390×844` all four mounts           | ✅ No horizontal overflow            |
| Desktop `1280×800` all four mounts         | ✅                                   |
| Restart chrome present                     | ✅                                   |
| Memories → match-intro                     | ✅                                   |
| Invalid mode → Moments                     | ✅                                   |
| Bloom / Warm Sky scene-ID leak             | ✅ None                              |
| Console material errors                    | ✅ None observed (HMR/DevTools only) |
| Continuous-motion CTA Playwright stability | ⚠ Flake — force-click; non-blocking  |

---

## 9. Security and fixture truth

| Check                                       | Result                                    |
| ------------------------------------------- | ----------------------------------------- |
| Synthetic fixtures only                     | ✅                                        |
| No DB client / migration / RLS in Sky delta | ✅                                        |
| No API / server actions / live submit       | ✅                                        |
| No `/e/[token]` Sky hosts                   | ✅                                        |
| Theme Lab `noindex`                         | ✅ `app/(theme-lab)/layout.tsx`           |
| Connection score                            | Fixture **92%** — not graded from answers |
| Memories score                              | Fixture **92%** — answers advance only    |
| Treasures progression                       | Host-local `openedSortOrders`             |
| Gallery assets                              | Bloom Moments fixture webps (stand-ins)   |

### npm audit

| Item                    | Result                                     |
| ----------------------- | ------------------------------------------ |
| Current                 | **7 vulnerabilities (5 high, 2 moderate)** |
| Introduced by Sky       | **None** (no package/lockfile change)      |
| `npm audit fix --force` | **Not run**                                |

---

## 10. Assets and performance

| Location                                             | Count / weight                             |
| ---------------------------------------------------- | ------------------------------------------ |
| `public/themes/sky/moments/`                         | 1 webp (~143 KB) + README                  |
| `public/themes/sky/{connection,memories,treasures}/` | None                                       |
| `design-references/sky/moments/`                     | ~4.02 MB                                   |
| `design-references/sky/connection/`                  | ~1.91 MB                                   |
| `design-references/sky/memories/`                    | ~1.13 MB                                   |
| `design-references/sky/treasures/`                   | ~1.60 MB                                   |
| Borrowed runtime gallery                             | `/themes/bloom/moments/gallery-fixtures/*` |

**Decision:** Dedicated Sky gallery fixtures **not required for Theme Lab lock**; document as production follow-up. Continuous Framer motion on CTAs/gifts is a known flake risk, not a Theme Lab blocker. No wrong-folder Canva screenshots under `public/`.

---

## 11. Accessibility and usability

| Finding                                                           | Class                                                                                |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Gift/quiz/match primary controls are real `<button>`s with labels | Theme Lab OK                                                                         |
| Final Gift disabled + aria remaining count                        | Theme Lab OK                                                                         |
| Continuous scale animation on CTAs (Playwright / vestibular)      | Non-blocking Theme Lab debt · production should respect reduced-motion more strictly |
| Quiz/match option serif (readability)                             | Production requirement (typography)                                                  |
| Decorative SVGs largely `aria-hidden`                             | Theme Lab OK                                                                         |
| Full WCAG claim                                                   | ❌ Not claimed                                                                       |

No Theme Lab **lock blockers** found in a11y.

---

## 12. Technical gate

| Check                               | Result                      |
| ----------------------------------- | --------------------------- |
| `tsc --noEmit`                      | ✅                          |
| ESLint `sky/**` + lab fixtures/page | ✅                          |
| `next build`                        | ✅                          |
| Graph checks                        | ✅ `ALL_GRAPHS_OK`          |
| `npm audit`                         | ✅ Reported (baseline only) |

**Fixes applied this audit:** None (no confirmed Theme Lab lock blockers).

---

## 13. Remaining non-blocking debt / production requirements

1. Quiz + match option text → Poppins/sans (typography production gate)
2. Memories empty match-set explicit UI
3. Dedicated Sky gallery fixtures (optional Theme Lab polish / production)
4. Photobooth Sprint 14 redesign
5. Gallery-ending parity (only if product requires Bloom/Warm parity)
6. Reduce Moments ceremony branching (`lockedOnly`) over time
7. Wrapper-chain review when editing Moments living scenes
8. npm audit baseline — do not force-fix in Theme Lab work
9. Full reduced-motion pass before production

---

## 14. Final Sky lock decision

Theme Lab Sky (Moments · Connection · Memories · Treasures) is **APPROVED AND LOCKED**.

**Playful is FROZEN** — no implementation, assets, routes, fixtures, or exploration without a future Founder unlock. This is a **delivery decision** to protect publication timeline, not a rejection of Playful’s concept. Future Playful work belongs in a **post-publication** phase.

Active release scope: **Bloom · Warm · Sky** — each with Moments · Connection · Memories · Treasures (**3 × 4**).  
`/e/[token]` remains **NOT AUTHORIZED**.

---

## 15. Lessons for Playful (when unlocked later)

1. Own graph/host/state early; keep shared APIs visual-only.
2. Do not bury mode progression inside another mode’s ceremony scene.
3. Decide typography for **controls vs editorial** before locking a mode.
4. Fixture scores must stay labeled as fixtures in UI/docs.
5. Automate against continuous-motion CTAs with force-click or reduced-motion lab flag.
6. Empty datasets need explicit empty states even in Theme Lab if Start is user-visible.
