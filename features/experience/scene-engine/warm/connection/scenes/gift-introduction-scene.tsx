"use client";

import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmGiftBoxScene } from "@/features/experience/scene-engine/warm/moments/scenes/gift-box-scene";

/** Scene 1 Gift Introduction — same as Warm Moments gift-box. */
export function WarmConnectionGiftIntroductionScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return <WarmGiftBoxScene payload={payload} onComplete={onComplete} />;
}
