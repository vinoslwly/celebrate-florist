import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { WarmMemoriesLabSceneId } from "@/features/experience/scene-engine/warm/memories/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type { WarmMemoriesLabScoreResult } from "@/features/theme-lab/config/warm-memories-fixtures";

export type WarmMemoriesScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  /** Theme Lab score fixture — drives score-reveal (Warm Connection living). */
  scoreResult?: WarmMemoriesLabScoreResult;
};

export type WarmMemoriesSceneProps = {
  payload: WarmMemoriesScenePayload;
  onComplete: () => void;
};

export type WarmMemoriesSceneComponent = (
  props: WarmMemoriesSceneProps,
) => ReactNode;

export type { WarmMemoriesLabSceneId };
