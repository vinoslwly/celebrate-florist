"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyBalloonBurstScene } from "@/features/experience/scene-engine/sky/moments/scenes/balloon-burst-scene";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

/**
 * sky.connection.celebration-transition — Scene 9.
 * Reuses Sky Moments Scene 5 balloon-burst (letter transition / celebration).
 * Self-advances via Moments scene timer.
 */
export function SkyConnectionCelebrationTransitionScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return (
    <SkyBalloonBurstScene
      payload={payload as SkyMomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
