"use client";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import type { WarmConnectionSceneProps } from "@/features/experience/scene-engine/warm/connection/types";
import { WarmLetterScene } from "@/features/experience/scene-engine/warm/moments/scenes/letter-scene";

/**
 * warm.connection.letter-reveal — Scene 11.
 * Reuses Warm Moments letter (Unlock Memories CTA).
 */
export function WarmConnectionLetterRevealScene({
  payload,
  onComplete,
}: WarmConnectionSceneProps) {
  return (
    <WarmLetterScene
      payload={payload as MomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
