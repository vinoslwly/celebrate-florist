import { TreasuresBinderTransitionScene } from "@/features/experience/scene-engine/treasures/scenes/binder-transition-scene";
import { TreasuresCelebrateLoadingScene } from "@/features/experience/scene-engine/treasures/scenes/celebrate-loading-scene";
import { TreasuresFinalGiftUnlockScene } from "@/features/experience/scene-engine/treasures/scenes/final-gift-unlock-scene";
import { TreasuresFinalLetterScene } from "@/features/experience/scene-engine/treasures/scenes/final-letter-scene";
import { TreasuresGalleryEndingScene } from "@/features/experience/scene-engine/treasures/scenes/gallery-ending-scene";
import { TreasuresGalleryScene } from "@/features/experience/scene-engine/treasures/scenes/gallery-scene";
import { TreasuresGiftExplosionScene } from "@/features/experience/scene-engine/treasures/scenes/gift-explosion-scene";
import { TreasuresGiftLockedScene } from "@/features/experience/scene-engine/treasures/scenes/gift-locked-scene";
import { TreasuresLockedGiftScene } from "@/features/experience/scene-engine/treasures/scenes/locked-gift-scene";
import { TreasuresPhotoboothScene } from "@/features/experience/scene-engine/treasures/scenes/photobooth-scene";
import { TreasuresWelcomeScene } from "@/features/experience/scene-engine/treasures/scenes/welcome-scene";
import type { TreasuresSceneRegistry } from "@/features/experience/scene-engine/treasures/types";

/**
 * Static scene registry — gift-grid and gift-content are hosted explicitly
 * (grid needs opened state; content is parameterized by sortOrder).
 */
export const treasuresSceneRegistry: TreasuresSceneRegistry = {
  "treasures.celebrate-loading": TreasuresCelebrateLoadingScene,
  "treasures.welcome": TreasuresWelcomeScene,
  "treasures.locked-gift": TreasuresLockedGiftScene,
  "treasures.gift-locked": TreasuresGiftLockedScene,
  "treasures.gift-explosion": TreasuresGiftExplosionScene,
  /** Hosted by TreasuresSceneHost with opened-state callbacks. */
  "treasures.gift-grid": () => null,
  "treasures.final-gift-unlock": TreasuresFinalGiftUnlockScene,
  "treasures.final-letter": TreasuresFinalLetterScene,
  "treasures.binder-transition": TreasuresBinderTransitionScene,
  "treasures.gallery": TreasuresGalleryScene,
  "treasures.gallery-ending": TreasuresGalleryEndingScene,
  "treasures.photobooth": TreasuresPhotoboothScene,
};
