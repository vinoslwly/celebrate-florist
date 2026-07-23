"use client";

import { WarmConnectionLetterEmergenceScene } from "@/features/experience/scene-engine/warm/connection/scenes/letter-emergence-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.letter-emergence — reuses Warm Connection letter-emergence.
 */
export function WarmMemoriesLetterEmergenceScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionLetterEmergenceScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
