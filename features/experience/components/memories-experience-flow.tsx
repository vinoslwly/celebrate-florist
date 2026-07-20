"use client";

import { useState } from "react";

import { ExperienceSurfaceCard } from "@/features/experience/components/experience-surface-card";
import { FinalRewardHeading } from "@/features/experience/components/final-reward-heading";
import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import { RecipientExperienceShell } from "@/features/experience/components/recipient-experience-shell";
import { rewardLetterToExperienceRow } from "@/features/experience/lib/memories-letter-adapter";
import {
  readMemoriesUnlockSession,
  writeMemoriesUnlockSession,
} from "@/features/experience/lib/memories-unlock-session";
import type {
  MemoriesGatePayload,
  MemoriesSubmitResult,
} from "@/features/experience/types/memories-gate.types";
import { MatchGamePanel } from "@/features/match/components/match-game-panel";
import { MatchScoreResult } from "@/features/match/components/match-score-result";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";

type MemoriesExperienceFlowProps = {
  gate: MemoriesGatePayload;
  experienceToken: string;
};

export function MemoriesExperienceFlow({
  gate,
  experienceToken,
}: MemoriesExperienceFlowProps) {
  const { experience, theme: themeRow, match } = gate;
  const theme = resolveThemeTokens(themeRow);
  const experienceId = experience.id;

  const [unlock, setUnlock] = useState<MemoriesSubmitResult | null>(() =>
    readMemoriesUnlockSession(experienceId),
  );

  function handleSubmitSuccess(data: MemoriesSubmitResult) {
    writeMemoriesUnlockSession(experienceId, data);
    setUnlock(data);
  }

  const isUnlocked = unlock !== null;

  return (
    <RecipientExperienceShell
      theme={theme}
      greetingName={experience.greeting_name}
    >
      {!isUnlocked ? (
        <MatchGamePanel
          experienceToken={experienceToken}
          match={match}
          onSubmitSuccess={handleSubmitSuccess}
        />
      ) : null}

      {isUnlocked ? (
        <>
          <MatchScoreResult result={unlock.result} />
          <FinalRewardHeading />

          {unlock.reward.unlockMessage.trim() ? (
            <ExperienceSurfaceCard tone="highlight" aria-live="polite">
              <h2 className="font-serif text-2xl font-semibold">
                A message for you
              </h2>
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {unlock.reward.unlockMessage}
              </p>
            </ExperienceSurfaceCard>
          ) : null}

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
