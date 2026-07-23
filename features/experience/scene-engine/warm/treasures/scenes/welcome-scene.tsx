"use client";

import { WarmConnectionGiftIntroductionScene } from "@/features/experience/scene-engine/warm/connection/scenes/gift-introduction-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.welcome — Scene 1.
 * Reuses Warm Connection gift-introduction (Moments flower tap).
 */
export function WarmTreasuresWelcomeScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionGiftIntroductionScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
