# Sprint 14.4 — Strip Presets + Universal Live Filters

> **Date:** 2026-08-09  
> **Branch:** `rebuild/foundation`  
> **Prior:** 14.3 Layout System pushed (`900a4eb`)  
> **Scope:** Strip presets · universal live filters · Bloom representative  
> **Founder revision:** Stickers + application watermark **removed from V1**

---

## 0. Decisions carried forward

| Decision                    | Status                                                                |
| --------------------------- | --------------------------------------------------------------------- |
| Layout B                    | 2×6 portrait · 1:3 · 3 poses · **400×1200**                           |
| Layout K                    | 4×6 portrait · 2:3 · 2 poses · **600×900**                            |
| **Layout ≠ Strip**          | Layout = geometry · Strip = visual skin                               |
| **Strip ≠ Filter**          | Independent controls                                                  |
| Filters                     | **Universal** across Bloom / Warm / Sky / all engine consumers        |
| Live camera filter          | **REQUIRED** — CSS on `<video>`                                       |
| Stickers                    | **Out of V1**                                                         |
| Application watermark       | **Out of V1** — Celebrate Florist branding lives in Founder strip art |
| Engine                      | One shared Photobooth engine                                          |
| Storage                     | Client-only · never stored                                            |
| Composition                 | Canvas 2D · cover crop · no html2canvas                               |
| Final export mirroring      | **Still open**                                                        |
| Real-device / iOS Safari    | Still pending                                                         |
| Warm/Sky visual strip packs | **14.6**                                                              |
| Sprint 13 Motion            | Locked                                                                |
| `/e/[token]`                | NOT AUTHORIZED                                                        |

---

## 1. Founder revision — removed from V1

| Removed                           | Reason                                                      |
| --------------------------------- | ----------------------------------------------------------- |
| Sticker editor / composition      | Keep Photobooth quick; not a mini Canva                     |
| App-generated Celebrate watermark | Strip artwork will already carry Celebrate Florist branding |

### Obsolete code removed

- `features/photobooth/lib/stickers.ts` (deleted)
- Sticker state, tray UI, drag handles, canvas sticker paint
- `paintWatermark` + watermark fields on strip presets
- Prior doc `04_STRIP_STICKER_WATERMARK_COMPOSITION.md` (replaced by this file)

Reusable kept: strip presets, `draw-frame` decoration (procedural stand-in), compose/cover crop, camera hooks.

---

## 2. Strip preset architecture

```
Shared Engine → Layout B/K → Theme Pack → Strip Preset → Filter (universal)
```

Data-driven presets in `lib/strip-presets.ts`. No per-strip React trees.

### Bloom representative presets

| Id              | Label         | Treatment |
| --------------- | ------------- | --------- |
| `bloom-soft`    | Bloom Soft    | soft      |
| `bloom-petal`   | Bloom Petal   | petal     |
| `bloom-ribbon`  | Bloom Ribbon  | ribbon    |
| `bloom-classic` | Bloom Classic | classic   |

Procedural stand-ins until Founder-designed strip art (`frameSrc` reserved).

---

## 3. Universal filter architecture

`lib/filters.ts` — one preset drives both surfaces:

| Field          | Use                                   |
| -------------- | ------------------------------------- |
| `cssFilter`    | Live `<video style={{ filter }}>`     |
| `canvasFilter` | `ctx.filter` when drawing photo slots |

### V1 filters

| Id         | Label    | Formula (CSS = Canvas)                                             |
| ---------- | -------- | ------------------------------------------------------------------ |
| `original` | Original | `none`                                                             |
| `soft`     | Soft     | `brightness(1.06) contrast(0.94) saturate(1.04)`                   |
| `warm`     | Warm     | `sepia(0.18) saturate(1.12) hue-rotate(-10deg) brightness(1.03)`   |
| `cool`     | Cool     | `saturate(0.92) hue-rotate(14deg) brightness(1.02) contrast(1.04)` |
| `vintage`  | Vintage  | `sepia(0.38) contrast(0.9) brightness(1.04) saturate(0.82)`        |
| `mono`     | Mono     | `grayscale(1) contrast(1.06) brightness(1.02)`                     |

No beauty / AR / WebGL / LUT pipeline.

---

## 4. Live preview vs Canvas consistency

| Surface            | Strategy                                               |
| ------------------ | ------------------------------------------------------ |
| Live camera        | CSS `filter` on `<video>` — no per-frame canvas loop   |
| Capture blob       | **Raw / unfiltered** (reusable)                        |
| Composition photos | `ctx.filter = canvasFilter` then cover-draw into slots |
| Strip chrome       | Drawn **after** photos with `ctx.filter = "none"`      |

Changing filter after capture recomposes without retakes.

Minor browser differences between CSS filter and Canvas filter may exist; formulas are shared to minimize drift.

---

## 5. Strip / filter independence

| Change | Poses | Camera | Layout | Strip          | Filter |
| ------ | ----- | ------ | ------ | -------------- | ------ |
| Filter | keep  | keep   | keep   | keep           | update |
| Strip  | keep  | keep   | keep   | update         | keep   |
| Layout | reset | keep*  | update | compat default | keep   |

\*Camera stream not restarted by layout/filter/strip changes.

---

## 6. Canvas composition order

1. Strip background
2. Photo slots (cover crop + selected filter)
3. Frame / decorative strip artwork

No stickers. No app watermark.

---

## 7. UI

Right column (compact):

1. Strip design selector
2. Filter swatch grid (6)
3. Raw pose thumbs

Selected states clear · mobile stacks · no horizontal overflow.

---

## 8. Playwright evidence

Deep-link: `/theme-lab/bloom?connectionScene=connection.photobooth`  
Result: **62/62 passed** (desktop 31 + mobile 31).

Validated (mocked camera):

- All 6 filters selectable · live `data-filter-id` updates
- Filter change does not reset camera/poses/strip
- Composition updates with filter
- Strip switch preserves poses + filter
- Layout B=3 / K=2 · no sticker UI · no watermark layer
- Desktop 1280×800 + mobile 390×844 · no x-overflow · Restart OK

**Mocked vs real:** fake `getUserMedia`. Real-device / iOS Safari filter feel still pending.

---

## 9. Performance

- Live preview uses CSS filter only (no canvas video loop)
- Compose runs on complete / strip / filter change only
- Countdown path unchanged

---

## 10. Compatibility

Legacy `variant` · CF-R2 · `?noPhotos=1` · graphs/scene IDs · package/lock — unchanged.

---

## 11. Remaining work for 14.5

- Final preview polish
- Download PNG/JPEG
- Founder lock on export mirroring
- Optional Founder strip art asset wiring (`frameSrc`)
