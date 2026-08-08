# Sprint 14.3 — Layout System

> **Date:** 2026-08-08  
> **Branch:** `rebuild/foundation`  
> **Prior:** 14.1 locked · 14.2 capture foundation pushed (`fbec2fd` smoke evidence)  
> **Scope:** Layout B / K geometry · cover crop · composition preview  
> **Not in this phase:** Final frame/sticker/watermark art · download · full Warm/Sky Theme Lab rollout · `/e/[token]`

---

## 0. Decisions carried forward

| Decision                   | Status                                                                |
| -------------------------- | --------------------------------------------------------------------- |
| Layout B                   | **2×6 inch portrait** · aspect **1:3** · **3 poses** · vertical stack |
| Layout K                   | **4×6 inch portrait** · aspect **2:3** · **2 poses** · vertical stack |
| Landscape reinterpretation | ❌ Forbidden without Founder authorization                            |
| Engine                     | One shared Photobooth engine · theme wrappers thin                    |
| Storage                    | Client-only · never uploaded/stored · no DB/API photo storage         |
| Camera / canvas            | Native `getUserMedia` + Canvas 2D · no html2canvas                    |
| Final export mirroring     | **Still open** (Founder UX) — not locked in 14.3                      |
| Theme art / stickers / WM  | Deferred to **14.4**                                                  |
| Full theme rollout         | Deferred to **14.6**                                                  |
| Graphs / scene IDs         | Unchanged                                                             |
| `?noPhotos=1` / CF-R2      | Unchanged                                                             |
| Sprint 13 Motion           | Locked                                                                |
| `/e/[token]`               | NOT AUTHORIZED                                                        |
| Playful / Pure             | Frozen                                                                |

### Still open (explicit)

- Real-device camera permission / capture validation
- iOS Safari camera behavior
- Final export mirror on/off
- Frame / sticker / watermark final art (14.4)

---

## 1. Working pixel resolutions

| Layout | Physical | Aspect | Working canvas | Rationale                                        |
| ------ | -------- | ------ | -------------- | ------------------------------------------------ |
| **B**  | 2×6 in   | 1:3    | **400 × 1200** | Exact 1:3 · light preview weight · not print DPI |
| **K**  | 4×6 in   | 2:3    | **600 × 900**  | Exact 2:3 · same weight class as B               |

These are **composition working sizes**, not print masters.

---

## 2. Slot geometry

Margins / gaps are pixel constants; slots are derived by equal vertical split of the inner box.

### Layout B — `400×1200`

| Property   | Value                               |
| ---------- | ----------------------------------- |
| Margins    | 24 all sides                        |
| Gap        | 16                                  |
| Slot size  | **352 × 373**                       |
| Slot 0     | `{ x: 24, y: 24, w: 352, h: 373 }`  |
| Slot 1     | `{ x: 24, y: 413, w: 352, h: 373 }` |
| Slot 2     | `{ x: 24, y: 802, w: 352, h: 373 }` |
| Safe frame | `{ x: 24, y: 24, w: 352, h: 1151 }` |

### Layout K — `600×900`

| Property   | Value                               |
| ---------- | ----------------------------------- |
| Margins    | 28 all sides                        |
| Gap        | 20                                  |
| Slot size  | **544 × 412**                       |
| Slot 0     | `{ x: 28, y: 28, w: 544, h: 412 }`  |
| Slot 1     | `{ x: 28, y: 460, w: 544, h: 412 }` |
| Safe frame | `{ x: 28, y: 28, w: 544, h: 844 }`  |

Safe frame = union of photo slots + inter-slot gaps (reserved for future frame art in 14.4).

---

## 3. Crop strategy

- **Mode:** CSS-like `object-fit: cover` via Canvas 2D
- **Preserve** source aspect ratio — **no stretch**
- **Crop from center** by default
- Implemented in `drawImageCover` (`compose-strip.ts`)
- Applied per slot independently

---

## 4. Preview vs export mirroring

| Surface                    | Behavior                                              |
| -------------------------- | ----------------------------------------------------- |
| Live video preview         | Optional CSS `scaleX(-1)` when Mirror On              |
| Capture blob               | Raw video frame (unmirrored)                          |
| Composition preview (14.3) | Uses **raw / unmirrored** capture frames              |
| Final export mirroring     | **Not locked** — Founder decision remains open (14.5) |

Do not treat composition preview mirroring as the export lock.

---

## 5. Composition architecture

```
features/photobooth/
  lib/
    layouts.ts          # B/K config: canvas · slots · margins · safeFrame
    compose-strip.ts    # cover crop + Canvas 2D compose → object URL
    types.ts
  hooks/
    use-camera.ts       # unchanged lifecycle
    use-capture-sequence.ts  # poseCount-driven; no layout branching
  components/
    photobooth-capture-foundation.tsx  # composition preview when complete
    photobooth.tsx                     # legacy default intact
```

- Composition logic lives **outside** React (`compose-strip.ts`)
- Capture hook only reads `poseCount` from layout config
- Neutral geometric frame (`#ECEFF2` fill + light borders) — **not** final themed art

---

## 6. Files changed

| Path                                                               | Change                                      |
| ------------------------------------------------------------------ | ------------------------------------------- |
| `features/photobooth/lib/layouts.ts`                               | Full B/K geometry + aspect helpers          |
| `features/photobooth/lib/compose-strip.ts`                         | Created — cover crop + compose              |
| `features/photobooth/components/photobooth-capture-foundation.tsx` | Composition preview · revoke on reset       |
| `next.config.ts`                                                   | CSP `img-src` adds `blob:` for client poses |
| `docs/sprint-14/03_LAYOUT_SYSTEM.md`                               | This file                                   |
| `docs/sprint-14/README.md`                                         | Status update                               |

---

## 7. Retake / reset / layout switch

| Action         | Result                                                         |
| -------------- | -------------------------------------------------------------- |
| Retake last    | Drops last pose URL · clears composition until complete again  |
| Reset all      | Revokes all pose URLs · clears composition                     |
| Layout B ↔ K   | `resetAll()` · new poseCount · revoke incompatible captures    |
| Stop / unmount | Camera tracks stopped · pose + composition object URLs revoked |

---

## 8. Representative integration

- Bloom Moments `PhotoboothScene` → `variant="capture"` (unchanged host)
- Bloom Connection / Memories / Treasures inherit via Moments wrapper
- Warm / Sky Theme Lab still default **legacy** until 14.6
- Legacy `Photobooth({ greetingName, themeEmoji })` → `variant="legacy"` intact

---

## 9. Browser evidence

### Playwright MCP (mocked camera stream)

Deep-link: `/theme-lab/bloom?connectionScene=connection.photobooth`  
Result: **34/34 passed** (desktop 17 + mobile 17).

| Check                                         | Desktop 1280×800 | Mobile 390×844 |
| --------------------------------------------- | ---------------- | -------------- |
| Layout B → 3 raw slots                        | ✅               | ✅             |
| Layout K → 2 raw slots                        | ✅               | ✅             |
| Composition pixels B `400×1200` / K `600×900` | ✅               | ✅             |
| Portrait aspects 1:3 / 2:3 on composition     | ✅               | ✅             |
| No horizontal overflow                        | ✅               | ✅             |
| Composition preview fits viewport             | ✅               | ✅             |
| Layout switch resets safely                   | ✅               | ✅             |
| Retake / reset                                | ✅               | ✅             |
| Restart journey                               | ✅               | ✅             |

CSP note: `next.config.ts` allows `blob:` on `img-src` and `connect-src` so client-only object URLs can preview (`<img>`) and compose (`fetch` → ImageBitmap).

**Mocked vs real camera**

- Composition / slot / overflow evidence used a **fake `getUserMedia` canvas stream** in Playwright (controlled colored frames).
- This is **not** real-device camera validation.
- Physical camera permission + iOS Safari remain **manual / pending**.

---

## 10. Legacy / shared compatibility

| Consumer                  | Impact                           |
| ------------------------- | -------------------------------- |
| Legacy experience flows   | Still default `variant="legacy"` |
| CF-R2 Treasures           | Untouched                        |
| `?noPhotos=1`             | Untouched                        |
| Graphs / scene IDs        | Untouched                        |
| `package.json` / lockfile | Unchanged                        |

---

## 11. Remaining work for 14.4

- Theme frame artwork inside / around `safeFrame`
- Curated stickers (limited; no resize/rotate editor)
- Celebrate watermark placement
- Keep geometry from this phase stable unless Founder adjusts spacing

---

## 12. Risks before 14.4

| Risk                     | Notes                                                    |
| ------------------------ | -------------------------------------------------------- |
| Slot margin taste        | Founder may want tighter/looser gaps after visual review |
| Export mirror still open | Must not silently bake mirror in 14.4                    |
| Real-device camera       | Still pending                                            |
| Warm/Sky still legacy    | Expected until 14.6                                      |
