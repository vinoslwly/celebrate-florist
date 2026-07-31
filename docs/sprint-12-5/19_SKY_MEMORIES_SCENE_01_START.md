# Sky Memories — full Theme Lab journey

> **Status:** ✅ **Living through photobooth**  
> **Theme Lab:** `/theme-lab/sky?mode=memories`  
> **Production `/e/[token]`:** ⛔ NOT AUTHORIZED  
> **Sky Moments / Connection:** 🔒 Locked — reused for ceremony + reward tail  
> **Sky Treasures / Playful:** ⏸ Not started

---

## Scene status

| Scene                            | Status                                                                    |
| -------------------------------- | ------------------------------------------------------------------------- |
| Scene 0 — Celebrate loading      | ✅ Living (reuses Sky Connection Scene 0)                                 |
| Scene 1 — Welcome                | ✅ Living (reuses Sky Connection gift-introduction)                       |
| Scene 2 — Locked gift            | ✅ Living (reuses Sky Connection locked-gift · `lockedOnly`)              |
| Scene 3 — Gift locked            | ✅ Living (reuses Sky Connection challenge-invitation)                    |
| Scene 4 — Match transition       | ✅ Living (MEMORY MATCH! · Quiz Time parity · auto ~2.5s)                 |
| Scene 5 — Match intro            | ✅ Living (scrapbook gate · Start CTA)                                    |
| Scene 6 — Match gameplay         | ✅ Living (`match.memory.{n}` · 4 pairs · Warm mechanics · Sky Quiz look) |
| Scene 7 — Calculating            | ✅ Living (reuses Sky Connection score-calculation)                       |
| Scene 8 — Score reveal           | ✅ Living (reuses Sky Connection score-reveal)                            |
| Scene 9 — Celebration transition | ✅ Living (reuses Sky Connection celebration → Moments balloon)           |
| Scene 10 — Letter reveal         | ✅ Living (reuses Sky Connection letter → Moments letter)                 |
| Scene 11 — Gallery unlock        | ✅ Living (reuses Sky Connection unlock → Moments heart-rain)             |
| Scene 12 — Gallery               | ✅ Living (reuses Sky Connection gallery)                                 |
| Scene 13 — Photobooth            | ✅ Living (terminal · reuses Sky Connection photobooth)                   |

---

## Notes

- Pattern mirrors Warm Memories: Connection wrappers for ceremony + reward tail; Memories-owned match middle
- **Skipped vs Warm/Bloom:** `letter-emergence` and `gallery-ending` — not present on Sky Connection (deferred parity); path matches Sky Connection’s own reward tail
- Gallery skip: unlock → photobooth when `?noPhotos=1`
- After last memory → calculating (~2s) → score reveal → …
- Host: `features/experience/scene-engine/sky/memories/sky-memories-scene-host.tsx`
- Architecture SSOT: [03_MEMORIES_SCENE_ARCHITECTURE.md](../sprint-11/03_MEMORIES_SCENE_ARCHITECTURE.md)
