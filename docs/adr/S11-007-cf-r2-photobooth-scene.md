# ADR S11-007 — CF-R2 Protected Contract at Photobooth Scene

> **Status:** Accepted — Planning (protects CF-R2-A/B/C)  
> **Date:** 2026-07-15  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [14_REPLAYABLE_EXPERIENCE.md](../14_REPLAYABLE_EXPERIENCE.md) · [15_SPRINT_10_CF-R2_REPLAY_RESET.md](../15_SPRINT_10_CF-R2_REPLAY_RESET.md) · [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md)

---

## Context

CF-R2 replay reset is a locked Phase A contract. Treasures triggers silent `DELETE FROM experience_envelope_opens` on **first Photobooth reach** after journey completion. Scene Engine changes presentation but MUST NOT alter trigger semantics, rejected mechanisms (CF-R2-B), or reload behavior (CF-R2-C).

---

## Decision

Transition into the **Photobooth scene** (Treasures mode) MUST preserve the existing CF-R2 trigger contract:

1. **First `onEnter` of Photobooth scene** on this page load → invoke existing `completeTreasuresJourneyAction` (fire-and-forget).
2. Trigger MUST NOT depend on visit detection, timers, cookies, or analytics (CF-R2-B).
3. Backend service semantics unchanged — only alignment of **when** the existing client hook fires to scene entry.
4. Idempotent guard: remount within same load MUST NOT double-delete; preserve Phase A ref/once-per-load pattern.
5. After trigger, current page continues — no UX interruption (CF-R2 invisible reset).

### Sequence

```
Recipient enters Photobooth scene (first time this page load)
  → SceneContract.onEnter("treasures.photobooth")
  → completeTreasuresJourneyAction (existing action)
  → recipient continues in Photobooth

Page reload after trigger (CF-R2-C)
  → server: experience_envelope_opens empty
  → server resolves initialSceneId = treasures.gift-grid
  → full journey replays from pre-grid ceremony (Scene 0) or server-resolved resume point
```

---

## Consequences

### Positive

- CF-R1 lifetime replay preserved through scene remount model.
- Doc 15 deferred UI issue (post-reset envelope re-interaction on same page) addressed by FR-03 unmount + CF-R2 on photobooth enter.

### Negative

- Photobooth scene carries side-effect responsibility; must be documented in Scene Contract compliance matrix (ADR S11-006).

### Forbidden

- Moving DELETE logic into Scene Manager (must remain existing service/action).
- New persistence for replay state.
- Delaying CF-R2 trigger until page unload or photobooth exit.
