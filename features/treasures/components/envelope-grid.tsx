import type { Theme } from "@/types/theme";

import {
  giftAccessibleName,
  giftDisplayName,
  GiftFinalBadge,
  GiftMotif,
  GiftStateLabel,
} from "@/features/treasures/components/gift-presentation";
import type { RecipientEnvelopeShell } from "@/features/treasures/types";

type EnvelopeGridProps = {
  envelopes: RecipientEnvelopeShell[];
  activeSortOrder: number | null;
  loadingSortOrder: number | null;
  disabled?: boolean;
  theme?: Theme;
  onOpen: (sortOrder: number) => void;
};

export function EnvelopeGrid({
  envelopes,
  activeSortOrder,
  loadingSortOrder,
  disabled = false,
  theme,
  onOpen,
}: EnvelopeGridProps) {
  const sortedEnvelopes = [...envelopes].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return (
    <section aria-label="Your gifts" className="space-y-4">
      <div className="space-y-1 text-center">
        <h2 className="font-serif text-2xl font-semibold">Your gifts</h2>
        <p className="text-sm text-muted-foreground">
          Open any gift in any order — each one holds a surprise memory.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sortedEnvelopes.map((envelope, index) => {
          const displayNumber = index + 1;
          const isActive = activeSortOrder === envelope.sortOrder;
          const isLoading = loadingSortOrder === envelope.sortOrder;
          const tileState = isLoading
            ? "loading"
            : envelope.isOpened
              ? "opened"
              : "closed";
          const kind = envelope.isFinal ? "final" : "standard";

          return (
            <li key={envelope.sortOrder}>
              <button
                type="button"
                onClick={() => onOpen(envelope.sortOrder)}
                disabled={disabled || isLoading}
                aria-pressed={isActive}
                aria-busy={isLoading}
                aria-label={giftAccessibleName({
                  displayNumber,
                  isOpened: envelope.isOpened,
                  isFinal: envelope.isFinal,
                  isLoading,
                })}
                className={[
                  "flex w-full flex-col items-center rounded-xl border px-3 py-5 text-center transition-colors min-h-[5.5rem]",
                  isActive
                    ? "border-primary bg-primary/10 shadow-sm"
                    : envelope.isOpened
                      ? "border-border bg-card hover:bg-muted/30"
                      : "border-border bg-card hover:bg-muted/40",
                  envelope.isFinal && !isActive
                    ? "ring-1 ring-pink-ink/20"
                    : "",
                  disabled || isLoading ? "opacity-60" : "",
                ].join(" ")}
              >
                <GiftMotif state={tileState} kind={kind} theme={theme} />
                <span className="mt-3 text-sm font-medium">
                  {giftDisplayName(index)}
                </span>
                <GiftStateLabel
                  state={tileState}
                  kind={kind}
                  className="mt-1"
                />
                {envelope.isFinal ? (
                  <GiftFinalBadge className="mt-2" theme={theme} />
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
