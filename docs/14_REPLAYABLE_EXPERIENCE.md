# 14 — Replayable Experience (Product Vision Correction)

> **Status:** **CF-R1 ✅ LOCKED** · **CF-R2 ✅ LOCKED & SHIPPED** (Sprint 10)  
> **Related:** [05 Founder Decisions](./05_FOUNDER_DECISIONS.md) · [15 Sprint 10 Proposal](./15_SPRINT_10_CF-R2_REPLAY_RESET.md) · [13 Experience Journey](./13_EXPERIENCE_JOURNEY.md) · [07 Product Revision V2](./07_PRODUCT_REVISION_V2.md) · [02 Architecture](./02_ARCHITECTURE.md)

---

## Purpose

This document records a **Product Vision Correction** discovered during Sprint 09B founder review.

Celebrate Florist is a **Digital Experience Gift**. Recipients must be able to reopen the gift weeks, months, or years later and experience the **same emotional journey from the beginning** — like reopening a physical gift box, not loading a completed game save.

**Replayability is now a first-class product requirement** and overrides any prior assumption that recipient progress should persist permanently after the journey completes.

---

## Canonical Design Principle — CF-R1

### CF-R1 — Replayable Experience ✅ LOCKED

|                         |                                                                                                                                                                                                                                                                      |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**            | Celebrate Florist is a **Digital Experience Gift**. Recipients must be able to revisit an experience weeks, months, or years later and experience the **same emotional journey from the beginning** — like reopening a physical gift box, not a completed game save. |
| **Active visit**        | Progress during the journey (before Photobooth trigger) **must be preserved** via server state.                                                                                                                                                                      |
| **Lifetime**            | Progress **must not** permanently lock the experience as completed. After Photobooth trigger, reload intentionally replays from ✉️ (CF-R2-C).                                                                                                                        |
| **Evaluation question** | _"If the recipient comes back one year later, what experience should they feel?"_ — If the answer is replay from the beginning, the implementation must respect CF-R1.                                                                                               |
| **Overrides**           | Any prior assumption that recipient progression should be permanently preserved forever.                                                                                                                                                                             |
| **Approved**            | Founder — 2026-07-14                                                                                                                                                                                                                                                 |
| **Sprint 10 scope**     | Treasures only (sole mode with lifetime DB progress violation)                                                                                                                                                                                                       |

### CF-R2 — Replay Reset ✅ LOCKED (Final Revision)

|                      |                                                                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Decision**         | Completed recipient progress is reset at the **Photobooth journey endpoint** so the experience can replay. Reset is **behavior-based**, **server-driven**, and **invisible** during the current page. |
| **CF-R2-A**          | Replay trigger: **first Photobooth reach** after all envelopes complete → silent `DELETE FROM experience_envelope_opens`.                                                                             |
| **CF-R2-B**          | Permanently rejected: inactivity timers, `last_accessed_at` logic, visit detection, session cookies, replay sessions, browser lifecycle hooks, analytics visit tracking.                              |
| **CF-R2-C**          | Reload after replay trigger (refresh, reopen, return later) **intentionally** starts ✉️ fresh. Not a bug. No post-trigger state preservation.                                                         |
| **No visit concept** | Product does not distinguish same visit vs new visit. Only **Current Experience** (in-browser, before reload) or **New Experience** (page load).                                                      |
| **No additional UX** | No Finish button, Replay button, confirmation dialog, or completion popup.                                                                                                                            |
| **No new tables**    | No `experience_visit`, `replay_session`, `visit_id`, or additional schema.                                                                                                                            |
| **Approved**         | Founder — 2026-07-14 (CF-R2 final revision)                                                                                                                                                           |
| **Implementation**   | ✅ Shipped Sprint 10 — [15_SPRINT_10_CF-R2_REPLAY_RESET.md](./15_SPRINT_10_CF-R2_REPLAY_RESET.md)                                                                                                     |

#### CF-R2 Replay Lifecycle (Treasures — Final)

```
Current Experience
  → Open envelopes → progress stored on server
  → Reward unlocked → letter + gallery
  → Photobooth reached (first time) → invisible DELETE opens
  → recipient continues naturally — no interruption

New Experience (any page load after trigger)
  → no opens in DB → fresh gate → ✉️ ✉️ ✉️
  → full emotional journey replays
  → applies to refresh, reopen, return tomorrow, return next year — no distinction
```

#### Engineering Guidelines (Permanent)

| Rule                | Requirement                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Journey progress    | Preserved in DB until Photobooth completion trigger                                      |
| Replay trigger      | **Behavior-based** — Photobooth endpoint, not time                                       |
| Reset visibility    | **Invisible** — no UX interruption on current page                                       |
| Reset execution     | Server action at Photobooth first mount                                                  |
| Post-trigger reload | Fresh ✉️ gate — **intentional** (CF-R2-C)                                                |
| No intent inference | Never use visit detection, inactivity, `last_accessed_at`, or session cookies for replay |
| Simplicity          | Favor simpler architecture over preserving lightweight progress after trigger            |
| Future modes        | Evaluate against CF-R1 + CF-R2 before shipping                                           |

### Journey Progress vs Replay (Treasures)

| Concept                       | Definition                                   | Requirement                                        |
| ----------------------------- | -------------------------------------------- | -------------------------------------------------- |
| **Before Photobooth trigger** | Recipient is opening envelopes toward reward | Opens in DB — refresh and return preserve progress |
| **At Photobooth trigger**     | Journey endpoint reached                     | Silent DELETE — current page continues             |
| **After trigger + reload**    | Any new page load                            | Fresh ✉️ gate — **intentional replay** (CF-R2-C)   |

Celebrate Florist is not a competitive game or long-progress application. Opening envelopes again is part of the emotional experience.

---

## Product Audit — Current Behavior (As Implemented)

Audit date: Sprint 09B Phase 8 follow-up. Source: codebase review (`features/`, `supabase/migrations/`), not live E2E.

### Summary Matrix

| Mode           | Progress storage                 | Active visit (refresh)      | Future visit (new session)                  | Replayable today? | Aligns with CF-R1? |
| -------------- | -------------------------------- | --------------------------- | ------------------------------------------- | ----------------- | ------------------ |
| **Moments**    | None                             | Full content always visible | Same as first visit                         | ✅ Yes            | ✅ Yes             |
| **Connection** | `sessionStorage` unlock blob     | Preserved (same tab)        | Quiz restarts (storage absent)              | ✅ Mostly         | ✅ Mostly          |
| **Memories**   | `sessionStorage` unlock blob     | Preserved (same tab)        | Match restarts (storage absent)             | ✅ Mostly         | ✅ Mostly          |
| **Treasures**  | `experience_envelope_opens` (DB) | Preserved (server SSOT)     | All envelopes stay opened; reward immediate | ❌ No             | ❌ No              |

---

## Mode 1 — Connection

### Current behavior

1. Initial load: **Gate payload** — quiz only; no letter, no signed gallery URLs.
2. Recipient submits quiz → server grades statelessly (**answers not persisted**).
3. Unlock blob (score + reward payload) written to **`sessionStorage`** — key `cf_connection_unlock_${experienceId}`.
4. Same tab refresh: unlock restored from `sessionStorage` → letter, gallery, photobooth visible.
5. New tab / cleared storage / new browser session: no unlock blob → **quiz must be replayed**.

**Founder decision CF-2** explicitly chose `sessionStorage` only — no database unlock state — citing "emotional replay-friendly UX."

### Replayability assessment

| Dimension                        | Assessment                                                                       |
| -------------------------------- | -------------------------------------------------------------------------------- |
| Permanent server completion      | ❌ Not stored — no DB progress                                                   |
| Lifetime replay on return        | ✅ New session generally starts fresh                                            |
| Active visit safety              | ✅ Refresh-safe within same tab                                                  |
| Cross-device during active visit | ⚠️ New tab/device does not share unlock — quiz replays (accepted CF-2 trade-off) |

### Alignment with Celebrate Florist vision

**Mostly aligned.** Connection does not permanently "complete" the experience in the database. A recipient returning months later (new browser session) replays the quiz.

**Gap:** If the same browser tab stays open indefinitely, unlock persists in `sessionStorage` until the tab is closed. This is session-scoped, not lifetime DB persistence, but is not identical to Treasures' year-later opened-envelope problem.

### Recommended behavior

| Item                     | Recommendation                                                                                                    |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Lifetime replay          | ✅ Keep — new session = quiz from beginning                                                                       |
| Active visit persistence | ✅ Keep — `sessionStorage` during visit                                                                           |
| Post-completion clear    | **Optional alignment:** explicitly clear unlock blob at journey endpoint — prevents stale unlock if tab left open |
| DB progress table        | ❌ Not needed for Connection                                                                                      |

---

## Mode 2 — Memories

### Current behavior

Mirrors Connection pattern:

1. Gate payload — match game structure; no reward content.
2. Batch submit → stateless server grade (**answers not persisted**).
3. Unlock blob in **`sessionStorage`** — key `cf_memories_unlock_${experienceId}`.
4. Same tab refresh: unlock preserved.
5. New session: match replays from beginning.

**FD-M3** locks single submission per session; unlock persistence mirrors CF-2.

### Replayability assessment

Same profile as Connection — session-scoped, not lifetime DB completion.

### Alignment with Celebrate Florist vision

**Mostly aligned** for the same reasons as Connection.

### Recommended behavior

Same as Connection — no DB changes. Optional post-completion `sessionStorage` clear for consistency with Treasures lifecycle (deferred).

---

## Mode 3 — Moments

### Current behavior

1. Single **published payload** on load — greeting, letter, signed gallery, photobooth.
2. **No game, no unlock gate, no progress table, no sessionStorage.**
3. Every visit renders identical content immediately.

### Replayability assessment

| Dimension                  | Assessment                                            |
| -------------------------- | ----------------------------------------------------- |
| Permanent completion state | None                                                  |
| Lifetime replay            | ✅ Every visit is the full experience from the letter |
| Active visit persistence   | N/A — nothing to lose on refresh                      |

### Alignment with Celebrate Florist vision

**Fully aligned.** Moments is the baseline replay model.

### Recommended behavior

**No change.** Moments already embodies "reopen the gift box" — recipient always reads the letter and views gallery again.

---

## Mode 4 — Treasures

### Current behavior

1. Gate payload — envelope shells + opened flags from **`experience_envelope_opens`** (server DB).
2. Each open → idempotent row insert; content fetched per envelope (A-4).
3. Reward when `openedCount == envelopeCount` (FD-T4).
4. Refresh / new tab / new device / return one year later: **opened state persists in DB** → all envelopes show opened, reward immediate.

### Replayability assessment

| Dimension                   | Assessment                                                         |
| --------------------------- | ------------------------------------------------------------------ |
| Permanent server completion | ✅ **Yes** — `experience_envelope_opens` rows persist indefinitely |
| Lifetime replay on return   | ❌ Experience appears permanently completed                        |
| Active visit safety         | ✅ Refresh-safe; cross-tab/device consistent (FD-T2 intent)        |

### Alignment with Celebrate Florist vision

**Not aligned.** This is the primary product inconsistency discovered in Sprint 09B review.

```
Visit #1:  ✉️ ✉️ ✉️  →  📬 📬 📬  →  Reward
Visit #2 (later):  📬 📬 📬  →  Reward (no rediscovery)
```

### Recommended behavior

Adopt **CF-R2** (Photobooth trigger):

```
Before Photobooth trigger:
  experience_envelope_opens rows accumulate
  refresh / return → progress preserved (server SSOT)

Photobooth first reach (CF-R2-A):
  DELETE FROM experience_envelope_opens WHERE experience_id = ?
  current page continues — invisible

After trigger + reload (CF-R2-C):
  all envelopes closed (✉️) — full journey replays
  refresh = reopen = return later — no distinction
```

**Do not** remove `experience_envelope_opens` during active journey. **Do** clear rows only at Photobooth trigger. **Do not** preserve completed state after trigger.

---

## Cross-Mode Analysis

### Is Treasures the only mode with this issue?

**Yes — Treasures is the only mode with lifetime DB-persisted recipient progress.**

| Mode       | Lifetime DB progress?                 |
| ---------- | ------------------------------------- |
| Moments    | No                                    |
| Connection | No (sessionStorage only)              |
| Memories   | No (sessionStorage only)              |
| Treasures  | **Yes** (`experience_envelope_opens`) |

Connection and Memories have a **related but different** trade-off: cross-tab unlock during an active visit (CF-2). That is session persistence, not permanent completion.

### Can "clear progress after completed experience" apply consistently?

| Mode           | Mechanism                                               | Applicable?                                           |
| -------------- | ------------------------------------------------------- | ----------------------------------------------------- |
| **Treasures**  | `DELETE FROM experience_envelope_opens`                 | ✅ **Primary target** — preferred direction           |
| **Connection** | `sessionStorage.removeItem(cf_connection_unlock_${id})` | ✅ Equivalent — clear unlock blob on visit completion |
| **Memories**   | `sessionStorage.removeItem(cf_memories_unlock_${id})`   | ✅ Equivalent                                         |
| **Moments**    | N/A                                                     | ✅ Already stateless                                  |

**Unified product rule:** Interactive progress resets at journey completion. Storage layer differs; philosophy is consistent. Treasures: Photobooth trigger (CF-R2-A). Connection/Memories: deferred optional alignment.

---

## Completion Strategy — CF-R2 (LOCKED — Final)

Founder approved **CF-R2-A/B/C** — behavior-based replay trigger at Photobooth, no visit inference, intentional reload replay.

| Rejected (permanently closed)                       | Reason                                         |
| --------------------------------------------------- | ---------------------------------------------- |
| Time-based visit detection (30 min / 4 h / 24 h)    | Not product behavior                           |
| `last_accessed_at` gap                              | Implementation heuristic                       |
| Visit detection / same visit vs new visit           | Product does not infer intent                  |
| Session cookies / completion signals for continuity | Engineering complexity without emotional value |
| Same-visit refresh preservation after trigger       | CF-R2-C — reload intentionally replays         |
| Browser lifecycle hooks                             | Unreliable                                     |
| Finish / Replay buttons                             | Unnecessary UX                                 |

**Locked approach (CF-R2-A):** Photobooth first reach after all envelopes complete → silent DELETE → current page continues.

**Locked behavior (CF-R2-C):** Any reload after trigger → ✉️ fresh start. Intentional. Not a bug.

Full implementation plan: [15_SPRINT_10_CF-R2_REPLAY_RESET.md](./15_SPRINT_10_CF-R2_REPLAY_RESET.md)

---

## Documentation Drift Resolved by CF-R1

The following prior docs implied permanent or sequential completion. CF-R1 supersedes lifetime persistence assumptions:

| Location                                      | Drift                                               | Correction                                                                                  |
| --------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `13_EXPERIENCE_JOURNEY.md` Treasures section  | "Skip ahead blocked"; sequential envelopes          | Sprint 09B FD-T1: any order opening — doc sync required                                     |
| `13_EXPERIENCE_JOURNEY.md`                    | "Revisit unlocked envelopes" without lifetime reset | CF-R2-C: reload after Photobooth trigger restarts; same-page revisit unchanged until reload |
| `05_FOUNDER_DECISIONS.md` Treasure Navigation | Sequential unlock language                          | Superseded by FD-T1 (any order) + CF-R1 (lifetime replay)                                   |
| Treasures implementation                      | Permanent `experience_envelope_opens`               | ✅ CF-R2 shipped Sprint 10                                                                  |

---

## Implementation Status

| Item                          | Status                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| Product audit                 | ✅ Complete                                                                              |
| CF-R1 founder approval        | ✅ Locked                                                                                |
| CF-R2 founder approval        | ✅ Locked (final — CF-R2-A/B/C)                                                          |
| SSOT documentation            | ✅ Complete                                                                              |
| Sprint 10 implementation plan | ✅ Complete — [15_SPRINT_10_CF-R2_REPLAY_RESET.md](./15_SPRINT_10_CF-R2_REPLAY_RESET.md) |
| Application code              | ✅ Shipped (10A backend + 10B Photobooth wiring)                                         |
| Database migration            | ❌ Not required                                                                          |

---

## Founder Review Checklist

- [x] Confirm CF-R1 as locked product principle
- [x] Confirm Treasures replay direction (CF-R2-A — Photobooth trigger)
- [x] Confirm CF-R2-B — no visit detection, timers, or session continuity
- [x] Confirm CF-R2-C — reload after trigger intentionally replays
- [x] Confirm Connection/Memories unchanged in Sprint 10
- [x] Approve Sprint 10 implementation (10A–10C complete)

---

## Related Decisions (Updated References)

| ID           | Relationship                                                                       |
| ------------ | ---------------------------------------------------------------------------------- |
| **CF-R1**    | ✅ Locked — replayable digital experience gift                                     |
| **CF-R2**    | ✅ Locked — CF-R2-A/B/C; Treasures Sprint 10                                       |
| **CF-2**     | Valid for Connection session-scoped persistence; lifetime replay via session scope |
| **FD-M3**    | Valid for Memories session-scoped persistence; lifetime replay via session scope   |
| **FD-T2**    | Server-side opens until Photobooth trigger; CF-R2 clears for replay                |
| **FD-T1–T5** | Unchanged gameplay rules; CF-R1/CF-R2 affect progress **lifecycle** only           |
