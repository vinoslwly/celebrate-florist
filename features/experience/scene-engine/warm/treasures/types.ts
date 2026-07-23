import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { WarmTreasuresLabSceneId } from "@/features/experience/scene-engine/warm/treasures/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export type WarmTreasuresScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
};

export type WarmTreasuresSceneProps = {
  payload: WarmTreasuresScenePayload;
  onComplete: () => void;
};

export type WarmTreasuresSceneComponent = (
  props: WarmTreasuresSceneProps,
) => ReactNode;

export type { WarmTreasuresLabSceneId };
