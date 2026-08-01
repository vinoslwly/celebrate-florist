"use client";

import { SkyConnectionCelebrationTransitionScene } from "@/features/experience/scene-engine/sky/connection/scenes/celebration-transition-scene";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

/**
 * sky.treasures.binder-transition — Scene 10.
 * Sky Moments path: balloon-burst (Connection celebration), not heart-rain unlock.
 * Self-advances via Moments scene timer.
 */
export function SkyTreasuresBinderTransitionScene({
  payload,
  onComplete,
}: SkyTreasuresSceneProps) {
  return (
    <SkyConnectionCelebrationTransitionScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
