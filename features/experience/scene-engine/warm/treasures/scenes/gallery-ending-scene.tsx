"use client";

import { WarmConnectionGalleryEndingScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-ending-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.gallery-ending — Scene 12.
 * Reuses Warm Connection gallery-ending.
 */
export function WarmTreasuresGalleryEndingScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionGalleryEndingScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
