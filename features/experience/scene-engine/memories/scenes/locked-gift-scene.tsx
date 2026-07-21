"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { GiftOpeningScene } from "@/features/experience/scene-engine/moments/scenes/gift-opening-scene";

/**
 * Scene 2 Locked Gift — Moments wrapped keyframe only (same as Connection).
 * Gift does not open; three failed open taps, then advances.
 */
export function MemoriesLockedGiftScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return (
    <GiftOpeningScene payload={payload} onComplete={onComplete} lockedOnly />
  );
}
