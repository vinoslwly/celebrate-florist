"use client";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGalleryEndingScene } from "@/features/experience/scene-engine/warm/moments/scenes/gallery-ending-scene";

/**
 * warm.connection.gallery-ending — Scene 14.
 * Reuses Warm Moments gallery ending.
 */
export function WarmConnectionGalleryEndingScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return (
    <WarmGalleryEndingScene
      payload={payload as MomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
