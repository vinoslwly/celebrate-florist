# 08 — Experience Modes

> **Sprint:** 05.5 — Product Revision V2 (documentation only)  
> **Journey SSOT:** [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) — **authoritative for recipient and buyer-preview ordering**  
> **Related:** [Product Revision V2](./07_PRODUCT_REVISION_V2.md) · [Architecture Impact](./09_ARCHITECTURE_IMPACT.md) · [Database Revision Plan](./10_DATABASE_REVISION_PLAN.md) · [Founder Decisions](./05_FOUNDER_DECISIONS.md)

---

## Document Legend

| Label                   | Meaning                                        |
| ----------------------- | ---------------------------------------------- |
| **Already Implemented** | Exists in codebase or database today           |
| **Planned**             | Approved in Product Revision V2; not yet built |
| **Future Idea**         | Optional enhancement; not scheduled            |

---

## Overview

Celebrate offers **four experience products**. Every mode shares a **core layer** (**Already Implemented** — Sprint 07):

| Core layer                                    | Status                  |
| --------------------------------------------- | ----------------------- |
| Memory Code gate + 24h grace + trusted device | **Already Implemented** |
| Themed greeting letter                        | **Already Implemented** |
| Memory photo gallery (max 6)                  | **Already Implemented** |
| In-browser photobooth (no server storage)     | **Already Implemented** |

Each mode adds an **interactive layer** on top of the core. Only **Moments** ships without mini-games.

**Recipient journey order** (after access gate / OPEN) — see [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) for full detail:

| Mode           | Journey (after OPEN)                                            |
| -------------- | --------------------------------------------------------------- |
| **Moments**    | Letter → Gallery → Photobooth                                   |
| **Connection** | Quiz → Submit → Score + Band → Letter → Gallery → Photobooth    |
| **Memories**   | Match Game → Unlock Message → Letter → Gallery → Photobooth     |
| **Treasures**  | Envelope 1 → … → Final Envelope → Letter → Gallery → Photobooth |

```mermaid
flowchart TB
    subgraph Core["Shared Core (all modes)"]
        MC[Memory Code / Grace / Trusted Device]
        LT[Letter]
        GL[Photo Gallery max 6]
        PB[Photobooth browser-only]
    end

    subgraph Modes["Interactive Layer — before reward content"]
        MO[Moments — none]
        CO[Connection — Quiz]
        ME[Memories — Match Game]
        TR[Treasures — Envelopes]
    end

    MC --> Modes
    Modes --> LT --> GL --> PB
    MO -.->|immediate| LT
```

---

## Mode 1 — Moments Experience

> Previously conceptualized as the only experience shape ("Classic").

### Purpose

Deliver the emotional core — letter, photos, photobooth — with **minimum friction** and **fast load**. No games, no extra setup.

### Target Customer

- Budget bouquet buyers
- Concert / event gifting (recipient may open on slow network)
- Senders who want simplicity
- Recipients on low-end Android devices

**First-visit rule (Founder Decision):** During the **24-hour grace period** after first successful access, Memory Code is **not** required — any device may open and becomes trusted. After grace, new devices require Memory Code. Full flow: [04_SECURITY.md](./04_SECURITY.md).

### User Journey (**Already Implemented** — Sprint 07)

```mermaid
flowchart LR
    A[OPEN] --> B[Letter]
    B --> C[Gallery]
    C --> D[Photobooth]
```

Access gate (Memory Code / grace / trusted device) applies before OPEN. After OPEN, letter, gallery, and photobooth are **immediate** — no secondary unlock.

### Emotion

Warmth, immediacy, intimacy. "They wrote this for me" — no cognitive load from games.

### Advantages

- Fastest time-to-emotion
- Lowest admin configuration burden
- Smallest client bundle / fewest API round trips
- Best for crowded venues (concerts, graduations)

### Limitations

- Lowest differentiation vs Canva + Drive
- No upsell mechanics inside the experience
- Less "wow" for premium buyers

### Future Expansion Ideas

- Letter-open animation (Future Idea — emotional polish for Moments)
- Optional ambient music (Future Idea)
- Letter read-aloud TTS (Future Idea)
- Seasonal letter templates (Future Idea)

### Admin Configuration (Planned)

| Field                          | Required                                             |
| ------------------------------ | ---------------------------------------------------- |
| Theme                          | ✅                                                   |
| Greeting / closing names       | ✅                                                   |
| Letter content + closing       | ✅                                                   |
| Up to 6 photos + captions      | ✅                                                   |
| Memory Code                    | ✅ (admin sets; grace rules apply at recipient open) |
| Quiz / match / envelope config | ❌                                                   |

### Analytics (Simple Business Level Only — OD-1 Locked)

| Event               | Purpose      | Status                                                                                                                          |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `experience_opened` | Engagement   | **Already Implemented**                                                                                                         |
| Mode = moments      | Segmentation | **Already Implemented** — derive via `experiences.experience_mode` JOIN; **no** `experience_completed` event (no migration 020) |

No per-section micro-analytics in V2.

### Security Considerations

- Memory Code grace period + trusted device model (**Planned Sprint 07**)
- No additional attack surface (no user-generated quiz answers stored pre-auth)
- Photobooth stays client-only (**Founder Decision**)

---

## Mode 2 — Connection Experience

### Purpose

Add a **personal couple quiz** — "How well do you know me?" — that turns reading into participation and produces a shareable score.

### Target Customer

- Couples (anniversary, Valentine's, apology/reconciliation)
- Close friends with inside jokes
- Premium bouquet tier buyers

### User Journey (**Already Implemented** — Sprint 08 + Sprint 08R)

```mermaid
flowchart LR
    A[OPEN] --> B[Quiz]
    B --> C[Submit]
    C --> D[Score + Band Message]
    D --> E[Letter]
    E --> F[Gallery]
    F --> G[Photobooth]
```

Recipient answers **multiple-choice (A/B/C) questions, maximum 6**, authored by admin. **Any successful submit unlocks** the letter, gallery, and photobooth (CF-1). Score affects band message only. Initial load delivers **Gate Payload** (quiz only); **Reward Payload** (letter + signed photos) arrives after submit (CF-4). Gallery is gated until unlock (CF-3). Unlock persists in `sessionStorage` only (CF-2).

Buyer preview order: Quiz → Letter → Gallery → Approve (no gating — buyer sees all content).

### Templates (Founder Decision — **Already Implemented** Sprint 08)

**New Connection** offers starter templates — admin edits, does not start from blank:

| Template    | Use case                |
| ----------- | ----------------------- |
| Anniversary | Couples milestone       |
| Graduation  | Celebration achievement |
| Birthday    | Personal celebration    |
| Proposal    | Romantic escalation     |

### Emotion

Playfulness, validation, competitive warmth. "Let me prove I pay attention."

### Advantages

- Strong differentiation — not replicable with static PDF
- High social share potential (score screenshot + photobooth)
- Clear premium upsell narrative

### Limitations

- Admin must author questions (time cost)
- Wrong question design feels generic
- More client JS than Moments

### Future Expansion Ideas

- Timed questions (Future Idea)
- Audio/video question prompts (Future Idea)
- Leaderboard for group events (Future Idea — conflicts with privacy model; needs founder review)

### Admin Configuration (**Already Implemented** — Sprint 08)

Everything in Moments, plus:

| Field                                        | Notes                                                        |
| -------------------------------------------- | ------------------------------------------------------------ |
| Questions (**max 6**, multiple choice A/B/C) | Prompt, options, correct answer                              |
| Score bands (**≥ 1 required** at publish)    | Message per band; single band allowed for simple quizzes     |
| Quiz title                                   | Optional custom heading — stored as `experiences.quiz_title` |
| Template                                     | Optional: Anniversary, Graduation, Birthday, Proposal        |

### Analytics (Simple Business Level Only — OD-1 Locked)

| Event               | Purpose      | Status                                                                                                                                        |
| ------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `experience_opened` | Engagement   | **Already Implemented** — recorded on granted recipient access                                                                                |
| Mode = connection   | Segmentation | **Already Implemented** — derive via `experiences.experience_mode` JOIN at query time; **no** `experience_completed` event (no migration 020) |

No per-section micro-analytics in V2.

### Security Considerations

- Quiz answers are recipient input — validate length, sanitize display (**Already Implemented** — Zod schemas)
- Correct answers must not leak before submission (**Already Implemented** — `RecipientQuizView` / `PreviewQuizView` strip `correct_option_index`; grading server-side only)
- Letter and signed photo URLs must not appear in initial Connection payload (**Already Implemented** — Sprint 08R Gate/Reward split, CF-4)
- Gallery gated until quiz submit (**Already Implemented** — CF-3)
- Rate-limit answer submissions per session — **Deferred** (see MED-05 in [06_DEVELOPMENT_GUIDE.md](./06_DEVELOPMENT_GUIDE.md))
- No PII required from recipient (no accounts)

---

## Mode 3 — Memories Experience

### Purpose

**Match The Memory** — recipient pairs story descriptions with photos shown through a **cinematic reveal window** (FD-M2). Emotional curiosity — not a pass/fail exam. Reward always delivered after submit (FD-M5).

### Target Customer

- Relationship milestones with shared photo history
- Family gifts (parent → child graduation)
- Premium buyers wanting narrative depth

### User Journey (Planned — Sprint 09A Phase 6+)

```mermaid
flowchart LR
    A[OPEN] --> B[Match Game]
    B --> C[Submit]
    C --> D[Score]
    D --> E[Unlock Message]
    E --> F[Letter]
    F --> G[Gallery]
    G --> H[Photobooth]
```

Recipient pairs stories with photos shown through a **cinematic reveal window** (~20–30% visible, centered, feathered — FD-M2). **One submission only** (FD-M3 — supersedes unlimited retry). Score is emotional feedback; **reward always delivered** after valid submit (FD-M5). Match game gates letter and gallery (CF-5).

> **Founder decisions:** FD-M1–FD-M5 locked in [05_FOUNDER_DECISIONS.md](./05_FOUNDER_DECISIONS.md). Journey SSOT: [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md).

### Emotion

Nostalgia, curiosity, emotional anticipation — _"you were there for these moments."_

### Advantages

- Photos become gameplay, not passive grid
- Encourages admin to curate meaningful captions
- Unlock mechanic creates a second emotional peak

### Limitations

- Requires at least **2** match pairs (publish minimum); best experience with 3–4+ distinct photo stories
- Tap-to-match primary; drag optional enhancement on larger screens
- Higher admin setup than Connection

### Future Expansion Ideas

- Progressive hints (Future Idea)
- Voice-recorded story clips (Future Idea)
- Multi-round matching (Future Idea)

### Admin Configuration (Planned — Sprint 09A)

Everything in Moments, plus:

| Field                | Notes                                                                     |
| -------------------- | ------------------------------------------------------------------------- |
| Match pairs          | **2–6** pairs; `story_text` ↔ `photo_sort_order` (each slot used once)    |
| Final unlock message | Shown after submit — always, regardless of score (FD-M5)                  |
| Shuffle presentation | Client-side randomization — **no `shuffle_seed` in V2 schema** (deferred) |
| Templates            | **Out of Sprint 09 scope** — Future Idea after core V2 complete           |

### Buyer Preview (Locked — Sprint 09 Kickoff)

Shows all stories, all uploaded photos (full — no cinematic mask), and overall game structure. **Must NOT reveal** correct story–photo mappings. Informational note: recipients experience cinematic reveal during live journey (FD-M2).

### Analytics (Simple Business Level Only — OD-1 Locked)

| Event               | Purpose      | Status                                                                                                              |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `experience_opened` | Engagement   | **Already Implemented**                                                                                             |
| Mode = memories     | Segmentation | **Planned** — derive via `experiences.experience_mode` JOIN; **no** `experience_completed` event (no migration 020) |

### Security Considerations

- **Batch submit** — full set validated server-side; client cannot skip to final message
- **Cinematic reveal** — recipient sees masked photos only during game (FD-M2); buyer preview shows full photos
- Photo URLs signed and server-minted (**Already Implemented** pattern)
- Recipient DTO strips correct `photo_sort_order` mappings (mirror Connection OD-2)
- **Single submission** after successful submit in same session (FD-M3 — supersedes unlimited retry)
- **Score never blocks reward** (FD-M5 — extends CF-1)

---

## Mode 4 — Treasures Experience

### Purpose

**Secret Envelopes** — sequential reveals. Each envelope contains a hidden message or hidden photo. Final envelope holds the biggest surprise.

### Target Customer

- Maximum-impact gifts (proposal hints, major birthdays)
- Signature bouquet tier
- Senders who want ceremony and pacing

### User Journey (Planned — Sprint 09B)

```mermaid
flowchart TD
    A[OPEN] --> B[Envelope 1]
    B --> C[Envelope 2]
    C --> D[...]
    D --> E[Final Envelope]
    E --> F[Letter]
    F --> G[Gallery]
    G --> H[Photobooth]
```

Recipient opens envelopes in sequence. **May revisit** previously unlocked envelopes. **May NOT skip ahead** — unlock order enforced server-side. Letter follows the final envelope (CF-5 — Treasures uses envelope ceremony, not a single game gate).

### Emotion

Anticipation, ceremony, layered surprise. "There's more…"

### Advantages

- Highest perceived value
- Strongest "unboxing" metaphor
- Works even with few photos (envelopes can be text-only)

### Limitations

- Longest experience — poor fit for concerts/quick opens
- Most admin authoring work
- Risk of fatigue if too many envelopes

### Future Expansion Ideas

- Custom envelope artwork per theme (Future Idea)
- Haptic feedback on mobile (Future Idea)
- Envelope open sound design (Future Idea)

### Admin Configuration (Planned — Sprint 09B)

Everything in Moments, plus:

| Field                     | Notes                                    |
| ------------------------- | ---------------------------------------- |
| Envelope count (**2–6**)  | Order matters; aligns with 6-photo cap   |
| Per-envelope content type | `message` or `photo`                     |
| Per-envelope body         | Text or photo reference                  |
| Final envelope flag       | Exactly one envelope marked final        |
| Templates                 | **Out of Sprint 09 scope** — Future Idea |

### Buyer Preview (Locked — Sprint 09 Kickoff)

Shows envelope structure and non-spoiler context. **Must NOT reveal** hidden envelope content or allow inferring unlock order secrets beyond what admin configured for buyer review.

### Analytics (Simple Business Level Only — OD-1 Locked)

| Event               | Purpose      | Status                                                                                                              |
| ------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------- |
| `experience_opened` | Engagement   | **Already Implemented**                                                                                             |
| Mode = treasures    | Segmentation | **Planned** — derive via `experiences.experience_mode` JOIN; **no** `experience_completed` event (no migration 020) |

### Security Considerations

- Envelope order enforced server-side — **no client skip ahead**
- **Per-envelope fetch (A-4)** — hidden photo/message content not in API until envelope unlocked
- Recipients may **revisit** previously opened envelopes only
- Final envelope content protected in preview vs recipient link separation (buyer preview must not spoil)

---

## Cross-Mode Design Principles (Planned)

| Principle               | Application                                                  |
| ----------------------- | ------------------------------------------------------------ |
| Mobile-first            | All interactions work on 360px width                         |
| Progressive enhancement | Moments works without WebGL/heavy animation                  |
| Theme consistency       | Interactive UI inherits theme tokens from `features/themes/` |
| Accessible tap targets  | Minimum 44px; drag optional, tap required                    |
| Offline-resilient core  | Letter readable if images slow-load                          |
| No recipient accounts   | Progress stored in session/server, not login                 |

---

## Mode Selection Rules (Planned)

| Rule                                    | Rationale                                         |
| --------------------------------------- | ------------------------------------------------- |
| Mode chosen at order creation in Studio | Business segmentation; pricing owned by marketing |
| Mode immutable after publish            | Same rule as letter immutability                  |
| Mode visible on preview link            | Buyer approves correct experience                 |
| Recipient cannot switch modes           | Prevents confusion                                |

---

## Related Documents

- [13_EXPERIENCE_JOURNEY.md](./13_EXPERIENCE_JOURNEY.md) — **Experience Journey SSOT**
- [07_PRODUCT_REVISION_V2.md](./07_PRODUCT_REVISION_V2.md) — why four modes exist
- [09_ARCHITECTURE_IMPACT.md](./09_ARCHITECTURE_IMPACT.md) — engineering impact
- [10_DATABASE_REVISION_PLAN.md](./10_DATABASE_REVISION_PLAN.md) — how modes persist
- [11_IMPLEMENTATION_ROADMAP_V2.md](./11_IMPLEMENTATION_ROADMAP_V2.md) — build order
