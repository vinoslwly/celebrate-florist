import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type {
  TreasuresSceneId,
  TreasuresStaticSceneId,
} from "@/features/experience/scene-engine/treasures/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export type TreasuresScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
};

export type TreasuresSceneProps = {
  payload: TreasuresScenePayload;
  onComplete: () => void;
};

export type TreasuresSceneComponent = (props: TreasuresSceneProps) => ReactNode;

export type TreasuresSceneRegistry = Record<
  TreasuresStaticSceneId,
  TreasuresSceneComponent
>;

export type { TreasuresSceneId };
