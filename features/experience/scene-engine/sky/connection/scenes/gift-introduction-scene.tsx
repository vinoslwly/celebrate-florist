"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyGiftBoxScene } from "@/features/experience/scene-engine/sky/moments/scenes/gift-box-scene";

/** Scene 1 Gift Introduction — reuses Sky Moments gift-box. */
export function SkyConnectionGiftIntroductionScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return <SkyGiftBoxScene payload={payload} onComplete={onComplete} />;
}
