"use client";

import { ConnectionChallengeInvitationScene } from "@/features/experience/scene-engine/connection/scenes/challenge-invitation-scene";
import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";

/**
 * Scene 3 Gift Locked — reuses Connection challenge-invitation living scene
 * (Founder: Scenes 0–3 same as Connection; visual + copy as-is).
 */
export function MemoriesGiftLockedScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  return (
    <ConnectionChallengeInvitationScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      onComplete={onComplete}
    />
  );
}
