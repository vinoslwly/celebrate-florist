import type { Theme } from "@/types/theme";

import { ExperienceSurfaceCard } from "@/features/experience/components/experience-surface-card";
import { EnvelopeContentView } from "@/features/treasures/components/envelope-content-view";
import {
  giftDisplayName,
  GiftFinalBadge,
  GiftMotif,
  GiftStateLabel,
} from "@/features/treasures/components/gift-presentation";
import type { PreviewEnvelopeView } from "@/features/treasures/types";

type BuyerPreviewTreasuresProps = {
  envelopes: PreviewEnvelopeView;
  theme?: Theme;
};

/** Buyer preview — full FD-T5 gift content; no open state or reward gating. */
export function BuyerPreviewTreasures({
  envelopes,
  theme,
}: BuyerPreviewTreasuresProps) {
  const sortedEnvelopes = [...envelopes.envelopes].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1 text-center">
        <h2 className="font-serif text-lg font-semibold">Gifts</h2>
        <p className="text-sm text-muted-foreground">
          Preview structure — recipients open gifts in any order before the
          letter and gallery unlock.
        </p>
        <p className="text-sm text-muted-foreground">
          {envelopes.envelopeCount}{" "}
          {envelopes.envelopeCount === 1 ? "gift" : "gifts"}
        </p>
      </header>

      {sortedEnvelopes.length === 0 ? (
        <ExperienceSurfaceCard
          tone="preview"
          theme={theme}
          className="text-center"
        >
          <p className="text-sm text-muted-foreground">
            No gifts saved yet. Add gifts in Studio before sending preview.
          </p>
        </ExperienceSurfaceCard>
      ) : (
        <>
          <ExperienceSurfaceCard
            tone="preview"
            theme={theme}
            className="space-y-3"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recipient view — closed gifts
            </p>
            <ul
              className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              aria-label="Gift states preview"
            >
              {sortedEnvelopes.map((envelope, index) => {
                const kind = envelope.isFinal ? "final" : "standard";

                return (
                  <li
                    key={envelope.sortOrder}
                    className="flex flex-col items-center rounded-lg border border-border/80 bg-muted/10 px-2 py-3 text-center"
                  >
                    <GiftMotif
                      state="closed"
                      kind={kind}
                      size="sm"
                      theme={theme}
                    />
                    <span className="mt-2 text-xs font-medium">
                      {giftDisplayName(index)}
                    </span>
                    <GiftStateLabel
                      state="closed"
                      kind={kind}
                      className="mt-0.5"
                    />
                    {envelope.isFinal ? (
                      <GiftFinalBadge className="mt-1.5" theme={theme} />
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <p className="text-xs text-muted-foreground">
              Content below shows what the recipient discovers inside each
              opened gift.
            </p>
          </ExperienceSurfaceCard>

          <div className="space-y-4">
            {sortedEnvelopes.map((envelope, index) => (
              <EnvelopeContentView
                key={envelope.sortOrder}
                displayNumber={index + 1}
                tone="preview"
                isFinal={envelope.isFinal}
                theme={theme}
                content={{
                  sortOrder: envelope.sortOrder,
                  messageText: envelope.messageText,
                  photo: envelope.photo,
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
