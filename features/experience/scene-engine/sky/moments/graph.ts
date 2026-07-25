/**
 * Sky Moments Theme Lab scene graph — Scene 1–9 living.
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */

export const SKY_MOMENTS_INITIAL_SCENE = "sky.moments.celebrate-loading";
export const SKY_MOMENTS_GIFT_BOX_SCENE = "sky.moments.gift-box";
export const SKY_MOMENTS_GIFT_OPENING_SCENE = "sky.moments.gift-opening";
export const SKY_MOMENTS_LETTER_CONFIRMATION_SCENE =
  "sky.moments.letter-confirmation";
export const SKY_MOMENTS_BALLOON_BURST_SCENE = "sky.moments.balloon-burst";
export const SKY_MOMENTS_LETTER_SCENE = "sky.moments.letter";
export const SKY_MOMENTS_HEART_RAIN_SCENE = "sky.moments.heart-rain";
export const SKY_MOMENTS_GALLERY_SCENE = "sky.moments.gallery";
/** Terminal scene — Bloom Photobooth wrapper (Sprint 14 redesign deferred). */
export const SKY_MOMENTS_PHOTOBOOTH_SCENE = "sky.moments.photobooth";

export type SkyMomentsLabSceneId =
  | typeof SKY_MOMENTS_INITIAL_SCENE
  | typeof SKY_MOMENTS_GIFT_BOX_SCENE
  | typeof SKY_MOMENTS_GIFT_OPENING_SCENE
  | typeof SKY_MOMENTS_LETTER_CONFIRMATION_SCENE
  | typeof SKY_MOMENTS_BALLOON_BURST_SCENE
  | typeof SKY_MOMENTS_LETTER_SCENE
  | typeof SKY_MOMENTS_HEART_RAIN_SCENE
  | typeof SKY_MOMENTS_GALLERY_SCENE
  | typeof SKY_MOMENTS_PHOTOBOOTH_SCENE;

export type SkyMomentsSceneContext = {
  hasPhotos: boolean;
};

/**
 * Resolve the next Sky Moments scene after the current one completes.
 * Gallery skip: heart-rain → photobooth when `hasPhotos === false`.
 */
export function resolveNextSkyMomentsScene(
  current: SkyMomentsLabSceneId,
  context: SkyMomentsSceneContext,
): SkyMomentsLabSceneId | null {
  switch (current) {
    case SKY_MOMENTS_INITIAL_SCENE:
      return SKY_MOMENTS_GIFT_BOX_SCENE;
    case SKY_MOMENTS_GIFT_BOX_SCENE:
      return SKY_MOMENTS_GIFT_OPENING_SCENE;
    case SKY_MOMENTS_GIFT_OPENING_SCENE:
      return SKY_MOMENTS_LETTER_CONFIRMATION_SCENE;
    case SKY_MOMENTS_LETTER_CONFIRMATION_SCENE:
      return SKY_MOMENTS_BALLOON_BURST_SCENE;
    case SKY_MOMENTS_BALLOON_BURST_SCENE:
      return SKY_MOMENTS_LETTER_SCENE;
    case SKY_MOMENTS_LETTER_SCENE:
      return SKY_MOMENTS_HEART_RAIN_SCENE;
    case SKY_MOMENTS_HEART_RAIN_SCENE:
      return context.hasPhotos
        ? SKY_MOMENTS_GALLERY_SCENE
        : SKY_MOMENTS_PHOTOBOOTH_SCENE;
    case SKY_MOMENTS_GALLERY_SCENE:
      return SKY_MOMENTS_PHOTOBOOTH_SCENE;
    case SKY_MOMENTS_PHOTOBOOTH_SCENE:
      return null;
    default:
      return null;
  }
}
