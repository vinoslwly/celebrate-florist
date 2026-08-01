"use client";

import { SkyConnectionCelebrateLoadingScene } from "@/features/experience/scene-engine/sky/connection/scenes/celebrate-loading-scene";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

/**
 * sky.treasures.celebrate-loading — Scene 0.
 * Reuses Sky Connection Scene 0.
 */
export function SkyTreasuresCelebrateLoadingScene({
  payload,
  onComplete,
}: SkyTreasuresSceneProps) {
  return (
    <SkyConnectionCelebrateLoadingScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
