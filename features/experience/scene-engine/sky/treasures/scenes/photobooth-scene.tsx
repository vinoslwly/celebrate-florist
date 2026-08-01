"use client";

import { SkyConnectionPhotoboothScene } from "@/features/experience/scene-engine/sky/connection/scenes/photobooth-scene";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

/**
 * sky.treasures.photobooth — Scene 13 (terminal).
 * Reuses Sky Connection photobooth (Moments photobooth stub · Sprint 14 deferred).
 */
export function SkyTreasuresPhotoboothScene({
  payload,
  onComplete,
}: SkyTreasuresSceneProps) {
  return (
    <SkyConnectionPhotoboothScene payload={payload} onComplete={onComplete} />
  );
}
