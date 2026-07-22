# Warm Moments — Theme Lab runtime assets

> Founder screenshot = reference only (`design-references/warm/moments/`).  
> Scene 1 uses atmosphere plate + rose icon; title/tagline remain live HTML.  
> Scene 3 gift motif is **code-built SVG** (`warm-gift-box.tsx`) — no runtime plate.

| File | Role | Consumer |
| ---- | ---- | -------- |
| `scene-01-atmosphere.webp` | Full-bleed Scene 1 background (no baked text) | `celebrate-loading-scene.tsx` |
| `scene-01-rose-icon.png` | Brand rose mark above CELEBRATE (transparent) | `celebrate-loading-scene.tsx` |
| `scene-02-rose-bouquet.png` | Scene 2 rose bouquet accent | `gift-box-scene.tsx` |

Scene 5 (letter-transition / rose rain) is **code-built** — no runtime image files.  
Scene 6 (letter) is **code-built** — hanging cream card on velvet mist; no runtime PNGs.

Removed unused runtime orphans (2026-07-22 Founder follow-up): corner webps, unused rose-icon.webp, unused scene-03 gift plate (SVG replaced plate). Design references outside `public/` retained.
