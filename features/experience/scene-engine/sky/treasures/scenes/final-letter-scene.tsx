"use client";

import { SkyConnectionLetterRevealScene } from "@/features/experience/scene-engine/sky/connection/scenes/letter-reveal-scene";
import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

/**
 * sky.treasures.final-letter — Scene 9.
 * Reuses Sky Connection letter-reveal (Moments letter living).
 */
export function SkyTreasuresFinalLetterScene({
  payload,
  onComplete,
}: SkyTreasuresSceneProps) {
  return (
    <SkyConnectionLetterRevealScene
      payload={payload as SkyConnectionSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
