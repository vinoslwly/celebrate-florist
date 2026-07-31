"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyGiftOpeningScene } from "@/features/experience/scene-engine/sky/moments/scenes/gift-opening-scene";

/**
 * Scene 2 Locked Gift — Sky Moments gift-opening with `lockedOnly`.
 * Three failed open taps (shake, no letter), then advances — same as Bloom Connection.
 */
export function SkyConnectionLockedGiftScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return (
    <SkyGiftOpeningScene payload={payload} onComplete={onComplete} lockedOnly />
  );
}
