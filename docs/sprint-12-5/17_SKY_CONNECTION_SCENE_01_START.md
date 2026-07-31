# Sky Connection — Scene 0–15 (full journey)

> **Status:** ✅ **Scenes 0–15 living** (through photobooth)  
> **Theme Lab:** `/theme-lab/sky?mode=connection`  
> **Production `/e/[token]`:** ⛔ NOT AUTHORIZED  
> **Sky Moments:** 🔒 Locked — reused for Scenes 0–2 and 9–15  
> **Sky Memories / Treasures / Playful:** ⏸ Not started

---

## Scene status

| Scene                                                    | Status                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| Sky Connection Scene 0 — Celebrate loading               | ✅ Living (reuses Sky Moments Scene 1)                       |
| Sky Connection Scene 1 — Gift introduction               | ✅ Living (reuses Sky Moments gift-box)                      |
| Sky Connection Scene 2 — Locked gift                     | ✅ Living (`lockedOnly` on Sky gift-opening)                 |
| Sky Connection Scene 3 — Challenge invitation            | ✅ Living (scrapbook card · START CHALLENGE)                 |
| Sky Connection Scene 4 — Quiz transition                 | ✅ Living (QUIZ TIME! · auto-advance ~2.5s)                  |
| Sky Connection Scene 5 — Quiz introduction               | ✅ Living (How well do you know me? · Start)                 |
| Sky Connection Scene 6 — Quiz (parameterized)            | ✅ Living (`quiz.question.{n}` · tap-to-advance)             |
| Sky Connection Scene 7 — Score calculation               | ✅ Living (ajar glow gift · Almost there… · ~2s auto)        |
| Sky Connection Scene 8 — Score reveal                    | ✅ Living (scalloped card · count-up % · Reveal My Gift)     |
| Sky Connection Scene 9 — Celebration / letter transition | ✅ Living (reuses Sky Moments Scene 5 balloon-burst)         |
| Sky Connection Scene 11 — Letter reveal                  | ✅ Living (reuses Sky Moments Scene 6 letter)                |
| Sky Connection Scene 12 — Gallery unlock                 | ✅ Living (reuses Sky Moments Scene 7 heart-rain)            |
| Sky Connection Scene 13 — Gallery                        | ✅ Living (reuses Sky Moments Scene 8 gallery)               |
| Sky Connection Scene 15 — Photobooth                     | ✅ Living (reuses Sky Moments Scene 9 photobooth · terminal) |

> **Note:** Scene 10 (letter-emergence) and Scene 14 (gallery-ending) are omitted in Sky — Moments 5→9 path has no separate equivalents (balloon covers the letter transition; gallery → photobooth directly).

---

## Notes

- Pattern mirrors Bloom / Warm Connection: thin wrappers over Moments ceremony for 0–2
- Scene 2: three failed taps → shake → advance (Bloom Connection locked-gift reference)
- Scene 3–8: Sky Connection–specific living scenes (Founder scrapbook + Bloom beats)
- **Scenes 9–15:** thin wrappers reusing locked Sky Moments Scene 5–9
  - 9 `celebration-transition` → `SkyBalloonBurstScene` (self-advance ~5s)
  - 11 `letter-reveal` → `SkyLetterScene` (Unlock Memories CTA)
  - 12 `gallery-unlock` → `SkyHeartRainScene` (self-advance ~4s)
  - 13 `gallery` → `SkyGalleryScene` (skip when `?noPhotos=1`)
  - 15 `photobooth` → `SkyPhotoboothScene` (terminal)
- Flow: … → Reveal My Gift → balloon → letter → heart-rain → gallery? → photobooth
- No-photo Lab: `?noPhotos=1` → heart-rain → photobooth
- Additive `lockedOnly` on Sky Moments `gift-opening-scene` — Moments journey unchanged
- Additive `ajar` on `SkyGiftBox` — Moments closed/open unchanged
- Design refs: `design-references/sky/connection/scene-03` … `scene-08-score-reveal-reference.png`
- Fixtures: `features/theme-lab/config/sky-connection-fixtures.ts`
- Host: `features/experience/scene-engine/sky/connection/sky-connection-scene-host.tsx`
