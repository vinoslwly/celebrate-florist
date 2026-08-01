"use client";

import { SkyConnectionGiftIntroductionScene } from "@/features/experience/scene-engine/sky/connection/scenes/gift-introduction-scene";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

/**
 * sky.treasures.welcome — Scene 1.
 * Reuses Sky Connection gift-introduction.
 */
export function SkyTreasuresWelcomeScene({
  payload,
  onComplete,
}: SkyTreasuresSceneProps) {
  return (
    <SkyConnectionGiftIntroductionScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
