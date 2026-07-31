import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { SkyMemoriesLabSceneId } from "@/features/experience/scene-engine/sky/memories/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type { SkyMemoriesLabScoreResult } from "@/features/theme-lab/config/sky-memories-fixtures";

export type SkyMemoriesScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  scoreResult?: SkyMemoriesLabScoreResult;
};

export type SkyMemoriesSceneProps = {
  payload: SkyMemoriesScenePayload;
  onComplete: () => void;
};

export type SkyMemoriesSceneComponent = (
  props: SkyMemoriesSceneProps,
) => ReactNode;

export type { SkyMemoriesLabSceneId };
