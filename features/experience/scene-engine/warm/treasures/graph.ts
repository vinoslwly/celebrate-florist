/**
 * Warm Treasures Theme Lab scene graph — Scenes 0–13 (full journey).
 * Scenes 0–2 reuse Warm Connection; 3–8 Warm Treasures–specific;
 * 9–13 reuse Warm Connection living scenes (letter → photobooth).
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */

export const WARM_TREASURES_INITIAL_SCENE =
  "warm.treasures.celebrate-loading" as const;
export const WARM_TREASURES_WELCOME_SCENE = "warm.treasures.welcome" as const;
export const WARM_TREASURES_LOCKED_GIFT_SCENE =
  "warm.treasures.locked-gift" as const;
export const WARM_TREASURES_GIFT_LOCKED_SCENE =
  "warm.treasures.gift-locked" as const;
export const WARM_TREASURES_GIFT_EXPLOSION_SCENE =
  "warm.treasures.gift-explosion" as const;
export const WARM_TREASURES_GIFT_GRID_SCENE =
  "warm.treasures.gift-grid" as const;
export const WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE =
  "warm.treasures.final-gift-unlock" as const;
export const WARM_TREASURES_FINAL_LETTER_SCENE =
  "warm.treasures.final-letter" as const;
export const WARM_TREASURES_BINDER_TRANSITION_SCENE =
  "warm.treasures.binder-transition" as const;
export const WARM_TREASURES_GALLERY_SCENE = "warm.treasures.gallery" as const;
export const WARM_TREASURES_GALLERY_ENDING_SCENE =
  "warm.treasures.gallery-ending" as const;
export const WARM_TREASURES_PHOTOBOOTH_SCENE =
  "warm.treasures.photobooth" as const;

export const WARM_TREASURES_STATIC_SCENE_IDS = [
  WARM_TREASURES_INITIAL_SCENE,
  WARM_TREASURES_WELCOME_SCENE,
  WARM_TREASURES_LOCKED_GIFT_SCENE,
  WARM_TREASURES_GIFT_LOCKED_SCENE,
  WARM_TREASURES_GIFT_EXPLOSION_SCENE,
  WARM_TREASURES_GIFT_GRID_SCENE,
  WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE,
  WARM_TREASURES_FINAL_LETTER_SCENE,
  WARM_TREASURES_BINDER_TRANSITION_SCENE,
  WARM_TREASURES_GALLERY_SCENE,
  WARM_TREASURES_GALLERY_ENDING_SCENE,
  WARM_TREASURES_PHOTOBOOTH_SCENE,
] as const;

export type WarmTreasuresStaticSceneId =
  (typeof WARM_TREASURES_STATIC_SCENE_IDS)[number];

export type WarmTreasuresGiftContentSceneId =
  `warm.treasures.gift-content.${number}`;

export type WarmTreasuresLabSceneId =
  WarmTreasuresStaticSceneId | WarmTreasuresGiftContentSceneId;

export type WarmTreasuresSceneContext = {
  hasPhotos: boolean;
};

export const WARM_TREASURES_SCENE_DURATIONS_MS: Partial<
  Record<WarmTreasuresStaticSceneId, number>
> = {
  [WARM_TREASURES_INITIAL_SCENE]: 2800,
  [WARM_TREASURES_GIFT_EXPLOSION_SCENE]: 3600,
  [WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE]: 3500,
  [WARM_TREASURES_BINDER_TRANSITION_SCENE]: 3000,
  [WARM_TREASURES_GALLERY_ENDING_SCENE]: 1600,
};

export function isWarmTreasuresGiftContentScene(
  sceneId: WarmTreasuresLabSceneId,
): sceneId is WarmTreasuresGiftContentSceneId {
  return sceneId.startsWith("warm.treasures.gift-content.");
}

export function parseWarmTreasuresGiftContentSortOrder(
  sceneId: WarmTreasuresLabSceneId,
): number | null {
  if (!isWarmTreasuresGiftContentScene(sceneId)) return null;
  const raw = sceneId.slice("warm.treasures.gift-content.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

export function warmTreasuresGiftContentSceneId(
  sortOrder: number,
): WarmTreasuresGiftContentSceneId {
  return `warm.treasures.gift-content.${sortOrder}`;
}

/**
 * Resolve next scene.
 * Gift-content back edge is handled in the host (grid vs final-unlock).
 * Gallery skip: binder → photobooth when no photos.
 */
export function resolveNextWarmTreasuresScene(
  current: WarmTreasuresLabSceneId,
  context: WarmTreasuresSceneContext = { hasPhotos: true },
): WarmTreasuresLabSceneId | null {
  if (isWarmTreasuresGiftContentScene(current)) {
    return WARM_TREASURES_GIFT_GRID_SCENE;
  }
  switch (current) {
    case WARM_TREASURES_INITIAL_SCENE:
      return WARM_TREASURES_WELCOME_SCENE;
    case WARM_TREASURES_WELCOME_SCENE:
      return WARM_TREASURES_LOCKED_GIFT_SCENE;
    case WARM_TREASURES_LOCKED_GIFT_SCENE:
      return WARM_TREASURES_GIFT_LOCKED_SCENE;
    case WARM_TREASURES_GIFT_LOCKED_SCENE:
      return WARM_TREASURES_GIFT_EXPLOSION_SCENE;
    case WARM_TREASURES_GIFT_EXPLOSION_SCENE:
      return WARM_TREASURES_GIFT_GRID_SCENE;
    case WARM_TREASURES_GIFT_GRID_SCENE:
      return null;
    case WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE:
      return WARM_TREASURES_FINAL_LETTER_SCENE;
    case WARM_TREASURES_FINAL_LETTER_SCENE:
      return WARM_TREASURES_BINDER_TRANSITION_SCENE;
    case WARM_TREASURES_BINDER_TRANSITION_SCENE:
      return context.hasPhotos
        ? WARM_TREASURES_GALLERY_SCENE
        : WARM_TREASURES_PHOTOBOOTH_SCENE;
    case WARM_TREASURES_GALLERY_SCENE:
      return WARM_TREASURES_GALLERY_ENDING_SCENE;
    case WARM_TREASURES_GALLERY_ENDING_SCENE:
      return WARM_TREASURES_PHOTOBOOTH_SCENE;
    case WARM_TREASURES_PHOTOBOOTH_SCENE:
      return null;
    default:
      return null;
  }
}
