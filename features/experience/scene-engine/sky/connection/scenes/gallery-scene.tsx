"use client";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyGalleryScene } from "@/features/experience/scene-engine/sky/moments/scenes/gallery-scene";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

/**
 * sky.connection.gallery — Scene 13.
 * Reuses Sky Moments Scene 8 gallery.
 */
export function SkyConnectionGalleryScene({
  payload,
  onComplete,
}: SkyConnectionSceneProps) {
  return (
    <SkyGalleryScene
      payload={payload as SkyMomentsSceneProps["payload"]}
      onComplete={onComplete}
    />
  );
}
