# 15 — Sprint 10: CF-R2 Replay Reset (Treasures)

> **Status:** **✅ COMPLETE** — CF-R2 implemented (Phases 10A–10C) · **2026-07-14**  
> **Depends on:** [CF-R1](./14_REPLAYABLE_EXPERIENCE.md) ✅ locked · [CF-R2](./14_REPLAYABLE_EXPERIENCE.md#cf-r2--replay-reset) ✅ locked  
> **Scope:** Treasures only — Connection, Memories, Moments unchanged

---

## Founder Decision — CF-R2 Final Revision (2026-07-14)

Celebrate Florist is a **Replayable Digital Experience Gift**. Replay begins whenever the recipient starts the experience again.

The product does **not** detect "same visit" or "new visit". There is no visit concept — only **Current Experience** or **New Experience**.

**Engineering principle:** Favor product simplicity over technical sophistication. If two implementations produce the same emotional experience, always choose the simpler architecture.

### CF-R2-A — Replay Trigger ✅ LOCKED

The replay trigger is:

> **The first time the recipient reaches the Photobooth after completing the journey.**

At that moment the server silently clears:

```sql
DELETE FROM experience_envelope_opens
```

Journey endpoint — no additional UX:

```
Envelope(s) → Reward → Letter → Gallery → Photobooth  ← completion trigger
       → silent DELETE opens
       → current page continues normally
```

### CF-R2-B — Permanently Rejected Mechanisms ✅ LOCKED

There is **NO**:

- inactivity timer
- `last_accessed_at` logic
- visit detection
- session cookie for replay
- replay session
- browser close detection
- analytics-based visit tracking
- completion signal for same-visit continuity

Celebrate Florist must not attempt to infer recipient intent.

### CF-R2-C — Refresh After Replay Trigger ✅ LOCKED

Refreshing the page **after** the replay trigger intentionally starts the experience from the beginning:

```
✉️ ✉️ ✉️
```

Refresh is treated exactly the same as opening the experience again. This is a **deliberate product decision** — not an engineering limitation, not a bug.

**Explicitly rejected UX:** Finish Experience button, Replay button, confirmation dialog, completion popup, "Your experience has ended" screen.

---

## Implementation Summary (Shipped)

| Phase   | Status      | Deliverable                                                                      |
| ------- | ----------- | -------------------------------------------------------------------------------- |
| **10A** | ✅ Complete | `complete-treasures-journey.service.ts` + `complete-treasures-journey.ts` action |
| **10B** | ✅ Complete | `TreasuresPhotoboothWithReplayReset` in `treasures-experience-flow.tsx`          |
| **10C** | ✅ Complete | QA report + documentation sync                                                   |

### Files Implemented

| File                                                                | Role                                       |
| ------------------------------------------------------------------- | ------------------------------------------ |
| `features/treasures/services/complete-treasures-journey.service.ts` | Access gate → eligibility → silent DELETE  |
| `features/treasures/actions/complete-treasures-journey.ts`          | Server action wrapper                      |
| `features/treasures/components/treasures-experience-flow.tsx`       | Photobooth mount trigger (fire-and-forget) |
| `schemas/envelope-recipient.ts`                                     | `completeTreasuresJourneySchema`           |
| `features/treasures/types/index.ts`                                 | `CompleteTreasuresJourneyResult`           |

**Unchanged:** Repositories, migrations, Studio, publish, buyer preview, Connection, Memories, Moments.

---

## Invisible Reset UX Requirement

| Requirement                 | Rule                                                                   |
| --------------------------- | ---------------------------------------------------------------------- |
| Reset visibility            | **Completely invisible** — recipient never notices                     |
| Current page                | Letter, gallery, and photobooth continue without interruption          |
| No new UI                   | No Finish button, Replay button, confirmation dialog, completion popup |
| No post-trigger UI mutation | No redirect, reload, `router.refresh()`, or React state reset          |
| After trigger + reload      | Fresh ✉️ gate — **intentional** (CF-R2-C)                              |

Celebrate Florist flows naturally to its conclusion. The photobooth **is** the ending.

---

## Architecture (As Built)

```
TreasuresExperienceFlow
  → showReward (rewardEligible + reward loaded)
  → LetterView → PhotoGallery → TreasuresPhotoboothWithReplayReset
       → useEffect (once via ref)
            → void completeTreasuresJourneyAction({ experienceToken })
            → ignore response; dev-only log on failure
       → <Photobooth /> renders immediately
            → completeTreasuresJourney()
                 → evaluateAccessGate()
                 → isRewardEligible(envelopeSortOrders, openedSortOrders)
                 → EnvelopeOpensRepository.deleteByExperienceId()
                 → { reset: true } | idempotent { reset: false }
```

**Layering:** Components → Actions → Services → Repositories → Supabase. No business logic in React components.

---

## Request Lifecycle (Verified)

### Journey in progress (before Photobooth)

```
Load page → ✉️ envelopes
Open envelopes → server records opens
Refresh / return later → progress preserved (opens in DB)
```

### Reward reached, before Photobooth

```
All envelopes opened → reward visible
Opens remain in DB
Refresh → 📬 + initialReward (unchanged)
```

### Photobooth reached — CF-R2 trigger (CF-R2-A)

```
Photobooth mounts (reward visible)
  → completeTreasuresJourneyAction (fire-and-forget)
  → DELETE experience_envelope_opens (invisible)
  → recipient continues letter / gallery / photobooth normally
  → NO refetch, NO dialog, NO interruption
```

### Reload after Photobooth — CF-R2-C (intentional)

```
Page reload (refresh, reopen, return later)
  → no opens in DB (cleared at Photobooth)
  → fresh gate → ✉️ ✉️ ✉️
  → full emotional journey replays
```

### Mid-progress reload (Photobooth never reached)

```
Opens: partial
  → NO reset ever occurred
  → Gate: mixed 📬/✉️ — continues where they left off
```

---

## Security Review (Verified)

| Risk                              | Mitigation                                          |
| --------------------------------- | --------------------------------------------------- |
| Reset before all envelopes opened | `isRewardEligible === true` required                |
| Reset before access granted       | `evaluateAccessGate()` must return `granted`        |
| Cross-experience reset            | Scoped to `experienceId` from token                 |
| Replay bypass without journey     | Service re-verifies full opens before DELETE        |
| Duplicate completion calls        | Idempotent DELETE; empty opens → `{ reset: false }` |
| Buyer preview / Studio            | No Photobooth completion path in preview            |

---

## Temporary UI Notes (Not Product Defects)

Founder clarification (post–Phase 10C review): the following are **deferred by design**, not backend bugs, replay defects, or security issues. They are expected to disappear when future **Experience UI / Animation** sprints ship dedicated scenes with transitions (QR → Envelope → Letter → Gallery → Photobooth → Ending), where earlier scenes unmount and envelope interaction is no longer available after progression.

| Item                                         | Assessment                                                                                                                                                                         |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Post-reset same-page envelope re-interaction | **Deferred by design** — consequence of temporary single-page recipient UI (Sprint 09B). Future scene-based UI will unmount the envelope stage; no Sprint 10 code change required. |
| Photobooth trigger on component mount        | **By design (10B)** — reset fires when Photobooth mounts (reward visible). Future scene transitions may refine timing; CF-R2 backend unchanged.                                    |

### QA / Testing Gap

| Item                   | Notes                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| No automated E2E tests | Lifecycle verified via code review + production build. Manual browser QA recommended before production promotion. |

---

## Sprint 10 Status

**✅ Officially approved and complete** (Founder — 2026-07-14).

**Engineering freeze in effect.** Repository closure review and documentation verification complete (2026-07-14). Next planned work: **Sprint 11 — Experience Architecture** per [Roadmap V1](../11_IMPLEMENTATION_ROADMAP_V2.md#roadmap-v1--post-sprint-10-founder-approved). **Not started.**

| Approach                                       | Status                |
| ---------------------------------------------- | --------------------- |
| 30 min / 4 hour / 24 hour inactivity threshold | ❌ Rejected           |
| `last_accessed_at` gap detection               | ❌ Rejected           |
| Visit detection / same visit vs new visit      | ❌ Rejected           |
| Session cookie for replay continuity           | ❌ Rejected           |
| Same-visit refresh preservation after trigger  | ❌ Rejected — CF-R2-C |
| Completion signal / analytics visit tracking   | ❌ Rejected           |
| Finish / Replay buttons or completion dialogs  | ❌ Rejected           |

---

## Founder Approval Record

| Phase                           | Status                                            |
| ------------------------------- | ------------------------------------------------- |
| CF-R2 product principle (A/B/C) | ✅ Locked                                         |
| Phase 10A — backend             | ✅ Approved                                       |
| Phase 10B — Photobooth wiring   | ✅ Approved                                       |
| Phase 10C — QA + documentation  | ✅ Approved                                       |
| Sprint 10 — overall             | ✅ **Officially complete** (Founder — 2026-07-14) |

**Engineering freeze in effect.** Repository closure review complete (2026-07-14). Roadmap V1 (Sprint 11–19) synchronized. **Sprint 11 not started.**
