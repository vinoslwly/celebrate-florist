"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { CelebrateLoadingScene } from "@/features/experience/scene-engine/moments/scenes/celebrate-loading-scene";

/**
 * Scene 0 — reuses locked Moments celebrate-loading (Founder: same as Moments).
 */
export function ConnectionCelebrateLoadingScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return <CelebrateLoadingScene payload={payload} onComplete={onComplete} />;
}
