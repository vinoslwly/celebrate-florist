"use client";

import { WarmConnectionLockedGiftScene } from "@/features/experience/scene-engine/warm/connection/scenes/locked-gift-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.locked-gift — Scene 2.
 * Reuses Warm Connection locked-gift (3 failed open taps).
 * Ceremony slice ends here until Scene 3 (gift-locked) is built.
 */
export function WarmTreasuresLockedGiftScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionLockedGiftScene payload={payload} onComplete={onComplete} />
  );
}
