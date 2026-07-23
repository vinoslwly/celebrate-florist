"use client";

import { WarmConnectionGiftIntroductionScene } from "@/features/experience/scene-engine/warm/connection/scenes/gift-introduction-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.welcome — Scene 1.
 * Reuses Warm Connection gift-introduction (Moments flower tap).
 */
export function WarmMemoriesWelcomeScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionGiftIntroductionScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
