"use client";

import { ConnectionGalleryEndingScene } from "@/features/experience/scene-engine/connection/scenes/gallery-ending-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 12 Gallery Ending — reuses Connection Scene 14 gallery-ending.
 * Wrappers only; Connection stays locked.
 */
export function TreasuresGalleryEndingScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return (
    <ConnectionGalleryEndingScene payload={payload} onComplete={onComplete} />
  );
}
