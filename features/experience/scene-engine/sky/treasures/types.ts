import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { SkyTreasuresLabSceneId } from "@/features/experience/scene-engine/sky/treasures/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export type SkyTreasuresScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
};

export type SkyTreasuresSceneProps = {
  payload: SkyTreasuresScenePayload;
  onComplete: () => void;
};

export type SkyTreasuresSceneComponent = (
  props: SkyTreasuresSceneProps,
) => ReactNode;

export type { SkyTreasuresLabSceneId };
