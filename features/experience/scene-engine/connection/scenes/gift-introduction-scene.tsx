"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { GiftBoxScene } from "@/features/experience/scene-engine/moments/scenes/gift-box-scene";

/**
 * Scene 1 Gift Introduction — reuses locked Moments gift-box / flower tap
 * (Founder: same as Moments; no new reference image).
 */
export function ConnectionGiftIntroductionScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return <GiftBoxScene payload={payload} onComplete={onComplete} />;
}
