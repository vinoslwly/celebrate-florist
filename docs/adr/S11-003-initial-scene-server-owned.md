# ADR S11-003 — Initial Scene Determined by Server State

> **Status:** Accepted — Founder Approved (FD-S11-05)  
> **Date:** 2026-07-15  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#fd-s11-05--initial-scene-ownership-approved)

---

## Context

Scene Engine must resolve which scene to show on first paint. Client-side guessing (e.g., inferring progress from URL hash, local heuristics, or defaulting to first scene) risks hydration mismatch between RSC output and client state, especially for Treasures server progress and sessionStorage unlock gates.

---

## Decision

**The server determines the initial scene.**

Scene Engine MUST never guess initial scene placement.

Server state — via existing Phase A contracts — determines:

- Recipient progress (envelope opens, unlock eligibility)
- Unlock status (gate vs reward path for Connection/Memories)
- Reward availability
- **Initial scene id** passed into the client Scene Engine host

Scene Engine only renders the scene corresponding to that resolved state.

### Resolution flow

```
page.tsx (RSC)
  → fetch mode payloads + progress (existing services)
  → compute initialSceneId from business state
  → pass initialSceneId + context props to client SceneEngineHost
  → Scene Manager mounts initial scene (+ persistent shell)
```

Client-side Scene Manager MAY change scenes after user interaction, but MUST NOT recompute initial scene on hydration differently from server-provided value.

---

## Consequences

### Positive

- SSR/RSC deterministic; hydration-safe.
- Treasures reload after CF-R2-C correctly starts at envelope grid when server opens are empty.
- Connection/Memories respect sessionStorage only as **input to server/RSC resolution** or as guards re-read consistently — not as client-only guess on first paint.

### Negative

- RSC layer must expose a `resolveInitialScene(context)` function per mode (spec now; implementation Sprint 12+).
- Deep-linking to mid-journey scenes remains out of scope unless founder approves URL-based scene routing later.

### Forbidden

- Scene Engine defaulting to `graph.scenes[0]` without server validation.
- Client-only initial scene for Treasures based on stale local state.
