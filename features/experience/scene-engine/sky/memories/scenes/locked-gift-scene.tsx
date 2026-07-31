"use client";

import { SkyConnectionLockedGiftScene } from "@/features/experience/scene-engine/sky/connection/scenes/locked-gift-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.locked-gift — Scene 2.
 * Reuses Sky Connection locked-gift (3 failed open taps).
 */
export function SkyMemoriesLockedGiftScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionLockedGiftScene payload={payload} onComplete={onComplete} />
  );
}
