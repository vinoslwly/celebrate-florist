"use client";

import { ConnectionGalleryScene } from "@/features/experience/scene-engine/connection/scenes/gallery-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 11 Gallery — reuses Connection Scene 13 gallery (Moments gallery).
 * Wrappers only; Connection stays locked.
 */
export function TreasuresGalleryScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return <ConnectionGalleryScene payload={payload} onComplete={onComplete} />;
}
