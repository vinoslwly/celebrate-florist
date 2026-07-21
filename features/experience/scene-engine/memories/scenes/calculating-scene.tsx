"use client";

import { ConnectionScoreCalculationScene } from "@/features/experience/scene-engine/connection/scenes/score-calculation-scene";
import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";

/**
 * Scene 7 Calculating — reuses Connection score-calculation living scene
 * (Founder: use Connection calculating + score reveal).
 */
export function MemoriesCalculatingScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return (
    <ConnectionScoreCalculationScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
