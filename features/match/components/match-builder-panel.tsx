"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import type { ExperiencePhotoRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import { saveMatchConfigAction } from "@/features/match/actions/match-config";
import {
  MATCH_INPUT_CLASS,
  matchStudioConfigToDraft,
  type MatchDraftState,
} from "@/features/match/components/match-draft";
import { MatchPairList } from "@/features/match/components/match-pair-list";
import type { MatchStudioConfig } from "@/features/match/types";

type MatchBuilderPanelProps = {
  orderId: string;
  experienceId: string;
  initialMatch: MatchStudioConfig;
  photos: ExperiencePhotoRow[];
  disabled?: boolean;
};

export function MatchBuilderPanel({
  orderId,
  experienceId,
  initialMatch,
  photos = [],
  disabled = false,
}: MatchBuilderPanelProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<MatchDraftState>(() =>
    matchStudioConfigToDraft(initialMatch),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setBusy(true);
    setError(null);
    setMessage(null);

    const saveResult = await saveMatchConfigAction({
      orderId,
      experienceId,
      pairs: draft.pairs,
      finalUnlockMessage: draft.finalUnlockMessage,
    });

    setBusy(false);

    if (!saveResult.ok) {
      setError(saveResult.error.message);
      return;
    }

    setDraft(matchStudioConfigToDraft(saveResult.data.match));
    setMessage("Match configuration saved.");
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <header className="space-y-1">
        <h2 className="text-sm font-semibold text-foreground">
          Memories — Match The Memory
        </h2>
        <p className="text-sm text-muted-foreground">
          Pair each story with the correct photo slot. Recipients match stories
          to photos in one batch submit.
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground">
          {message}
        </div>
      ) : null}

      <MatchPairList
        pairs={draft.pairs}
        photos={photos}
        disabled={disabled || busy}
        onChange={(pairs) => setDraft((current) => ({ ...current, pairs }))}
      />

      <div className="space-y-2 border-t border-border pt-4">
        <label
          htmlFor="match-final-unlock-message"
          className="text-sm font-medium"
        >
          Final unlock message
        </label>
        <textarea
          id="match-final-unlock-message"
          rows={4}
          value={draft.finalUnlockMessage ?? ""}
          onChange={(event) =>
            setDraft((current) => ({
              ...current,
              finalUnlockMessage: event.target.value.trim()
                ? event.target.value
                : null,
            }))
          }
          className={MATCH_INPUT_CLASS}
          disabled={disabled || busy}
          placeholder="Message shown when the recipient matches every story correctly"
        />
        <p className="text-xs text-muted-foreground">
          Shown only after a perfect match. Required before publish (validated
          on publish).
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={disabled || busy}
        >
          {busy ? "Saving match…" : "Save match"}
        </Button>
        {busy ? (
          <span className="text-xs text-muted-foreground" aria-live="polite">
            Please wait…
          </span>
        ) : null}
      </div>
    </section>
  );
}
