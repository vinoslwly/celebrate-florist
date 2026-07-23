"use client";

import { WarmConnectionGalleryScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.gallery — reuses Warm Connection gallery.
 */
export function WarmMemoriesGalleryScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionGalleryScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
