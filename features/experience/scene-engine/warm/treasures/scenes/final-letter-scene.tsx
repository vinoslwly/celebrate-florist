"use client";

import { WarmConnectionLetterRevealScene } from "@/features/experience/scene-engine/warm/connection/scenes/letter-reveal-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.final-letter — Scene 9.
 * Reuses Warm Connection letter-reveal (Moments letter living).
 */
export function WarmTreasuresFinalLetterScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionLetterRevealScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
