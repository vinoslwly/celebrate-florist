# ADR S11-001 — Scene Engine Wraps ExperienceFlow Architecture

> **Status:** Accepted — Founder Approved (FD-S11-01)  
> **Date:** 2026-07-15  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#fd-s11-01--wrap-architecture-approved)

---

## Context

Phase A (Sprint 00–10) established recipient journeys through `*ExperienceFlow` orchestrators, Gate/Reward payloads, repositories, services, and server actions. Phase B introduces a Scene Engine for presentation orchestration. Two architectural options existed:

- **Option A (Wrap):** Scene Engine wraps existing ExperienceFlow and child components.
- **Option B (Replace):** Scene Engine replaces orchestrators and absorbs business logic.

---

## Decision

**Use Option A — Wrap Architecture.**

Scene Engine is a **presentation orchestration layer only**. It MUST wrap the existing ExperienceFlow architecture.

Scene Engine MUST NOT replace:

- Repositories
- Services
- Server actions
- Gate/reward logic
- Business state
- Existing payload contracts (Gate Payload, Reward Payload, published experience payloads)

---

## Consequences

### Positive

- Phase A security boundaries (CF-3, CF-4, A-4) remain intact.
- CF-R2 replay semantics stay in existing services; only presentation timing may align to scene entry.
- Sprint 12–13 can migrate modes incrementally without rewriting business logic.
- Lower risk of accidental gate/reward leakage at the scene layer.

### Negative

- Some orchestration duplication may remain temporarily in `*ExperienceFlow` until migration completes.
- Scene Engine must integrate with existing component trees rather than owning a greenfield API.

### Rejected alternative

**Option B (Replace)** — rejected because it would require reimplementing gate grading, per-envelope fetch, sessionStorage unlock flows, and CF-R2 trigger logic inside the engine, violating Phase A contracts and increasing security regression risk.

---

## Compliance

| Phase A artifact           | Relationship to Scene Engine                     |
| -------------------------- | ------------------------------------------------ |
| `ConnectionExperienceFlow` | Wrapped; quiz submit actions unchanged           |
| `MemoriesExperienceFlow`   | Wrapped; match submit actions unchanged          |
| `TreasuresExperienceFlow`  | Wrapped; envelope open + CF-R2 actions unchanged |
| `MomentsExperience`        | Wrapped; full payload on load unchanged          |
| `mode-registry.tsx`        | Mode selection above Scene Engine host           |
