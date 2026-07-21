"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { CelebrateLoadingScene } from "@/features/experience/scene-engine/moments/scenes/celebrate-loading-scene";

/**
 * Scene 0 — reuses Moments celebrate-loading (same as Connection Scene 0).
 */
export function MemoriesCelebrateLoadingScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return <CelebrateLoadingScene payload={payload} onComplete={onComplete} />;
}
