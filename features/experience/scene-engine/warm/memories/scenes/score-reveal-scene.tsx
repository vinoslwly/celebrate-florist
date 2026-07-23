"use client";

import { WarmConnectionScoreRevealScene } from "@/features/experience/scene-engine/warm/connection/scenes/score-reveal-scene";
import type { WarmMemoriesSceneProps } from "@/features/experience/scene-engine/warm/memories/types";
import type { WarmConnectionLabScoreResult } from "@/features/theme-lab/config/warm-connection-fixtures";
import { WARM_MEMORIES_LAB_SCORE_RESULT } from "@/features/theme-lab/config/warm-memories-fixtures";

/**
 * warm.memories.score-reveal — reuses Warm Connection score-reveal.
 */
export function WarmMemoriesScoreRevealScene({
  payload,
  onComplete,
}: WarmMemoriesSceneProps) {
  const scoreResult = (payload.scoreResult ??
    WARM_MEMORIES_LAB_SCORE_RESULT) as WarmConnectionLabScoreResult;

  return (
    <WarmConnectionScoreRevealScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
      }}
      scoreResult={scoreResult}
      onComplete={onComplete}
    />
  );
}
