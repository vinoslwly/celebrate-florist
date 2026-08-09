# Sprint 14 — Experience Components (Photobooth)

> **Status:** ✅ **14.1–14.4** pushed · ✅ **14.5 Final Preview + Download** complete (awaiting Founder review) · [01](./01_PHOTOBOOTH_ENTRY_PLAN.md) · [02](./02_CAPTURE_FOUNDATION.md) · [03](./03_LAYOUT_SYSTEM.md) · [04](./04_STRIP_AND_FILTER_COMPOSITION.md) · [05](./05_FINAL_PREVIEW_AND_DOWNLOAD.md)  
> **After:** Sprint 13 Motion System 🔒 LOCKED ([09](../sprint-13/09_SPRINT_13_FINAL_REGRESSION_AND_LOCK.md))  
> **Primary scope:** Photobooth — Layout B/K · strip · universal filters · download  
> **Themes:** Bloom · Warm · Sky (Playful / Pure frozen)  
> **`/e/[token]` Scene Engine:** ⛔ NOT AUTHORIZED  
> **Storage:** Photobooth images **client-only — never stored** (Founder Decision)  
> **Sprint 13 Motion:** 🔒 LOCKED — do not reopen for optional polish

## Locked layouts

| Layout | Physical                    | Orientation | Poses | Aspect | Working  | Export (2×)   |
| ------ | --------------------------- | ----------- | ----- | ------ | -------- | ------------- |
| **B**  | 2×6 inch classic photostrip | Portrait    | 3     | 1:3    | 400×1200 | **800×2400**  |
| **K**  | 4×6 inch photo-card         | Portrait    | 2     | 2:3    | 600×900  | **1200×1800** |

**Layout ≠ Strip ≠ Filter.** Download = JPEG 0.92 · export **unmirrored** (Option A).

## Locked architecture (summary)

- One shared Photobooth engine · theme strip packs for Bloom/Warm/Sky
- Universal filters with **live camera preview** · raw captures reusable
- `getUserMedia` + Canvas 2D · client-side download only
- **No stickers in V1** · **no app watermark** (branding in Founder strip art)
- Live preview may mirror · **export unmirrored**
- Terminal scene · `?noPhotos=1` safe · CF-R2 intact

## Goal

Deliver a focused Photobooth V1: capture → strip + filter → final preview → download — without backend storage or a Canva-like editor.

## Founder UI reference

- **Center** — live filtered camera · final preview + Download when complete
- **Right** — strip selector · filter swatches · pose thumbs
- **Left** — layout B/K · Mirror · Flash

## Documents

| #   | Document                                                                   | Purpose                            |
| --- | -------------------------------------------------------------------------- | ---------------------------------- |
| 01  | [01_PHOTOBOOTH_ENTRY_PLAN.md](./01_PHOTOBOOTH_ENTRY_PLAN.md)               | Entry audit · architecture · locks |
| 02  | [02_CAPTURE_FOUNDATION.md](./02_CAPTURE_FOUNDATION.md)                     | 14.2 capture foundation            |
| 03  | [03_LAYOUT_SYSTEM.md](./03_LAYOUT_SYSTEM.md)                               | 14.3 B/K geometry · crop           |
| 04  | [04_STRIP_AND_FILTER_COMPOSITION.md](./04_STRIP_AND_FILTER_COMPOSITION.md) | 14.4 strip · live filters          |
| 05  | [05_FINAL_PREVIEW_AND_DOWNLOAD.md](./05_FINAL_PREVIEW_AND_DOWNLOAD.md)     | 14.5 preview · export · download   |

## Phases

| Phase | Focus                                    | Status               |
| ----- | ---------------------------------------- | -------------------- |
| 14.1  | Entry audit + architecture + layouts     | ✅ Locked            |
| 14.2  | Camera / capture foundation              | ✅ Complete (pushed) |
| 14.3  | Layout B + Layout K composition          | ✅ Complete (pushed) |
| 14.4  | Strip presets + universal live filters   | ✅ Complete (pushed) |
| 14.5  | Preview + download                       | ✅ Complete (review) |
| 14.6  | Bloom / Warm / Sky Theme Lab integration | Planned              |
| 14.7  | Regression & lock                        | Planned              |

## Hard boundaries

- No stickers · no app watermark · no beauty/AR/WebGL filters
- No backend photo storage · no DB/API photobooth work
- No Playful / Pure · no Studio / Preview redesign
- No Sprint 13 motion reopen · no journey-graph semantics changes
- No `npm audit fix --force` as part of this sprint unless separately authorized
