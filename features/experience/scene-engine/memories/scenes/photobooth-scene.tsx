"use client";

import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { PhotoboothScene } from "@/features/experience/scene-engine/moments/scenes/photobooth-scene";

/**
 * Scene 15 Photobooth — reuses Moments Scene 10 photobooth
 * (Sprint 14 redesign deferred; same as Connection).
 */
export function MemoriesPhotoboothScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return <PhotoboothScene payload={payload} onComplete={onComplete} />;
}
