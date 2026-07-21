"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { GalleryEndingScene } from "@/features/experience/scene-engine/moments/scenes/gallery-ending-scene";

/**
 * Scene 14 Gallery Ending — reuses Moments Scene 9 gallery ending.
 */
export function MemoriesGalleryEndingScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return <GalleryEndingScene payload={payload} onComplete={onComplete} />;
}
