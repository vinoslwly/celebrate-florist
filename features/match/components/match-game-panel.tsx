"use client";

import { useMemo, useState } from "react";

import type {
  MemoriesGateMatchView,
  MemoriesSubmitResult,
} from "@/features/experience/types/memories-gate.types";
import { submitMatchAnswersAction } from "@/features/match/actions/recipient-match";
import { MatchSubmitFooter } from "@/features/match/components/match-submit-footer";
import { StoryCard } from "@/features/match/components/story-card";
import type { MatchAnswerSubmission } from "@/features/match/types";

type MatchGamePanelProps = {
  experienceToken: string;
  match: MemoriesGateMatchView;
  onSubmitSuccess: (data: MemoriesSubmitResult) => void;
};

/** Match game UI — submit wired via server action (Sprint 09A Phase 6C). */
export function MatchGamePanel({
  experienceToken,
  match,
  onSubmitSuccess,
}: MatchGamePanelProps) {
  const sortedStories = useMemo(
    () =>
      [...match.stories].sort(
        (left, right) => left.sortOrder - right.sortOrder,
      ),
    [match.stories],
  );

  const sortedPhotoOptions = useMemo(
    () =>
      [...match.photoOptions].sort(
        (left, right) => left.sortOrder - right.sortOrder,
      ),
    [match.photoOptions],
  );

  const [selections, setSelections] = useState<Record<number, number | null>>(
    () => {
      const initial: Record<number, number | null> = {};
      for (const story of sortedStories) {
        initial[story.sortOrder] = null;
      }
      return initial;
    },
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allSelected = sortedStories.every(
    (story) => selections[story.sortOrder] !== null,
  );

  function selectPhoto(storySortOrder: number, photoSortOrder: number) {
    setSelections((current) => ({
      ...current,
      [storySortOrder]: photoSortOrder,
    }));
  }

  async function handleSubmit() {
    if (!allSelected) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      const answers: MatchAnswerSubmission[] = sortedStories.map((story) => ({
        storySortOrder: story.sortOrder,
        selectedPhotoSortOrder: selections[story.sortOrder]!,
      }));

      const response = await submitMatchAnswersAction({
        experienceToken,
        answers,
      });

      if (!response.ok) {
        setError(response.error.message);
        return;
      }

      onSubmitSuccess(response.data);
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong submitting your matches.";
      setError(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <header className="space-y-1 text-center">
        <h2 className="font-serif text-2xl font-semibold">Match the memory</h2>
        <p className="text-sm text-muted-foreground">
          Read each story and choose the photo that feels right.
        </p>
      </header>

      {error ? (
        <p
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <div className="space-y-5">
        {sortedStories.map((story, index) => (
          <StoryCard
            key={story.sortOrder}
            story={story}
            index={index}
            photoOptions={sortedPhotoOptions}
            selectedPhotoSortOrder={selections[story.sortOrder] ?? null}
            disabled={busy}
            onSelectPhoto={(photoSortOrder) =>
              selectPhoto(story.sortOrder, photoSortOrder)
            }
          />
        ))}
      </div>

      <MatchSubmitFooter
        busy={busy}
        canSubmit={allSelected && sortedStories.length > 0}
        onSubmit={() => void handleSubmit()}
      />
    </section>
  );
}
