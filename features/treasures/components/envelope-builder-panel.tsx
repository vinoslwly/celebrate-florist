"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import type { ExperiencePhotoRow } from "@/types/database";

import { Button } from "@/components/ui/button";
import { saveEnvelopeConfigAction } from "@/features/treasures/actions/envelope-config";
import { EnvelopeCardList } from "@/features/treasures/components/envelope-card-list";
import {
  envelopeStudioConfigToDraft,
  getEnvelopeDraftValidation,
  type EnvelopeDraftState,
} from "@/features/treasures/components/envelope-draft";
import type { EnvelopeStudioConfig } from "@/features/treasures/types";

type EnvelopeBuilderPanelProps = {
  orderId: string;
  experienceId: string;
  initialEnvelopes: EnvelopeStudioConfig;
  photos: ExperiencePhotoRow[];
  disabled?: boolean;
};

export function EnvelopeBuilderPanel({
  orderId,
  experienceId,
  initialEnvelopes,
  photos = [],
  disabled = false,
}: EnvelopeBuilderPanelProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<EnvelopeDraftState>(() =>
    envelopeStudioConfigToDraft(initialEnvelopes),
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    const draftValidation = getEnvelopeDraftValidation(draft.envelopes);
    if (draftValidation) {
      setError(draftValidation);
      setMessage(null);
      return;
    }

    setBusy(true);
    setError(null);
    setMessage(null);

    const saveResult = await saveEnvelopeConfigAction({
      orderId,
      experienceId,
      envelopes: draft.envelopes,
    });

    setBusy(false);

    if (!saveResult.ok) {
      setError(saveResult.error.message);
      return;
    }

    setDraft(envelopeStudioConfigToDraft(saveResult.data.envelopes));
    setMessage("Gift configuration saved.");
    router.refresh();
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <header className="space-y-2">
        <h2 className="font-serif text-base font-semibold text-foreground">
          Mode experience — Gifts
        </h2>
        <p className="text-sm text-muted-foreground">
          Prepare each gift as a complete surprise. Recipients see every gift
          closed at first, then open them in any order they choose.
        </p>
        <p className="text-xs text-muted-foreground">
          After all gifts are opened, the letter and photo gallery unlock. No
          forced sequence — just closed and opened states.
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

      <EnvelopeCardList
        envelopes={draft.envelopes}
        photos={photos}
        disabled={disabled || busy}
        onChange={(envelopes) => setDraft({ envelopes })}
      />

      <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={disabled || busy}
        >
          {busy ? "Saving gifts…" : "Save gifts"}
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
