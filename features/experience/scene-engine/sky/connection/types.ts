import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { SkyConnectionLabSceneId } from "@/features/experience/scene-engine/sky/connection/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export type SkyConnectionScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
};

export type SkyConnectionSceneProps = {
  payload: SkyConnectionScenePayload;
  onComplete: () => void;
};

export type SkyConnectionSceneComponent = (
  props: SkyConnectionSceneProps,
) => ReactNode;

export type { SkyConnectionLabSceneId };
