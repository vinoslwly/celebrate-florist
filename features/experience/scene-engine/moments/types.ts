import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { MomentsSceneId } from "@/features/experience/scene-engine/moments/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export type MomentsScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
};

export type MomentsSceneProps = {
  payload: MomentsScenePayload;
  onComplete: () => void;
};

export type MomentsSceneComponent = (props: MomentsSceneProps) => ReactNode;

export type MomentsSceneRegistry = Record<
  MomentsSceneId,
  MomentsSceneComponent
>;
