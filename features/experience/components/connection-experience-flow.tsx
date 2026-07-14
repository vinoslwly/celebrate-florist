"use client";

import { useState } from "react";

import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
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
    <div className="relative mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-40 opacity-15 ${theme.accentClassName}`}
        aria-hidden
      />
      <header className="relative text-center">
        <p className="text-4xl" aria-hidden>
          {theme.emoji}
        </p>
        <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
          {theme.name} · A gift for you
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">
          {experience.greeting_name}
        </h1>
      </header>

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
    </div>
  );
}
