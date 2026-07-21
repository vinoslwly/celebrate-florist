# Sprint 12.5 — Bloom Theme Validation Pilot Plan

> **Status:** ✅ **PLAN APPROVED** · Moments 🔒 **LOCKED** · Connection 🔒 **LOCKED**  
> **Date:** 2026-07-19 (plan) · **Moments lock:** 2026-07-20 · **Connection lock:** 2026-07-21  
> **Parent:** [DDR-S12-030](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md) · [DDR-S12-034](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md) · [DDR-S12-035](../sprint-12/CELEBRATE_DESIGN_DECISION_REGISTER.md) · [Core UI closure](../sprint-12-implementation/README.md) · [Connection audit](./04_BLOOM_CONNECTION_AUDIT_AND_LOCK.md)  
> **Scene graph:** [Moments](../sprint-11/01_MOMENTS_SCENE_ARCHITECTURE.md) · [Connection](../sprint-11/02_CONNECTION_SCENE_ARCHITECTURE.md)  
> **Theme Lab:** `/theme-lab/bloom` (Moments + Connection locked · Memories/Treasures not started)

---

## Pilot question

> Can Bloom become a complete visual theme without breaking the Core UI System or requiring theme-specific product logic?

Not a full Bloom rollout. Not Warm/Playful/Sky production. Not changes to production Recipient, Preview, Studio, or Landing routes.

**Founder direction:** light pink, romantic, warm, personal, celebratory — recognizably Celebrate; not wedding-only, childish, washed out, or flower-dependent.

### Presentation workflow (locked — Moments now; other modes/themes later)

**Founder image → living code.** Not “paste screenshot as the screen.”

1. Founder delivers **one** reference image (scene / screen) at a time.
2. Engineering converts it into a **living composition**: HTML typography, CSS layout/atmosphere, Framer Motion interaction — in Theme Lab (`/theme-lab/bloom` for Moments).
3. Reference file stays in `design-references/bloom/...` as **source only**; it must not be the full-bleed interactive UI. Runtime decorative crops live under `public/themes/bloom/moments/`.
4. Optional layer crops (corners, petals) are decoration only.
5. Sprint 11 scene IDs remain the graph source of truth.
6. Do **not** bulk-import Canva packs, paste full-page PNGs as scenes, or invent interim crop collages.
7. Production `/e/` wrap only after Founder approves the full Moments journey.
8. When Connection / Memories / Treasures (or other themes) start: **same workflow** — one image in, living composition out.

---

## 1. Current Bloom assets

| Item                              | State                                                                |
| --------------------------------- | -------------------------------------------------------------------- |
| `features/themes/config/bloom.ts` | Interim tokens: `bg-pink-300`, `text-pink-ink`, gradient atmospheres |
| `presentation.assets`             | `{}` — all slots empty                                               |
| Preview image paths               | Undefined — Landing uses `PhotoSlot` placeholders                    |
| Gift                              | CSS motif fallback in `gift-presentation.tsx`                        |
| Decorative emoji                  | Recipient shell, LetterView, Memory gate — `data-production-pending` |
| `public/themes/bloom/moments/`    | Scene 1 splash only — further scenes added when Founder delivers     |

Bloom has **infrastructure and interim tokens**. Moments presentation is built **per scene** from Founder reference images into living components — not via bulk Canva pack import or pasted full-screen screenshots.

---

## 2. Missing assets and formats

Exports needed for pilot validation:

| Slot                     | Size / format                  | Role                                 |
| ------------------------ | ------------------------------ | ------------------------------------ |
| `headerMotif`            | SVG or WebP ~320×120           | Ceremonial header mark               |
| `atmosphereAsset`        | WebP 1920×1080 or tile 800×800 | Soft background texture              |
| `cornerDecoration`       | SVG ~200×200                   | Restrained corner accent             |
| `giftMotif`              | SVG/WebP 192×192               | Gift tile artwork                    |
| `completionArtwork`      | WebP ~560×360                  | Final Reward moment                  |
| `photoTreatment`         | PNG/WebP alpha                 | Gallery frame overlay                |
| `greetingPreviewImage`   | 3:4 ~600×800                   | Landing (deferred unless authorized) |
| `photoboothPreviewImage` | 3:4 ~600×800                   | Landing (deferred unless authorized) |

Prefer WebP/SVG; sRGB; no baked UI text; target ~500 KB total pilot bundle.

---

## 3. Shared vs mode-specific

**Shared:** accent, accentText, atmosphere, headerMotif, cornerDecoration — all four modes.

**Mode-specific rendering only:**

| Mode           | Surfaces to validate                                       |
| -------------- | ---------------------------------------------------------- |
| **Moments**    | Shell, LetterView, PhotoGallery                            |
| **Connection** | Shell, Quiz option (selected), Final Reward, LetterView    |
| **Memories**   | Shell, Match photo-choice, Final Reward                    |
| **Treasures**  | Shell, Gift grid (closed/opened), Final Reward, LetterView |

One theme contract; modes differ by **which surfaces appear**, not separate configs.

---

## 4. Asset slots and naming

Use existing `ThemeAssetSlots` in `types/theme.ts`:

`headerMotif` · `giftMotif` · `atmosphereAsset` · `cornerDecoration` · `completionArtwork` · `photoTreatment`

**Slot names are sufficient.** Phase 6 docs used conceptual names (`motifSlot`); code names are function-based and clearer. Moments scene art uses `public/themes/bloom/moments/scene-NN-*.png` delivered by Founder; shared theme slots remain optional and separate.

**Memory gate:** reuse scaled `headerMotif` unless review proves need for a new slot — defer `gateMotif` addition.

Wire through **shared theme helpers** — no `if (theme.id === 'bloom')` in feature components.

---

## 5. Isolated route: `/theme-lab/bloom`

| Property          | Value                                                               |
| ----------------- | ------------------------------------------------------------------- |
| Path              | `app/(theme-lab)/theme-lab/bloom/page.tsx`                          |
| URL               | `/theme-lab/bloom`                                                  |
| Data              | Static fixtures — no DB, tokens, or publish APIs                    |
| Auth              | None                                                                |
| Production impact | Scene Engine not wired to `/e/` — not linked from Landing or Studio |

**Page sections:** token swatches → four mode panels → each panel shows **Recipient** and **Preview** side-by-side (desktop) or tabbed (mobile).

Alternatives like `/dev/bloom` rejected — risk confusion with buyer Preview.

---

## 6. Recipient vs Preview

One Bloom contract; existing intensity split:

|            | Recipient                                   | Preview                                   |
| ---------- | ------------------------------------------- | ----------------------------------------- |
| Atmosphere | `pageAtmosphereRecipient` · opacity **70%** | `pageAtmospherePreview` · opacity **50%** |
| Cards      | `tone="recipient"`                          | `tone="preview"`                          |

**Screenshot matrix:** Recipient desktop/mobile · Preview desktop/mobile. Preview must stay representative but calmer.

---

## 7. Typography

**Locked:** Poppins (body, long letters, UI) · Fraunces (ceremonial headings, short lines).

**Pilot may evaluate one optional Bloom expressive font** for short greetings, Final Reward heading, brief unlock lines only.

Validate: licensing · `next/font` load cost · mobile readability · Fraunces/Poppins fallback · max 2–3 uses on Theme Lab.

Do not select a font because it looks good in Canva alone.

---

## 8. Accent and accentText

Pilot validates (not assumes interim tokens are final):

- Soft pink **accent** — bars, halos, selected states
- Deeper rose/berry **accentText** — harmonizes with accent, distinct from destructive red
- Neutral body foreground on long copy
- Surfaces: Quiz selected option, Gift labels, Recipient header chip, Preview context notes, Studio swatch

Measure contrast on **real components**, not hex alone. Propose token changes in a before/after table for Founder sign-off before merging `bloom.ts`.

---

## 9. Gift treatment

**Preserve:** Closed / Opened / Final Gift / Final Reward semantics · open/reward logic · CSS motif fallback.

**Pilot adds:** optional `assets.giftMotif` — shared `GiftMotif` loads image when present, else CSS.

**Forbidden:** Bloom-specific Gift component · theme-ID branching · emoji return.

---

## 10. Mobile, crop, and performance risks

| Risk                         | Mitigation                                |
| ---------------------------- | ----------------------------------------- |
| Wide motif crops on 320px    | SVG or `object-contain` + `max-w`         |
| Atmosphere harms readability | Low contrast; keep CSS gradient fallback  |
| completionArtwork too tall   | Cap height inside card                    |
| Gift touch targets           | Maintain ≥44px (Batch 6)                  |
| Large Canva PNGs             | WebP + SVGO; lazy-load below fold         |
| Font FOUT                    | `display: swap`; preload only if measured |

Review at **375px** and **1280px**. Target LCP comparable to current Recipient ± decorative delta.

---

## 11. `decorativeIntensity`

No runtime behavior during planning. When implementation is authorized, pilot tests **one optional consumer** (e.g. corner motif opacity cap).

Outcomes: **keep and use** · **keep optional** · **remove if unused**. Field existence ≠ proof of need.

---

## 12. Production Pending classification

| Element                     | Action                                         |
| --------------------------- | ---------------------------------------------- |
| Recipient / Letter emoji    | Replace in pilot (headerMotif or neutral mark) |
| Memory gate 🎁              | Replace in pilot                               |
| Gift CSS motif              | Retain as fallback                             |
| Empty asset slots           | Fill when exports ready                        |
| Landing PhotoSlots          | Defer unless separately authorized             |
| Founder scene art           | Moments presentation — one file per scene      |
| S13 motion / S14 photobooth | Defer                                          |

No random external artwork.

---

## 13. Follow-up register (from Core UI closure)

**Bloom:** Founder scene-by-scene Moments art · slot naming · `decorativeIntensity` · no special-case components · Gift replaceability · one contract · emoji replacement · mobile crop · accentText · performance.

**Post-closure:** Create Order field errors · broader `aria-describedby` · measured contrast · Production Pending traceability.

**Later:** final four-theme art · S13 Motion · S14 Photobooth.

---

## 14. Founder inputs before coding

1. Explicit **implementation authorization** (Theme Lab + asset wiring)
2. **Founder scene art** (Moments) + optional shared theme slot files when authorized
3. **accent / accentText** sign-off from Theme Lab review
4. **Expressive font** candidate or explicit skip + license
5. **Emoji replacement** strategy
6. Whether **Landing preview images** update in same pass
7. Theme Lab screenshot approval before production `bloom.ts` merge

---

## 15. Implementation boundary (when authorized)

**In:** `/theme-lab/bloom` · shared slot consumers · `public/themes/bloom/*` · optional expressive font on limited surfaces · `bloom.ts` token updates after review.

**Out:** production `/e/` or `/preview/` changes · other themes · schemas/APIs/DB · Bloom-specific components · motion · photobooth · Landing redesign · commits without authorization.

---

## 16. Success criteria

Founder can confirm: assets load via shared slots without forks · four modes coherent · Preview calmer but representative · Gift CSS fallback intact · mobile readable · no Core UI regression · `decorativeIntensity` decision documented.

**Next step:** Founder review of this plan. **No coding until §14 inputs and implementation authorization.**
