"use client";

import { WarmConnectionGalleryUnlockScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-unlock-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.binder-transition — Scene 10.
 * Reuses Warm Connection gallery-unlock (Moments album-unlock).
 */
export function WarmTreasuresBinderTransitionScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionGalleryUnlockScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
