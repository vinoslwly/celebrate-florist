"use client";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmAlbumUnlockTransitionScene } from "@/features/experience/scene-engine/warm/moments/scenes/album-unlock-transition-scene";

/**
 * warm.connection.gallery-unlock — Scene 12.
 * Reuses Warm Moments album unlock transition.
 */
export function WarmConnectionGalleryUnlockScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return (
    <WarmAlbumUnlockTransitionScene
      payload={payload as MomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
