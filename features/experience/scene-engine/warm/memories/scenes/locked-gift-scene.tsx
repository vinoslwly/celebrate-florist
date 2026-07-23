"use client";

import { WarmConnectionLockedGiftScene } from "@/features/experience/scene-engine/warm/connection/scenes/locked-gift-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.locked-gift — Scene 2.
 * Reuses Warm Connection locked-gift (3 failed open taps).
 */
export function WarmMemoriesLockedGiftScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionLockedGiftScene payload={payload} onComplete={onComplete} />
  );
}
