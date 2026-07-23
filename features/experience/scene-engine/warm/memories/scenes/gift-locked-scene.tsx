"use client";

import { WarmConnectionChallengeInvitationScene } from "@/features/experience/scene-engine/warm/connection/scenes/challenge-invitation-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";

/**
 * warm.memories.gift-locked — Scene 3.
 * Reuses Warm Connection challenge-invitation (Founder: same as Connection).
 */
export function WarmMemoriesGiftLockedScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  return (
    <WarmConnectionChallengeInvitationScene
      payload={payload}
      onComplete={onComplete}
    />
  );
}
