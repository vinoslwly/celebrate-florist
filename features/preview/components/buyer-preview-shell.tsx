"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ExperienceSurfaceCard } from "@/features/experience/components/experience-surface-card";
import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import { BuyerPreviewMatch } from "@/features/match/components/buyer-preview-match";
import { approvePreviewAction } from "@/features/preview/actions/approve-preview";
import {
  PreviewContextNote,
  PreviewReviewFrame,
} from "@/features/preview/components/preview-review-frame";
import type { BuyerPreviewPayload } from "@/features/preview/types";
import { BuyerPreviewQuiz } from "@/features/quiz/components/buyer-preview-quiz";
import { ThemePageAtmosphere } from "@/features/themes/components/theme-page-atmosphere";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";
import { BuyerPreviewTreasures } from "@/features/treasures/components/buyer-preview-treasures";

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
    <ThemePageAtmosphere theme={theme} surface="preview">
      <PreviewReviewFrame receiverName={order.receiver_name}>
        {payload.envelopes ? (
          <>
            <BuyerPreviewTreasures
              envelopes={payload.envelopes}
              theme={theme}
            />
            <LetterView experience={experience} theme={theme} />
            <PhotoGallery photos={photos} theme={theme} tone="preview" />
          </>
        ) : (
          <>
            {payload.match ? (
              <>
                <BuyerPreviewMatch match={payload.match} photos={photos} />
                <PreviewContextNote>
                  Recipients uncover each memory through a cinematic reveal
                  before discovering the full moments after completing the
                  experience.
                </PreviewContextNote>
                {payload.match.finalUnlockMessage?.trim() ? (
                  <ExperienceSurfaceCard
                    tone="preview"
                    theme={theme}
                    className="text-center space-y-3"
                  >
                    <h2 className="font-serif text-lg font-semibold">
                      Unlock message
                    </h2>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {payload.match.finalUnlockMessage}
                    </p>
                  </ExperienceSurfaceCard>
                ) : null}
              </>
            ) : null}

            {payload.quiz ? (
              <>
                <BuyerPreviewQuiz quiz={payload.quiz} />
                <PreviewContextNote>
                  Recipients take the quiz before the letter is revealed.
                </PreviewContextNote>
              </>
            ) : null}

            <LetterView experience={experience} theme={theme} />
            <PhotoGallery photos={photos} theme={theme} tone="preview" />
          </>
        )}

        <ExperienceSurfaceCard
          tone="preview"
          theme={theme}
          className="space-y-4"
        >
          <h2 className="font-serif text-lg font-semibold">Buyer approval</h2>
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
        </ExperienceSurfaceCard>
      </PreviewReviewFrame>
    </ThemePageAtmosphere>
  );
}
