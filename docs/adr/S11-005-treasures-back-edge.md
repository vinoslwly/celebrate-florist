# ADR S11-005 — Treasures Back Edge Navigation

> **Status:** Accepted — Founder Approved (FD-S11-02)  
> **Date:** 2026-07-15  
> **Sprint:** 11 — Experience Architecture (planning only)  
> **Related:** [16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md](../16_SPRINT_11_EXPERIENCE_ARCHITECTURE.md) · [13_EXPERIENCE_JOURNEY.md](../13_EXPERIENCE_JOURNEY.md) · [05_FOUNDER_DECISIONS.md](../05_FOUNDER_DECISIONS.md#fd-s11-02--treasures-navigation-approved)

---

## Context

Sprint 11 default navigation is **forward-only** after reward phases. Treasures has a product requirement (FD-T3): recipients may revisit opened envelopes during the same visit. This requires a controlled backward edge within the gate phase only.

---

## Decision

**Use Back Edge — Treasures only.**

Treasures is the **only** mode allowed to navigate:

```
Gift Content → Gift Grid
```

_(Business layer: Envelope Content → Envelope Grid — unchanged.)_

Presentation uses **Gift** icon per FD-S11-15; back trigger alias: `GIFT_BACK` / `ENVELOPE_BACK`.

This preserves FD-T3 (revisit opened envelopes) while keeping the overall journey forward-only.

**No other mode** gains backward navigation after reward:

| Mode       | Back navigation after reward                                                        |
| ---------- | ----------------------------------------------------------------------------------- |
| Moments    | No                                                                                  |
| Connection | No (CF-2 sessionStorage lock)                                                       |
| Memories   | No (FD-M3)                                                                          |
| Treasures  | No — back edge exists **only** within gate phase (content → grid), not after letter |

The back edge is **presentation navigation within the gate phase**, not a journey reset. Envelope grid remains until all envelopes are opened (FD-T4). Letter scene guard: all opened.

---

## Consequences

### Positive

- Aligns with doc 13 Treasures navigation semantics.
- Transition Manager can validate a single explicit back trigger (`GIFT_BACK` / `ENVELOPE_BACK`) for Treasures only.
- Connection/Memories quiz/match cannot be replayed after submit — unchanged.

### Negative

- Scene Manager MAY maintain a lightweight within-gate stack for Treasures envelope content only.
- Must NOT persist visit history or enable back to letter after photobooth.

### Forbidden

- Back navigation from letter → gift grid after reward revealed.
- Back navigation from photobooth to any prior scene.
- Extending back edge to Connection or Memories without new founder decision.
