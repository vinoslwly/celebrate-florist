"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { AlbumUnlockTransitionScene } from "@/features/experience/scene-engine/moments/scenes/album-unlock-transition-scene";

/**
 * connection.gallery-unlock — Scene 12.
 * Reuses locked Moments Scene 7 album unlock transition.
 */
export function ConnectionGalleryUnlockScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return (
    <AlbumUnlockTransitionScene payload={payload} onComplete={onComplete} />
  );
}
