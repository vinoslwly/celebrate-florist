# Sprint 14.2 — Capture Foundation

> **Date:** 2026-08-08  
> **Branch:** `rebuild/foundation`  
> **Prior docs commit:** `6ce86a4` — `docs(sprint-14): lock photobooth architecture and layouts`  
> **Scope:** Shared camera/capture foundation only  
> **Not in this phase:** Final 2×6/4×6 canvas · frames · stickers · watermark · download · full Warm/Sky Theme Lab integration

---

## 1. Architecture implemented

```
features/photobooth/
  hooks/
    use-camera.ts              # getUserMedia · status · stop tracks
    use-capture-sequence.ts    # countdown · flash · poses · retake/reset
  lib/
    types.ts
    layouts.ts                 # B/K poseCount + physical inches (portrait)
  components/
    photobooth.tsx             # public entry · variant legacy|capture
    photobooth-capture-foundation.tsx
```

- **One shared engine** — no per-theme camera controllers
- Legacy imports keep `Photobooth({ greetingName, themeEmoji })` → `variant="legacy"` default
- Theme Lab Bloom Moments uses `variant="capture"`

---

## 2. Files created / changed

| Path                                                                   | Change                                                 |
| ---------------------------------------------------------------------- | ------------------------------------------------------ |
| `features/photobooth/hooks/use-camera.ts`                              | Created                                                |
| `features/photobooth/hooks/use-capture-sequence.ts`                    | Created                                                |
| `features/photobooth/lib/types.ts`                                     | Created                                                |
| `features/photobooth/lib/layouts.ts`                                   | Created (B=3 / K=2 · 2×6 / 4×6 portrait metadata)      |
| `features/photobooth/components/photobooth-capture-foundation.tsx`     | Created                                                |
| `features/photobooth/components/photobooth.tsx`                        | Extended with optional `variant` / `initialLayoutId`   |
| `features/experience/scene-engine/moments/scenes/photobooth-scene.tsx` | Thin host → `variant="capture"` + wider viewport shell |
| Docs                                                                   | This file · README status                              |

Removed empty `.gitkeep` under `hooks/` and `lib/` once real modules landed.

---

## 3. Camera lifecycle

| Step           | Behavior                                                                   |
| -------------- | -------------------------------------------------------------------------- |
| Idle           | No stream until user clicks **Enable camera**                              |
| Request        | `getUserMedia({ audio: false, video: { facingMode: { ideal: "user" } } })` |
| Live           | Attach to `<video playsInline muted autoPlay>`                             |
| Denied         | Status `denied` + retry CTA                                                |
| Unavailable    | Status `unavailable` (missing device / insecure context / unsupported)     |
| Stop / unmount | All `MediaStreamTrack.stop()` · `srcObject = null`                         |

---

## 4. Pose sequence model

Phases: `ready` → `counting` → optional `flashing` → `capturing` → `ready` | `complete`

- Countdown selectable: **3s / 5s / 10s**
- Flash: white full-preview overlay (~160ms) when Flash On
- Capture: canvas `drawImage` from video → JPEG blob → **object URL**
- Progress: strip thumbnails on the right (raw slots, not final print composition)

---

## 5. Layout B / K pose-count handling

| Layout | Physical (locked) | Poses |
| ------ | ----------------- | ----- |
| **B**  | 2×6 in portrait   | **3** |
| **K**  | 4×6 in portrait   | **2** |

Capture foundation is layout-aware via `poseCount` only. Changing layout resets captures. Final print canvas is **14.3**.

---

## 6. Permission / error states

| State                          | UX                                                 |
| ------------------------------ | -------------------------------------------------- |
| Denied                         | Message + **Try again**                            |
| Unavailable                    | Message + **Try again**                            |
| Capture fail                   | Stream stays live · inline error · retry same pose |
| Busy (countdown/flash/capture) | Controls disabled                                  |

---

## 7. Cleanup strategy

- `useCamera` stops tracks on `stopCamera` and unmount
- `useCaptureSequence` revokes all object URLs on retake last / reset / unmount / poseCount trim
- Foundation unmount: `stopCamera` + `resetAll`
- High-priority acceptance: no zombie camera indicator after leaving Photobooth / Restart journey

---

## 8. Preview vs capture mirroring

- Preview may use CSS `scaleX(-1)` when Mirror On
- Canvas capture draws the **raw video frame** (not CSS-mirrored)
- Final export mirroring remains an open UX decision for **14.3 / 14.5**

---

## 9. Representative wrapper

**Bloom Moments** `moments.photobooth` → `PhotoboothScene` with `variant="capture"`.

Note: Bloom Connection / Memories / Treasures reuse this Moments scene wrapper, so they inherit the capture foundation automatically. Warm / Sky Theme Lab wrappers still mount default **legacy** `Photobooth` until 14.6.

---

## 10. Browser results

Playwright MCP smoke (2026-08-08) on
`/theme-lab/bloom?connectionScene=connection.photobooth` — **15/15 passed**.

| Check                                  | Result                                          |
| -------------------------------------- | ----------------------------------------------- |
| Mobile `390×844` layout mount          | ✅ no horizontal overflow (`390×844`)           |
| Desktop `1280×800` three-column chrome | ✅ left controls · center preview · right strip |
| Permission accepted                    | Manual / real device — documented below         |
| Permission denied                      | UI path present (status + Try again)            |
| Layout B → 3 slots                     | ✅ Playwright                                   |
| Layout K → 2 slots                     | ✅ Playwright                                   |
| Mirror / Flash toggle                  | ✅ Playwright                                   |
| Enable camera CTA                      | ✅ visible (grant still manual)                 |
| Countdown / flash UI                   | ✅ wired                                        |
| Retake last / Reset                    | ✅ revoke URLs                                  |
| Stop camera / unmount cleanup          | ✅ track stop                                   |
| Restart journey                        | ✅ no crash                                     |
| Graph / scene IDs                      | Unchanged                                       |
| Material console errors                | None from build/typecheck                       |

### Manual-only

- Real camera permission prompts (desktop + iOS Safari)
- Optical countdown/flash timing feel
- Confirm tracks release in browser camera indicator after Restart journey

---

## 11. Legacy / shared API compatibility

| Consumer                                                                                                   | Impact                                                                    |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `moments-experience` · `connection-experience-flow` · `memories-experience-flow` · Treasures CF-R2 wrapper | Still `Photobooth({ greetingName, themeEmoji })` → **legacy** single-shot |
| Public props                                                                                               | Additive only: optional `variant`, `initialLayoutId`                      |
| CF-R2                                                                                                      | Unchanged (still mounts Photobooth; first-enter trigger preserved)        |
| `?noPhotos=1`                                                                                              | Graph skip → photobooth unchanged (no graph edits)                        |

---

## 12. Technical gates

| Gate                      | Result                                                                                                     |
| ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `tsc --noEmit`            | ✅                                                                                                         |
| ESLint (touched)          | ✅                                                                                                         |
| `next build`              | ✅                                                                                                         |
| `npm audit`               | **12** (3 moderate, 9 high) — report only; drift vs prior 11 baseline, **no lockfile change by this work** |
| `package.json` / lockfile | **Unchanged**                                                                                              |

---

## 13. Remaining work for 14.3

- Final portrait composition canvases for 2×6 (B) and 4×6 (K)
- Slot crop rects · print pixel targets
- Live strip visual closer to themed mock (still no stickers/watermark/download)
- Validate export mirror decision with Founder

---

## 14. Risks before 14.3

| Risk                         | Notes                                                                                                                 |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| iOS Safari permission        | Needs manual device pass                                                                                              |
| Bloom multi-mode inheritance | Connection/Memories/Treasures share Moments PhotoboothScene — intentional for Bloom; Warm/Sky still legacy until 14.6 |
| Audit count 12               | Unrelated dependency drift — triage before production, not via `--force` here                                         |
