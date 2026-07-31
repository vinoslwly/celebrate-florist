"use client";

import { SkyConnectionLetterRevealScene } from "@/features/experience/scene-engine/sky/connection/scenes/letter-reveal-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.letter-reveal — reuses Sky Connection letter-reveal
 * (Moments letter).
 */
export function SkyMemoriesLetterRevealScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionLetterRevealScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
