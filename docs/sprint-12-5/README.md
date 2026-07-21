# Sprint 12.5 — Bloom Theme Validation Pilot

> **Bloom Moments:** 🔒 **APPROVED AND LOCKED**  
> **Bloom Connection:** 🔒 **APPROVED AND LOCKED** (Theme Lab Scenes 0–15) — Photobooth = Moments placeholder (Sprint 14 redesign deferred)  
> **Bloom Memories:** ⏸ **NOT STARTED**  
> **Bloom Treasures:** ⏸ **NOT STARTED**  
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

Scene graph SSOT: [Moments](../sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md) · [Connection](../sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md).

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

### Mode / production gates

| Item                              | Status                                                                                 |
| --------------------------------- | -------------------------------------------------------------------------------------- |
| Bloom Pilot Plan                  | ✅ [00](./00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md)                                     |
| Moments Theme Lab                 | 🔒 **APPROVED AND LOCKED**                                                             |
| Independent audit (Moments)       | ✅ [02](./02_BLOOM_MOMENTS_INDEPENDENT_AUDIT.md) — PASS WITH REQUIRED FIXES (resolved) |
| Stabilization + lessons (Moments) | ✅ [03](./03_BLOOM_MOMENTS_STABILIZATION_AND_LESSONS.md)                               |
| Bloom Connection                  | 🔒 **APPROVED AND LOCKED**                                                             |
| Connection audit + lock           | ✅ [04](./04_BLOOM_CONNECTION_AUDIT_AND_LOCK.md)                                       |
| Bloom Memories                    | ⏸ **NOT STARTED**                                                                      |
| Bloom Treasures                   | ⏸ **NOT STARTED**                                                                      |
| Production `/e/` Scene Engine     | ⛔ **NOT AUTHORIZED**                                                                  |

### Assets

| Location                              | Role                                                                  |
| ------------------------------------- | --------------------------------------------------------------------- |
| `public/themes/bloom/moments/`        | **Runtime** Theme Lab assets (shared by Connection reuse)             |
| `design-references/bloom/moments/`    | Founder Moments **reference** images (not deploy-facing)              |
| `design-references/bloom/connection/` | Founder Connection **reference** images (~3.5 MB · not deploy-facing) |
| `public/themes/bloom/connection/`     | **None** — Connection does not copy Moments runtime assets            |

### Notes

- `decorativeIntensity` is a **runtime** theme presentation field (consumed by atmosphere helpers).
- Theme Lab uses **static synthetic fixtures** — no DB, tokens, or server actions.
- Theme Lab is `noindex` and absent from production navigation.
- Connection Theme Lab journey Scenes 0–15 is complete for Bloom validation.
- Connection Scene 0–1 and Scenes 11–15 reuse locked Moments scenes (Founder instruction).
- Photobooth redesign remains **Sprint 14 / Production Pending** (same as Moments).
