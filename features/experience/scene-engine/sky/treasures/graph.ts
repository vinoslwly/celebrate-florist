/**
 * Sky Treasures Theme Lab scene graph — Scenes 0–13 (through photobooth).
 * Final Pearl (white) — not gold.
 * Scene 12 gallery-ending omitted (Sky Moments / Connection path: gallery → photobooth).
 * Scene 10 binder uses balloon-burst (Moments), not heart-rain gallery-unlock.
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */

export const SKY_TREASURES_INITIAL_SCENE = "sky.treasures.celebrate-loading";
export const SKY_TREASURES_WELCOME_SCENE = "sky.treasures.welcome";
export const SKY_TREASURES_LOCKED_GIFT_SCENE = "sky.treasures.locked-gift";
export const SKY_TREASURES_GIFT_LOCKED_SCENE = "sky.treasures.gift-locked";
export const SKY_TREASURES_GIFT_EXPLOSION_SCENE =
  "sky.treasures.gift-explosion";
export const SKY_TREASURES_GIFT_GRID_SCENE = "sky.treasures.gift-grid";
export const SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE =
  "sky.treasures.final-gift-unlock";
export const SKY_TREASURES_FINAL_LETTER_SCENE = "sky.treasures.final-letter";
export const SKY_TREASURES_BINDER_TRANSITION_SCENE =
  "sky.treasures.binder-transition";
export const SKY_TREASURES_GALLERY_SCENE = "sky.treasures.gallery";
export const SKY_TREASURES_PHOTOBOOTH_SCENE = "sky.treasures.photobooth";

export const SKY_TREASURES_STATIC_SCENE_IDS = [
  SKY_TREASURES_INITIAL_SCENE,
  SKY_TREASURES_WELCOME_SCENE,
  SKY_TREASURES_LOCKED_GIFT_SCENE,
  SKY_TREASURES_GIFT_LOCKED_SCENE,
  SKY_TREASURES_GIFT_EXPLOSION_SCENE,
  SKY_TREASURES_GIFT_GRID_SCENE,
  SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE,
  SKY_TREASURES_FINAL_LETTER_SCENE,
  SKY_TREASURES_BINDER_TRANSITION_SCENE,
  SKY_TREASURES_GALLERY_SCENE,
  SKY_TREASURES_PHOTOBOOTH_SCENE,
] as const;

export type SkyTreasuresStaticSceneId =
  (typeof SKY_TREASURES_STATIC_SCENE_IDS)[number];

export type SkyTreasuresGiftContentSceneId =
  `sky.treasures.gift-content.${number}`;

export type SkyTreasuresLabSceneId =
  SkyTreasuresStaticSceneId | SkyTreasuresGiftContentSceneId;

export type SkyTreasuresSceneContext = {
  hasPhotos: boolean;
};

/**
 * Timed auto-advance.
 * Binder self-advances via Moments balloon onComplete — not listed.
 * Letter / gallery / photobooth are user-driven.
 */
export const SKY_TREASURES_SCENE_DURATIONS_MS: Partial<
  Record<SkyTreasuresStaticSceneId, number>
> = {
  [SKY_TREASURES_INITIAL_SCENE]: 2800,
  /** Architecture Scenes 4+5 as one beat (~3.6s). */
  [SKY_TREASURES_GIFT_EXPLOSION_SCENE]: 3600,
  /** KF1 1.5s + KF2 2s. */
  [SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE]: 3500,
};

export function isSkyTreasuresGiftContentScene(
  sceneId: SkyTreasuresLabSceneId,
): sceneId is SkyTreasuresGiftContentSceneId {
  return sceneId.startsWith("sky.treasures.gift-content.");
}

export function parseSkyTreasuresGiftContentSortOrder(
  sceneId: SkyTreasuresLabSceneId,
): number | null {
  if (!isSkyTreasuresGiftContentScene(sceneId)) return null;
  const raw = sceneId.slice("sky.treasures.gift-content.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

export function skyTreasuresGiftContentSceneId(
  sortOrder: number,
): SkyTreasuresGiftContentSceneId {
  return `sky.treasures.gift-content.${sortOrder}`;
}

/**
 * Resolve next Sky Treasures scene.
 * Gift-content back edge is handled in the host (grid vs final-unlock).
 * Letter → balloon binder → gallery (or photobooth if no photos) → photobooth.
 */
export function resolveNextSkyTreasuresScene(
  current: SkyTreasuresLabSceneId,
  context: SkyTreasuresSceneContext = { hasPhotos: true },
): SkyTreasuresLabSceneId | null {
  if (isSkyTreasuresGiftContentScene(current)) {
    return SKY_TREASURES_GIFT_GRID_SCENE;
  }
  switch (current) {
    case SKY_TREASURES_INITIAL_SCENE:
      return SKY_TREASURES_WELCOME_SCENE;
    case SKY_TREASURES_WELCOME_SCENE:
      return SKY_TREASURES_LOCKED_GIFT_SCENE;
    case SKY_TREASURES_LOCKED_GIFT_SCENE:
      return SKY_TREASURES_GIFT_LOCKED_SCENE;
    case SKY_TREASURES_GIFT_LOCKED_SCENE:
      return SKY_TREASURES_GIFT_EXPLOSION_SCENE;
    case SKY_TREASURES_GIFT_EXPLOSION_SCENE:
      return SKY_TREASURES_GIFT_GRID_SCENE;
    case SKY_TREASURES_GIFT_GRID_SCENE:
      return null;
    case SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE:
      return SKY_TREASURES_FINAL_LETTER_SCENE;
    case SKY_TREASURES_FINAL_LETTER_SCENE:
      return SKY_TREASURES_BINDER_TRANSITION_SCENE;
    case SKY_TREASURES_BINDER_TRANSITION_SCENE:
      return context.hasPhotos
        ? SKY_TREASURES_GALLERY_SCENE
        : SKY_TREASURES_PHOTOBOOTH_SCENE;
    case SKY_TREASURES_GALLERY_SCENE:
      return SKY_TREASURES_PHOTOBOOTH_SCENE;
    case SKY_TREASURES_PHOTOBOOTH_SCENE:
      return null;
    default:
      return null;
  }
}
