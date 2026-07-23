# Sprint 12.5 — Bloom Theme Validation Pilot

> **Bloom Moments:** 🔒 **APPROVED AND LOCKED**  
> **Bloom Connection:** 🔒 **APPROVED AND LOCKED** (Theme Lab Scenes 0–15) — Photobooth = Moments placeholder (Sprint 14 redesign deferred)  
> **Bloom Memories:** 🔒 **APPROVED AND LOCKED** (Theme Lab Scenes 0–15 · Scene 10 letter-emergence) — see [05 fast gate](./05_BLOOM_MEMORIES_FAST_GATE.md)  
> **Bloom Treasures:** 🔒 **APPROVED AND LOCKED** (Theme Lab Scenes 0–13 · Scene 9+ reuses Connection 11+) — see [06 fast gate](./06_BLOOM_TREASURES_FAST_GATE.md)  
> **Bloom theme (all four modes):** 🔒 **APPROVED AND LOCKED** — see [07 full audit](./07_FULL_BLOOM_THEME_AUDIT_AND_LOCK.md)  
> **Bloom remote sync:** ✅ **COMPLETE** (`3820a6a` on `origin/rebuild/foundation`)  
> **Handoff / next theme:** [08 handoff](./08_BLOOM_HANDOFF_AND_NEXT_THEME_READINESS.md)  
> **Warm theme (all four modes):** 🔒 **APPROVED AND LOCKED** — [14 full audit](./14_FULL_WARM_THEME_AUDIT_AND_LOCK.md) · modes [10](./10_WARM_MOMENTS_FAST_GATE.md) · [11](./11_WARM_CONNECTION_FAST_GATE.md) · [12](./12_WARM_MEMORIES_FAST_GATE.md) · [13](./13_WARM_TREASURES_FAST_GATE.md)  
> **Playful / Sky:** ⏸ not started — Playful may begin after Founder approval  
> **Production Scene Engine integration:** ⛔ **NOT AUTHORIZED**  
> **`/e/[token]` production wiring:** ⛔ **NOT AUTHORIZED**

**Theme Lab route:** `/theme-lab/bloom` (`app/(theme-lab)/theme-lab/bloom/page.tsx`)

**Core UI:** ✅ **IMPLEMENTED AND APPROVED** (PASS WITH FOLLOW-UP) — separate from Moments Theme Lab  
**Register:** [DDR-S12-030](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md) … [DDR-S12-035](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md)  
**Founder decision:** [FD-S12-17](../05_FOUNDER_DECISIONS.md) · [FD-S12-18](../05_FOUNDER_DECISIONS.md)

## Locked baseline (Moments)

Bloom Moments is the **reference implementation** for future Bloom modes.

“Locked” means future work must **not** casually change its approved journey, design, scene order, or technical contract.

A later change is allowed only for:

- confirmed regression
- shared infrastructure compatibility
- security fix
- accessibility fix
- explicit Founder instruction

## Presentation workflow (locked — all modes / themes)

**Founder gives one reference image → engineering converts it into living code.**

| Step | Rule                                                                                   |
| ---- | -------------------------------------------------------------------------------------- |
| 1    | Founder delivers **one scene / screen** reference image at a time                      |
| 2    | Engineering rebuilds it as **living HTML + CSS + Framer Motion**                       |
| 3    | The Founder image is **reference only** — never pasted as the full interactive screen  |
| 4    | Optional crops (corners, petals) may support layers; they are **not** the scene itself |
| 5    | Revise in Theme Lab until Founder approves that scene, then proceed to the next        |

**Exception (Connection Scene 0–1, 11–15):** Founder instructed reuse of locked Moments loading, gift introduction, letter, album unlock, gallery, gallery ending, and photobooth — no new reference images required for those beats ([DDR-S12-035](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md)).

**Exception (Memories Scene 0–3):** Founder instructed reuse of locked Connection living Scenes 0–3 (loading, welcome/flower, locked gift, challenge invitation / gift-locked) — Theme Lab living scenes as-is ([DDR-S12-036](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md)).

**Exception (Treasures Scene 0–2):** Founder instructed reuse of locked Moments/Connection/Memories ceremony (loading, welcome/flower, locked gift) — Theme Lab living scenes as-is ([DDR-S12-037](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md)).

Scene graph SSOT: [Moments](../sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md) · [Connection](../sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md) · [Memories](../sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md) · [Treasures](../sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md).

### Moments scene status (Theme Lab) — LOCKED

| Scene                               | Status                                                     |
| ----------------------------------- | ---------------------------------------------------------- |
| 1 `moments.celebrate-loading`       | 🔒 Living                                                  |
| 2 `moments.gift-box`                | 🔒 Living                                                  |
| 3 `moments.gift-opening`            | 🔒 Living                                                  |
| 4 `moments.letter-confirmation`     | 🔒 Living                                                  |
| 5 `moments.letter-transition`       | 🔒 Living                                                  |
| 6 `moments.letter`                  | 🔒 Living                                                  |
| 7 `moments.album-unlock-transition` | 🔒 Living (~3s unlock)                                     |
| 8 `moments.gallery`                 | 🔒 Living (scrollable polaroids + Celebrate CTA)           |
| 9 `moments.gallery-ending`          | 🔒 Living (~1.6s thank-you beat)                           |
| 10 `moments.photobooth`             | ⏸ Placeholder wrapper — **Sprint 14 / Production Pending** |

### Connection scene status (Theme Lab) — LOCKED

| Scene                                 | Status                                                                       |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| 0 `connection.celebrate-loading`      | 🔒 Living (reuses Moments Scene 1)                                           |
| 1 `connection.gift-introduction`      | 🔒 Living (reuses Moments Scene 2 flower tap)                                |
| 2 `connection.locked-gift`            | 🔒 Living (Moments Scene 3 wrapped only — gift does not open)                |
| 3 `connection.challenge-invitation`   | 🔒 Living (invitation card + I'm Ready)                                      |
| 4 `connection.quiz-transition`        | 🔒 Living (romantic Quiz Time bridge · ~2s auto · no CTA)                    |
| 5 `connection.quiz-introduction`      | 🔒 Living (How well do you know me? · Start → gift)                          |
| 6 `connection.quiz.question.{n}`      | 🔒 Living (progress + one question · tap advances · 5 lab Qs)                |
| 7 `connection.score-calculation`      | 🔒 Living (glowing ajar gift · Almost there… · ~2s auto)                     |
| 8 `connection.score-reveal`           | 🔒 Living (ornate card · % · Reveal My Gift)                                 |
| 9 `connection.celebration-transition` | 🔒 Living (large SVG fireworks bottom→top · ~2.3s auto)                      |
| 10 `connection.letter-emergence`      | 🔒 Living (open gift + To/From head · ~1.4s auto · no tap CTA)               |
| 11 `connection.letter-reveal`         | 🔒 Living (reuses Moments Scene 6 letter · Unlock Memories)                  |
| 12 `connection.gallery-unlock`        | 🔒 Living (reuses Moments Scene 7 album unlock · ~3s)                        |
| 13 `connection.gallery`               | 🔒 Living (reuses Moments Scene 8 gallery)                                   |
| 14 `connection.gallery-ending`        | 🔒 Living (reuses Moments Scene 9 ending · ~1.6s)                            |
| 15 `connection.photobooth`            | 🔒 Living (reuses Moments Scene 10 photobooth · Sprint 14 redesign deferred) |

### Memories scene status (Theme Lab) — LOCKED

| Scene                           | Status                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------- |
| 0 `memories.celebrate-loading`  | 🔒 Living (reuses Connection / Moments loading)                              |
| 1 `memories.welcome`            | 🔒 Living (reuses Connection gift-introduction / Moments flower tap)         |
| 2 `memories.locked-gift`        | 🔒 Living (reuses Connection locked-gift · 3 failed opens)                   |
| 3 `memories.gift-locked`        | 🔒 Living (reuses Connection challenge-invitation as-is)                     |
| 4 `memories.match-transition`   | 🔒 Living (scrapbook MEMORY MATCH! celebration · auto ~1.8s)                 |
| 5 `memories.match-intro`        | 🔒 Living (gift + Start · emotional gate)                                    |
| 6 `memories.match.memory.{n}`   | 🔒 Living (photo → story · 20s · black spotlight reveal · 4 lab pairs)       |
| 7 `memories.calculating`        | 🔒 Living (reuses Connection score-calculation)                              |
| 8 `memories.score-reveal`       | 🔒 Living (reuses Connection score-reveal)                                   |
| 9 `memories.memory-transition`  | 🔒 Living (reuses Moments Scene 5 origami sakura letter-transition)          |
| 10 `memories.letter-emergence`  | 🔒 Living (reuses Connection Scene 10 · gift open + To/From head · ~1.4s)    |
| 11 `memories.letter-reveal`     | 🔒 Living (reuses Moments Scene 6 letter)                                    |
| 12 `memories.binder-transition` | 🔒 Living (reuses Moments Scene 7 album-unlock)                              |
| 13 `memories.gallery`           | 🔒 Living (reuses Moments Scene 8 gallery)                                   |
| 14 `memories.gallery-ending`    | 🔒 Living (reuses Moments Scene 9 gallery ending)                            |
| 15 `memories.photobooth`        | 🔒 Living (reuses Moments Scene 10 photobooth · Sprint 14 redesign deferred) |

### Treasures scene status (Theme Lab) — LOCKED

| Scene                            | Status                                                               |
| -------------------------------- | -------------------------------------------------------------------- |
| 0 `treasures.celebrate-loading`  | 🔒 Living (reuses Moments / Connection / Memories loading)           |
| 1 `treasures.welcome`            | 🔒 Living (reuses Moments flower tap / Connection gift-introduction) |
| 2 `treasures.locked-gift`        | 🔒 Living (reuses Moments locked gift · 3 failed opens)              |
| 3 `treasures.gift-locked`        | 🔒 Living (SPECIAL MESSAGE card · Once you open it… · Yes ♥)         |
| 4–5 `treasures.gift-explosion`   | 🔒 Living (one beat ~3.6s · open gift + mini gifts fountain)         |
| 6 `treasures.gift-grid`          | 🔒 Living (5 pink + Final Gold · locked until non-finals opened)     |
| 7 `treasures.gift-content.{n}`   | 🔒 Living (open gift + letter Message/Photo · back to grid)          |
| 8 `treasures.final-gift-unlock`  | 🔒 Living (KF1 1.5s gold glow → KF2 2s To/From · 3.5s total)         |
| 9 `treasures.final-letter`       | 🔒 Living (reuses Connection Scene 11 letter-reveal)                 |
| 10 `treasures.binder-transition` | 🔒 Living (reuses Connection Scene 12 gallery-unlock)                |
| 11 `treasures.gallery`           | 🔒 Living (reuses Connection Scene 13 gallery)                       |
| 12 `treasures.gallery-ending`    | 🔒 Living (reuses Connection Scene 14 gallery-ending)                |
| 13 `treasures.photobooth`        | 🔒 Living (reuses Connection Scene 15 photobooth · terminal)         |

### Mode / production gates

| Item                              | Status                                                                                                                                                                                                                                                              |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bloom Pilot Plan                  | ✅ [00](./00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md)                                                                                                                                                                                                                  |
| Moments Theme Lab                 | 🔒 **APPROVED AND LOCKED**                                                                                                                                                                                                                                          |
| Independent audit (Moments)       | ✅ [02](./02_BLOOM_MOMENTS_INDEPENDENT_AUDIT.md) — PASS WITH REQUIRED FIXES (resolved)                                                                                                                                                                              |
| Stabilization + lessons (Moments) | ✅ [03](./03_BLOOM_MOMENTS_STABILIZATION_AND_LESSONS.md)                                                                                                                                                                                                            |
| Bloom Connection                  | 🔒 **APPROVED AND LOCKED**                                                                                                                                                                                                                                          |
| Connection audit + lock           | ✅ [04](./04_BLOOM_CONNECTION_AUDIT_AND_LOCK.md)                                                                                                                                                                                                                    |
| Bloom Memories                    | 🔒 **APPROVED AND LOCKED** (Scenes 0–15) — [05 fast gate](./05_BLOOM_MEMORIES_FAST_GATE.md)                                                                                                                                                                         |
| Bloom Treasures                   | 🔒 **APPROVED AND LOCKED** (Scenes 0–13) — [06 fast gate](./06_BLOOM_TREASURES_FAST_GATE.md)                                                                                                                                                                        |
| Full Bloom theme audit + lock     | 🔒 **PASSED** — [07](./07_FULL_BLOOM_THEME_AUDIT_AND_LOCK.md)                                                                                                                                                                                                       |
| Bloom remote sync                 | ✅ **COMPLETE** — `3820a6a` on remote                                                                                                                                                                                                                               |
| Next-theme handoff                | ✅ [08](./08_BLOOM_HANDOFF_AND_NEXT_THEME_READINESS.md)                                                                                                                                                                                                             |
| Warm                              | 🔒 **APPROVED AND LOCKED** (four modes) — [14 full audit](./14_FULL_WARM_THEME_AUDIT_AND_LOCK.md) · [10](./10_WARM_MOMENTS_FAST_GATE.md) · [11](./11_WARM_CONNECTION_FAST_GATE.md) · [12](./12_WARM_MEMORIES_FAST_GATE.md) · [13](./13_WARM_TREASURES_FAST_GATE.md) |
| Playful / Sky                     | ⏸ Not started — Playful after Founder approval                                                                                                                                                                                                                      |
| Production `/e/` Scene Engine     | ⛔ **NOT AUTHORIZED**                                                                                                                                                                                                                                               |

### Assets

| Location                              | Role                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------- |
| `public/themes/bloom/moments/`        | **Runtime** Theme Lab assets (shared by Connection / Memories / Treasures gallery reuse) |
| `design-references/bloom/moments/`    | Founder Moments **reference** images (not deploy-facing)                                 |
| `design-references/bloom/connection/` | Founder Connection **reference** images (~3.5 MB · not deploy-facing)                    |
| `design-references/bloom/treasures/`  | Founder Treasures **reference** images (~2.21 MB · not deploy-facing)                    |
| `public/themes/bloom/connection/`     | **None** — Connection does not copy Moments runtime assets                               |
| `public/themes/bloom/treasures/`      | **None** — Treasures uses shared SVG gift + Moments gallery fixtures                     |

### Notes

- `decorativeIntensity` is a **runtime** theme presentation field (consumed by atmosphere helpers).
- Theme Lab uses **static synthetic fixtures** — no DB, tokens, or server actions.
- Theme Lab is `noindex` and absent from production navigation.
- Connection Theme Lab journey Scenes 0–15 is complete for Bloom validation.
- Connection Scene 0–1 and Scenes 11–15 reuse locked Moments scenes (Founder instruction).
- Photobooth redesign remains **Sprint 14 / Production Pending** (same as Moments).
