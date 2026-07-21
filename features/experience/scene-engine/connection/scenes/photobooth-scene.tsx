"use client";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { PhotoboothScene } from "@/features/experience/scene-engine/moments/scenes/photobooth-scene";

/**
 * connection.photobooth — Scene 15 (terminal).
 * Reuses locked Moments Scene 10 photobooth placeholder (Sprint 14 redesign deferred).
 */
export function ConnectionPhotoboothScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  return <PhotoboothScene payload={payload} onComplete={onComplete} />;
}
