"use client";

import { WarmConnectionCelebrateLoadingScene } from "@/features/experience/scene-engine/warm/connection/scenes/celebrate-loading-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.celebrate-loading — Scene 0.
 * Reuses Warm Connection Scene 0 (same as Bloom Memories → Connection).
 */
export function WarmMemoriesCelebrateLoadingScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionCelebrateLoadingScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
