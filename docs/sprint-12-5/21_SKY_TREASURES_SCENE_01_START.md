# Sky Treasures — Scenes 0–13 (through photobooth)

> **Status:** ✅ **Scenes 0–13 living** · **Fast gate passed** — [22](./22_SKY_TREASURES_FAST_GATE.md) · ready to lock  
> **Theme Lab:** `/theme-lab/sky?mode=treasures`  
> **Production `/e/[token]`:** ⛔ NOT AUTHORIZED  
> **Sky Moments / Connection / Memories:** 🔒 Locked — reused for ceremony head + letter + balloon + gallery + photobooth  
> **Sky Playful:** ⏸ Not started  
> **Full Sky theme audit:** Next after Founder lock + push

---

## Scene status

| Scene                                      | Status                                                            |
| ------------------------------------------ | ----------------------------------------------------------------- |
| Sky Treasures Scene 0 — Celebrate loading  | ✅ Living (reuses Sky Connection Scene 0)                         |
| Sky Treasures Scene 1 — Welcome            | ✅ Living (reuses Sky Connection gift-introduction)               |
| Sky Treasures Scene 2 — Locked gift        | ✅ Living (reuses Sky Connection locked-gift · `lockedOnly`)      |
| Sky Treasures Scene 3 — Gift locked        | ✅ Living (Sky-owned scrapbook · TREASURE MODE · Yes CTA)         |
| Sky Treasures Scenes 4–5 — Gift explosion  | ✅ Living (one beat ~3.6s)                                        |
| Sky Treasures Scene 6 — Gift grid          | ✅ Living (5 sky + **Final Pearl / white** · FD-S11-17 lock)      |
| Sky Treasures Scene 7 — Gift content       | ✅ Living (stationery letter · tap outside → grid)                |
| Sky Treasures Scene 8 — Final gift unlock  | ✅ Living (KF1 pearl glow → KF2 To/From · 3.5s · **no gold**)     |
| Sky Treasures Scene 9 — Final letter       | ✅ Living (reuses Sky Connection letter-reveal · Unlock → binder) |
| Sky Treasures Scene 10 — Binder transition | ✅ Living (**Moments balloon-burst** via Connection celebration)  |
| Sky Treasures Scene 11 — Gallery           | ✅ Living (reuses Moments gallery · skipped when no photos)       |
| Sky Treasures Scene 12 — Gallery ending    | ⏸ Omitted (Sky Moments / Connection path: gallery → photobooth)   |
| Sky Treasures Scene 13 — Photobooth        | ✅ Living (reuses Moments photobooth stub · terminal)             |

---

## Tail flow (Moments Sky)

```
final-letter (Unlock)
  → binder-transition (balloon · ~5s self-advance)
  → gallery (if photos) | photobooth (if no photos)
  → photobooth (terminal)
```

---

## Notes

- Pattern mirrors Bloom / Warm Treasures Theme Lab numbering; **Sky binder = balloon**, not heart-rain unlock
- **Sky difference:** Final Treasure is **pearl white / silver**, not gold
- Scene 8: after Final Pearl Scene 7 dismiss → unlock beat → Scene 9 letter
- `SkyGiftBox` tone: `sky` | `pearl`
- Host: `features/experience/scene-engine/sky/treasures/sky-treasures-scene-host.tsx`
- Architecture SSOT: [04_TREASURES_SCENE_ARCHITECTURE.md](../sprint-11/04_TREASURES_SCENE_ARCHITECTURE.md)
- Lab: `?noPhotos=1` skips gallery (binder → photobooth)
