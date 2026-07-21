"use client";

import { ConnectionLetterRevealScene } from "@/features/experience/scene-engine/connection/scenes/letter-reveal-scene";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

/**
 * Scene 9 Final Letter — reuses Connection Scene 11 letter-reveal
 * (which reuses Moments letter). Wrappers only; Connection stays locked.
 */
export function TreasuresFinalLetterScene({
  payload,
  onComplete,
}: TreasuresSceneProps) {
  return (
    <ConnectionLetterRevealScene payload={payload} onComplete={onComplete} />
  );
}
