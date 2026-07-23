"use client";

import { WarmConnectionGalleryEndingScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-ending-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.gallery-ending — reuses Warm Connection gallery-ending.
 */
export function WarmMemoriesGalleryEndingScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionGalleryEndingScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
