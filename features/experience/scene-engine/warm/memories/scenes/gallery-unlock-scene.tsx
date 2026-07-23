"use client";

import { WarmConnectionGalleryUnlockScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-unlock-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.gallery-unlock — reuses Warm Connection gallery-unlock.
 */
export function WarmMemoriesGalleryUnlockScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionGalleryUnlockScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
