"use client";

import { SkyConnectionLockedGiftScene } from "@/features/experience/scene-engine/sky/connection/scenes/locked-gift-scene";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

/**
 * sky.treasures.locked-gift — Scene 2.
 * Reuses Sky Connection locked-gift (3 failed open taps).
 * Ceremony slice ends here until Scene 3 (gift-locked) is built.
 */
export function SkyTreasuresLockedGiftScene({
  payload,
  onComplete,
}: SkyTreasuresSceneProps) {
  return (
    <SkyConnectionLockedGiftScene payload={payload} onComplete={onComplete} />
  );
}
