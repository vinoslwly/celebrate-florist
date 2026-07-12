"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { LetterView } from "@/features/experience/components/letter-view";
import { approvePreviewAction } from "@/features/preview/actions/approve-preview";
import type { BuyerPreviewPayload } from "@/features/preview/types";
import { BuyerPreviewQuiz } from "@/features/quiz/components/buyer-preview-quiz";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";

type BuyerPreviewShellProps = {
  payload: BuyerPreviewPayload;
};

export function BuyerPreviewShell({ payload }: BuyerPreviewShellProps) {
  const { order, experience, photos, previewToken, theme: themeRow } = payload;
  const theme = resolveThemeTokens(themeRow);
  const [approved, setApproved] = useState(order.status === "approved");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setBusy(true);
    setError(null);

    const result = await approvePreviewAction({ previewToken });
    setBusy(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setApproved(true);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <header className="text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Buyer preview
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">
          {order.receiver_name}&apos;s bouquet
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review the digital experience before it is published for delivery.
        </p>
      </header>

      <LetterView experience={experience} theme={theme} />

      {photos.length > 0 ? (
        <section className="space-y-4">
          <h2 className="font-serif text-xl font-semibold">Memory photos</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="overflow-hidden rounded-xl border border-border bg-card"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.signedUrl}
                  alt={`Memory photo ${photo.sort_order}`}
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {payload.quiz ? <BuyerPreviewQuiz quiz={payload.quiz} /> : null}

      <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h2 className="text-sm font-semibold">Buyer approval</h2>
        {approved ? (
          <p className="text-sm text-emerald-600">
            Approved — the studio can publish when ready.
          </p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Approve this preview to unlock publishing in Studio.
            </p>
            {error ? (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            ) : null}
            <Button
              type="button"
              disabled={busy}
              onClick={() => void handleApprove()}
            >
              {busy ? "Approving…" : "Approve preview"}
            </Button>
          </>
        )}
      </section>
    </div>
  );
}
