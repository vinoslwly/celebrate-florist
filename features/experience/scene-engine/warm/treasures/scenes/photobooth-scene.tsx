"use client";

import { WarmConnectionPhotoboothScene } from "@/features/experience/scene-engine/warm/connection/scenes/photobooth-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.photobooth — Scene 13 (terminal).
 * Reuses Warm Connection photobooth (Layout B, 3-step flow).
 */
export function WarmTreasuresPhotoboothScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionPhotoboothScene payload={payload} onComplete={onComplete} />
  );
}
