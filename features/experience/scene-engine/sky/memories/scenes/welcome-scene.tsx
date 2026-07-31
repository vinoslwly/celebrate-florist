"use client";

import { SkyConnectionGiftIntroductionScene } from "@/features/experience/scene-engine/sky/connection/scenes/gift-introduction-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.welcome — Scene 1.
 * Reuses Sky Connection gift-introduction (Moments gift-box).
 */
export function SkyMemoriesWelcomeScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionGiftIntroductionScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
