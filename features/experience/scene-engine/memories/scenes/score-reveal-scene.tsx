"use client";

import { ConnectionScoreRevealScene } from "@/features/experience/scene-engine/connection/scenes/score-reveal-scene";
import type { MemoriesSceneProps } from "@/features/experience/scene-engine/memories/types";
import { BLOOM_CONNECTION_LAB_SCORE_RESULT } from "@/features/theme-lab/config/bloom-connection-fixtures";

/**
 * Scene 8 Score Reveal — reuses Connection score-reveal living scene
 * (Founder: use Connection calculating + score reveal as-is).
 */
export function MemoriesScoreRevealScene({
  payload,
  onComplete,
}: MemoriesSceneProps) {
  const scoreResult = payload.scoreResult
    ? {
        percent: payload.scoreResult.percent,
        headline: payload.scoreResult.headline,
        message: payload.scoreResult.message,
      }
    : BLOOM_CONNECTION_LAB_SCORE_RESULT;

  return (
    <ConnectionScoreRevealScene
      payload={{
        experience: payload.experience,
        photos: payload.photos,
        theme: payload.theme,
        scoreResult: scoreResult as typeof BLOOM_CONNECTION_LAB_SCORE_RESULT,
      }}
      onComplete={onComplete}
    />
  );
}
