import { ConnectionCelebrateLoadingScene } from "@/features/experience/scene-engine/connection/scenes/celebrate-loading-scene";
import { ConnectionCelebrationTransitionScene } from "@/features/experience/scene-engine/connection/scenes/celebration-transition-scene";
import { ConnectionChallengeInvitationScene } from "@/features/experience/scene-engine/connection/scenes/challenge-invitation-scene";
import { ConnectionGalleryEndingScene } from "@/features/experience/scene-engine/connection/scenes/gallery-ending-scene";
import { ConnectionGalleryScene } from "@/features/experience/scene-engine/connection/scenes/gallery-scene";
import { ConnectionGalleryUnlockScene } from "@/features/experience/scene-engine/connection/scenes/gallery-unlock-scene";
import { ConnectionGiftIntroductionScene } from "@/features/experience/scene-engine/connection/scenes/gift-introduction-scene";
import { ConnectionLetterEmergenceScene } from "@/features/experience/scene-engine/connection/scenes/letter-emergence-scene";
import { ConnectionLetterRevealScene } from "@/features/experience/scene-engine/connection/scenes/letter-reveal-scene";
import { ConnectionLockedGiftScene } from "@/features/experience/scene-engine/connection/scenes/locked-gift-scene";
import { ConnectionPhotoboothScene } from "@/features/experience/scene-engine/connection/scenes/photobooth-scene";
import { ConnectionQuizIntroductionScene } from "@/features/experience/scene-engine/connection/scenes/quiz-introduction-scene";
import { ConnectionQuizTransitionScene } from "@/features/experience/scene-engine/connection/scenes/quiz-transition-scene";
import { ConnectionScoreCalculationScene } from "@/features/experience/scene-engine/connection/scenes/score-calculation-scene";
import { ConnectionScoreRevealScene } from "@/features/experience/scene-engine/connection/scenes/score-reveal-scene";
import type { ConnectionSceneRegistry } from "@/features/experience/scene-engine/connection/types";

export const connectionSceneRegistry: ConnectionSceneRegistry = {
  "connection.celebrate-loading": ConnectionCelebrateLoadingScene,
  "connection.gift-introduction": ConnectionGiftIntroductionScene,
  "connection.locked-gift": ConnectionLockedGiftScene,
  "connection.challenge-invitation": ConnectionChallengeInvitationScene,
  "connection.quiz-transition": ConnectionQuizTransitionScene,
  "connection.quiz-introduction": ConnectionQuizIntroductionScene,
  "connection.score-calculation": ConnectionScoreCalculationScene,
  "connection.score-reveal": ConnectionScoreRevealScene,
  "connection.celebration-transition": ConnectionCelebrationTransitionScene,
  "connection.letter-emergence": ConnectionLetterEmergenceScene,
  "connection.letter-reveal": ConnectionLetterRevealScene,
  "connection.gallery-unlock": ConnectionGalleryUnlockScene,
  "connection.gallery": ConnectionGalleryScene,
  "connection.gallery-ending": ConnectionGalleryEndingScene,
  "connection.photobooth": ConnectionPhotoboothScene,
};
