import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export type SkyMomentsScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
};

export type SkyMomentsSceneProps = {
  payload: SkyMomentsScenePayload;
  onComplete: () => void;
};

export type SkyMomentsSceneComponent = (
  props: SkyMomentsSceneProps,
) => ReactNode;
