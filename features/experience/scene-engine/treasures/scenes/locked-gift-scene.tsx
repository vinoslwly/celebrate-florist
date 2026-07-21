"use client";

import { GiftOpeningScene } from "@/features/experience/scene-engine/moments/scenes/gift-opening-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 2 Locked Gift — Moments wrapped keyframe only
 * (same as Connection / Memories). Gift does not open; three failed taps, then advances.
 */
export function TreasuresLockedGiftScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return (
    <GiftOpeningScene payload={payload} onComplete={onComplete} lockedOnly />
  );
}
