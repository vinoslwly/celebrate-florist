"use client";

import { WarmConnectionLetterRevealScene } from "@/features/experience/scene-engine/warm/connection/scenes/letter-reveal-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.letter-reveal — reuses Warm Connection letter-reveal.
 */
export function WarmMemoriesLetterRevealScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionLetterRevealScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
