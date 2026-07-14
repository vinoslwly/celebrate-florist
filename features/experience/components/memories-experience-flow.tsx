"use client";

import { useState } from "react";

import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
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
        <MatchGamePanel
          experienceToken={experienceToken}
          match={match}
          onSubmitSuccess={handleSubmitSuccess}
        />
      ) : null}

      {isUnlocked ? (
        <>
          <MatchScoreResult result={unlock.result} />

          {unlock.reward.unlockMessage.trim() ? (
            <section
              aria-live="polite"
              className="rounded-2xl border border-border bg-card p-6 text-center space-y-3"
            >
              <h2 className="font-serif text-2xl font-semibold">
                A message for you
              </h2>
              <p className="text-base leading-relaxed whitespace-pre-wrap">
                {unlock.reward.unlockMessage}
              </p>
            </section>
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
    </div>
  );
}
