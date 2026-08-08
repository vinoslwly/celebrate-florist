# Sprint 14 — Experience Components (Photobooth)

> **Status:** ✅ **14.1 LOCKED** · ✅ **14.2 Capture Foundation** complete · [01](./01_PHOTOBOOTH_ENTRY_PLAN.md) · [02](./02_CAPTURE_FOUNDATION.md)  
> **After:** Sprint 13 Motion System 🔒 LOCKED ([09](../sprint-13/09_SPRINT_13_FINAL_REGRESSION_AND_LOCK.md))  
> **Primary scope:** Photobooth redesign — Layout B · Layout K · countdown · flash · stickers · watermark · download  
> **Themes:** Bloom · Warm · Sky (Playful / Pure frozen)  
> **`/e/[token]` Scene Engine:** ⛔ NOT AUTHORIZED  
> **Storage:** Photobooth images **client-only — never stored** (Founder Decision)  
> **Sprint 13 Motion:** 🔒 LOCKED — do not reopen for optional polish

## Locked layouts

| Layout | Physical                    | Orientation | Poses |
| ------ | --------------------------- | ----------- | ----- |
| **B**  | 2×6 inch classic photostrip | Portrait    | 3     |
| **K**  | 4×6 inch photo-card         | Portrait    | 2     |

Do not reinterpret as landscape unless Founder changes this.

## Locked architecture (summary)

- One shared Photobooth engine · theme packs only for Bloom/Warm/Sky
- `getUserMedia` + Canvas 2D · no html2canvas · no V1 dependency by default
- Preview may mirror · export mirroring decided later
- Stickers limited · resize/rotate deferred
- Terminal scene · `?noPhotos=1` safe · CF-R2 intact
- Full lock list: [01 §0](./01_PHOTOBOOTH_ENTRY_PLAN.md#0-locked-decisions-do-not-reinterpret)

## Goal

Deliver a focused Photobooth V1 as a shared experience component: capture → compose → download, with theme-local frames/stickers — without backend storage or a Canva-like editor.

## Founder UI reference

Session layout intent:

- **Center** — camera preview
- **Right** — live photo strip
- **Left** — 2-pose / 3-pose layout · Mirror on/off · Flash on/off
- Other controls placed for clarity

Mocks: [`references/`](./references/) · details in [01 plan §3](./01_PHOTOBOOTH_ENTRY_PLAN.md#3-v1-user-journey)

## Documents

| #   | Document                                                     | Purpose                                       |
| --- | ------------------------------------------------------------ | --------------------------------------------- |
| 01  | [01_PHOTOBOOTH_ENTRY_PLAN.md](./01_PHOTOBOOTH_ENTRY_PLAN.md) | Entry audit · architecture · locked decisions |
| 02  | [02_CAPTURE_FOUNDATION.md](./02_CAPTURE_FOUNDATION.md)       | 14.2 capture foundation (when complete)       |

## Phases

| Phase | Focus                                    | Status      |
| ----- | ---------------------------------------- | ----------- |
| 14.1  | Entry audit + architecture + layouts     | ✅ Locked   |
| 14.2  | Camera / capture foundation              | ✅ Complete |
| 14.3  | Layout B + Layout K composition          | Planned     |
| 14.4  | Frame / sticker / watermark              | Planned     |
| 14.5  | Preview + download                       | Planned     |
| 14.6  | Bloom / Warm / Sky Theme Lab integration | Planned     |
| 14.7  | Regression & lock                        | Planned     |

## Hard boundaries

- No video/GIF · beauty filters · AI backgrounds · complex editor
- No backend photo storage · no DB/API photobooth work
- No Playful / Pure · no Studio / Preview redesign
- No Sprint 13 motion reopen · no journey-graph semantics changes
- No `npm audit fix --force` as part of this sprint unless separately authorized
