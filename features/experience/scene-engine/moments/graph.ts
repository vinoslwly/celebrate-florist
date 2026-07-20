/** Sprint 11 Moments scene IDs — presentation layer only. */

export const MOMENTS_SCENE_IDS = [
  "moments.celebrate-loading",
  "moments.gift-box",
  "moments.gift-opening",
  "moments.letter-confirmation",
  "moments.letter-transition",
  "moments.letter",
  "moments.album-unlock-transition",
  "moments.gallery",
  "moments.gallery-ending",
  "moments.photobooth",
] as const;

export type MomentsSceneId = (typeof MOMENTS_SCENE_IDS)[number];

export const MOMENTS_INITIAL_SCENE: MomentsSceneId =
  "moments.celebrate-loading";

/** Logical duration hints (ms) for auto-advance scenes. */
export const MOMENTS_SCENE_DURATIONS_MS: Partial<
  Record<MomentsSceneId, number>
> = {
  "moments.celebrate-loading": 2800,
  /** Dense origami surge must cover the screen before letter. */
  "moments.letter-transition": 3000,
  /** Scene 7: KF1→KF2→KF3 continuous unlock + light burst (~3s). */
  "moments.album-unlock-transition": 3000,
  /** Scene 9: soft closing beat after gallery Celebrate, then photobooth. */
  "moments.gallery-ending": 1600,
};

export type MomentsSceneContext = {
  hasPhotos: boolean;
};

/**
 * Resolve the next Moments scene after the current one completes.
 * Gallery skip: album unlock → photobooth when no photos.
 */
export function resolveNextMomentsScene(
  current: MomentsSceneId,
  context: MomentsSceneContext,
): MomentsSceneId | null {
  switch (current) {
    case "moments.celebrate-loading":
      return "moments.gift-box";
    case "moments.gift-box":
      return "moments.gift-opening";
    case "moments.gift-opening":
      return "moments.letter-confirmation";
    case "moments.letter-confirmation":
      return "moments.letter-transition";
    case "moments.letter-transition":
      return "moments.letter";
    case "moments.letter":
      return "moments.album-unlock-transition";
    case "moments.album-unlock-transition":
      return context.hasPhotos ? "moments.gallery" : "moments.photobooth";
    case "moments.gallery":
      return "moments.gallery-ending";
    case "moments.gallery-ending":
      return "moments.photobooth";
    case "moments.photobooth":
      return null;
    default:
      return null;
  }
}
