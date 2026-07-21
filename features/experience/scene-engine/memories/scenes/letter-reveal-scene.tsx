"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { LetterScene } from "@/features/experience/scene-engine/moments/scenes/letter-scene";

/**
 * Scene 11 Letter Reveal — reuses Moments Scene 6 letter.
 */
export function MemoriesLetterRevealScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return <LetterScene payload={payload} onComplete={onComplete} />;
}
