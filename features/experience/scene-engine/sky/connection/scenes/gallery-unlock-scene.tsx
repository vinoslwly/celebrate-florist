"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyHeartRainScene } from "@/features/experience/scene-engine/sky/moments/scenes/heart-rain-scene";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

/**
 * sky.connection.gallery-unlock — Scene 12.
 * Reuses Sky Moments Scene 7 heart-rain (cinematic bridge into gallery).
 * Self-advances via Moments scene timer.
 */
export function SkyConnectionGalleryUnlockScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return (
    <SkyHeartRainScene
      payload={payload as SkyMomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
