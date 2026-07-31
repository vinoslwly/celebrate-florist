"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyCelebrateLoadingScene } from "@/features/experience/scene-engine/sky/moments/scenes/celebrate-loading-scene";

/** Scene 0 — reuses Sky Moments celebrate-loading. */
export function SkyConnectionCelebrateLoadingScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return <SkyCelebrateLoadingScene payload={payload} onComplete={onComplete} />;
}
