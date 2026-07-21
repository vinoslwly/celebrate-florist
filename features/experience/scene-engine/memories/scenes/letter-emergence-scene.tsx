"use client";

import { ConnectionLetterEmergenceScene } from "@/features/experience/scene-engine/connection/scenes/letter-emergence-scene";
import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";

/**
 * Scene 10 Letter Emergence — reuses Connection Scene 10 letter-emergence
 * (gift open + To/From head · ~1.4s).
 * (Founder: extra transition before Memories letter-reveal).
 */
export function MemoriesLetterEmergenceScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return (
    <ConnectionLetterEmergenceScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
