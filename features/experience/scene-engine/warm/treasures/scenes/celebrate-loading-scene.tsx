"use client";

import { WarmConnectionCelebrateLoadingScene } from "@/features/experience/scene-engine/warm/connection/scenes/celebrate-loading-scene";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

/**
 * warm.treasures.celebrate-loading — Scene 0.
 * Reuses Warm Connection Scene 0 (same ceremony as Memories).
 */
export function WarmTreasuresCelebrateLoadingScene({
  payload,
  onComplete,
}: WarmTreasuresSceneProps) {
  return (
    <WarmConnectionCelebrateLoadingScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
