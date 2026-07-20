# Bloom Moments — Stabilization and Lessons

> **Date:** 2026-07-20  
> **Audit:** [02_BLOOM_MOMENTS_INDEPENDENT_AUDIT.md](./02_BLOOM_MOMENTS_INDEPENDENT_AUDIT.md)  
> **Verdict accepted:** PASS WITH REQUIRED FIXES  
> **Purpose:** Stabilize Moments as the reference Theme Lab mode before Connection / Memories / Treasures.

---

## 1. What the audit found

- Theme Lab Moments Scene Engine is **isolated** (no `/e/` wire, static fixtures, `noindex`).
- Quality gate was **red**: TypeScript/build failed on `LidWithBow` prop types.
- Working tree **co-mingled** approved Core UI presentation work with Moments Theme Lab files — harder to audit.
- Deploy-facing `public/` held ~4.9 MB of Founder **reference** PNGs plus small runtime assets.
- No Critical/High security exploit in Theme Lab; Connection must stay on hold until Founder visual approval.

## 2. Root cause of the build failure

`LidWithBow` required `x: number; y: number`, but JSX used string attributes (`x="50"`).  
`tsc` / `next build` TypeScript phase rejected the assignment.

## 3. Fix applied

- Use numeric props: `x={50} y={68}` (and `x={0} y={0}`).
- Ran ESLint `--fix` on Moments scene-engine + decorations to clear import-order warnings.
- Separated reference assets; cleaned local clutter; aligned Sprint 12.5 docs.

## 4. Why the dirty working tree made auditing harder

Uncommitted Core UI, Studio, Quiz, Match, Treasures, and Moments Theme Lab changes sat in one tree.  
Auditors could not treat “Bloom Moments complete” as a clean change set without classifying every path.

## 5. Core UI vs Theme Lab (classification)

| Bucket                        | Examples                                                                                                                                                                                                        | Production impact                                  |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| **Approved Core UI baseline** | `types/theme.ts` presentation, `theme-assets` / `theme-surfaces` / `theme-fallbacks`, `ThemePageAtmosphere`, `RecipientExperienceShell`, LetterView/PhotoGallery shell polish, Studio form UI, mode-flow shells | Yes — shared Recipient/Preview/Studio presentation |
| **Bloom Moments Theme Lab**   | `app/(theme-lab)/**`, `features/theme-lab/**`, `features/experience/scene-engine/moments/**`, `bloom-moments-decorations.tsx`, `bloom-moments-lab-theme.ts`, `public/themes/bloom/moments/**` (runtime)         | No Scene Engine on `/e/`                           |
| **Documentation**             | `docs/sprint-12-5/**`, Moments asset READMEs                                                                                                                                                                    | None                                               |
| **Design references**         | `design-references/bloom/moments/**`                                                                                                                                                                            | Not deploy-facing                                  |
| **Generated / local clutter** | Root QA PNGs, `.playwright-mcp/`, `.tmp/`                                                                                                                                                                       | Must stay ignored / deleted                        |

Do **not** treat Core UI baseline edits as Moments Scene Engine approval.

## 6. Runtime assets vs design-reference assets

|                               | Before                                                    | After                                                          |
| ----------------------------- | --------------------------------------------------------- | -------------------------------------------------------------- |
| `public/themes/bloom/moments` | ~24 files · **~4786 KB**                                  | **10 files · ~76 KB**                                          |
| Runtime retained              | corners webp, origami webp, gallery-fixtures webp, README | same                                                           |
| References relocated          | —                                                         | `design-references/bloom/moments/*.png` (+ source origami PNG) |

## 7. Security conclusions

Theme Lab still holds:

- static synthetic fixtures · no DB · no real customer data · no production tokens
- no server actions · no Studio admin access · no Canva private URLs / MCP credentials
- local runtime assets only · `noindex` · no production nav link

If any of these break, stop: **FOUNDER DECISION REQUIRED**.

## 8. Performance lessons

- Reference art in `public/` inflates deploy surface for free.
- Keep living scenes light on mobile (few particles; opacity/transform motion).
- Count **runtime** weight separately from Founder reference archives.

## 9. Accessibility observations

- Gallery/ending honor `useReducedMotion`; earlier scenes still animate — acceptable for pilot, improve per mode later.
- Scene 10 shows an explicit Production Pending label in Theme Lab.
- Contrast on pink atmospheres still needs Founder eyeball review.

## 10. Reuse for the next mode

- Isolated Theme Lab route + static fixtures
- One Founder image → living composition workflow
- Scene graph SSOT in docs; host-owned timed advances
- Runtime vs `design-references/` split from day one
- Quality gate before declaring a mode “done”

## 11. Do not copy to the next mode

- Shipping reference PNGs under `public/`
- Leaving type errors that only show in `next build`
- Mixing Core UI refactors into the same “mode complete” claim
- Starting the next mode before Founder visual approval
- Wiring Theme Lab engines into `/e/` without authorization

## 12. Quality gate before each future mode

```text
Audit one mode
→ implement in Theme Lab
→ typecheck / lint / build pass
→ asset hygiene check
→ mobile / desktop visual review
→ Founder approval
→ only then start the next mode
```

**Now:** Moments is **APPROVED AND LOCKED**. Bloom Connection is **READY — NOT STARTED** (separate Founder authorization required before audit/coding).

---

## 13. Required workflow for every future Bloom mode

```text
Audit one Canva mode
→ classify assets
→ implement only that mode in Theme Lab
→ keep production logic isolated
→ typecheck, lint, build, and security check
→ separate runtime assets from design references
→ mobile and desktop journey review
→ independent audit when appropriate
→ fix required findings
→ Founder visual approval
→ lock the mode
→ only then start the next mode
```

### Carry-forward rules

- one mode at a time
- no full-page Canva screenshots as web implementation
- real text and controls remain HTML/React
- no theme-specific database or business logic
- no production route wiring without separate authorization
- reference assets stay outside `public/`
- runtime assets must remain optimized
- build must be green before another mode starts
- approved Moments components may be reused, but must not be copied blindly
- future modes must not modify the locked Moments journey without a justified reason

### Lock exception policy

Change locked Moments only for: confirmed regression · shared infrastructure compatibility · security fix · accessibility fix · explicit Founder instruction.
