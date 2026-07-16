# ADR S11-004 — Parameterized Scene Graphs

> **Status:** Accepted — Founder Approved (FD-S11-04)  
> **Date:** 2026-07-15  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#fd-s11-04--parameterized-scene-graph-approved)

---

## Context

Treasures experiences may contain 2–6 envelopes (founder cap). Hard-coding separate scene graphs per envelope count would require Scene Engine changes for each configuration and block future modes with variable gate counts.

---

## Decision

Scene graphs MUST support **parameterized structures**.

Example — Treasures:

- 2 envelopes, 3 envelopes, … 6 envelopes
- Same graph **template**; envelope count injected at runtime from published experience config
- Dynamic scenes use type `gate-dynamic` with index parameter (e.g., `treasures.envelope-content.{i}`)

Adding a future experience mode MUST require only:

1. A new scene graph definition (static or parameterized)
2. A registry entry in `mode-registry.tsx` patterns

The Scene Engine core MUST remain unchanged when introducing new modes or parameter values.

---

## Consequences

### Positive

- Treasures scales 2–6 without engine forks.
- Fifth mode can declare parameterized or fixed graphs using the same `ExperienceSceneGraph` schema.
- Guards and edges reference parameters (`envelopeCount`, `openedIds`) not hard-coded scene lists.

### Negative

- Graph builder function required per mode (`buildTreasuresSceneGraph(envelopeCount)`).
- Testing must cover parameter boundaries (min/max envelopes).

### Schema sketch (spec-level)

```typescript
type ExperienceSceneGraph = {
  mode: ExperienceMode;
  buildScenes: (params: SceneGraphParams) => SceneNode[];
  edges: SceneEdge[] | ((params: SceneGraphParams) => SceneEdge[]);
  resolveInitialScene: (ctx: SceneContext) => SceneId;
};
```

Engine iterates graphs; it does not embed Treasures-specific envelope logic.
