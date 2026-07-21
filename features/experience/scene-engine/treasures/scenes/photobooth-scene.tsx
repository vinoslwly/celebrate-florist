"use client";

import { ConnectionPhotoboothScene } from "@/features/experience/scene-engine/connection/scenes/photobooth-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 13 Photobooth — reuses Connection Scene 15 photobooth (Moments).
 * Wrappers only; Connection stays locked. Sprint 14 redesign deferred.
 */
export function TreasuresPhotoboothScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return (
    <ConnectionPhotoboothScene payload={payload} onComplete={onComplete} />
  );
}
