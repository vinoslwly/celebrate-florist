"use client";

import { ConnectionGalleryUnlockScene } from "@/features/experience/scene-engine/connection/scenes/gallery-unlock-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 10 Binder Transition — reuses Connection Scene 12 gallery-unlock
 * (Moments album-unlock). Wrappers only; Connection stays locked.
 */
export function TreasuresBinderTransitionScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return (
    <ConnectionGalleryUnlockScene payload={payload} onComplete={onComplete} />
  );
}
