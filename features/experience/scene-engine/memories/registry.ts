import { MemoriesBinderTransitionScene } from "@/features/experience/scene-engine/memories/scenes/binder-transition-scene";
import { MemoriesCalculatingScene } from "@/features/experience/scene-engine/memories/scenes/calculating-scene";
import { MemoriesCelebrateLoadingScene } from "@/features/experience/scene-engine/memories/scenes/celebrate-loading-scene";
import { MemoriesGalleryEndingScene } from "@/features/experience/scene-engine/memories/scenes/gallery-ending-scene";
import { MemoriesGalleryScene } from "@/features/experience/scene-engine/memories/scenes/gallery-scene";
import { MemoriesGiftLockedScene } from "@/features/experience/scene-engine/memories/scenes/gift-locked-scene";
import { MemoriesLetterEmergenceScene } from "@/features/experience/scene-engine/memories/scenes/letter-emergence-scene";
import { MemoriesLetterRevealScene } from "@/features/experience/scene-engine/memories/scenes/letter-reveal-scene";
import { MemoriesLockedGiftScene } from "@/features/experience/scene-engine/memories/scenes/locked-gift-scene";
import { MemoriesMatchIntroScene } from "@/features/experience/scene-engine/memories/scenes/match-intro-scene";
import { MemoriesMatchTransitionScene } from "@/features/experience/scene-engine/memories/scenes/match-transition-scene";
import { MemoriesMemoryTransitionScene } from "@/features/experience/scene-engine/memories/scenes/memory-transition-scene";
import { MemoriesPhotoboothScene } from "@/features/experience/scene-engine/memories/scenes/photobooth-scene";
import { MemoriesScoreRevealScene } from "@/features/experience/scene-engine/memories/scenes/score-reveal-scene";
import { MemoriesWelcomeScene } from "@/features/experience/scene-engine/memories/scenes/welcome-scene";
import type { MemoriesSceneRegistry } from "@/features/experience/scene-engine/memories/types";

export const memoriesSceneRegistry: MemoriesSceneRegistry = {
  "memories.celebrate-loading": MemoriesCelebrateLoadingScene,
  "memories.welcome": MemoriesWelcomeScene,
  "memories.locked-gift": MemoriesLockedGiftScene,
  "memories.gift-locked": MemoriesGiftLockedScene,
  "memories.match-transition": MemoriesMatchTransitionScene,
  "memories.match-intro": MemoriesMatchIntroScene,
  "memories.calculating": MemoriesCalculatingScene,
  "memories.score-reveal": MemoriesScoreRevealScene,
  "memories.memory-transition": MemoriesMemoryTransitionScene,
  "memories.letter-emergence": MemoriesLetterEmergenceScene,
  "memories.letter-reveal": MemoriesLetterRevealScene,
  "memories.binder-transition": MemoriesBinderTransitionScene,
  "memories.gallery": MemoriesGalleryScene,
  "memories.gallery-ending": MemoriesGalleryEndingScene,
  "memories.photobooth": MemoriesPhotoboothScene,
};
