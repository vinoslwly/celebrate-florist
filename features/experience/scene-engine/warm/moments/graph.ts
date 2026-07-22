/**
 * Warm Moments Theme Lab scene graph — presentation only.
 * Mirrors Bloom Moments: album unlock → gallery or photobooth; gallery ending → photobooth.
 */

/** Warm Moments — Theme Lab scenes. */
export const WARM_MOMENTS_INITIAL_SCENE = "warm.moments.celebrate-loading";
export const WARM_MOMENTS_GIFT_BOX_SCENE = "warm.moments.gift-box";
export const WARM_MOMENTS_GIFT_OPENING_SCENE = "warm.moments.gift-opening";
export const WARM_MOMENTS_LETTER_CONFIRMATION_SCENE =
  "warm.moments.letter-confirmation";
export const WARM_MOMENTS_LETTER_TRANSITION_SCENE =
  "warm.moments.letter-transition";
export const WARM_MOMENTS_LETTER_SCENE = "warm.moments.letter";
export const WARM_MOMENTS_ALBUM_UNLOCK_SCENE =
  "warm.moments.album-unlock-transition";
export const WARM_MOMENTS_GALLERY_SCENE = "warm.moments.gallery";
export const WARM_MOMENTS_GALLERY_ENDING_SCENE = "warm.moments.gallery-ending";
export const WARM_MOMENTS_PHOTOBOOTH_SCENE = "warm.moments.photobooth";

export type WarmMomentsLabSceneId =
  | typeof WARM_MOMENTS_INITIAL_SCENE
  | typeof WARM_MOMENTS_GIFT_BOX_SCENE
  | typeof WARM_MOMENTS_GIFT_OPENING_SCENE
  | typeof WARM_MOMENTS_LETTER_CONFIRMATION_SCENE
  | typeof WARM_MOMENTS_LETTER_TRANSITION_SCENE
  | typeof WARM_MOMENTS_LETTER_SCENE
  | typeof WARM_MOMENTS_ALBUM_UNLOCK_SCENE
  | typeof WARM_MOMENTS_GALLERY_SCENE
  | typeof WARM_MOMENTS_GALLERY_ENDING_SCENE
  | typeof WARM_MOMENTS_PHOTOBOOTH_SCENE;

export type WarmMomentsSceneContext = {
  hasPhotos: boolean;
};

/**
 * Resolve the next Warm Moments scene after the current one completes.
 * Gallery skip: album unlock → photobooth when `hasPhotos === false`.
 */
export function resolveNextWarmMomentsScene(
  current: WarmMomentsLabSceneId,
  context: WarmMomentsSceneContext,
): WarmMomentsLabSceneId | null {
  switch (current) {
    case WARM_MOMENTS_INITIAL_SCENE:
      return WARM_MOMENTS_GIFT_BOX_SCENE;
    case WARM_MOMENTS_GIFT_BOX_SCENE:
      return WARM_MOMENTS_GIFT_OPENING_SCENE;
    case WARM_MOMENTS_GIFT_OPENING_SCENE:
      return WARM_MOMENTS_LETTER_CONFIRMATION_SCENE;
    case WARM_MOMENTS_LETTER_CONFIRMATION_SCENE:
      return WARM_MOMENTS_LETTER_TRANSITION_SCENE;
    case WARM_MOMENTS_LETTER_TRANSITION_SCENE:
      return WARM_MOMENTS_LETTER_SCENE;
    case WARM_MOMENTS_LETTER_SCENE:
      return WARM_MOMENTS_ALBUM_UNLOCK_SCENE;
    case WARM_MOMENTS_ALBUM_UNLOCK_SCENE:
      return context.hasPhotos
        ? WARM_MOMENTS_GALLERY_SCENE
        : WARM_MOMENTS_PHOTOBOOTH_SCENE;
    case WARM_MOMENTS_GALLERY_SCENE:
      return WARM_MOMENTS_GALLERY_ENDING_SCENE;
    case WARM_MOMENTS_GALLERY_ENDING_SCENE:
      return WARM_MOMENTS_PHOTOBOOTH_SCENE;
    case WARM_MOMENTS_PHOTOBOOTH_SCENE:
      return null;
    default:
      return null;
  }
}
