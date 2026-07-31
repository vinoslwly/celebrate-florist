"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyPhotoboothScene } from "@/features/experience/scene-engine/sky/moments/scenes/photobooth-scene";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

/**
 * sky.connection.photobooth — Scene 15 (terminal).
 * Reuses Sky Moments Scene 9 photobooth stub (Sprint 14 redesign deferred).
 */
export function SkyConnectionPhotoboothScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return (
    <SkyPhotoboothScene
      payload={payload as SkyMomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
