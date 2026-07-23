# Bloom Handoff and Next-Theme Readiness

> **Date:** 2026-07-21  
> **Branch:** `rebuild/foundation` · commit `3820a6a` on remote  
> **Bloom full audit:** ✅ COMPLETE — [07](./07_FULL_BLOOM_THEME_AUDIT_AND_LOCK.md)  
> **Bloom theme lock:** 🔒 APPROVED  
> **Bloom remote sync:** ✅ COMPLETE  
> **Production `/e/[token]` Scene Engine:** ⛔ **NOT AUTHORIZED**

---

## Bloom final status

| Item             | Status                                                                               |
| ---------------- | ------------------------------------------------------------------------------------ |
| Moments          | 🔒 Locked (`b96c1b2`)                                                                |
| Connection       | 🔒 Locked (`d056513`)                                                                |
| Memories         | 🔒 Locked (`dda7efe`)                                                                |
| Treasures        | 🔒 Locked (`df262bc`)                                                                |
| Full theme audit | 🔒 Locked (`3820a6a`)                                                                |
| Theme Lab route  | `/theme-lab/bloom`                                                                   |
| Warm             | 🔒 **APPROVED AND LOCKED** — [14 full audit](./14_FULL_WARM_THEME_AUDIT_AND_LOCK.md) |
| Playful          | ⏸ Not started — may begin after Founder approval                                     |
| Sky              | ⏸ Not started                                                                        |

Bloom is the **reference implementation** for future themes. Locked scenes must not change casually — only for regression, security, accessibility, shared-infrastructure need, or explicit Founder instruction.

---

## Locked shared components

| Component                                    | Role                                       | Lock rule                                |
| -------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `BloomGiftBox`                               | Canonical gift SVG (`tone`: bloom \| gold) | Presentation only — no mode logic        |
| `MomentsPersistentShell` / Bloom decorations | Theme Lab immersive shell                  | Shared chrome — test all modes on change |

---

## Mode ownership map

| Mode           | Owns                                               | Reuses (wrappers only)                         |
| -------------- | -------------------------------------------------- | ---------------------------------------------- |
| **Moments**    | Graph 1–10, ceremony, letter, gallery, photobooth  | — (reference mode)                             |
| **Connection** | Quiz graph 0–15, score fixture, celebration        | Moments loading/gift/letter/gallery/photobooth |
| **Memories**   | Match graph 4–6, match fixture score               | Connection 0–3, 7–8, 10; Moments 9, 11–15      |
| **Treasures**  | Gift grid, unlock state, Final Gift / Final Reward | Ceremony 0–2; Connection 9–13 wrappers         |

**Final Gift** = locked grid/item state · **Final Reward** = letter/gallery path after Final Gift dismiss.

---

## What may be reused vs must stay mode-specific

| May reuse                                                  | Must stay mode-specific               |
| ---------------------------------------------------------- | ------------------------------------- |
| Thin scene wrappers                                        | Graph, host, registry per mode        |
| `BloomGiftBox`, shell, gallery fixtures                    | Quiz logic (Connection)               |
| Moments gallery webp paths                                 | Match logic (Memories)                |
| Letter/gallery/photobooth ceremony chain                   | Treasures `openedSortOrders` / unlock |
| Presentation tokens from `features/themes/config/bloom.ts` | Score / unlock production actions     |

Do **not** duplicate Bloom code purely to change colors — identify genuine theme-specific visual differences only.

---

## Fixture vs production boundaries

| Surface          | Theme Lab           | Production                                      |
| ---------------- | ------------------- | ----------------------------------------------- |
| Connection score | Fixed `92%` fixture | Live quiz grading (not wired)                   |
| Memories score   | Fixed `92%` fixture | `submitMatchAnswersAction` (not in lab)         |
| Treasures unlock | Host-local state    | `openEnvelopeAction` / Gift domain (not in lab) |
| Gallery photos   | Moments local webp  | Published signed URLs                           |
| Data             | Static TS fixtures  | Database + tokens                               |

No database client, server actions, or `/e/[token]` Scene Engine in Theme Lab.

---

## Known deferred items

- Connection / Memories scores are fixtures
- Treasures unlock is local Theme Lab state
- Connection / Memories / Treasures **Preview (static)** tab not built
- Photobooth redesign — **Sprint 14**
- Letter CTA still says “Unlock Memories” on reused letter scenes
- Empty-photo gallery skip — graph supports; browser QA pending
- Production performance budget and WCAG measurement pending
- Optional `?momentsScene=` deep-link parity

---

## Asset rules

| Location                     | Purpose                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| `public/themes/bloom/**`     | Runtime only (Moments gallery fixtures ~0.07 MB)                     |
| `design-references/bloom/**` | Founder refs — never deploy-facing                                   |
| Other themes (future)        | Same split: `public/themes/<theme>/` vs `design-references/<theme>/` |

Reuse shared runtime assets where appropriate; do not copy unnecessarily.

---

## Workflow for future themes

### Per mode (fast)

```text
Implement one mode
→ Fast Gate
→ mobile + desktop spot-check
→ commit clean checkpoint
→ next mode
```

Do **not** run a full independent audit after every mode unless production logic, database, auth, APIs, dependencies, or major shared infrastructure changed.

### After all modes in one theme

```text
Full cross-mode theme audit
→ fix blockers only
→ sync docs
→ lock theme
→ push
```

---

## Conditions requiring Founder review

- Any change to locked Bloom scenes (except allowed unlock reasons above)
- Shared component change affecting multiple modes
- New production API, server action, schema, or `/e/` wiring
- New dependency or remote asset URL
- Score/unlock presented as production truth in UI
- Starting Warm, Playful, or Sky implementation
- Duplicating locked scenes instead of wrapping

---

## Next-theme starting checklist

Before implementing Warm, Playful, or Sky:

1. **Confirm which theme starts next** (Founder approval).
2. **Inspect Canva / design references** for that theme — one scene at a time.
3. **Audit one mode first** — do not bulk-build all four modes at once.
4. **Decide whether Bloom architecture reuses unchanged** (graph/host/registry pattern) or needs theme-specific ceremony differences.
5. **Do not duplicate Bloom code** purely for palette swaps — token/config changes first.
6. **Identify genuine theme-specific visual differences** (atmosphere, motif, typography).
7. **Keep production wiring untouched** — Theme Lab + synthetic fixtures only until explicit authorization.
8. **Create** `features/theme-lab/config/<theme>-<mode>-fixtures.ts` — no real customer data.
9. **Add Theme Lab tab** with whitelisted deep-links — same security model as Bloom.
10. **Run Fast Gate per mode** · **full theme audit after all modes** · **then lock and push**.

---

## Pointers

- Full audit: [07_FULL_BLOOM_THEME_AUDIT_AND_LOCK.md](./07_FULL_BLOOM_THEME_AUDIT_AND_LOCK.md)
- Pilot plan: [00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md](./00_BLOOM_THEME_VALIDATION_PILOT_PLAN.md)
- Mode gates: [05](./05_BLOOM_MEMORIES_FAST_GATE.md) · [06](./06_BLOOM_TREASURES_FAST_GATE.md) · [04](./04_BLOOM_CONNECTION_AUDIT_AND_LOCK.md)
- Register: [DDR-S12-038](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md) · [FD-S12-19](../05_FOUNDER_DECISIONS.md)
