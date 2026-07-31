"use client";

import { SkyConnectionScoreRevealScene } from "@/features/experience/scene-engine/sky/connection/scenes/score-reveal-scene";
import type { SkyMemoriesSceneProps } from "@/features/experience/scene-engine/sky/memories/types";
import type { SkyConnectionLabScoreResult } from "@/features/theme-lab/config/sky-connection-fixtures";
import { SKY_MEMORIES_LAB_SCORE_RESULT } from "@/features/theme-lab/config/sky-memories-fixtures";

/**
 * sky.memories.score-reveal — reuses Sky Connection score-reveal.
 */
export function SkyMemoriesScoreRevealScene({
  payload,
  onComplete,
}: SkyMemoriesSceneProps) {
  const scoreResult = (payload.scoreResult ??
    SKY_MEMORIES_LAB_SCORE_RESULT) as SkyConnectionLabScoreResult;

  return (
    <SkyConnectionScoreRevealScene
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
