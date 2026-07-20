# Sprint 12.5 — Bloom Theme Validation Pilot

> **Bloom Moments Audit:** ✅ **COMPLETE** — [02_BLOOM_MOMENTS_INDEPENDENT_AUDIT.md](./02_BLOOM_MOMENTS_INDEPENDENT_AUDIT.md)  
> **Bloom Moments Stabilization:** ✅ **COMPLETE** — [03_BLOOM_MOMENTS_STABILIZATION_AND_LESSONS.md](./03_BLOOM_MOMENTS_STABILIZATION_AND_LESSONS.md)  
> **Bloom Moments Technical Gate:** ✅ **PASSED**  
> **Bloom Moments Founder Visual Review:** ✅ **APPROVED**  
> **Bloom Moments:** 🔒 **APPROVED AND LOCKED**  
> **Bloom Connection:** ✅ **READY — NOT STARTED** (audit authorized only after separate Founder instruction)  
> **Bloom Memories:** ⏸ **NOT STARTED**  
> **Bloom Treasures:** ⏸ **NOT STARTED**  
> **Production Scene Engine integration:** ⛔ **NOT AUTHORIZED**  
> **`/e/[token]` production wiring:** ⛔ **NOT AUTHORIZED**

**Theme Lab route:** `/theme-lab/bloom` (`app/(theme-lab)/theme-lab/bloom/page.tsx`)

**Core UI:** ✅ **IMPLEMENTED AND APPROVED** (PASS WITH FOLLOW-UP) — separate from Moments Theme Lab  
**Register:** [DDR-S12-030](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md) … [DDR-S12-034](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md)  
**Founder decision:** [FD-S12-17](../05_FOUNDER_DECISIONS.md)

## Locked baseline

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

Scene graph SSOT: [Sprint 11 Moments Scene Architecture](../sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md).

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

### Mode / production gates

| Item                          | Status                                                                                 |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| Bloom Pilot Plan              | ✅ [00](./00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md)                                     |
| Moments Theme Lab             | 🔒 **APPROVED AND LOCKED**                                                             |
| Independent audit             | ✅ [02](./02_BLOOM_MOMENTS_INDEPENDENT_AUDIT.md) — PASS WITH REQUIRED FIXES (resolved) |
| Stabilization + lessons       | ✅ [03](./03_BLOOM_MOMENTS_STABILIZATION_AND_LESSONS.md)                               |
| Bloom Connection              | ✅ **READY — NOT STARTED**                                                             |
| Bloom Memories                | ⏸ **NOT STARTED**                                                                      |
| Bloom Treasures               | ⏸ **NOT STARTED**                                                                      |
| Production `/e/` Scene Engine | ⛔ **NOT AUTHORIZED**                                                                  |

### Assets

| Location                           | Role                                                   |
| ---------------------------------- | ------------------------------------------------------ |
| `public/themes/bloom/moments/`     | **Runtime** Theme Lab assets only (~76 KB)             |
| `design-references/bloom/moments/` | Founder/Canva **reference** images (not deploy-facing) |

### Notes

- `decorativeIntensity` is a **runtime** theme presentation field (consumed by atmosphere helpers).
- Theme Lab uses **static synthetic fixtures** — no DB, tokens, or server actions.
- Theme Lab is `noindex` and absent from production navigation.
- Do not start Connection coding until Founder separately authorizes that mode.
