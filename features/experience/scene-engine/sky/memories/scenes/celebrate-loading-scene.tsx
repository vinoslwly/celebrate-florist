"use client";

import { SkyConnectionCelebrateLoadingScene } from "@/features/experience/scene-engine/sky/connection/scenes/celebrate-loading-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.celebrate-loading — Scene 0.
 * Reuses Sky Connection Scene 0 (same as Warm/Bloom Memories → Connection).
 */
export function SkyMemoriesCelebrateLoadingScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionCelebrateLoadingScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
