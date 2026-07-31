"use client";

import { SkyConnectionCelebrationTransitionScene } from "@/features/experience/scene-engine/sky/connection/scenes/celebration-transition-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.celebration-transition — reuses Sky Connection celebration
 * (Moments balloon-burst).
 */
export function SkyMemoriesCelebrationTransitionScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionCelebrationTransitionScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
