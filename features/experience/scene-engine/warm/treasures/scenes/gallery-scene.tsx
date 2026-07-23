"use client";

import { WarmConnectionGalleryScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.gallery — Scene 11.
 * Reuses Warm Connection gallery. Skipped when no photos.
 */
export function WarmTreasuresGalleryScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionGalleryScene payload={payload} onComplete={onComplete} />
  );
}
