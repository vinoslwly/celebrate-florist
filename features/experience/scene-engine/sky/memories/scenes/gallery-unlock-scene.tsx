"use client";

import { SkyConnectionGalleryUnlockScene } from "@/features/experience/scene-engine/sky/connection/scenes/gallery-unlock-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.gallery-unlock — reuses Sky Connection gallery-unlock
 * (Moments heart-rain).
 */
export function SkyMemoriesGalleryUnlockScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionGalleryUnlockScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
