"use client";

import { WarmConnectionScoreCalculationScene } from "@/features/experience/scene-engine/warm/connection/scenes/score-calculation-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.calculating — reuses Warm Connection score-calculation.
 */
export function WarmMemoriesCalculatingScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionScoreCalculationScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
