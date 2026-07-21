"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { LetterTransitionScene } from "@/features/experience/scene-engine/moments/scenes/letter-transition-scene";

/**
 * Scene 9 Memory Transition — reuses Moments Scene 5 letter-transition
 * (origami sakura surge; Founder preference over photo-float / fireworks).
 */
export function MemoriesMemoryTransitionScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return <LetterTransitionScene payload={payload} onComplete={onComplete} />;
}
