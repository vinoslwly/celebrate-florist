"use client";

import { CelebrateLoadingScene } from "@/features/experience/scene-engine/moments/scenes/celebrate-loading-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 0 — reuses Moments celebrate-loading
 * (same living beat as Connection / Memories Scene 0).
 */
export function TreasuresCelebrateLoadingScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return <CelebrateLoadingScene payload={payload} onComplete={onComplete} />;
}
