"use client";

import { useState } from "react";

import { FinalRewardHeading } from "@/features/experience/components/final-reward-heading";
import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import { RecipientExperienceShell } from "@/features/experience/components/recipient-experience-shell";
import { rewardLetterToExperienceRow } from "@/features/experience/lib/connection-letter-adapter";
import {
  readConnectionUnlockSession,
  writeConnectionUnlockSession,
} from "@/features/experience/lib/connection-unlock-session";
import type {
  ConnectionGatePayload,
  ConnectionQuizSubmitResult,
} from "@/features/experience/types/connection-gate.types";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { QuizPlayer } from "@/features/quiz/components/quiz-player";
import { QuizScoreResult } from "@/features/quiz/components/quiz-score-result";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";

type ConnectionExperienceFlowProps = {
  gate: ConnectionGatePayload;
  experienceToken: string;
};

export function ConnectionExperienceFlow({
  gate,
  experienceToken,
}: ConnectionExperienceFlowProps) {
  const { experience, theme: themeRow, quiz } = gate;
  const theme = resolveThemeTokens(themeRow);
  const experienceId = experience.id;

  const [unlock, setUnlock] = useState<ConnectionQuizSubmitResult | null>(() =>
    readConnectionUnlockSession(experienceId),
  );

  function handleSubmitSuccess(data: ConnectionQuizSubmitResult) {
    writeConnectionUnlockSession(experienceId, data);
    setUnlock(data);
  }

  const isUnlocked = unlock !== null;

  return (
    <RecipientExperienceShell
      theme={theme}
      greetingName={experience.greeting_name}
    >
      {!isUnlocked ? (
        <QuizPlayer
          experienceToken={experienceToken}
          quiz={quiz}
          onSubmitSuccess={handleSubmitSuccess}
        />
      ) : null}

      {isUnlocked ? (
        <>
          <QuizScoreResult result={unlock.result} />
          <FinalRewardHeading />
          <LetterView
            experience={rewardLetterToExperienceRow(unlock.reward.letter)}
            theme={theme}
          />
          <PhotoGallery photos={unlock.reward.photos} theme={theme} />
          <Photobooth
            greetingName={experience.greeting_name}
            themeEmoji={theme.emoji}
          />
        </>
      ) : null}
    </RecipientExperienceShell>
  );
}
