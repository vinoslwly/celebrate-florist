# Bloom Moments — Independent Audit

> **Stabilization (2026-07-20):** Required quality-gate fixes applied — see [03_BLOOM_MOMENTS_STABILIZATION_AND_LESSONS.md](./03_BLOOM_MOMENTS_STABILIZATION_AND_LESSONS.md).  
> **Founder lock (2026-07-20):** Visual review **APPROVED** — Bloom Moments is 🔒 **APPROVED AND LOCKED** ([README](./README.md) · [DDR-S12-034](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md)).

> **Date:** 2026-07-20  
> **Auditor stance:** Independent senior engineer / security reviewer / regression auditor (devil’s advocate)  
> **Mode:** Read-only (no code fixes applied during audit)  
> **Branch:** `rebuild/foundation` @ `e9dd477` + large dirty working tree  
> **Overall verdict:** **PASS WITH REQUIRED FIXES**

---

## 1. Executive verdict

Bloom Moments **Theme Lab** (`/theme-lab/bloom`) is a largely well-isolated presentation pilot: static fixtures, no database access, no production `/e/[token]` wiring of the Moments Scene Engine, `noindex`, and no new npm dependencies.

However, the claim “Bloom Moments implementation is complete” is **not** supported by repository evidence:

1. **Typecheck and production build fail** on Moments Scene Engine code (`gift-opening-scene.tsx`).
2. The working tree mixes Theme Lab Moments work with **broad Sprint 12 Core UI / Studio / mode-flow presentation changes** that already affect production Recipient, Preview, Studio, Landing-adjacent, Quiz, Match, and Treasures surfaces.
3. Pilot plan constraints (“no production Recipient/Preview/Studio/Landing route changes” for this Moments validation) are **not** met by the working tree as a whole.
4. Founder visual approval of the full living journey is still pending; Scene 10 remains a thin Photobooth wrapper; production Scene Engine rollout is explicitly unauthorized.

**Theme Lab may remain in the repository** after required quality-gate fixes, for Founder visual review.  
**Production Moments Scene Engine merge is not ready.**  
**Bloom Connection must not begin** until required fixes land and Moments Founder visual approval is obtained.

No Critical security exploit was identified. No `CRITICAL SECURITY ISSUE — FOUNDER REVIEW REQUIRED` stop condition was triggered.

---

## 2. Exact files changed (Bloom Moments–focused)

Evidence sources: `git status`, `git diff --stat HEAD`, `git ls-files --others --exclude-standard`.

### 2.1 Theme Lab + Moments Scene Engine (untracked — primary pilot surface)

| Path                                                                     | Classification                                                                        |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| `app/(theme-lab)/layout.tsx`                                             | Authorized and necessary                                                              |
| `app/(theme-lab)/theme-lab/bloom/page.tsx`                               | Authorized and necessary                                                              |
| `features/theme-lab/components/bloom-theme-lab-page.tsx`                 | Authorized and necessary                                                              |
| `features/theme-lab/config/bloom-moments-fixtures.ts`                    | Authorized and necessary · Security-sensitive (fixture IDs — verified synthetic)      |
| `features/experience/scene-engine/moments/graph.ts`                      | Authorized and necessary                                                              |
| `features/experience/scene-engine/moments/moments-scene-host.tsx`        | Authorized and necessary                                                              |
| `features/experience/scene-engine/moments/registry.ts`                   | Authorized and necessary                                                              |
| `features/experience/scene-engine/moments/types.ts`                      | Authorized and necessary                                                              |
| `features/experience/scene-engine/moments/scenes/*.tsx` (10 scene files) | Authorized and necessary · Requires Founder review (visual)                           |
| `features/themes/components/bloom-moments-decorations.tsx`               | Authorized and necessary                                                              |
| `features/themes/config/bloom-moments-lab-theme.ts`                      | Authorized and necessary                                                              |
| `docs/sprint-12-5/00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md`               | Documentation only                                                                    |
| `docs/sprint-12-5/README.md`                                             | Documentation only · Authorized but questionable (status lag vs code)                 |
| `public/themes/bloom/moments/**` (24 files, ~4.9 MB)                     | Authorized and necessary (references + corner crops + fixtures) · Performance concern |

### 2.2 Shared theme / production presentation (modified — not Theme-Lab-only)

| Path                                                                                        | Classification                                                                        |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `types/theme.ts`                                                                            | Authorized but questionable for “Moments-only” claim · Affects all themes             |
| `features/themes/config/bloom.ts` (+ warm/play/sky/pure/all-themes/resolve-theme)           | Unrelated / broader Core UI · Production impact                                       |
| `features/themes/config/theme-assets.ts` (untracked)                                        | Shared helper · Production impact                                                     |
| `features/themes/config/theme-fallbacks.ts` (untracked)                                     | Shared helper · Production impact                                                     |
| `features/themes/config/theme-surfaces.ts` (untracked)                                      | Shared helper · Production impact                                                     |
| `features/themes/config/active-themes.ts` (untracked)                                       | Shared · Requires Founder review if theme gating changes                              |
| `features/themes/components/theme-page-atmosphere.tsx` (untracked)                          | Shared · Production Recipient/Preview                                                 |
| `features/experience/components/moments-experience.tsx`                                     | **Unrelated scope change relative to Theme Lab isolation claim** · Production Moments |
| `features/experience/components/letter-view.tsx`                                            | Production shared · All modes using LetterView                                        |
| `features/experience/components/photo-gallery.tsx`                                          | Production shared                                                                     |
| `features/experience/components/recipient-experience-shell.tsx` (untracked)                 | Production shared · Moments/Connection/Memories/Treasures                             |
| `features/experience/components/*` + preview/studio/quiz/match/treasures/landing (many `M`) | **Unrelated scope change** to Bloom Moments Scene Engine · Sprint 12 UI system        |

### 2.3 Generated / local clutter (not part of product)

| Path                                                              | Classification                                                                |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Root `*.png` screenshots, `.playwright-mcp/`, `.tmp/`, `.cursor/` | Generated artifact · Must not be committed                                    |
| `docs/sprint-12/`, `docs/sprint-12-implementation/`               | Documentation only (Sprint 12 UI system — adjacent, not Moments Scene Engine) |

### 2.4 Package / lockfile / env

| Item                                         | Result                                       |
| -------------------------------------------- | -------------------------------------------- |
| `package.json` / `package-lock.json` vs HEAD | **No diff**                                  |
| New npm packages for Bloom Moments           | **None**                                     |
| Env / secrets files changed for Bloom        | **None observed** in Moments/Theme Lab paths |

---

## 3. Unauthorized-scope changes

**Relative to Sprint 12.5 Moments pilot plan** (`00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md`):

> Not changes to production Recipient, Preview, Studio, or Landing routes.

**Finding:** The dirty tree **does** change production Recipient presentation (`MomentsExperience` → `RecipientExperienceShell`, `LetterView`, `PhotoGallery`), Preview shell, Studio form/UI components, Quiz/Match/Treasures flows, and Landing FAQ/collection copy.

**Scene Engine itself** is not imported by production `/e/[token]`. Isolation of the _engine_ holds; isolation of the _working tree / “Moments complete” packaging_ does **not**.

Report any file changed outside Bloom Moments scope: **yes — dozens of Studio/Quiz/Match/Landing/Preview/Treasures files and shared theme infrastructure.**

---

## 4. Database / schema result

| Check                                                 | Result                                         |
| ----------------------------------------------------- | ---------------------------------------------- |
| New migrations for Bloom Moments                      | **None**                                       |
| Schema / RLS / types/database changes in Moments work | **None**                                       |
| Theme Lab DB reads/writes                             | **None** — fixtures are compile-time constants |
| Production data mutation from Theme Lab               | **None**                                       |

Expected statement holds:

> Bloom Moments Theme Lab uses static fixtures and requires no database access or database mutation.

**Evidence:** `bloom-moments-fixtures.ts` exports static `ExperienceRow` / `PublishedPhoto[]`; Theme Lab / scene-engine greps show no `supabase`, `createClient`, or `use server`.

Pre-existing `experience_mode` migration (`moments|connection|memories|treasures`) is historical Sprint work, not introduced by this pilot’s Theme Lab files.

---

## 5. API / route / workflow result

| Concern                                                                       | Result                                                            |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Theme Lab route                                                               | `/theme-lab/bloom` via `app/(theme-lab)/theme-lab/bloom/page.tsx` |
| Publicly reachable if deployed                                                | **Yes** (no auth) — assessed safe given static fixtures only      |
| Navigation links                                                              | **None** found to `/theme-lab`                                    |
| Sitemap                                                                       | **No** sitemap file                                               |
| Robots metadata                                                               | `robots: { index: false, follow: false }` on Theme Lab layout     |
| Production Scene Engine on `/e/[token]`                                       | **No** — production uses `MomentsExperience`                      |
| Server actions / publish / Memory Code from Theme Lab                         | **No**                                                            |
| Order / quiz / match / gift gating logic changes attributable to Scene Engine | **No**                                                            |
| Broader tree workflow UI changes                                              | **Yes** (Studio/Quiz/etc. — outside Theme Lab engine)             |

Scene graph (`graph.ts`) remains presentation-order only; gallery skip when `photos.length === 0` is Theme Lab host logic, not production publish rules.

---

## 6. Production shared-code impact

### Confirmed unchanged by Scene Engine

- Production does **not** import `MomentsSceneHost` / scene registry.
- No Moments Scene Engine path in `mode-registry` → still `MomentsExperience`.

### Confirmed changed in working tree (shared)

| Change                                             | Consumers                                       | Impact                                                         |
| -------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------- |
| `RecipientExperienceShell` + `ThemePageAtmosphere` | Moments, Connection, Memories, Treasures        | Global Recipient chrome/atmosphere                             |
| `LetterView` motif + accent helpers                | Any LetterView consumer                         | Visual + structure                                             |
| `PhotoGallery` polaroid treatment + `tone`         | Production Moments (+ Theme Lab preview static) | Visual                                                         |
| `resolveThemeTokens` + presentation fallbacks      | All themes                                      | Safer unknown-theme fallback; requires `presentation` on Theme |
| `decorativeIntensity` → `themeDecorativeOpacity`   | `ThemePageAtmosphere`, `MomentsPersistentShell` | Runtime opacity behavior for motifs                            |

### Possible behavior changes

- Deploying the dirty tree without separating Theme Lab would ship Core UI presentation changes to production Recipient/Preview **before** Moments Scene Engine Founder approval.
- `bloom.ts` `assets: {}` remains empty — production Bloom still uses CSS/emoji fallbacks; Scene Lab theme is separate (`bloom-moments-lab-theme.ts`).

---

## 7. Security-document compliance matrix

Source of truth: `docs/04_SECURITY.md` (+ architecture/database cross-links). Rules are not invented beyond that document.

| Security rule                                               | Evidence in implementation                                               | Status         | Finding                                                           |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- | ----------------------------------------------------------------- |
| Data minimization                                           | Theme Lab uses synthetic names/IDs only                                  | Pass           | Fixtures clearly labeled anonymous                                |
| Least privilege / anon never touches Gift DB from Theme Lab | No DB client in Theme Lab/scene-engine                                   | Pass           | N/A to Gift domain path                                           |
| RLS defense-in-depth                                        | Not altered by Moments pilot                                             | Not Applicable | No schema work                                                    |
| Memory Code never plaintext in product flows                | Fixture `memory_key_hash: "theme-lab"` is a stub string, unused for auth | Partial        | Misleading field value in fixture type shape — not an auth bypass |
| Experience/preview tokens protected                         | Theme Lab does not use real tokens                                       | Pass           |                                                                   |
| Admin auth for Studio                                       | Theme Lab has no Studio actions                                          | Not Applicable |                                                                   |
| CSP / security headers present                              | `next.config.ts` CSP unchanged; no new remote origins for Moments        | Pass           | Moments uses `'self'` local assets                                |
| Secrets not in client                                       | No `NEXT_PUBLIC_*` secrets in Moments paths; no env reads in Theme Lab   | Pass           |                                                                   |
| Rate limiting `/e/*`                                        | Theme Lab not under `/e/*`                                               | Not Applicable |                                                                   |
| Personal content protection                                 | No real letters/photos from DB                                           | Pass           |                                                                   |
| No weakening of image remotePatterns for Canva              | `remotePatterns` still Supabase-only                                     | Pass           |                                                                   |

**Governance risk:** Pilot README status lines lag reality (claims scenes 1–2 living while code implements through Scene 9). Documentation incompleteness is a process risk, not a runtime exploit.

---

## 8. Authentication and authorization findings

| Check                               | Result                                  |
| ----------------------------------- | --------------------------------------- |
| Theme Lab auth guard                | None (intentional)                      |
| Access to Studio-only data          | None                                    |
| Reuse of production server actions  | None found                              |
| Real order/customer IDs in fixtures | None (`theme-lab-*`)                    |
| Privilege escalation via Theme Lab  | No path identified                      |
| UI-only “security”                  | N/A — no sensitive capabilities exposed |

**Severity:** No High/Critical auth findings for Theme Lab.

---

## 9. Client/server boundary findings

| Boundary                              | Evidence                                                             |
| ------------------------------------- | -------------------------------------------------------------------- |
| Theme Lab page                        | Server Component shell → client `BloomThemeLabPage`                  |
| Scene Engine                          | Entire host + scenes are `"use client"` (expected for Framer Motion) |
| Server-only imports into client       | None found (`fs`, `server-only`, Supabase clients absent)            |
| Secrets in client bundle from Moments | None observed                                                        |
| HTML serialization of sensitive data  | Synthetic fixture only                                               |

**Note:** Heavy client surface is a performance/maintainability cost, not a trust-boundary violation.

---

## 10. Input and injection findings

| Vector                                         | Result                                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------------- |
| `dangerouslySetInnerHTML` in Moments/Theme Lab | **None**                                                                  |
| Untrusted URL params driving Theme Lab         | **None** (no searchParams usage in Theme Lab page)                        |
| User markdown/HTML rendering                   | **None**                                                                  |
| Image URLs                                     | Local `/themes/bloom/...` paths only                                      |
| Caption/text                                   | Static fixture strings / experience fixture fields rendered as React text |

**Status:** Pass for Theme Lab static content model.

---

## 11. Canva asset and font findings

### Assets

- Founder reference PNGs stored under `public/themes/bloom/moments/` as **source-only** per DDR workflow.
- Runtime living scenes reference only: Scene 1 corner webps, Scene 5 origami webp, gallery-fixtures webps.
- Large reference PNGs are still **publicly fetchable if the app is deployed** (not secrets; bloat + IP exposure of Founder art).
- **No SVG files** under `public/themes/bloom` — SVG script audit N/A for that tree; inline SVG in React scenes is developer-authored.
- No Canva edit/view URLs, MCP tokens, or expiring signed Canva URLs found in Moments/Theme Lab code.
- `next.config` image `remotePatterns` not broadened for Canva.

### Fonts

- **No new font** added for Bloom Moments.
- App continues global `Poppins` / `Fraunces` / `Fira_Code` via `next/font` in root layout (pre-existing).
- Pilot optional expressive font: **not implemented**.

### Licensing / ownership

- Founder-delivered reference screenshots: ownership assumed Founder/product; **technical security ≠ legal license clearance** — Informational.

---

## 12. Dependency and supply-chain findings

| Check                                | Result                                                  |
| ------------------------------------ | ------------------------------------------------------- |
| New packages                         | **None** (`package.json` unchanged vs HEAD)             |
| `npm audit`                          | **0** vulnerabilities (info/low/moderate/high/critical) |
| CDN / remote script deps for Moments | **None**                                                |
| Pre-existing vs new vulns            | N/A — audit clean                                       |

---

## 13. Fixture privacy findings

`BLOOM_MOMENTS_LAB_EXPERIENCE` / `BLOOM_MOMENTS_LAB_PHOTOS`:

- Names: `Alex`, `Jordan` (synthetic)
- IDs/tokens: `theme-lab*` strings
- Photos: local mood-plate webps (not customer photos)
- No emails, phones, WhatsApp, real order UUIDs, recipient tokens, or private Canva links
- `memory_key_hash: "theme-lab"` is **not** a real hash — cannot be submitted through Theme Lab to production verify actions (no such wiring)

**Pass** for privacy. **Low** clarity issue on stub hash field.

---

## 14. Theme-contract findings

| Expectation                                               | Result                                                                                                                          |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Shared Theme Presentation contract                        | Used (`ThemePresentation`, helpers)                                                                                             |
| No Bloom-only business logic in Gift domain               | Scene Engine is presentation graph only                                                                                         |
| No duplicate production Recipient family for Scene Engine | Engine is Theme Lab–only; production still `MomentsExperience`                                                                  |
| Safe fallbacks                                            | `withThemePresentationFallbacks` present                                                                                        |
| No premature global Bloom asset fill                      | Production `bloom.ts` `assets: {}`                                                                                              |
| Warm/Playful/Sky/Pure                                     | Presentation fields added (Core UI) — visual token expansion, not Moments Scene Engine                                          |
| Schema fields                                             | None required                                                                                                                   |
| `decorativeIntensity`                                     | **Runtime behavior exists** via `themeDecorativeOpacity` despite comment “no runtime consumer in Core UI pass” — doc/code drift |

**Recommendation for `decorativeIntensity`:** **keep and use** (already wired) — update the outdated comment later; do not remove during Founder review.

---

## 15. Code-quality findings

| Issue                                                                            | Severity          | Notes                                                                 |
| -------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| TS prop types on `LidWithBow` (`x="50"` string vs `number`)                      | Medium            | Breaks `tsc` / `next build`                                           |
| Import-order lint warnings in scene-engine                                       | Low               | 9 warnings, lint exit 0                                               |
| Duplicated sakura/petal SVG helpers across scenes                                | Low               | Maintainability                                                       |
| Hardcoded pink hex palette inside scenes                                         | Low/Informational | Expected for living compositions; diverges from Tailwind theme tokens |
| Scene 10 thin Photobooth wrapper                                                 | Informational     | Acknowledged Production Pending / Sprint 14                           |
| Pilot README incomplete vs implemented scenes                                    | Low               | Process hygiene                                                       |
| Plan doc route path `app/(public)/theme-lab/...` vs actual `app/(theme-lab)/...` | Low               | Doc drift                                                             |
| No automated tests for Scene Engine                                              | Medium            | Repo has **zero** `*.test.ts(x)` / `*.spec.ts(x)` files               |
| Root screenshot clutter                                                          | Low               | Must not ship                                                         |

---

## 16. Performance findings

| Metric                              | Evidence                                                                                                                |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `public/themes/bloom/moments` total | **~4.90 MB** / 24 files                                                                                                 |
| Runtime-needed assets (approx.)     | Corners (~13 KB) + origami webp (~25 KB) + gallery fixtures (~38 KB) ≪ references                                       |
| Reference PNG weight                | Dominant (splash/kf/cover references hundreds of KB each)                                                               |
| Pilot guardrail (~500 KB)           | **Exceeded by ~10×** if all public Moments files are counted                                                            |
| LCP                                 | **Not measured** (no Lighthouse run)                                                                                    |
| Client cost                         | Full journey is client-rendered Framer Motion; Scenes 8–9 recently lightened (reduced particles / no filter blur loops) |
| Lazy images                         | Gallery uses `loading="lazy"`                                                                                           |

**Assessment:** Acceptable for an unlinked Theme Lab if reference PNGs remain source-only; **before production**, exclude unused reference PNGs from the deploy surface or move them out of `public/`.

---

## 17. Accessibility findings

| Area                                  | Assessment                                                                                                                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Theme Lab chrome tabs                 | Roles `tablist`/`tab` present                                                                                                                                                   |
| Scene CTAs                            | Buttons with `aria-label` in key places (gift/gallery)                                                                                                                          |
| Decorative SVGs                       | Generally `aria-hidden`                                                                                                                                                         |
| Gallery photo `alt`                   | Uses caption title — OK for fixtures                                                                                                                                            |
| Reduced motion                        | Gallery + gallery-ending use `useReducedMotion` — **compliant by code evidence** for those scenes; earlier scenes may still animate fully — **likely issue** / needs spot-check |
| Focus rings                           | Present on primary Celebrate CTA                                                                                                                                                |
| Contrast                              | **Needs manual visual validation** on pink gradient                                                                                                                             |
| Heading hierarchy in immersive scenes | Mixed (`h1` Gallery vs shell headings) — **likely issue** inside lab chrome                                                                                                     |
| Touch targets                         | Celebrate CTA adequate; “Continue” text link on Scene 9 is small — **likely issue**                                                                                             |
| WCAG claim                            | **Not claimed**                                                                                                                                                                 |

---

## 18. Validation-command results

| Command             | Exit  | Result                                                                   | Attribution                                |
| ------------------- | ----- | ------------------------------------------------------------------------ | ------------------------------------------ |
| `npm run typecheck` | **2** | Errors in `gift-opening-scene.tsx` (LidWithBow `x`/`y` string vs number) | **Introduced by Bloom Moments**            |
| `npm run lint`      | **0** | 9 import/order **warnings** in scene-engine / decorations                | Introduced by Bloom Moments (non-blocking) |
| `npm run build`     | **1** | Compile OK; TypeScript phase fails on same LidWithBow errors             | **Introduced by Bloom Moments**            |
| Automated tests     | N/A   | No test files found in repo                                              | Pre-existing gap                           |
| `npm audit`         | **0** | Zero vulnerabilities                                                     | Clean; no new packages                     |

---

## 19. Findings table

| ID   | Severity          | Finding                                                                                                    | Evidence                                                                      |
| ---- | ----------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| F-01 | **Medium**        | Typecheck/build broken in Moments Scene Engine                                                             | `gift-opening-scene.tsx:174` / `:310` — `LidWithBow` props                    |
| F-02 | **Medium**        | Working tree ships production Recipient/Preview/Studio UI changes beyond Theme Lab Moments isolation claim | `git status` / diffs on `moments-experience.tsx`, shells, studio, quiz, match |
| F-03 | **Medium**        | No automated tests for Scene Engine; quality gate relies on manual Theme Lab                               | Glob `*.{test,spec}.{ts,tsx}` → 0                                             |
| F-04 | **Medium**        | Public Moments asset bundle ~4.9 MB vs ~500 KB pilot guardrail                                             | `dir public/themes/bloom/moments`                                             |
| F-05 | **Low**           | `decorativeIntensity` comment outdated; runtime consumers exist                                            | `types/theme.ts` vs `theme-assets.ts` / atmosphere components                 |
| F-06 | **Low**           | ESLint import/order warnings in new Moments files                                                          | `npm run lint`                                                                |
| F-07 | **Low**           | Docs drift (README scene status; plan route path `(public)` vs `(theme-lab)`)                              | `docs/sprint-12-5/*`                                                          |
| F-08 | **Low**           | Fixture `memory_key_hash: "theme-lab"` is a stub, not a hash                                               | `bloom-moments-fixtures.ts`                                                   |
| F-09 | **Low**           | Untracked screenshot/PNG clutter at repo root                                                              | `git status` untracked `*.png`                                                |
| F-10 | **Informational** | Scene 10 Photobooth is placeholder wrapper                                                                 | `photobooth-scene.tsx`                                                        |
| F-11 | **Informational** | Production Scene Engine wrap unauthorized / unwired                                                        | Pilot plan + `mode-registry` → `MomentsExperience`                            |
| F-12 | **Informational** | Reduced-motion not uniformly applied across Scenes 1–7                                                     | Code search — only gallery scenes use `useReducedMotion`                      |

**Critical:** none  
**High:** none (scope bleed treated as Medium governance/regression risk, not exploitable privilege bypass)

---

## 20. Pre-existing versus newly introduced

| Item                            | Classification                                                               |
| ------------------------------- | ---------------------------------------------------------------------------- |
| F-01 type errors                | **Newly introduced** (Moments Scene Engine)                                  |
| F-02 production UI tree changes | **Newly introduced in working tree** (largely Sprint 12 Core UI, co-mingled) |
| F-03 no test suite              | **Pre-existing** repo gap                                                    |
| F-04 asset weight               | **Newly introduced** (Founder references + fixtures)                         |
| npm audit clean                 | Neutral                                                                      |
| CSP / Supabase patterns         | Pre-existing; unchanged by Moments                                           |

---

## 21. Required fixes before visual approval

1. **Fix `LidWithBow` TypeScript errors** so `npm run typecheck` and `npm run build` pass.
2. Confirm Theme Lab journey Scenes 1→10 manually on mobile + desktop after the fix (Founder visual session).
3. Do **not** treat production Recipient screenshot changes as Moments Scene Engine approval.

---

## 22. Required fixes before production merge

1. Founder visual approval of **full living Moments journey** in Theme Lab.
2. Explicit authorization to wire Scene Engine into production `/e/[token]` (currently forbidden).
3. Separate / review Sprint 12 Core UI production presentation changes from Moments Scene Engine rollout (do not conflate).
4. Remove or relocate unused reference PNGs from deploy-facing `public/` (or ensure CDN/cache policy acceptable).
5. Decide Scene 10 photobooth scope (keep wrapper vs Sprint 14).
6. Align docs (`README`, plan route path, `decorativeIntensity` comment).
7. Add at least minimal smoke coverage for scene graph transitions (recommended).

---

## 23. Safe follow-ups that may be deferred

- Deduplicate sakura/petal helpers
- Broader `useReducedMotion` on Scenes 1–7
- Import-order lint cleanup
- Optional Bloom expressive font evaluation
- Connection/Memories/Treasures Theme Lab modes
- Root screenshot cleanup (local hygiene)

---

## 24. Theme Lab deployment verdict

| Question                                   | Verdict                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| Safe as isolated Theme Lab after F-01 fix? | **Yes**                                                                               |
| Safe to keep in repository?                | **Yes**                                                                               |
| Safe to deploy unlinked with `noindex`?    | **Yes, after build passes** — accepts public static fixtures + reference art exposure |
| Unsafe to deploy today?                    | **Build currently fails** — do not ship green CI claim                                |

---

## 25. Production integration verdict

| Question                                          | Verdict                                                   |
| ------------------------------------------------- | --------------------------------------------------------- |
| Ready for production Scene Engine integration?    | **No**                                                    |
| Safe to merge Scene Engine into `/e/[token]` now? | **No**                                                    |
| Core UI presentation changes in tree              | Separate review track — not Moments Scene Engine approval |

---

## 26. Safe to continue to Bloom Connection?

**No.**

Gate:

1. F-01 fixed (typecheck/build green)
2. Founder visual approval of Bloom Moments living journey
3. Explicit go-ahead to start Connection under the same one-image→living-code workflow

Until then, Connection/Memories/Treasures remain **NOT STARTED** per sprint-12-5 README.

---

## Primary audit questions — answers

1. **Outside authorized Moments Theme Lab scope?** Yes — co-mingled Core UI / Studio / mode UI changes in the working tree.
2. **DB/schema/API/business contracts?** Theme Lab Moments: no. Broader tree: presentation contracts yes; DB schema no.
3. **Affect production Recipient/Preview/Studio/Landing/other themes?** Scene Engine: no. Shared theme + shell changes: **yes**.
4. **Secure per `docs/04_SECURITY.md`?** Theme Lab: largely compliant.
5. **Vulnerabilities / trust-boundary issues?** No Critical/High exploit path found in Theme Lab.
6. **Theme Lab isolated?** Engine: yes. Working tree packaging: partial.
7. **Canva/fonts/external safe?** No unsafe remote Canva/fonts; local assets only; no new font.
8. **Over-engineered / fragile?** Some duplication + TS break + heavy public references.
9. **Safe to remain in repo before production approval?** Yes (Theme Lab), after build fix.
10. **Safe to continue next Bloom mode?** **No** until fixes + Founder Moments approval.

---

## Overall verdict

# PASS WITH REQUIRED FIXES

---

_End of independent audit. No code was modified to remediate findings during this pass (except creation of this report as required)._
