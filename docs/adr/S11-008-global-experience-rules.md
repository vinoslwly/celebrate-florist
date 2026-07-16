# ADR S11-008 — Global Experience Rules (GER)

> **Status:** Accepted — Founder Approved (revised 2026-07-16)  
> **Date:** 2026-07-16  
> **Revision:** 2026-07-16 — GER-02/03/05 scoped to **Memories only**; Connection Quiz has **no** gameplay timer  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#global-experience-rules-ger)

---

## Context

Sprint 11 locked mode-specific scene architecture for **all four modes** (Moments, Connection, Memories, Treasures). Cross-mode patterns emerged (transition durations, timer expiry behavior) that should be standardized where they truly apply across modes.

These rules are **presentation-layer standards**. They must not alter Phase A business logic, Gate/Reward contracts, or CF-R2 replay semantics.

**Revision rationale (2026-07-16):** Connection is a reflective experience — recipients read longer questions without time pressure. Memories is intentionally a lightweight mini-game where countdown enhances pacing. Gameplay timers are therefore **mode-specific**, not global.

---

## Decision

Adopt **Global Experience Rules (GER-01 through GER-06)** as official Sprint 11 cross-mode architecture.

| ID         | Rule                 | Summary                                                                                                                          |
| ---------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **GER-01** | Transition duration  | Standard logical duration ~**1.0–1.5 seconds** for `transition` scenes (all modes)                                               |
| **GER-02** | Gameplay countdown   | **Not global.** Only modes designed as time-based challenges. **V1: Memories Match only** (20 s). Connection Quiz: **no timer**. |
| **GER-03** | Timer expiration UX  | **Memories only.** Short **"Time's up"** beat (~0.8–1 s) then auto-continue — no dialog, no reset                                |
| **GER-04** | Backend preservation | No schema, payload, submit, scoring, unlock, or sessionStorage changes                                                           |
| **GER-05** | Auto-selection       | **Memories only.** Timer expiry without answer → first story by `sortOrder` (invisible to backend)                               |
| **GER-06** | UX philosophy        | Where timers exist: pacing, not punishment — no fail screen, restart, or lost progress                                           |

**Scope:** GER-01 and GER-06 apply cross-mode. GER-02, GER-03, GER-05 apply per founder mode decision — **not** inherited automatically by future modes.

**Override examples (locked mode docs take precedence for duration):**

- Memories binder transition: 2–3 seconds (cinematic bridge)
- Treasures binder transition: 2–3 seconds (cinematic bridge)
- Treasures gift explosion: max 3 seconds (FD-S11-16)
- Memories memory transition: ~1–2 seconds
- Moments Celebrate Loading (`intro`): 0.5–1 second (not a `transition` scene)

---

## CF-R2-B Clarification

CF-R2-B rejects **visit/replay timers** (inactivity logout, visit detection, replay sessions). **Memories gameplay countdown** is active-session pacing during match — a different category. It does **not** infer visit intent or trigger replay reset.

---

## Consequences

### Positive

- Connection quiz remains pressure-free — aligns with reflective UX and Phase A (no quiz timer in shipped code)
- Memories retains intentional mini-game pacing (FD-S11-11)
- Future modes must explicitly opt in to gameplay timers via Founder Decision — no silent inheritance
- Zero backend impact — removing Connection timer from planning docs only

### Negative

- Future time-based modes need explicit GER-02 opt-in rather than default inheritance

### Rejected alternatives

**Global 20-second gameplay default (prior GER-02)** — rejected on founder review 2026-07-16. Connection longer question text and reflective tone conflict with countdown anxiety.

---

## Compliance by mode (planning)

| Mode       | GER-01                                                                | GER-02                                     | GER-03        | GER-05                        |
| ---------- | --------------------------------------------------------------------- | ------------------------------------------ | ------------- | ----------------------------- |
| Moments    | Transitions 5, 7                                                      | ❌ No gameplay timer                       | N/A           | N/A                           |
| Connection | Transitions 4, 7, 9                                                   | ❌ **No gameplay timer** (reflective quiz) | N/A           | N/A                           |
| Memories   | Transitions 4, 7, 9, 11*                                              | ✅ 20 s per memory (FD-S11-11)             | ✅ Per memory | ✅ First story by `sortOrder` |
| Treasures  | Transitions 4, 10 — ~1.0–1.5 s; S5 max 3 s (FD-S11-16); binder 2–3 s* | ❌ No gameplay timer                       | N/A           | N/A                           |

\*Binder transition 2–3 s overrides GER-01 default.

---

## Related mode docs

- [01_MOMENTS](../sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md)
- [02_CONNECTION](../sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md)
- [03_MEMORIES](../sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)
- [04_TREASURES](../sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)
- [05_CROSS_MODE_REVIEW](../sprint-11/05_CROSS_MODE_REVIEW.md)
