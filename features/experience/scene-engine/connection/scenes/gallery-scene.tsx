"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { GalleryScene } from "@/features/experience/scene-engine/moments/scenes/gallery-scene";

/**
 * connection.gallery — Scene 13.
 * Reuses locked Moments Scene 8 gallery.
 */
export function ConnectionGalleryScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return <GalleryScene payload={payload} onComplete={onComplete} />;
}
