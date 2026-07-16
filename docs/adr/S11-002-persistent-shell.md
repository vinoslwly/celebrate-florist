# ADR S11-002 — Persistent Shell Architecture

> **Status:** Accepted — Founder Approved (FD-S11-03)  
> **Date:** 2026-07-15  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#fd-s11-03--persistent-shell-approved)

---

## Context

Recipient experiences include persistent chrome: theme, layout frame, header (emoji, greeting name), and global UI affordances. When scenes transition, remounting the entire experience frame causes unnecessary rerenders, layout flicker, and complicates Sprint 13 motion choreography.

---

## Decision

Sprint 11 SHALL use a **Persistent Shell** architecture:

- The **shell** (theme, layout frame, global UI) remains **mounted** for the duration of the recipient session on the experience page.
- **Individual scenes** are mounted and unmounted inside the shell as the recipient progresses.
- Shell is classified as scene type `shell` in the scene graph but is **not** torn down on forward transitions.

---

## Consequences

### Positive

- Stable DOM anchor for Sprint 13 enter/exit animations on scene content only.
- Reduced rerender cost on theme/header during transitions.
- Clear separation: shell = chrome, scenes = journey content.

### Negative

- Shell must not hold scene-specific interaction state that should unmount with completed scenes.
- Shell styling must remain mode-agnostic or mode-themed via props, not per-scene remount.

### Implementation note (Sprint 12+)

`SceneEngineHost` renders:

```
PersistentShell (always mounted)
  └── SceneSlot (active scene only, mount/unmount)
```

Shell MUST NOT prefetch or display reward content before gate completion.
