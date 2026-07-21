"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { GiftBoxScene } from "@/features/experience/scene-engine/moments/scenes/gift-box-scene";

/**
 * Scene 1 Welcome — reuses Moments gift-box / flower tap
 * (same as Connection gift-introduction; Founder: same living beat).
 */
export function MemoriesWelcomeScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return <GiftBoxScene payload={payload} onComplete={onComplete} />;
}
