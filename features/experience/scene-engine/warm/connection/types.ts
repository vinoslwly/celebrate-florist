import type { ReactNode } from "react";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import type { WarmConnectionLabSceneId } from "@/features/experience/scene-engine/warm/connection/graph";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export type WarmConnectionScenePayload = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
};

export type WarmConnectionSceneProps = {
  payload: WarmConnectionScenePayload;
  onComplete: () => void;
};

export type WarmConnectionSceneComponent = (
  props: WarmConnectionSceneProps,
) => ReactNode;

export type { WarmConnectionLabSceneId };
