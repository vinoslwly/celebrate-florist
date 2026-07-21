"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { GalleryScene } from "@/features/experience/scene-engine/moments/scenes/gallery-scene";

/**
 * Scene 13 Gallery — reuses Moments Scene 8 gallery.
 */
export function MemoriesGalleryScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return <GalleryScene payload={payload} onComplete={onComplete} />;
}
