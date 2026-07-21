"use client";

import { GiftBoxScene } from "@/features/experience/scene-engine/moments/scenes/gift-box-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 1 Welcome — reuses Moments gift-box / flower tap
 * (same as Connection gift-introduction / Memories welcome).
 */
export function TreasuresWelcomeScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return <GiftBoxScene payload={payload} onComplete={onComplete} />;
}
