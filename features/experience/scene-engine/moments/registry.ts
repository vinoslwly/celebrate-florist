import { AlbumUnlockTransitionScene } from "@/features/experience/scene-engine/moments/scenes/album-unlock-transition-scene";
import { CelebrateLoadingScene } from "@/features/experience/scene-engine/moments/scenes/celebrate-loading-scene";
import { GalleryEndingScene } from "@/features/experience/scene-engine/moments/scenes/gallery-ending-scene";
import { GalleryScene } from "@/features/experience/scene-engine/moments/scenes/gallery-scene";
import { GiftBoxScene } from "@/features/experience/scene-engine/moments/scenes/gift-box-scene";
import { GiftOpeningScene } from "@/features/experience/scene-engine/moments/scenes/gift-opening-scene";
import { LetterConfirmationScene } from "@/features/experience/scene-engine/moments/scenes/letter-confirmation-scene";
import { LetterScene } from "@/features/experience/scene-engine/moments/scenes/letter-scene";
import { LetterTransitionScene } from "@/features/experience/scene-engine/moments/scenes/letter-transition-scene";
import { PhotoboothScene } from "@/features/experience/scene-engine/moments/scenes/photobooth-scene";
import type { MomentsSceneRegistry } from "@/features/experience/scene-engine/moments/types";

export const momentsSceneRegistry: MomentsSceneRegistry = {
  "moments.celebrate-loading": CelebrateLoadingScene,
  "moments.gift-box": GiftBoxScene,
  "moments.gift-opening": GiftOpeningScene,
  "moments.letter-confirmation": LetterConfirmationScene,
  "moments.letter-transition": LetterTransitionScene,
  "moments.letter": LetterScene,
  "moments.album-unlock-transition": AlbumUnlockTransitionScene,
  "moments.gallery": GalleryScene,
  "moments.gallery-ending": GalleryEndingScene,
  "moments.photobooth": PhotoboothScene,
};
