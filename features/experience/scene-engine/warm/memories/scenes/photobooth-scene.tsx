"use client";

import { WarmConnectionPhotoboothScene } from "@/features/experience/scene-engine/warm/connection/scenes/photobooth-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.photobooth — reuses Warm Connection photobooth.
 */
export function WarmMemoriesPhotoboothScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionPhotoboothScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
