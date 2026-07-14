"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import { rewardLetterToExperienceRow } from "@/features/experience/lib/treasures-letter-adapter";
import type {
  TreasuresGatePayload,
  TreasuresRewardPayload,
} from "@/features/experience/types/treasures-gate.types";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";
import { completeTreasuresJourneyAction } from "@/features/treasures/actions/complete-treasures-journey";
import {
  fetchTreasuresRewardAction,
  openEnvelopeAction,
} from "@/features/treasures/actions/recipient-envelope";
import { EnvelopeContentView } from "@/features/treasures/components/envelope-content-view";
import { EnvelopeGrid } from "@/features/treasures/components/envelope-grid";
import type {
  EnvelopeProgress,
  RecipientEnvelopeContent,
  RecipientEnvelopeGateView,
} from "@/features/treasures/types";

type TreasuresExperienceFlowProps = {
  gate: TreasuresGatePayload;
  experienceToken: string;
  initialReward: TreasuresRewardPayload | null;
};

function mergeOpenProgress(
  view: RecipientEnvelopeGateView,
  sortOrder: number,
  progress: EnvelopeProgress,
): RecipientEnvelopeGateView {
  return {
    ...progress,
    envelopes: view.envelopes.map((shell) =>
      shell.sortOrder === sortOrder ? { ...shell, isOpened: true } : shell,
    ),
  };
}

function displayNumberForSortOrder(
  envelopes: RecipientEnvelopeGateView["envelopes"],
  sortOrder: number,
): number {
  const sorted = [...envelopes].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );
  const index = sorted.findIndex((shell) => shell.sortOrder === sortOrder);
  return index >= 0 ? index + 1 : sortOrder;
}

type TreasuresPhotoboothWithReplayResetProps = {
  experienceToken: string;
  greetingName: string;
  themeEmoji: string;
};

/**
 * CF-R2-A — fires replay reset once when Photobooth first mounts after journey completion.
 * Fire-and-forget; no UI change on success or idempotent no-op.
 */
function TreasuresPhotoboothWithReplayReset({
  experienceToken,
  greetingName,
  themeEmoji,
}: TreasuresPhotoboothWithReplayResetProps) {
  const replayResetTriggeredRef = useRef(false);

  useEffect(() => {
    if (replayResetTriggeredRef.current) {
      return;
    }

    replayResetTriggeredRef.current = true;

    void completeTreasuresJourneyAction({ experienceToken }).then(
      (response) => {
        if (process.env.NODE_ENV === "development" && !response.ok) {
          console.error(
            "[treasures] completeTreasuresJourneyAction:",
            response.error.message,
          );
        }
      },
    );
  }, [experienceToken]);

  return <Photobooth greetingName={greetingName} themeEmoji={themeEmoji} />;
}

export function TreasuresExperienceFlow({
  gate,
  experienceToken,
  initialReward,
}: TreasuresExperienceFlowProps) {
  const { experience, theme: themeRow } = gate;
  const theme = resolveThemeTokens(themeRow);

  const [gateView, setGateView] = useState<RecipientEnvelopeGateView>(
    gate.envelopes,
  );
  const [activeSortOrder, setActiveSortOrder] = useState<number | null>(null);
  const [activeContent, setActiveContent] =
    useState<RecipientEnvelopeContent | null>(null);
  const [reward, setReward] = useState<TreasuresRewardPayload | null>(
    initialReward,
  );
  const [loadingSortOrder, setLoadingSortOrder] = useState<number | null>(null);
  const [rewardLoading, setRewardLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const displayNumber = useMemo(() => {
    if (activeSortOrder === null) {
      return null;
    }

    return displayNumberForSortOrder(gateView.envelopes, activeSortOrder);
  }, [activeSortOrder, gateView.envelopes]);

  async function loadReward() {
    setRewardLoading(true);
    setError(null);

    try {
      const response = await fetchTreasuresRewardAction({ experienceToken });

      if (!response.ok) {
        setError(response.error.message);
        return;
      }

      setReward(response.data);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Something went wrong loading your reward.",
      );
    } finally {
      setRewardLoading(false);
    }
  }

  async function handleOpenEnvelope(sortOrder: number) {
    setLoadingSortOrder(sortOrder);
    setError(null);

    try {
      const response = await openEnvelopeAction({
        experienceToken,
        sortOrder,
      });

      if (!response.ok) {
        setError(response.error.message);
        return;
      }

      const result = response.data;
      setGateView((current) =>
        mergeOpenProgress(current, sortOrder, result.progress),
      );
      setActiveSortOrder(sortOrder);
      setActiveContent(result.content);

      if (result.progress.rewardEligible && reward === null) {
        await loadReward();
      }
    } catch (openError) {
      setError(
        openError instanceof Error
          ? openError.message
          : "Something went wrong opening this envelope.",
      );
    } finally {
      setLoadingSortOrder(null);
    }
  }

  const showReward = gateView.rewardEligible && reward !== null;

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

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      <EnvelopeGrid
        envelopes={gateView.envelopes}
        activeSortOrder={activeSortOrder}
        loadingSortOrder={loadingSortOrder}
        disabled={rewardLoading}
        onOpen={(sortOrder) => void handleOpenEnvelope(sortOrder)}
      />

      {activeContent && displayNumber !== null ? (
        <EnvelopeContentView
          content={activeContent}
          displayNumber={displayNumber}
        />
      ) : null}

      {gateView.rewardEligible && rewardLoading && reward === null ? (
        <p
          className="text-center text-sm text-muted-foreground"
          aria-live="polite"
        >
          Unlocking your letter…
        </p>
      ) : null}

      {showReward ? (
        <>
          <LetterView
            experience={rewardLetterToExperienceRow(reward.letter)}
            theme={theme}
          />
          <PhotoGallery photos={reward.photos} theme={theme} />
          <TreasuresPhotoboothWithReplayReset
            experienceToken={experienceToken}
            greetingName={experience.greeting_name}
            themeEmoji={theme.emoji}
          />
        </>
      ) : null}
    </div>
  );
}
