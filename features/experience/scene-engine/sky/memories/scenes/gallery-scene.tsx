"use client";

import { SkyConnectionGalleryScene } from "@/features/experience/scene-engine/sky/connection/scenes/gallery-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.gallery — reuses Sky Connection gallery (Moments gallery).
 */
export function SkyMemoriesGalleryScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionGalleryScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
