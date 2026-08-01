"use client";

import { SkyConnectionGalleryScene } from "@/features/experience/scene-engine/sky/connection/scenes/gallery-scene";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

/**
 * sky.treasures.gallery — Scene 11.
 * Reuses Sky Connection gallery (Moments gallery). Skipped when no photos.
 */
export function SkyTreasuresGalleryScene({
  payload,
  onComplete,
}: SkyTreasuresSceneProps) {
  return (
    <SkyConnectionGalleryScene payload={payload} onComplete={onComplete} />
  );
}
