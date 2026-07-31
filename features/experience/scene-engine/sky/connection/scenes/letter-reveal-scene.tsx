"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyLetterScene } from "@/features/experience/scene-engine/sky/moments/scenes/letter-scene";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

/**
 * sky.connection.letter-reveal — Scene 11.
 * Reuses Sky Moments Scene 6 letter (Unlock Memories CTA).
 */
export function SkyConnectionLetterRevealScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return (
    <SkyLetterScene
      payload={payload as SkyMomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
