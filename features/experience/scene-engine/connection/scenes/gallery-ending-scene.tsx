"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { GalleryEndingScene } from "@/features/experience/scene-engine/moments/scenes/gallery-ending-scene";

/**
 * connection.gallery-ending — Scene 14.
 * Reuses locked Moments Scene 9 gallery ending.
 */
export function ConnectionGalleryEndingScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return <GalleryEndingScene payload={payload} onComplete={onComplete} />;
}
