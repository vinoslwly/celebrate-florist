import type { ExperienceMode } from "@/types/database";

import { ConnectionExperience } from "@/features/experience/components/connection-experience";
import { MomentsExperience } from "@/features/experience/components/moments-experience";
import { RecipientModeUnavailable } from "@/features/experience/components/recipient-mode-unavailable";
import type { PublishedExperiencePayload } from "@/features/experience/services/fetch-published-experience.service";
import type { RecipientQuizView } from "@/features/quiz/types";

export type RecipientExperienceRenderProps = {
  mode: ExperienceMode;
  payload: PublishedExperiencePayload;
  experienceToken: string;
  quiz?: RecipientQuizView;
};

export function RecipientExperienceView({
  mode,
  payload,
  experienceToken,
  quiz,
}: RecipientExperienceRenderProps) {
  switch (mode) {
    case "moments":
      return <MomentsExperience payload={payload} />;
    case "connection":
      if (!quiz) {
        return <RecipientModeUnavailable mode={mode} />;
      }
      return (
        <ConnectionExperience
          payload={payload}
          quiz={quiz}
          experienceToken={experienceToken}
        />
      );
    default:
      return <RecipientModeUnavailable mode={mode} />;
  }
}

export function isLiveRecipientMode(
  mode: ExperienceMode,
): mode is "moments" | "connection" {
  return mode === "moments" || mode === "connection";
}
