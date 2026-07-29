# Sky Moments — Scene 1–9

> **Status:** 🔒 **APPROVED AND LOCKED** (Theme Lab · commit `42a6c88`)  
> **Theme Lab:** `/theme-lab/sky`  
> **Production `/e/[token]`:** ⛔ NOT AUTHORIZED  
> **Playful:** ⏸ Not started in this pass

---

## Scene status

| Scene                                     | Status                             |
| ----------------------------------------- | ---------------------------------- |
| Sky Moments Scene 1 — Celebrate loading   | ✅ Living                          |
| Sky Moments Scene 2 — Gift box            | ✅ Living (tap blue doll)          |
| Sky Moments Scene 3 — Gift opening        | ✅ Living (tap gift → letter)      |
| Sky Moments Scene 4 — Letter confirmation | ✅ Living (Yes open / Maybe later) |
| Sky Moments Scene 5 — Balloon burst       | ✅ Living (open gift → balloons)   |
| Sky Moments Scene 6 — Letter              | ✅ Living (Unlock Memories)        |
| Sky Moments Scene 7 — Heart rain          | ✅ Living (auto ~4s)               |
| Sky Moments Scene 8 — Gallery             | ✅ Living (Our Moments scrapbook)  |
| Sky Moments Scene 9 — Photobooth          | ✅ Living (Bloom Photobooth stub)  |

---

## Notes

- Structure mirrors Bloom Moments through letter
- Scene 5: dense light-blue balloon fountain from gift mouth
- Scene 6: scrapbook sky letter + staggered reveal
- Scene 7: soft glass blue/white love rain
- Scene 8: zigzag scrapbook gallery (polaroids, flags, CTA Celebrate This Moment)
- Flow: … → `heart-rain` → `gallery?` → `photobooth` (terminal)
- No-photo Lab: `?noPhotos=1` → skip gallery after heart-rain
- Scene 9: Bloom `Photobooth` component on sky gradient field; camera stays in browser only
- Fast gate: [16_SKY_MOMENTS_FAST_GATE.md](./16_SKY_MOMENTS_FAST_GATE.md)
- Design refs: `design-references/sky/moments/`
- Mobile-light gallery: `whileInView` cards, few ambient stars, no extra font loads / noise filters
