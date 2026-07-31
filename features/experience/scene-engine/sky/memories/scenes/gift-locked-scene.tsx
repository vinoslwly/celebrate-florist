"use client";

import { SkyConnectionChallengeInvitationScene } from "@/features/experience/scene-engine/sky/connection/scenes/challenge-invitation-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";

/**
 * sky.memories.gift-locked — Scene 3.
 * Reuses Sky Connection challenge-invitation (Founder: same as Connection).
 */
export function SkyMemoriesGiftLockedScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  return (
    <SkyConnectionChallengeInvitationScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
