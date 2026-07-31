"use client";

import { SkyConnectionScoreCalculationScene } from "@/features/experience/scene-engine/sky/connection/scenes/score-calculation-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.calculating — reuses Sky Connection score-calculation.
 */
export function SkyMemoriesCalculatingScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionScoreCalculationScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
