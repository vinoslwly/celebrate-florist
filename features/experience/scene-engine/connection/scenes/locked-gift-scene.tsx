"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { GiftOpeningScene } from "@/features/experience/scene-engine/moments/scenes/gift-opening-scene";

/**
 * Scene 2 Locked Gift — Moments Scene 3 wrapped keyframe only.
 * Gift does not open (CF-4); three failed open taps, then advances.
 */
export function ConnectionLockedGiftScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return (
    <GiftOpeningScene payload={payload} onComplete={onComplete} lockedOnly />
  );
}
