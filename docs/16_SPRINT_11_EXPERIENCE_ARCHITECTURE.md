# 16 — Sprint 11: Experience Architecture (Scene Engine)

> **Status:** **Architecture Complete** · **Implementation NOT authorized**  
> **Sprint type:** Architecture & specification only (no production code)  
> **Architecture closure:** 2026-07-16 (Cross-Mode Review + SSOT merge)  
> **Engineering freeze:** Active until explicit Sprint 11 **implementation** clearance  
> **Core architecture approval:** 2026-07-15 (FD-S11-01–06)  
> **Mode docs:** [sprint-11/README.md](./sprint-11/README.md)  
> **Authority chain:** [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) · [14_REPLAYABLE_EXPERIENCE.md](./14_REPLAYABLE_EXPERIENCE.md) · [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md) · [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md)

---

## Final Architecture Consistency Review

**Review date:** 2026-07-15  
**Outcome:** **PASSED** — no blocking contradictions

| Check                          | Result                                                                        |
| ------------------------------ | ----------------------------------------------------------------------------- |
| Phase A architecture preserved | ✅ Wrap-only; repos, services, actions, payloads untouched                    |
| CF-R1 / CF-R2 protected        | ✅ ADR S11-007; no CF-R2-B mechanisms; Photobooth trigger preserved           |
| Existing Founder Decisions     | ✅ FD-T1/T3/T4, CF-2, FD-M3, photobooth never-stored — all compatible         |
| Doc 13 four-mode SSOT          | ✅ Scene graphs defined for Moments, Connection, Memories, Treasures          |
| Unnecessary complexity         | ✅ Thin orchestration layer; no game engine, event bus, or visit model        |
| Future technical debt          | ✅ Parameterized graphs + Scene Contract enable Mode 5 without engine changes |
| FD-S11-01 through FD-S11-06    | ✅ Recorded in [05](./05_FOUNDER_DECISIONS.md) and ADRs below                 |

**Scene Contract ADR evaluation:** Founder guidance requested assessment of a dedicated ADR. **Recommendation accepted:** [ADR S11-006](./adr/S11-006-scene-contract.md) consolidates lifecycle, hooks, and integration into one SSOT — improves onboarding and scalability without extra implementation complexity.

---

## Incremental Documentation Strategy (FD-S11-DOC)

Sprint 11 is **not** one monolithic document. Mode-specific scene architecture is documented **incrementally, one mode at a time**, then consolidated.

| Step                  | Document                                                                   | Status      |
| --------------------- | -------------------------------------------------------------------------- | ----------- |
| Core engine + ADRs    | This document                                                              | ✅ Locked   |
| 1 — Moments           | [sprint-11/01_MOMENTS](./sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md)       | ✅ Locked   |
| 2 — Connection        | [sprint-11/02_CONNECTION](./sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md) | ✅ Locked   |
| 3 — Memories          | [sprint-11/03_MEMORIES](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)     | ✅ Locked   |
| 4 — Treasures         | [sprint-11/04_TREASURES](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)   | ✅ Locked   |
| 5 — Cross-mode review | [sprint-11/05_CROSS_MODE_REVIEW](./sprint-11/05_CROSS_MODE_REVIEW.md)      | ✅ Complete |
| 6 — Final SSOT merge  | This document §7 + deliverables                                            | ✅ Complete |

**Full strategy:** [sprint-11/README.md](./sprint-11/README.md)

Sprint 11 **architecture planning is complete**. Scene Engine **implementation** is not authorized until explicit founder clearance.

---

## Document Control

| Field                                 | Value                                  |
| ------------------------------------- | -------------------------------------- |
| Sprint                                | 11 — Experience Architecture           |
| Implementation authorized             | **No**                                 |
| Animation / UI redesign authorized    | **No**                                 |
| Backend / database changes authorized | **No**                                 |
| Primary deliverable                   | This specification + ADRs              |
| Target consumers                      | Sprint 12–13 implementers, QA, Founder |

---

## Founder Decisions (Sprint 11)

| ID               | Decision                                                                        | ADR                                                                        |
| ---------------- | ------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **FD-S11-01**    | Wrap Architecture — Scene Engine wraps ExperienceFlow; presentation only        | [S11-001](./adr/S11-001-wrap-architecture.md)                              |
| **FD-S11-02**    | Treasures Back Edge — only mode with content → grid navigation                  | [S11-005](./adr/S11-005-treasures-back-edge.md)                            |
| **FD-S11-03**    | Persistent Shell — theme/layout frame stays mounted                             | [S11-002](./adr/S11-002-persistent-shell.md)                               |
| **FD-S11-04**    | Parameterized Scene Graphs — 2–6 envelopes without engine changes               | [S11-004](./adr/S11-004-parameterized-scene-graph.md)                      |
| **FD-S11-05**    | Initial Scene Ownership — server determines initial scene; engine never guesses | [S11-003](./adr/S11-003-initial-scene-server-owned.md)                     |
| **FD-S11-06**    | Scene Contract — universal onEnter/onExit/canLeave/onComplete for all scenes    | [S11-006](./adr/S11-006-scene-contract.md)                                 |
| **FD-S11-DOC**   | Incremental documentation — one mode at a time                                  | [sprint-11/README.md](./sprint-11/README.md)                               |
| **FD-S11-07**    | Moments scene flow (Scenes 0–10)                                                | [sprint-11/01_MOMENTS](./sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md)       |
| **FD-S11-08**    | Connection scene flow (Scenes 0–15)                                             | [sprint-11/02_CONNECTION](./sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md) |
| **FD-S11-09–13** | Memories scene flow + presentation rules                                        | [sprint-11/03_MEMORIES](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)     |
| **FD-S11-14–17** | Treasures scene flow + gift presentation                                        | [sprint-11/04_TREASURES](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)   |

Full decision text: [05_FOUNDER_DECISIONS.md — Sprint 11 Architecture](./05_FOUNDER_DECISIONS.md#sprint-11--experience-architecture-founder-approved).

CF-R2 integration: [S11-007](./adr/S11-007-cf-r2-photobooth-scene.md).

Global Experience Rules: [GER-01–06](./05_FOUNDER_DECISIONS.md#global-experience-rules-ger) · [S11-008](./adr/S11-008-global-experience-rules.md).

---

## Global Experience Rules (GER)

Cross-mode presentation standards — apply to all modes unless a locked mode doc explicitly overrides.

| ID         | Rule                                                                         | ADR                                                 |
| ---------- | ---------------------------------------------------------------------------- | --------------------------------------------------- |
| **GER-01** | Transition duration ~1.0–1.5 s                                               | [S11-008](./adr/S11-008-global-experience-rules.md) |
| **GER-02** | Gameplay countdown — **Memories Match only** (20 s); Connection **no timer** | [S11-008](./adr/S11-008-global-experience-rules.md) |
| **GER-03** | Timer expiry UX — **Memories only**                                          | [S11-008](./adr/S11-008-global-experience-rules.md) |
| **GER-04** | Backend preservation (Phase A unchanged)                                     | [S11-008](./adr/S11-008-global-experience-rules.md) |
| **GER-05** | Auto-select first story — **Memories only**                                  | [S11-008](./adr/S11-008-global-experience-rules.md) |
| **GER-06** | Timers = pacing, not punishment (where timers exist)                         | [S11-008](./adr/S11-008-global-experience-rules.md) |

**Revision (2026-07-16):** GER-02/03/05 scoped to Memories; Connection Quiz explicitly has no gameplay timer.

**CF-R2-B note:** GER gameplay timers are **not** visit/replay timers. See ADR S11-008.

Mode applicability: [01 Moments](./sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md) · [02 Connection](./sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md) · [03 Memories](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md).

---

## 1. Objectives

### Primary

Define the **Scene Engine** — a client-side presentation architecture that transforms Celebrate's single-page recipient flows into a **scene-based experience model** without altering business logic, security boundaries, or backend contracts from Phase A.

### Secondary

1. Produce **mode-specific scene graphs** for all four modes aligned with doc 13.
2. Define boundaries between Scene Engine (presentation) and Gate/Reward architecture (business).
3. Establish **Scene Contract** lifecycle preserving CF-R1/CF-R2 semantics.
4. Create implementation-ready artifacts (ADRs, type contracts, diagrams) for Sprint 12–13.
5. Validate design scales to a fifth mode without redesigning engine core.

---

## 2. Problems Solved

| #    | Phase A problem                                      | Why it blocks Phase B                                                |
| ---- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| P-01 | Single scrollable page per mode                      | Completed stages remain interactable (Treasures post-reset — doc 15) |
| P-02 | No shared scene lifecycle                            | Sprint 13 motion would be ad-hoc per mode                            |
| P-03 | Transition semantics undefined                       | Inconsistent cinematic experience                                    |
| P-04 | Progress models differ with no presentation contract | Engine cannot reason about journey position                          |
| P-05 | Informal Treasures-centric planning                  | Connection/Memories gate→reward ignored                              |
| P-06 | CF-R2 tied to Photobooth mount                       | Scene transitions must preserve trigger timing                       |
| P-07 | No extension point for future modes                  | Fifth mode = bespoke orchestrator                                    |

---

## 3. Scope & Non-Goals

### In scope (planning only)

Scene Engine model · per-mode scene graphs · Scene Contract · Persistent Shell · integration with `*ExperienceFlow` and `mode-registry` · logical transitions · progress/state ownership · CF-R2 contract · ADRs · diagrams · Sprint 12 handoff.

### Explicit non-goals

| Category            | Non-goal                                         |
| ------------------- | ------------------------------------------------ |
| Implementation      | No production code, spikes, or prototypes        |
| Animation           | No Framer Motion, CSS transitions, timing curves |
| UI redesign         | No new visual design                             |
| Backend             | No repos, services, actions, migrations          |
| Gate/Reward         | No payload or grading changes                    |
| Access gate         | No Memory Code / trust changes                   |
| CF-R2 backend       | No service semantic changes                      |
| Visit model         | No cookies, timers, visit detection (CF-R2-B)    |
| Photobooth redesign | Sprint 14                                        |
| Studio UX           | Sprint 15                                        |
| Buyer preview       | Unchanged in Sprint 11 scope                     |

---

## 4. Functional Requirements

| ID        | Requirement                                                                                         |
| --------- | --------------------------------------------------------------------------------------------------- |
| **FR-01** | Multi-mode scene graphs: `moments`, `connection`, `memories`, `treasures` — aligned with doc 13     |
| **FR-02** | Wrap existing orchestrators (`MomentsExperience`, `*ExperienceFlow`) — FD-S11-01                    |
| **FR-03** | Completed scenes **unmount** (not CSS hide); no interaction on unmounted scenes                     |
| **FR-04** | Forward-only default; **Treasures only** back edge content → grid — FD-S11-02                       |
| **FR-05** | Scene Engine starts after access gate `granted`                                                     |
| **FR-06** | Photobooth scene entry preserves CF-R2 trigger — [S11-007](./adr/S11-007-cf-r2-photobooth-scene.md) |
| **FR-07** | Progress from existing sources only (none / sessionStorage / server)                                |
| **FR-08** | Conditional scenes: gallery omitted when no photos; Treasures 2–6 envelopes — FD-S11-04             |
| **FR-09** | **Persistent Shell** — FD-S11-03                                                                    |
| **FR-10** | **Server determines initial scene** — FD-S11-05                                                     |
| **FR-11** | Every scene implements **Scene Contract** — FD-S11-06                                               |
| **FR-12** | Buyer preview routes excluded from Sprint 11 scope                                                  |

---

## 5. Non-Functional Requirements

| ID     | Requirement                                                   |
| ------ | ------------------------------------------------------------- |
| NFR-01 | Preserve security boundaries (CF-3, CF-4, A-4, FD-M2)         |
| NFR-02 | Thin orchestration — not a game engine                        |
| NFR-03 | Client-only Scene Engine boundary                             |
| NFR-04 | Feature-first: `features/experience/scene-engine/` (proposed) |
| NFR-05 | Mode extensibility: graph + registry only                     |
| NFR-06 | Reduced-motion bypass path (contract now; impl Sprint 13)     |
| NFR-07 | Do not mount all mode assets simultaneously                   |
| NFR-08 | Transitions describable as pure guard functions               |
| NFR-09 | Architectural choices in ADRs                                 |
| NFR-10 | Phase A behavior valid until per-mode migration complete      |

---

## 6. Scene Contract & Lifecycle

**Authoritative reference:** [ADR S11-006 — Scene Contract](./adr/S11-006-scene-contract.md).

Every scene exposes equivalent of: **onEnter**, **onExit**, **canLeave**, **onComplete**.

Lifecycle states:

```
INACTIVE → ENTERING → ACTIVE → EXITING → UNMOUNTED
```

Sprint 11: ENTERING/EXITING are logical zero-duration phases until Sprint 13 motion.

---

## 7. Scene Graph Architecture

### Core concepts

```
ExperienceSceneGraph
  ├── mode: ExperienceMode
  ├── buildScenes(params): SceneNode[]     ← parameterized — FD-S11-04
  ├── edges: SceneEdge[]
  └── resolveInitialScene(context): SceneId  ← server-owned — FD-S11-05
```

### Scene types

| Type                  | Examples                                                          | Destination?                                      |
| --------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| `shell`               | Persistent theme, layout frame — always mounted                   | N/A (chrome)                                      |
| `intro`               | Celebrate Loading, Gift Box, Gift Opening (Moments)               | Yes                                               |
| `transition`          | Letter Transition, Album Unlock Transition                        | **No** — logical bridge only; Sprint 13 animation |
| `gate`                | Quiz, Match, Envelope grid                                        | Yes                                               |
| `gate-dynamic`        | Single envelope content; Connection quiz question (parameterized) | Yes                                               |
| `reward-partial`      | Connection Score Reveal — score/band before letter payoff         | Yes                                               |
| `reward`              | Letter, unlock message                                            | Yes                                               |
| `continuation`        | Gallery                                                           | Yes                                               |
| `continuation-ending` | Gallery Ending (Moments)                                          | Yes                                               |
| `terminal`            | Photobooth                                                        | Yes (journey end)                                 |

**Transition scenes:** Exist in the graph but are NOT interaction destinations. They auto-advance after logical duration (Sprint 13 implements motion). Default duration: **GER-01** (~1.0–1.5 s). Minimal Scene Contract — see [S11-006](./adr/S11-006-scene-contract.md) · [S11-008](./adr/S11-008-global-experience-rules.md).

### Per-mode graphs

**Moments:** ✅ **Locked** — [sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md](./sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md)

```
access (outside engine) → celebrate-loading → gift-box → gift-opening
  → letter-confirmation → [letter-transition] → letter
  → [album-unlock-transition] → [gallery?] → [gallery-ending?] → photobooth
```

Doc 13 business layer preserved: **Letter → Gallery → Photobooth**.

**Connection:** ✅ **Locked** — [sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md](./sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md)

```
celebrate-loading → gift-intro → locked-gift → challenge-invitation
  → [quiz-transition] → quiz-intro → quiz.question.{n}
  → [score-calculation] → score-reveal → [celebration-transition] → letter-reveal
  → [gallery-unlock] → [gallery?] → [gallery-ending?] → photobooth
```

Doc 13 business layer preserved: **Quiz → Submit → Score + Band → Letter → Gallery → Photobooth**.

**Memories:** ✅ **Locked** — [sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)

```
celebrate-loading → welcome → locked-gift → gift-locked
  → [match-transition] → match-intro → match.memory.{n}
  → [calculating] → score-reveal → [memory-transition] → letter-reveal
  → [binder-transition] → [gallery?] → [gallery-ending?] → photobooth
```

Doc 13 business layer preserved: **Match → Submit → Score → Unlock Message → Letter → Gallery → Photobooth**.

**Treasures:** ✅ **Locked** — [sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)

```
celebrate-loading → welcome → locked-gift → gift-locked
  → [preparing-transition] → [gift-explosion] → gift-grid
  ⇄ gift-content.{so}          ← back edge FD-S11-02
  → final-gift-unlock → final-letter
  → [binder-transition] → [gallery?] → [gallery-ending?] → photobooth
```

Doc 13 business layer preserved: **Grid → Open any → All opened → Letter → Gallery → Photobooth**. Presentation uses Gift metaphor; business layer remains envelopes + A-4 fetch.

---

## 8. Scene Manager & Transition Manager

### Scene Manager

| Responsibility   | Detail                                 |
| ---------------- | -------------------------------------- |
| Graph loading    | By `experience_mode`                   |
| Active scene     | Current `SceneId`                      |
| Mount management | Persistent shell + active scene only   |
| Initial scene    | From server props — never client guess |
| Event dispatch   | From scene `onComplete` via contract   |

**MUST NOT:** fetch server data, grade answers, mutate envelope opens, store visit IDs.

### Transition Manager

| Responsibility   | Detail                                                     |
| ---------------- | ---------------------------------------------------------- |
| Edge validation  | Reject illegal transitions                                 |
| Guard evaluation | Unlock, envelope count, photos                             |
| Concurrency      | Block double-trigger                                       |
| Back edge        | `GIFT_BACK` / `ENVELOPE_BACK` — Treasures only (FD-S11-02) |

### Standard triggers

`JOURNEY_START` · `GATE_COMPLETE` · `ENVELOPE_OPENED` · `ENVELOPE_BACK` · `ALL_ENVELOPES_OPENED` · `REWARD_REVEALED` · `CONTINUATION_COMPLETE` · `TERMINAL_REACHED`

---

## 9. Navigation, Progress & State

### Navigation layers

```
Layer 0: Access (URL, Memory Code)     ← OUT OF SCOPE
Layer 1: Scene Engine                  ← SPRINT 11
Layer 2: In-scene interaction          ← EXISTING COMPONENTS
```

### Progress sources (read-only to engine)

| Mode       | Source                                      |
| ---------- | ------------------------------------------- |
| Moments    | N/A — sequential at OPEN                    |
| Connection | `sessionStorage` (`cf_connection_unlock_*`) |
| Memories   | `sessionStorage` (`cf_memories_unlock_*`)   |
| Treasures  | Server `experience_envelope_opens`          |

### State ownership

- **Business state** — existing features (payloads, sessionStorage, server opens)
- **Scene state** — Scene Manager (`activeSceneId`, transition status)
- **Presentation state** — Sprint 13 motion tokens

Scene Engine MUST NOT write business persistence except through existing business components/actions.

---

## 10. Gate/Reward & mode-registry Integration

```
page.tsx (RSC) → resolve initialSceneId + payloads
  └── RecipientExperienceView (mode-registry)
        └── *Experience shell
              └── SceneEngineHost
                    └── PersistentShell
                          └── Active Scene → existing components
```

Preserved contracts: Gate/Reward payloads · per-envelope fetch (A-4) · CF-R2 action · `isLiveRecipientMode()`.

---

## 11. Risks

| ID   | Risk                           | Mitigation                                 |
| ---- | ------------------------------ | ------------------------------------------ |
| R-01 | Engine replaces business logic | FD-S11-01 + ADR S11-001                    |
| R-02 | CF-R2 misfire on remount       | Once-per-load guard; ADR S11-007           |
| R-03 | sessionStorage desync          | Business components remain source of truth |
| R-04 | Over-engineering               | Max ~4 core modules; no event bus          |
| R-05 | Treasures dynamic graph        | Parameterized `gate-dynamic` — ADR S11-004 |
| R-06 | Hydration mismatch             | Server initial scene — ADR S11-003         |
| R-07 | Sprint 13 blocked              | Logical transition tokens defined          |
| R-08 | Mode visual divergence         | Shared Persistent Shell — ADR S11-002      |

---

## 12. Acceptance Criteria (Sprint 11 Planning)

| #     | Criterion                                                 | Status                                                         |
| ----- | --------------------------------------------------------- | -------------------------------------------------------------- |
| AC-01 | Core engine specification founder-approved (FD-S11-01–06) | ✅                                                             |
| AC-02 | ADRs S11-001 through S11-007 complete                     | ✅                                                             |
| AC-03 | Scene graph for each of 4 modes                           | ✅ All four modes locked                                       |
| AC-04 | Scene Contract documented                                 | ✅ ADR S11-006                                                 |
| AC-05 | Non-goals signed off                                      | ✅                                                             |
| AC-06 | Sprint 12 handoff (§13)                                   | ✅ (core); mode docs extend handoff per mode                   |
| AC-07 | Security: no gate/reward leakage at spec level            | ✅                                                             |
| AC-08 | No repository production code                             | ✅ Engineering freeze                                          |
| AC-09 | Incremental documentation strategy documented             | ✅ [sprint-11/README](./sprint-11/README.md)                   |
| AC-10 | Cross-mode review + final SSOT merge                      | ✅ [05_CROSS_MODE_REVIEW](./sprint-11/05_CROSS_MODE_REVIEW.md) |

---

## 13. Sprint 12 Handoff

Sprint 12 (UI System) needs from Sprint 11:

| Output                           | Use                              |
| -------------------------------- | -------------------------------- |
| Persistent Shell layout contract | Design system scene slots        |
| Scene type taxonomy              | Component organization           |
| Scene Contract hooks             | Shell + scene adapter patterns   |
| Transition phase slots           | Token placeholders for Sprint 13 |
| Reduced-motion semantic flags    | `data-reduced-motion` contract   |

Sprint 12 MUST NOT assume Scene Engine code exists or animations are implemented.

---

## 14. Deliverables

| #     | Deliverable                            | Location                                                                   |
| ----- | -------------------------------------- | -------------------------------------------------------------------------- |
| D-01  | Sprint 11 Core Specification           | This document                                                              |
| D-01a | Incremental planning index             | [sprint-11/README.md](./sprint-11/README.md)                               |
| D-01b | Moments scene architecture             | [sprint-11/01_MOMENTS](./sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md)       |
| D-01c | Connection scene architecture          | [sprint-11/02_CONNECTION](./sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md) |
| D-01d | Memories scene architecture            | [sprint-11/03_MEMORIES](./sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)     |
| D-01e | Treasures scene architecture           | [sprint-11/04_TREASURES](./sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)   |
| D-01f | Cross-mode architecture review         | [sprint-11/05_CROSS_MODE_REVIEW](./sprint-11/05_CROSS_MODE_REVIEW.md)      |
| D-02  | ADR S11-001 Wrap Architecture          | [adr/S11-001](./adr/S11-001-wrap-architecture.md)                          |
| D-03  | ADR S11-002 Persistent Shell           | [adr/S11-002](./adr/S11-002-persistent-shell.md)                           |
| D-04  | ADR S11-003 Initial Scene Server-Owned | [adr/S11-003](./adr/S11-003-initial-scene-server-owned.md)                 |
| D-05  | ADR S11-004 Parameterized Scene Graph  | [adr/S11-004](./adr/S11-004-parameterized-scene-graph.md)                  |
| D-06  | ADR S11-005 Treasures Back Edge        | [adr/S11-005](./adr/S11-005-treasures-back-edge.md)                        |
| D-07  | ADR S11-006 Scene Contract             | [adr/S11-006](./adr/S11-006-scene-contract.md)                             |
| D-08  | ADR S11-007 CF-R2 Photobooth Scene     | [adr/S11-007](./adr/S11-007-cf-r2-photobooth-scene.md)                     |
| D-09  | ADR S11-008 Global Experience Rules    | [adr/S11-008](./adr/S11-008-global-experience-rules.md)                    |

---

## Appendix A — Type Contracts (Spec-Level)

```typescript
type SceneId = string;

type SceneType =
  | "shell"
  | "intro"
  | "transition"
  | "gate"
  | "gate-dynamic"
  | "reward-partial"
  | "reward"
  | "continuation"
  | "continuation-ending"
  | "terminal";

interface SceneContract {
  readonly sceneId: SceneId;
  onEnter(ctx: SceneContext): void | Promise<void>;
  onExit(ctx: SceneContext): void | Promise<void>;
  canLeave(ctx: SceneContext): boolean;
  onComplete(ctx: SceneContext): void | Promise<void>;
}

type SceneTrigger =
  | "JOURNEY_START"
  | "GATE_COMPLETE"
  | "ENVELOPE_OPENED"
  | "ENVELOPE_BACK"
  | "ALL_ENVELOPES_OPENED"
  | "REWARD_REVEALED"
  | "CONTINUATION_COMPLETE"
  | "TERMINAL_REACHED";
```

---

## Appendix B — Founder Decision Compliance

| Decision              | Compliance                          |
| --------------------- | ----------------------------------- |
| CF-R1 / CF-R2         | ADR S11-007; unmount enables replay |
| CF-2 / FD-M3          | sessionStorage guards unchanged     |
| CF-3 / CF-4 / A-4     | No reward in gate scenes            |
| FD-T1 / FD-T3 / FD-T4 | Treasures graph + back edge         |
| FD-S11-01–06          | ADRs + §4 FR table                  |
| Engineering freeze    | Planning docs only                  |

---

## Status

| Item                              | State                                                                                       |
| --------------------------------- | ------------------------------------------------------------------------------------------- |
| Core architecture (FD-S11-01–06)  | **Founder approved**                                                                        |
| Moments mode doc (FD-S11-07)      | **Locked**                                                                                  |
| Connection mode doc (FD-S11-08)   | **Locked**                                                                                  |
| Memories mode doc (FD-S11-09–13)  | **Locked**                                                                                  |
| Treasures mode doc (FD-S11-14–17) | **Locked**                                                                                  |
| Cross-mode review (Step 5)        | **Complete** — [05_CROSS_MODE_REVIEW](./sprint-11/05_CROSS_MODE_REVIEW.md)                  |
| Final SSOT merge (Step 6)         | **Complete**                                                                                |
| Sprint 11 planning (architecture) | **Complete**                                                                                |
| Sprint 11 implementation          | **NOT authorized**                                                                          |
| Engineering freeze                | **Active**                                                                                  |
| Next step                         | **Sprint 12 — UI System** (founder implementation clearance required for Scene Engine code) |
