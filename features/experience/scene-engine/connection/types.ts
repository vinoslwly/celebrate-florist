import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type {
  ConnectionSceneId,
  ConnectionStaticSceneId,
} from "@/features/experience/scene-engine/connection/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  BloomConnectionLabQuiz,
  BloomConnectionLabScoreResult,
} from "@/features/theme-lab/config/bloom-connection-fixtures";

export type ConnectionScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  /** Theme Lab / gate quiz — required once Scene 6 is in the journey. */
  quiz?: BloomConnectionLabQuiz;
  /** Theme Lab / submit result — drives Scene 8 score reveal. */
  scoreResult?: BloomConnectionLabScoreResult;
};

export type ConnectionSceneProps = {
  payload: ConnectionScenePayload;
  onComplete: () => void;
};

export type ConnectionSceneComponent = (
  props: ConnectionSceneProps,
) => ReactNode;

export type ConnectionSceneRegistry = Record<
  ConnectionStaticSceneId,
  ConnectionSceneComponent
>;

export type { ConnectionSceneId };
