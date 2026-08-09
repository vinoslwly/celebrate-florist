# Sprint 14 — Experience Components (Photobooth)

> **Status:** ✅ **14.1 LOCKED** · ✅ **14.2** · ✅ **14.3** (pushed) · ✅ **14.4 Strip + Filters** complete (awaiting Founder review) · [01](./01_PHOTOBOOTH_ENTRY_PLAN.md) · [02](./02_CAPTURE_FOUNDATION.md) · [03](./03_LAYOUT_SYSTEM.md) · [04](./04_STRIP_AND_FILTER_COMPOSITION.md)  
> **After:** Sprint 13 Motion System 🔒 LOCKED ([09](../sprint-13/09_SPRINT_13_FINAL_REGRESSION_AND_LOCK.md))  
> **Primary scope:** Photobooth — Layout B/K · strip presets · universal live filters · download  
> **Themes:** Bloom · Warm · Sky (Playful / Pure frozen)  
> **`/e/[token]` Scene Engine:** ⛔ NOT AUTHORIZED  
> **Storage:** Photobooth images **client-only — never stored** (Founder Decision)  
> **Sprint 13 Motion:** 🔒 LOCKED — do not reopen for optional polish

## Locked layouts

| Layout | Physical                    | Orientation | Poses | Aspect | Working canvas |
| ------ | --------------------------- | ----------- | ----- | ------ | -------------- |
| **B**  | 2×6 inch classic photostrip | Portrait    | 3     | 1:3    | 400×1200       |
| **K**  | 4×6 inch photo-card         | Portrait    | 2     | 2:3    | 600×900        |

**Layout ≠ Strip ≠ Filter.** Strip = visual skin. Filters = universal photo look (live + compose).

## Locked architecture (summary)

- One shared Photobooth engine · theme strip packs for Bloom/Warm/Sky
- Universal filters (Original / Soft / Warm / Cool / Vintage / Mono) with **live camera preview**
- `getUserMedia` + Canvas 2D · no html2canvas · no V1 dependency by default
- **No stickers in V1** · **no app watermark** (branding in Founder strip art)
- Preview may mirror · **export mirroring still open**
- Terminal scene · `?noPhotos=1` safe · CF-R2 intact
- Full lock list: [01 §0](./01_PHOTOBOOTH_ENTRY_PLAN.md#0-locked-decisions-do-not-reinterpret)

## Goal

Deliver a focused Photobooth V1: capture → strip + filter compose → download — without backend storage or a Canva-like editor.

## Founder UI reference

- **Center** — live filtered camera (+ composition when complete)
- **Right** — strip selector · filter swatches · pose thumbs
- **Left** — layout B/K · Mirror · Flash

Mocks: [`references/`](./references/) · details in [01 plan §3](./01_PHOTOBOOTH_ENTRY_PLAN.md#3-v1-user-journey)

## Documents

| #   | Document                                                                   | Purpose                            |
| --- | -------------------------------------------------------------------------- | ---------------------------------- |
| 01  | [01_PHOTOBOOTH_ENTRY_PLAN.md](./01_PHOTOBOOTH_ENTRY_PLAN.md)               | Entry audit · architecture · locks |
| 02  | [02_CAPTURE_FOUNDATION.md](./02_CAPTURE_FOUNDATION.md)                     | 14.2 capture foundation            |
| 03  | [03_LAYOUT_SYSTEM.md](./03_LAYOUT_SYSTEM.md)                               | 14.3 B/K geometry · crop           |
| 04  | [04_STRIP_AND_FILTER_COMPOSITION.md](./04_STRIP_AND_FILTER_COMPOSITION.md) | 14.4 strip presets · live filters  |

## Phases

| Phase | Focus                                    | Status               |
| ----- | ---------------------------------------- | -------------------- |
| 14.1  | Entry audit + architecture + layouts     | ✅ Locked            |
| 14.2  | Camera / capture foundation              | ✅ Complete (pushed) |
| 14.3  | Layout B + Layout K composition          | ✅ Complete (pushed) |
| 14.4  | Strip presets + universal live filters   | ✅ Complete (review) |
| 14.5  | Preview + download                       | Planned              |
| 14.6  | Bloom / Warm / Sky Theme Lab integration | Planned              |
| 14.7  | Regression & lock                        | Planned              |

## Hard boundaries

- No stickers · no app watermark · no beauty/AR/WebGL filters
- No video/GIF · AI backgrounds · complex editor
- No backend photo storage · no DB/API photobooth work
- No Playful / Pure · no Studio / Preview redesign
- No Sprint 13 motion reopen · no journey-graph semantics changes
- No `npm audit fix --force` as part of this sprint unless separately authorized
