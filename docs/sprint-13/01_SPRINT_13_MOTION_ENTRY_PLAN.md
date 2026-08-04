# Sprint 13 — Motion System Entry Plan

> **Date:** 2026-08-04  
> **Branch:** `rebuild/foundation` · after Sprint 12.5 close `d0ec576`  
> **Status:** ✅ **FOUNDER APPROVED** — entry plan locked · P0/P1 pilots authorized separately  
> **Goal:** Make Theme Lab journeys feel like an experience, not a stack of static pages (**publish-oriented motion polish**)  
> **Locked themes:** Bloom · Warm · Sky (3 × 4)  
> **Frozen:** Playful · Pure  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**  
> **Photobooth:** ⛔ **OUT OF SCOPE** (Sprint 14)  
> **`npm audit` baseline:** 10 vulnerabilities (7 high, 3 moderate) — do **not** run `npm audit fix --force`

---

## 1. Current motion findings

### What already exists

Theme Lab already uses **Framer Motion heavily** (~90+ scene-engine files). Motion is **per-scene authored**, not tokenized.

| Category                   | Current state                                                                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Scene host cross-fade      | Present on all 12 hosts — **durations disagree** (Bloom `0.45s` wait · Sky `0.28s` wait · Warm `0.2s` sync exit-only)                     |
| Fade / slide / scale enter | Common pattern: `opacity` + `y` + light `scale`; many local `EASE` / `EASE_OUT` copies (`[0.22, 1, 0.36, 1]`)                             |
| Blur                       | Mostly **decorative CSS bokeh**, not a shared reveal primitive                                                                            |
| Zoom / camera-like push    | Occasional scale springs / small `y` travel — **no shared camera system** (correct for Sprint 13 scope)                                   |
| Envelope / gift opening    | Theme-local gift boxes + opening scenes (Bloom shared gift API; Warm/Sky own art)                                                         |
| Letter reveal              | Sentence/stagger reveals; Bloom Moments `letter-scene` has **no `useReducedMotion`**                                                      |
| Gallery reveal             | Staggered card enter; theme-local scrapbook/album character                                                                               |
| Score / reward             | Calculation + reveal scenes with ambient bob/sparkle/fireworks loops                                                                      |
| Ambient infinite loops     | Widespread on Connection intro/quiz, celebration transitions, Treasures explosion, Sky balloons/sparks                                    |
| CTA / control pulse        | Quiz/match **node pulse** (`*-node-pulse … infinite`) on current step — known Playwright flake source                                     |
| Reduced motion             | **Partial** — many later scenes honor `useReducedMotion`; **no host** respects it for cross-fade; some early Bloom Moments scenes omit it |
| Shared motion foundation   | **None** (no motion tokens module). Landing has `ScrollReveal` + `MotionProvider` only                                                    |

### Host transition inventory (evidence)

| Host family                                 | `AnimatePresence` | Enter                           | Exit       | Duration  |
| ------------------------------------------- | ----------------- | ------------------------------- | ---------- | --------- |
| Bloom Moments/Connection/Memories/Treasures | `mode="wait"`     | opacity 0→1                     | opacity →0 | **0.45s** |
| Sky Moments/Connection                      | `mode="wait"`     | opacity 0→1                     | opacity →0 | **0.28s** |
| Sky Memories                                | `mode="sync"`     | (varies)                        | opacity →0 | **0.2s**  |
| Sky Treasures                               | `mode="wait"`     | opacity 0→1                     | opacity →0 | **0.18s** |
| Warm Moments/Connection/Memories/Treasures  | `mode="sync"`     | **opacity stays 1** (exit-only) | opacity →0 | **0.2s**  |

Warm’s exit-only sync fade can feel **abrupt on enter** relative to Bloom’s wait cross-fade.

### Browser spot checks (2026-08-04)

One-off Playwright (temp install; **not** added to repo):

| Probe                                                 | Result                                                                                       |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Bloom / Warm / Sky mount `390×844`                    | ✅ no overflow · no page errors on normal motion                                             |
| Sky desktop `1280×800`                                | ✅ no overflow                                                                               |
| Bloom gift CTA advance via automation                 | ⚠️ flake — stayed on `moments.gift-box` (known continuous-motion / CTA discoverability debt) |
| CSS `animation-iteration: infinite` count on gift-box | Often **0** (ambient motion is mostly Framer, not CSS keyframes)                             |
| Sky Connection + `reducedMotion: reduce`              | ⚠️ **hydration mismatch** log (server HTML vs client reduced-motion branch)                  |
| HTTP Theme Lab routes                                 | ✅ 200                                                                                       |

Prior Sprint 12.5 closure evidence remains valid for journey coverage; this review did **not** re-run all 12 paths.

### Identity contradictions (motion)

| Observation                                                    | Flag                                                                  |
| -------------------------------------------------------------- | --------------------------------------------------------------------- |
| Bloom Connection quiz intro uses gift-float + petal fall loops | Soft floral OK, but **loops on interactive screens** compete with CTA |
| Warm celebration-transition fireworks **infinite** loops       | Can feel louder than “ceremonial stationery” if overused              |
| Sky balloon float infinite                                     | Fits airy identity — keep, but gate with reduced-motion               |
| Shared Bloom Moments gift reused into Connection               | Coupling risk if Sprint 13 retimes shared gift primitives             |

---

## 2. Most serious risks

1. **Shared Moments surface coupling** — editing Bloom/Warm/Sky Moments gift, letter, or gallery primitives ripples into Connection / Memories / Treasures wrappers.
2. **Inconsistent host transitions** — same product feels different when switching themes/modes; Warm enter is especially thin.
3. **Incomplete reduced-motion** — hosts ignore preference; Bloom Moments letter/gift-box omit hooks; reduced-motion paths risk **hydration mismatch**.
4. **Infinite motion on interactive chrome** — node pulse / ambient loops harm focus and automation stability.
5. **Locked journey logic drift** — Sprint 13 must change presentation timing only; graphs, advances, and business state stay locked.

---

## 3. Minimal Motion Foundation proposal

**Name:** Celebrate Motion Kit (Theme Lab) — small module, not a choreography engine.

### Shared (proposed location)

`features/experience/scene-engine/shared/motion/` (names finalizable at implementation):

| Export                        | Purpose                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `MOTION_DURATION`             | `instant` 0 · `fast` ~0.2 · `base` ~0.35 · `scene` ~0.45 · `ceremony` ~0.7–1.0 (map to GER-01 for _transition scenes_, not every host fade) |
| `MOTION_EASE`                 | `out` `[0.22,1,0.36,1]` · `soft` · `pop` (one shared pop curve)                                                                             |
| `fadeVariants` / `sceneFade`  | Host enter/exit opacity helpers + **reduced-motion → duration 0 / false initial**                                                           |
| `blurReveal` (optional light) | opacity + slight blur→0 for letter/gallery payoff — skip if reduce                                                                          |
| `gentleZoom`                  | scale `0.96→1` max — supporting tool only                                                                                                   |
| `staggerChildren` presets     | Small delays (`0.06` / `0.1`) for letter lines / gallery cards                                                                              |
| `useCelebrateReducedMotion()` | Thin wrapper around `useReducedMotion` + SSR-safe default to avoid hydration traps                                                          |
| Ambient rules helper          | Document + tiny util: ambient loops **off** when reduce; **no infinite** on primary CTAs                                                    |

### Theme-specific (remain local)

- Art direction: sakura vs velvet stationery vs clouds/balloons
- Gift box SVG / lid choreography character
- Particle vocabulary (petals, sparks, balloon float)
- Scrapbook tilt / album unlock theatrics
- Any spring stiffness that defines personality

### Leave unchanged unless touched for a representative fix

- Locked graph IDs and advance rules
- Photobooth placeholder scenes
- Studio / Landing / Preview / `/e/[token]`
- Playful / Pure catalogs
- Most score-calculation copy/layout

### Worth consolidating (high value / low drama)

1. **Host scene fade** durations + reduced-motion gate (12 hosts)
2. **Duplicated `EASE_OUT` constants** → import shared
3. **Quiz/match node pulse** → one-shot or CSS that fully stops under reduce; prefer **static emphasis** on current step
4. **Letter enter / gift open** timing tokens used by representative scenes only first

### Not in foundation

- Virtual camera / timeline DSL / scene choreographer
- Global particle system
- Rewriting all 12 journeys’ ambient art

---

## 4. Theme-specific motion principles

| Theme     | Motion character                         | Do                                                               | Don’t                                                    |
| --------- | ---------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| **Bloom** | Soft, floral, gentle, luminous           | Soft ease-out, petal-like stagger, luminous fades                | Hard cuts, carnival bounce, endless CTA pulse            |
| **Warm**  | Ceremonial, intimate, stationery, velvet | Deliberate ceremony timing, envelope gravity, restrained sparkle | Infinite fireworks on idle screens; childish spring spam |
| **Sky**   | Airy, scrapbook, clouds, balloons        | Light float, scrapbook settle, balloon lift                      | Heavy blur stacks, slow opaque fades that feel “muddy”   |

Shared timing/a11y rules are allowed. Personality stays local.

---

## 5. Prioritized implementation phases

| Phase  | Focus                                                                         | Outcome                                             |
| ------ | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| **P0** | Motion kit + SSR-safe reduced-motion helper                                   | Tokens exist; hydration-safe                        |
| **P1** | Scene host transitions (all 12 hosts)                                         | Intentional, consistent cross-fade; reduce → snap   |
| **P2** | Reduced-motion pass on representative + high-traffic ambient                  | Ceremony still readable without loops               |
| **P3** | Envelope / gift reveal (1 Bloom + 1 Warm + optional Sky gift)                 | Ceremonial open, tokenized durations                |
| **P4** | Letter reveal (1 Warm stationery + 1 Bloom/Sky letter)                        | Staggered read feel; reduce → full text             |
| **P5** | Gallery entrance / completion (1 Sky or Warm gallery)                         | Emotional payoff without re-authoring all galleries |
| **P6** | Cull infinite CTA / node pulse                                                | Static or one-shot emphasis                         |
| **P7** | Light camera push/pull **only** where a representative scene clearly benefits | Supporting polish — not a feature track             |
| **P8** | Regression matrix + Sprint 13 audit/lock doc                                  | Close sprint                                        |

Blur / zoom / camera are **tools inside** P3–P7, not separate epics.

---

## 6. Representative rollout plan

Prove the kit on a **limited matrix**, then expand only with justification:

| Slot                  | Surface                                              | Why                                                     |
| --------------------- | ---------------------------------------------------- | ------------------------------------------------------- |
| Bloom ceremony        | Moments gift-box → gift-opening (host fade + gift)   | Canonical soft open; shared gift API risk visible early |
| Warm envelope/letter  | Moments gift-opening or letter-transition → letter   | Stationery ceremony                                     |
| Sky gallery / balloon | Moments balloon-burst → gallery **or** gallery enter | Airy payoff                                             |
| Connection            | Bloom or Sky quiz-question current-node treatment    | Interaction + pulse debt                                |
| Memories              | Warm or Sky match-intro / match-transition           | One-shot particles already preferred here               |
| Treasures             | Sky or Bloom final-gift unlock / gift-grid settle    | Reward without fireworks mandate                        |

### Shared Moments regression checklist (mandatory when editing shared files)

If changing Bloom Moments gift/letter/gallery or Warm/Sky Moments primitives reused by wrappers:

- [ ] Moments journey still advances
- [ ] Connection scenes that reuse Moments gift/loading still mount
- [ ] Treasures binder/gallery paths that reuse Moments gallery still mount
- [ ] `?noPhotos=1` path still safe
- [ ] No graph ID renames

---

## 7. Safety boundaries

Sprint 13 implementation **must not** require:

- DB / schema / migration / RLS changes
- New API routes or server actions
- Live quiz / match / Gift submit or persistence
- Studio, Preview, orders, publish changes
- `/e/[token]` Scene Engine wiring
- Playful / Pure unfreeze or Theme Lab
- Photobooth redesign
- Package upgrades unless a proven blocker (prefer none)
- `npm audit fix --force`

### Dependency audit baseline (record only)

As of this entry review (`npm audit`): **10 vulnerabilities (7 high, 3 moderate)** — drift from Sprint 12.5 closure baseline of 7 (5 high, 2 moderate). **Do not auto-fix** in Sprint 13. Triage remains **before production**.

---

## 8. Browser and regression plan

| Mode           | Viewports             | Checks                                                                                                                    |
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Normal motion  | `390×844`, `1280×800` | Representative matrix scenes; overflow; CTA reachability; no blank transition; no dead click during enter; console errors |
| Reduced motion | same                  | Snap transitions; no infinite ambient on critical UI; **no hydration errors**; content readable                           |

Also verify:

- Locked journey logic unchanged (scene order, auto-advance durations in graphs)
- Mobile smoothness **acceptable** (not a full perf certification)
- No major layout shift from host fade
- Playwright: prefer role/text assertions over waiting on mid-animation positions

Sprint 13 does **not** claim full WCAG or performance certification.

---

## 9. Deliverables

1. Motion inventory (this doc §1; optional living checklist in README)
2. Minimal motion tokens/utilities (`shared/motion`)
3. Reduced-motion rules + SSR-safe hook
4. Core scene transition pattern applied to hosts
5. Envelope/gift reveal pattern (representative)
6. Letter reveal pattern (representative)
7. Gallery reveal pattern (representative)
8. Representative Bloom · Warm · Sky implementations
9. Regression matrix results
10. `docs/sprint-13/…` audit + lock documentation at sprint end

**Excluded deliverable:** Photobooth motion.

---

## 10. Definition of done

Sprint 13 is complete only when:

- [ ] Scene changes feel intentional rather than abrupt
- [ ] Envelope/gift and letter reveals feel ceremonial on representative surfaces
- [ ] Gallery feels like an emotional payoff on at least one representative path
- [ ] Primary CTAs do not move continuously without a clear reason
- [ ] Reduced-motion behavior works (hosts + representative scenes; no hydration mismatch)
- [ ] Mobile controls remain reachable
- [ ] No locked graph / journey logic changes unexpectedly
- [ ] Bloom, Warm, and Sky retain distinct motion personalities
- [ ] Technical gate passes (`tsc`, ESLint on touched areas, `next build`)
- [ ] Documentation synchronized
- [ ] Production `/e/[token]` remains unauthorized
- [ ] Playful / Photobooth remain untouched

---

## 11. Explicit exclusions

- Photobooth redesign / animation (Sprint 14)
- Playful Theme Lab
- Pure reactivation
- `/e/[token]` Scene Engine integration
- Cinematic virtual-camera framework
- Rewriting all 12 journeys’ unique choreography
- Live scoring / Gift domain actions
- Dependency force-fixes

---

## 12. Recommendation

**Sprint 13 entry plan is Founder-approved.** Implementation proceeds in limited phases (P0 foundation → representative P1 hosts → Founder expansion review). No cinematic / virtual-camera framework. Photobooth, Playful, Pure, and `/e/[token]` remain out of scope.

---

## Pointers

- Sprint 12.5 closure: [../sprint-12-5/24_SPRINT_12_5_FINAL_CLOSURE_AUDIT.md](../sprint-12-5/24_SPRINT_12_5_FINAL_CLOSURE_AUDIT.md)
- GER-01 transition duration: [../adr/S11-008-global-experience-rules.md](../adr/S11-008-global-experience-rules.md)
- Scene contract motion slots: [../adr/S11-006-scene-contract.md](../adr/S11-006-scene-contract.md)
- Roadmap: [../11_IMPLEMENTATION_ROADMAP_V2.md](../11_IMPLEMENTATION_ROADMAP_V2.md)
