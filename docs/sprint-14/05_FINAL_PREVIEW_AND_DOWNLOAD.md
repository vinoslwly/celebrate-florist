# Sprint 14.5 — Final Preview + Download

> **Date:** 2026-08-09  
> **Branch:** `rebuild/foundation`  
> **Prior:** 14.4 Strip + Filters pushed (`cb4620a`)  
> **Scope:** Final preview · export resolution · JPEG download · mirror lock  
> **Not in this phase:** Warm/Sky strip packs · `/e/[token]` · backend storage · stickers · app watermark

---

## 0. Decisions carried forward

| Decision                | Status                                                 |
| ----------------------- | ------------------------------------------------------ |
| Layout B / K            | 2×6·3 poses / 4×6·2 poses · working 400×1200 / 600×900 |
| Layout ≠ Strip ≠ Filter | Independent                                            |
| Filters                 | Universal · live CSS · raw captures · Canvas reapply   |
| Stickers                | **Out of V1**                                          |
| App watermark           | **Out of V1** — branding in Founder strip art          |
| Client-only             | Never uploaded/stored                                  |
| One shared engine       | Canvas 2D                                              |
| Export mirroring        | **Locked in this phase** — Option A (see §4)           |

---

## 1. Final preview flow

```
Capture complete
→ choose Strip / Filter (right rail)
→ Final Preview card (“Your keepsake…”)
→ Download  |  Start over
```

Actions:

- **Download** — client-side JPEG at export resolution
- **Change Strip / Filter** — existing selectors; recomposes without retake
- **Start over** — `resetAll()` (clears poses + preview)

Not a new editor workspace.

---

## 2. Export resolution

| Layout | Working  | Scale  | Export pixels | Aspect |
| ------ | -------- | ------ | ------------- | ------ |
| **B**  | 400×1200 | **2×** | **800×2400**  | 1:3    |
| **K**  | 600×900  | **2×** | **1200×1800** | 2:3    |

Reasoning: exact aspect preserved via scaled geometry; sharper than working preview; still practical for mobile memory/file size; not print-DPI masters.

Constants: `PHOTOBOOTH_EXPORT_SCALE = 2` in `lib/export.ts`.

---

## 3. Output format + quality

| Setting | Value        |
| ------- | ------------ |
| Format  | **JPEG**     |
| MIME    | `image/jpeg` |
| Quality | **0.92**     |

No transparency required for V1 procedural strips. PNG deferred until Founder `frameSrc` art truly needs alpha. Single format for V1 (no user format picker).

---

## 4. Export mirroring — decision

| Option | Live preview | Export         |
| ------ | ------------ | -------------- |
| **A**  | May mirror   | **Unmirrored** |
| B      | May mirror   | Mirrored       |

**V1 lock: Option A** (`PHOTOBOOTH_EXPORT_MIRROR = false`).

Reason: selfie mirror helps aiming; download matches unmirrored capture / how others see the subject — standard photobooth keepsake behavior. No user-facing export mirror toggle.

Evidence: Playwright asymmetric fixture + `data-export-mirror="0"` on final preview.

---

## 5. Download architecture

```
composeStripForDownload (2×, unmirrored)
→ Blob (JPEG 0.92)
→ temporary object URL
→ <a download>
→ revoke URL (~1.5s)
```

- No server upload / processing / storage
- Preview object URL untouched by download
- Repeated downloads safe (fresh compose each time)

Filename:

`celebrate-florist-photobooth-{B|K}-{ISO-timestamp}.jpg`

---

## 6. Filter consistency

Same `filterId` drives:

1. Live CSS on `<video>`
2. Working final-preview compose (`scale: 1`)
3. Download compose (`scale: 2`, same `canvasFilter`)

Minor CSS↔Canvas drift acceptable.

---

## 7. Memory / cleanup

- Pose URLs revoked on retake / reset / unmount (14.2)
- Preview composition URL replaced/revoked on recompose / incomplete / unmount
- Download URL revoked after click
- Camera tracks stop on stop / unmount / Restart

---

## 8. Future strip art

`preset.frameSrc` optional: when set, drawn as full-canvas overlay after photos; falls back to procedural decoration on load failure. Download architecture unchanged. Branding remains in strip art — **no app watermark**.

---

## 9. Playwright evidence

Deep-link: `/theme-lab/bloom?connectionScene=connection.photobooth`  
Result: **48/48 passed** (desktop 24 + mobile 24).

Validated (mocked camera):

- Final preview after B / K
- Strip + filter persist & update preview
- Aspect 1:3 / 2:3
- Download produces JPEG blob at export pixels
- Filename pattern
- Repeated download
- Start over / Restart
- `data-export-mirror="0"`
- No sticker / watermark UI
- Desktop 1280×800 + mobile 390×844 · no x-overflow

**Mocked vs real:** fake `getUserMedia`. Real-device / iOS Safari still pending.

---

## 10. Compatibility

Legacy · CF-R2 · `?noPhotos=1` · graphs/scene IDs · package/lock — unchanged.

---

## 11. Remaining work for 14.6

- Warm / Sky strip packs + Theme Lab hosts
- Wire Founder strip artwork (`frameSrc`)
- Real-device / iOS Safari validation
- Optional PNG path if strip art requires alpha

Still out of scope: `/e/[token]` · DB/API · production integration · stickers · app watermark · Sprint 13 reopen.
