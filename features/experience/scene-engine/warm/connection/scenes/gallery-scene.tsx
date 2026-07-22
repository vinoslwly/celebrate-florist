"use client";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGalleryScene } from "@/features/experience/scene-engine/warm/moments/scenes/gallery-scene";

/**
 * warm.connection.gallery — Scene 13.
 * Reuses Warm Moments gallery.
 */
export function WarmConnectionGalleryScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return (
    <WarmGalleryScene
      payload={payload as MomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
