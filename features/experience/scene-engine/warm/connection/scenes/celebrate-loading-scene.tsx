"use client";

import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmCelebrateLoadingScene } from "@/features/experience/scene-engine/warm/moments/scenes/celebrate-loading-scene";

/** Scene 0 — same as Warm Moments celebrate-loading. */
export function WarmConnectionCelebrateLoadingScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return (
    <WarmCelebrateLoadingScene payload={payload} onComplete={onComplete} />
  );
}
