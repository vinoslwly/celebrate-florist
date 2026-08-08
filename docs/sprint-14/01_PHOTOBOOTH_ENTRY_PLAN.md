# Sprint 14 — Photobooth Entry Plan

> **Date:** 2026-08-08  
> **Branch:** `rebuild/foundation`  
> **Status:** ✅ **14.1 LOCKED** — architecture + layouts Founder-approved · implementation proceeds by phase  
> **Prior:** Sprint 13 Motion 🔒 LOCKED (`fdb8c78`)  
> **Roadmap:** [11_IMPLEMENTATION_ROADMAP_V2.md](../11_IMPLEMENTATION_ROADMAP_V2.md) · Sprint 14  
> **Founder rules:** Photobooth images **never stored** · client-only ([05](../05_FOUNDER_DECISIONS.md)) · CF-R2 at Treasures photobooth enter ([ADR S11-007](../adr/S11-007-cf-r2-photobooth-scene.md))

---

## 0. Locked decisions (do not reinterpret)

| Decision                  | Lock                                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| Engine                    | **One shared** Photobooth engine — **no** per-theme camera engines                                     |
| Theme differences         | Bloom / Warm / Sky = **presentation packs only**                                                       |
| Storage                   | Images **client-only · never stored** · no DB/API/backend photo storage                                |
| Camera                    | Native `getUserMedia`                                                                                  |
| Composition/export        | Native **Canvas 2D** · **no** html2canvas                                                              |
| Dependencies              | **No** new V1 dependency unless proven necessary                                                       |
| Preview mirror            | Preview **may** be mirrored for selfie UX · **export mirroring** validated later (14.3/14.5)           |
| **Layout B**              | Classic photostrip · physical **2×6 inch portrait** · **3 poses** · vertical stack · **not landscape** |
| **Layout K**              | Photo-card · physical **4×6 inch portrait** · **2 poses** · vertical stack · **not landscape**         |
| Stickers                  | Intentionally limited · resize/rotate editor **deferred**                                              |
| Terminal scene            | Photobooth stays **terminal** · no graph advance after completion                                      |
| `?noPhotos=1`             | Must still reach Photobooth safely                                                                     |
| CF-R2 Treasures           | Must remain intact                                                                                     |
| Playful / Pure            | Frozen                                                                                                 |
| Sprint 13 Motion          | Locked — no optional reopen                                                                            |
| `/e/[token]` Scene Engine | **NOT AUTHORIZED**                                                                                     |
| Studio / Preview / DB/API | Out of scope                                                                                           |

UI session chrome (reference): center camera · right live strip · left layout (2/3 pose) + Mirror + Flash. See §3 and `references/`.

---

## 1. Current repository findings

### What exists

| Area                           | Finding                                                                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| Shared component               | `features/photobooth/components/photobooth.tsx` — single-shot `getUserMedia` + canvas `drawImage` → PNG data URL |
| Folder stubs                   | `features/photobooth/hooks/.gitkeep` · `lib/.gitkeep` · empty component placeholder                              |
| Camera API                     | `facingMode: "user"` · track `stop()` on unmount/stop · basic error string                                       |
| Countdown / flash / multi-pose | **Absent**                                                                                                       |
| Layouts B / K                  | **Absent** (documented only in roadmap)                                                                          |
| Stickers / frames / watermark  | **Absent** as photobooth assets                                                                                  |
| Download / export              | **Absent** (no save/`download` attribute flow)                                                                   |
| Canvas composition of strip    | **Absent** (only raw video frame copy)                                                                           |
| DOM screenshot libs            | **None** in `package.json` (no html2canvas / etc.)                                                               |
| Server image tooling           | `sharp` present for Next/server — **not** appropriate for client photobooth composition                          |

### What must be built (V1)

1. Layout selection (B · K)
2. Camera permission + unavailable fallbacks
3. Live preview · countdown · flash
4. Multi-pose capture sequence + retake
5. Canvas strip composition (slots · crop)
6. Theme frames · curated stickers · Celebrate watermark
7. Final preview · download (PNG/JPEG)
8. Track cleanup on exit / restart
9. Thin Theme Lab scene integration (replace placeholder UI, keep scene IDs)

### Legacy production note (boundary)

Legacy experience flows still mount `Photobooth` directly:

- `features/experience/components/moments-experience.tsx`
- `features/experience/components/connection-experience-flow.tsx`
- `features/experience/components/memories-experience-flow.tsx`
- `features/treasures/components/treasures-experience-flow.tsx` (+ CF-R2 wrapper)

**Sprint 14 Theme Lab is the authorization surface.** Upgrading `features/photobooth` will improve the shared component used by those flows, but **`/e/[token]` Scene Engine wiring remains NOT AUTHORIZED.** CF-R2 Treasures trigger must remain intact wherever photobooth first mounts after journey completion.

---

## 2. Photobooth routing / placeholder map

### Terminal scene IDs (12 journeys)

| Theme     | Moments                   | Connection                   | Memories                   | Treasures                   |
| --------- | ------------------------- | ---------------------------- | -------------------------- | --------------------------- |
| **Bloom** | `moments.photobooth`      | `connection.photobooth`      | `memories.photobooth`      | `treasures.photobooth`      |
| **Warm**  | `warm.moments.photobooth` | `warm.connection.photobooth` | `warm.memories.photobooth` | `warm.treasures.photobooth` |
| **Sky**   | `sky.moments.photobooth`  | `sky.connection.photobooth`  | `sky.memories.photobooth`  | `sky.treasures.photobooth`  |

### Coupling (reuse)

```
Bloom Moments PhotoboothScene  ← Connection / Memories / Treasures wrappers
Warm Moments WarmPhotoboothScene ← Warm Connection / Memories / Treasures wrappers
Sky Moments SkyPhotoboothScene ← Sky Connection / Memories / Treasures wrappers
         ↓
   features/photobooth/components/photobooth.tsx  (shared camera UI today)
```

**Implication:** One shared engine upgrade; theme wrappers stay presentation shells. Do **not** fork camera engines per theme/mode.

### Graph entry into photobooth

Typical paths (unchanged):

- Gallery ending → photobooth
- **`hasPhotos === false` / `?noPhotos=1`:** album/gallery unlock → **skip gallery** → photobooth

Photobooth is **terminal** (no further scene). Graphs / scene IDs / `?noPhotos=1` semantics must stay unchanged.

### Placeholder UX today

- Mono “Production Pending / Sprint 14” labels in Theme Lab wrappers
- Card UI: Start → Capture → Stop · video + single snapshot
- Warm/Sky add themed field backgrounds around the same `Photobooth` card

---

## 3. V1 user journey

### Founder UI layout reference (not implemented yet)

Founder provided mock references (stored under `docs/sprint-14/references/`). **Capture session chrome** should follow this spatial model:

| Zone       | Content                                                                                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| **Center** | Live camera preview (+ shutter / Start)                                                                           |
| **Right**  | Live **photo strip** preview (slots fill as poses capture; theme frame / greeting / Celebrate branding)           |
| **Left**   | Controls: **layout / frame** (2-pose · 3-pose ≡ Layout K / B), **Mirror On/Off**, **Flash On/Off**                |
| **Other**  | Countdown timer (3s / 5s / 10s), permission-denied / unavailable states, Start — place for clarity; avoid clutter |

Notes from references:

- Strip is a first-class live panel, not only a post-capture step
- Layout picker may open as a focused sheet/modal (V1: **only 2-pose + 3-pose**, not a 12-layout marketplace)
- Mirror / Flash are explicit toggles beside primary Start
- Copy in mocks may be Indonesian; Celebrate Theme Lab may keep product language consistent with existing Theme Lab English unless Founder later locks i18n
- Filter / “Bersinar” style extras in competitor mocks stay **out of V1** unless mapped to our watermark/frame/sticker scope

**No implementation in this planning pass** — reference only for phases 14.2–14.6.

Recommended flow (simple, strip-booth style):

```
Entry (terminal scene)
  → Session UI: camera (center) · strip (right) · layout/mirror/flash (left)
  → Choose layout (2-pose / 3-pose)
  → Camera permission request
  → Live preview (+ strip placeholders)
  → Countdown → Flash (if on) → Capture pose → slot fills on strip
  → Repeat until pose count complete
  → Optional retake (last pose or all — see below)
  → Light customize (stickers within safe area; frame already from layout/theme)
  → Final preview
  → Download
  → Done (remain on terminal scene; no graph advance)
```

### Challenged alternative

Skipping layout selection and hardcoding Layout B first would reduce V1 scope but conflicts with Founder-approved dual layouts in the roadmap. **Keep both layouts in V1**; delay only advanced editors.

### Behaviors

| Case                   | Behavior                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Retake**             | V1: retake **last pose** before composition commits; optional “retake all” resets sequence. After composition, “Start over” returns to layout select (or preview camera). |
| **Cancel / back**      | Back from camera → layout select; back from customize → composition with captures kept; never invent new graph edges.                                                     |
| **Permission denied**  | Clear message · “Try again” · “Continue without camera” disabled for capture (photobooth requires camera); user may Restart journey via Theme Lab chrome.                 |
| **Camera unavailable** | Same as denied + note HTTPS / device support.                                                                                                                             |
| **Capture fail**       | Keep stream · toast/inline error · retry countdown for that pose.                                                                                                         |
| **Restart journey**    | Existing Theme Lab Restart · must **stop tracks** on unmount.                                                                                                             |
| **Completion**         | Download success acknowledgment; scene remains terminal (no photobooth → next scene).                                                                                     |

---

## 4. Architecture proposal

### Principle

**One shared Photobooth engine** + **theme presentation packs**.

```
features/photobooth/
  components/
    photobooth-experience.tsx     # orchestrator (replaces/extends Photobooth)
    camera-preview.tsx
    countdown-overlay.tsx
    flash-overlay.tsx
    pose-progress.tsx
    layout-picker.tsx
    composition-canvas.tsx        # or canvas util only, thin view
    sticker-layer.tsx             # minimal
    final-preview.tsx
  hooks/
    use-camera.ts                 # getUserMedia · cleanup · constraints
    use-capture-sequence.ts       # countdown · poses · retake
  lib/
    layouts.ts                    # Layout B/K config (not a DSL)
    compose-strip.ts              # canvas draw · crop · watermark
    download.ts                   # blob → anchor download
    types.ts
  themes/
    bloom.ts | warm.ts | sky.ts   # frame URLs, sticker set, accent copy
  assets/                         # or public/photobooth/...
```

### Responsibility split

| Layer              | Owns                                                                                            |
| ------------------ | ----------------------------------------------------------------------------------------------- |
| **Shared core**    | camera · countdown · flash · pose sequence · crop/compose · export/download · permission errors |
| **Theme pack**     | frame art · sticker PNGs · watermark treatment · field/chrome colors · typography accents       |
| **Scene wrappers** | Theme Lab shell (`SCENE_VIEWPORT_*`) · payload → greeting name · **no camera logic**            |

### Abstraction budget

Create components only when they isolate a real lifecycle (camera tracks, countdown timer, canvas export). Prefer hooks + lib over a large component taxonomy.

**Do not build:** camera engine per theme · choreography DSL · timeline engine · global particle framework · layout marketplace DSL.

### Scene Engine integration

- Keep scene IDs and registries.
- Swap placeholder body for `<PhotoboothExperience themeId="bloom|warm|sky" … />`.
- **No graph changes** for V1.
- Treasures CF-R2: preserve first-enter trigger semantics (production path + any future Theme Lab alignment); redesign must not double-fire or move DELETE into Scene Manager.

---

## 5. Layout B / K model

### Founder-locked physical formats

| Layout | Physical                        | Orientation       | Poses | Composition            | Intent                                  |
| ------ | ------------------------------- | ----------------- | ----- | ---------------------- | --------------------------------------- |
| **B**  | **2×6 inch** classic photostrip | **Portrait only** | **3** | Vertical stacked slots | Couples / best friends / small groups   |
| **K**  | **4×6 inch** photo-card         | **Portrait only** | **2** | Vertical stacked slots | Postcard / graduation / couple / family |

Do **not** reinterpret as landscape unless Founder explicitly changes this.

UI labels: **3 pose** ↔ Layout B · **2 pose** ↔ Layout K.

Final visual detailing (frames, print finish) belongs to later layout/composition phases (14.3+). Capture foundation (14.2) uses `poseCount` only.

### Config shape (simple — not a DSL)

```ts
type PhotoSlot = {
  id: string;
  /** Normalized rect inside output canvas [0–1]. */
  x: number;
  y: number;
  w: number;
  h: number;
  fit: "cover"; // V1 fixed
};

type PhotoboothLayout = {
  id: "B" | "K";
  label: string;
  poseCount: 3 | 2;
  /** Physical inches (portrait). */
  physicalInches: { width: 2 | 4; height: 6 };
  /** Output pixel size — set in 14.3. */
  width: number;
  height: number;
  slots: PhotoSlot[]; // length === poseCount · vertical stack
  frameInset: { top: number; right: number; bottom: number; left: number };
  stickerSafeArea: { x: number; y: number; w: number; height: number };
  watermark: { x: number; y: number; maxWidth: number };
};
```

### Suggested print-resolution targets (for 14.3 — not required in 14.2)

| Layout    | Aspect (W:H) | Example @ ~300 DPI | Slots            |
| --------- | ------------ | ------------------ | ---------------- |
| **B** 2×6 | 1:3          | `900 × 2700`       | 3 equal vertical |
| **K** 4×6 | 2:3          | `1200 × 1800`      | 2 equal vertical |

### Future layouts

Add a new `PhotoboothLayout` object + assets. Capture engine stays `poseCount`-driven.

---

## 6. Camera / browser constraints

| Topic                | Recommendation                                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------------------- |
| API                  | `navigator.mediaDevices.getUserMedia` (already used)                                                           |
| Facing               | Prefer `{ facingMode: { ideal: "user" } }` · audio `false`                                                     |
| Secure context       | HTTPS or localhost required                                                                                    |
| Desktop vs mobile    | Same API; mobile needs `playsInline` · `muted` · careful viewport (`SCENE_VIEWPORT_*`)                         |
| Permission lifecycle | Request on user gesture (“Enable camera”) · not on silent mount                                                |
| Cleanup              | `track.stop()` on unmount, Stop, Restart, layout change, leave scene                                           |
| Mirror               | Preview CSS `scaleX(-1)` for selfie UX · **export unmirrored** (or optional toggle; default natural for print) |
| Orientation          | Lock composition to layout aspect; avoid rotating strip mid-session in V1                                      |
| Quality              | Capture at camera native size → center-crop to slot aspect → downscale into layout pixels                      |
| Memory               | Prefer `ImageBitmap` / blob URLs over many large data URLs; revoke object URLs on reset                        |
| Safari / iOS         | Manual validation required; `playsInline` essential; permission re-prompt quirks                               |
| Packages             | **No new dependency** for camera — browser APIs suffice                                                        |

---

## 7. Composition / download strategy

### Method

**Native Canvas 2D** (already partially used):

1. Create offscreen/output canvas at layout `width × height`
2. Draw theme frame
3. For each pose: draw cropped bitmap into slot
4. Draw stickers (in z-order)
5. Draw Celebrate watermark
6. `canvas.toBlob("image/jpeg", 0.92)` (or PNG if transparency required for frame edges)
7. Trigger `<a download>` with object URL · revoke after click

### Avoid

- html2canvas / DOM screenshot libraries (layout brittle, heavier, less control)
- Server-side `sharp` for recipient photobooth (violates client-only rule / adds latency)

### Output defaults (proposed)

| Setting    | V1 default                                             |
| ---------- | ------------------------------------------------------ |
| File type  | `image/jpeg` (smaller) · PNG only if frame needs alpha |
| Filename   | `celebrate-photobooth-{layout}-{yyyyMMdd-HHmm}.jpg`    |
| Resolution | Layout design pixels above (not full 4K)               |
| Crop       | `object-fit: cover` equivalent into each slot          |

---

## 8. Sticker recommendation (intentionally small)

### V1

- **Curated set:** ~6–12 stickers per theme (or one shared set + 3–4 theme accents)
- **Add:** tap sticker → appears at default/safe position (or cycle preset anchors)
- **Move:** drag within sticker safe area
- **Remove:** tap selected + delete
- **Resize / rotate:** **defer** unless drag proves trivial — resize/gesture math + a11y often balloons scope

### If drag proves costly

Fall back to **tap-to-place on 3–4 fixed anchors** (corners / margin). Still feels personal without an editor project.

### Non-goals

Marketplace · upload custom stickers · text editor · layers panel · undo stack beyond last action.

---

## 9. Theme integration strategy

| Theme     | Presentation pack                                              |
| --------- | -------------------------------------------------------------- |
| **Bloom** | Soft floral / luminous frame · petal accents · blush watermark |
| **Warm**  | Ceremonial / stationery frame · cream+gold · intimate type     |
| **Sky**   | Airy scrapbook frame · denim/cloud accents · light watermark   |

Shared engine receives:

```ts
type PhotoboothThemePack = {
  id: "bloom" | "warm" | "sky";
  frameSrc: string;
  stickers: { id: string; src: string; defaultScale: number }[];
  watermarkSrc?: string;
  watermarkText?: string; // e.g. "Celebrate"
  chromeClassName?: string;
};
```

Scene wrappers pass `themeId` only. **No duplicated capture controllers.**

---

## 10. Testing plan

### Viewports

- Mobile `390×844`
- Desktop `1280×800`

### Cases

| Case                | Validate                               |
| ------------------- | -------------------------------------- |
| Permission accepted | Preview live · capture works           |
| Permission denied   | Error UX · no zombie tracks            |
| Camera unavailable  | Fallback copy                          |
| Layout B complete   | 3 poses → compose                      |
| Layout K complete   | 2 poses → compose                      |
| Retake              | Last pose / start over                 |
| Stickers            | Add · drag (or anchors) · remove       |
| Watermark           | Visible on export                      |
| Download            | File opens · correct layout            |
| Restart             | Tracks stopped · clean remount         |
| Overflow            | No horizontal overflow · CTA reachable |
| `?noPhotos=1`       | Still skips gallery → photobooth       |
| Exit scene          | Tracks stopped                         |

### Manual-only / hard to automate

- Real device camera permission prompts
- Safari iOS quirks
- Visual frame alignment / print feel
- Flash timing “feel”
- Downloaded file open on device Photos app

Playwright can cover mount, denied mock, layout UI, download click with mocked stream where possible — **not** full optical quality sign-off.

---

## 11. Implementation phases

| Phase    | Deliverable                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **14.1** | Entry audit + architecture _(this document)_                                                                                 |
| **14.2** | `useCamera` · preview · permission/error · cleanup · countdown · flash · single/multi capture sequence (no fancy frames yet) |
| **14.3** | Layout B + K config · slot crop · pose progress · retake                                                                     |
| **14.4** | Frame · sticker V1 · watermark composition onto canvas                                                                       |
| **14.5** | Final preview · download · filename · memory cleanup                                                                         |
| **14.6** | Bloom / Warm / Sky Theme Lab wrappers wired to engine · presentation packs · preserve `?noPhotos=1`                          |
| **14.7** | Regression matrix · track-leak checks · docs lock                                                                            |

**Optional reorder:** If Founder provides frame assets late, ship 14.2–14.3 with a temporary geometric frame, swap art in 14.4 without recutting capture.

---

## 12. Risks

| Risk                                             | Severity     | Mitigation                                                                                                       |
| ------------------------------------------------ | ------------ | ---------------------------------------------------------------------------------------------------------------- |
| Layout B/K orientation                           | **Resolved** | Locked portrait 2×6 (B) · 4×6 (K) — do not flip to landscape                                                     |
| Frame/sticker assets not ready                   | Medium       | Geometric interim frame · swap assets later                                                                      |
| iOS Safari camera quirks                         | Medium       | Manual device pass in 14.7 · `playsInline` · gesture-gated permission                                            |
| CF-R2 double-fire / missed fire on Treasures     | **High**     | Preserve mount-once semantics; regression on production Treasures path without expanding `/e` Scene Engine scope |
| Shared `Photobooth` upgrade affects legacy flows | Medium       | Keep API stable · Theme Lab primary QA · smoke legacy mounts                                                     |
| Sticker drag scope creep                         | Medium       | Cap at drag+delete; defer resize                                                                                 |
| Memory leaks (blobs / streams)                   | Medium       | Central cleanup in hooks · restart tests                                                                         |
| Sprint 13 motion reopen temptation               | Low          | Explicit non-goal                                                                                                |

---

## 13. Explicit exclusions

- Video / GIF capture
- Beauty filters · AI backgrounds
- Complex image / text editor
- Dozens of layouts · sticker marketplace
- Backend storage · sharing / social
- Playful / Pure
- Studio / Preview redesign
- `/e/[token]` Scene Engine wiring
- DB / API / migrations / RLS for photos
- Journey graph / scene ID / scoring / Final Gift semantics changes
- Sprint 13 motion polish
- `npm audit fix --force`

---

## 14. Definition of done (Sprint 14 V1)

- [ ] Layout B (3 poses) and Layout K (2 poses) complete capture → compose → download
- [ ] Camera permission accepted / denied / unavailable handled
- [ ] Countdown + flash feedback
- [ ] Curated stickers (tap + drag or anchors) + Celebrate watermark on export
- [ ] Bloom · Warm · Sky Theme Lab terminals use shared engine with distinct packs
- [ ] Media tracks stop on exit / restart
- [ ] `?noPhotos=1` still reaches photobooth safely
- [ ] Graphs / scene IDs unchanged
- [ ] No server upload of photobooth images
- [ ] Mobile + desktop regression recorded
- [ ] CF-R2 Treasures contract preserved
- [ ] Sprint 14 lock doc

---

## 15. Recommendation — ready to begin?

**14.1 locked.** Layout orientation resolved (B = 2×6 portrait · K = 4×6 portrait). Remaining for later phases:

1. Exact output px / slot rects in composition (14.3)
2. **Asset source** for frames/stickers (Founder art vs interim geometric)

No architecture blockers. Shared-engine + native `getUserMedia` / Canvas 2D remains the path.

---

## Likely files to create or change (when authorized)

| Action         | Path                                                                                   |
| -------------- | -------------------------------------------------------------------------------------- |
| Create         | `features/photobooth/hooks/use-camera.ts`                                              |
| Create         | `features/photobooth/hooks/use-capture-sequence.ts`                                    |
| Create         | `features/photobooth/lib/layouts.ts` · `compose-strip.ts` · `download.ts` · `types.ts` |
| Create         | `features/photobooth/themes/{bloom,warm,sky}.ts` + assets under `public/photobooth/`   |
| Replace/extend | `features/photobooth/components/photobooth.tsx` → experience orchestrator              |
| Thin update    | Theme Lab photobooth scene wrappers (Bloom/Warm/Sky × modes) — presentation only       |
| Docs           | Sprint 14 phase notes · final lock                                                     |
| Avoid          | Graph files · Sprint 13 motion kit · Studio · `/e/[token]` hosts                       |

### Dependencies

**None required** for V1 (browser `MediaStream` + Canvas 2D + download attribute). Revisit only if Founder mandates a specific composition library (not recommended).
