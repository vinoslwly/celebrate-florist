"use client";

import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGiftOpeningScene } from "@/features/experience/scene-engine/warm/moments/scenes/gift-opening-scene";

/**
 * Scene 2 Locked Gift — Warm Moments gift-opening with `lockedOnly`.
 * Three failed open taps (shake, no letter), then advances — same as Bloom Connection.
 */
export function WarmConnectionLockedGiftScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return (
    <WarmGiftOpeningScene
      payload={payload}
      onComplete={onComplete}
      lockedOnly
    />
  );
}
