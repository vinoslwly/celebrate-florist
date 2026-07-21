import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type {
  MemoriesSceneId,
  MemoriesStaticSceneId,
} from "@/features/experience/scene-engine/memories/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  BloomMemoriesLabMatch,
  BloomMemoriesLabScoreResult,
} from "@/features/theme-lab/config/bloom-memories-fixtures";

export type MemoriesScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  /** Theme Lab / gate match — required once Scene 6 is in the journey. */
  match?: BloomMemoriesLabMatch;
  /** Theme Lab score fixture — drives Scene 8 (Connection score-reveal shape). */
  scoreResult?: BloomMemoriesLabScoreResult;
};

export type MemoriesSceneProps = {
  payload: MemoriesScenePayload;
  onComplete: () => void;
};

export type MemoriesSceneComponent = (props: MemoriesSceneProps) => ReactNode;

export type MemoriesSceneRegistry = Record<
  MemoriesStaticSceneId,
  MemoriesSceneComponent
>;

export type { MemoriesSceneId };
