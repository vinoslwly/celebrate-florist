"use client";

import { WarmConnectionCelebrationTransitionScene } from "@/features/experience/scene-engine/warm/connection/scenes/celebration-transition-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.celebration-transition — reuses Warm Connection celebration.
 */
export function WarmMemoriesCelebrationTransitionScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionCelebrationTransitionScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
