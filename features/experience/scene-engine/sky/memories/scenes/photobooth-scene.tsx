"use client";

import { SkyConnectionPhotoboothScene } from "@/features/experience/scene-engine/sky/connection/scenes/photobooth-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.photobooth — terminal · reuses Sky Connection photobooth
 * (Moments photobooth).
 */
export function SkyMemoriesPhotoboothScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionPhotoboothScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
