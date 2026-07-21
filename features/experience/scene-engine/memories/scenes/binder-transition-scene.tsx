"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { AlbumUnlockTransitionScene } from "@/features/experience/scene-engine/moments/scenes/album-unlock-transition-scene";

/**
 * Scene 12 Binder Transition — reuses Moments Scene 7 album-unlock
 * (Founder: letter→photobooth reuse Moments 6+).
 */
export function MemoriesBinderTransitionScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return (
    <AlbumUnlockTransitionScene payload={payload} onComplete={onComplete} />
  );
}
