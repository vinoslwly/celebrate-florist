"use client";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmPhotoboothScene } from "@/features/experience/scene-engine/warm/moments/scenes/photobooth-scene";

/**
 * warm.connection.photobooth — Scene 15 (terminal).
 * Reuses Warm Moments photobooth (Layout B, 3-step flow).
 */
export function WarmConnectionPhotoboothScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return (
    <WarmPhotoboothScene
      payload={payload as MomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
