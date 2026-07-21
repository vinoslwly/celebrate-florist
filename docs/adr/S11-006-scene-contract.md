# ADR S11-006 — Scene Contract Specification

> **Status:** Accepted — Founder Approved (FD-S11-06)  
> **Date:** 2026-07-15  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#fd-s11-06--scene-contract-approved)

---

## Context

Four experience modes (and future modes) must integrate with Scene Engine consistently. Without a universal contract, lifecycle behavior would diverge across Quiz, Match, Envelope, Letter, Gallery, and Photobooth scenes — blocking Sprint 13 motion and forcing Scene Engine changes per new scene type.

Founder requested evaluation: should Scene Contract be a dedicated ADR vs. spread across lifecycle, hooks, and type docs?

**Architectural review conclusion:** A dedicated ADR improves maintainability, onboarding, and scalability without adding implementation complexity. It consolidates lifecycle, hooks, and integration rules into one authoritative reference.

---

## Decision

Every scene MUST implement the same **Scene Contract** — a common architecture interface from the Scene Engine perspective.

Applicable to: Quiz, Match, Envelope (grid + content), Letter, Gallery, Photobooth, and all future scene types.

Exact API naming is flexible during Sprint 11 planning refinement. Conceptually, every scene MUST expose equivalent lifecycle responsibilities:

| Responsibility | Purpose                                                                                                  |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| **onEnter**    | Scene becomes active; subscribe UI; allowed side effects (e.g., CF-R2 trigger on Photobooth first enter) |
| **onExit**     | Transition out begins; block new interaction                                                             |
| **canLeave**   | Guard — return false to block illegal transitions (e.g., quiz unsubmitted)                               |
| **onComplete** | Scene business goal satisfied; emit transition trigger to Transition Manager                             |

Scene Engine invokes contract methods; scenes MUST NOT bypass Transition Manager to change `activeSceneId`.

---

## Contract rules

1. **Uniform from engine view** — Scene Manager treats all scene types polymorphically via the contract.
2. **Business logic stays in scene implementation** — grading, envelope fetch, unlock writes remain in existing feature modules; contract only coordinates lifecycle.
3. **No engine modification for new scene types** — new mode = new scene graph + scene implementation satisfying contract + registry entry.
4. **Mount/unmount** — `onExit` leads to unmount (FR-03); completed scenes MUST NOT remain interactive in DOM.
5. **canLeave is synchronous for UX blocking** — async validation (e.g., submit in flight) returns false until settled.
6. **Transition scenes (`type: transition`)** — logical bridge only; **minimal contract** (auto-advance via duration or edge guard). Not interaction destinations. See [Moments spec](../sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md) Scenes 5 and 7.

### Scene type taxonomy (extends engine)

| Type                  | Contract level | Example                                                                                                            |
| --------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------ |
| `intro`               | Full           | Moments Gift Box, Gift Opening                                                                                     |
| `transition`          | Minimal        | Letter Transition, Album Unlock Transition                                                                         |
| `continuation-ending` | Full           | Gallery Ending                                                                                                     |
| _(other types)_       | Full           | gate, reward, reward-partial, continuation, terminal — see [doc 16 §7](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) |

---

## Spec-level interface (documentation only)

```typescript
/** Conceptual contract — exact export names decided at implementation */
interface SceneContract {
  readonly sceneId: SceneId;

  onEnter(ctx: SceneContext): void | Promise<void>;
  onExit(ctx: SceneContext): void | Promise<void>;
  canLeave(ctx: SceneContext): boolean;
  onComplete(ctx: SceneContext): void | Promise<void>;
}
```

Scenes MAY be implemented as React components with hook adapters (`useSceneContract`) — implementation detail for Sprint 12+.

---

## Lifecycle mapping

```
INACTIVE → ENTERING → ACTIVE → EXITING → UNMOUNTED
              ↑ onEnter    ↑ canLeave/onComplete trigger transition
              onExit ─────────────────────────────→ UNMOUNTED
```

Sprint 11: ENTERING/EXITING are **logical zero-duration phases** until Sprint 13 assigns motion duration.

---

## Consequences

### Positive

- Single reference for implementers adding Mode 5 scenes.
- Sprint 13 motion hooks attach to onEnter/onExit uniformly.
- Reduces risk of Treasures-only special cases leaking into Scene Manager core.

### Negative

- Thin adapter layer required for legacy components not authored with lifecycle hooks.
- Contract compliance must be verified in Sprint 12 integration checklist.

### Rejected alternative

**Distributed documentation only** (lifecycle in doc 16 §7, hooks in §7, types in appendix) — rejected because FD-S11-06 elevates Scene Contract to a core architectural decision deserving one SSOT ADR.

---

## Compliance matrix

| Scene type                     | onComplete trigger                                                | canLeave notes                                                |
| ------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------- |
| Intro (Moments)                | User interaction or auto duration                                 | Gift Box: false until tap; Celebrate Loading: auto            |
| Transition                     | Duration complete → auto edge                                     | N/A — not interactive; minimal contract                       |
| Locked Gift (Connection)       | 3 failed open attempts → challenge                                | CF-4: nothing revealed                                        |
| Quiz intro (Connection)        | Start → first question                                            | Use "gift" not "letter"                                       |
| Quiz question (Connection)     | Answer selected → next or submit                                  | One question per screen; no back; no per-answer feedback      |
| Score calculation (Connection) | Submit success → score reveal                                     | Covers async submit                                           |
| Score reveal (Connection)      | Reveal My Gift → celebration                                      | Warm tone only (CF-1); reward-partial type                    |
| Locked Gift (Memories)         | Failed open → gift locked                                         | CF-4: nothing revealed; gift not album                        |
| Match memory (Memories)        | Story selected or timer → next/submit                             | One photo per screen; FD-S11-09 reversal; no Correct/Wrong UI |
| Score reveal (Memories)        | Unlock Your Gift → memory transition                              | Warm tone (FD-M5); reward-partial type                        |
| Envelope grid                  | Open envelope → `ENVELOPE_OPENED`                                 | true (any order FD-T1)                                        |
| Envelope content               | Back or complete read → `ENVELOPE_BACK` or grid                   | true for back edge                                            |
| Locked gift (Treasures)        | Failed open → gift locked                                         | CF-4: nothing revealed                                        |
| Gift explosion (Treasures)     | Duration complete → gift grid                                     | Max 3 s (GER-01 override)                                     |
| Gift grid (Treasures)          | Open gift → `GIFT_OPENED`                                         | Presentation guard on Final Gold (FD-S11-17)                  |
| Gift content (Treasures)       | Back or complete read → `GIFT_BACK` or grid                       | true for back edge (FD-S11-02)                                |
| Final gift unlock (Treasures)  | Open final gold → final letter                                    | Elegant reveal; no fireworks                                  |
| Letter                         | User proceed → `CONTINUATION_COMPLETE`                            | true after render                                             |
| Gallery                        | Proceed or skip if empty                                          | true                                                          |
| Gallery ending                 | User CTA → photobooth                                             | true                                                          |
| Photobooth                     | Terminal — `TERMINAL_REACHED`; CF-R2 on first onEnter (Treasures) | true (terminal)                                               |

**Gameplay timers (Memories only):** GER-02 · GER-03 · GER-05 — [S11-008](./S11-008-global-experience-rules.md)

**Moments mode detail:** [sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md](../sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md)

**Connection mode detail:** [sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md](../sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md)

**Memories mode detail:** [sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md](../sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)

**Treasures mode detail:** [sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md](../sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)
