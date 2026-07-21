"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { LetterScene } from "@/features/experience/scene-engine/moments/scenes/letter-scene";

/**
 * connection.letter-reveal — Scene 11.
 * Reuses locked Moments Scene 6 letter (Founder: same as Moments).
 */
export function ConnectionLetterRevealScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return <LetterScene payload={payload} onComplete={onComplete} />;
}
