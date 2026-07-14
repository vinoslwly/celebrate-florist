import { EnvelopeContentView } from "@/features/treasures/components/envelope-content-view";
import type { PreviewEnvelopeView } from "@/features/treasures/types";

type BuyerPreviewTreasuresProps = {
  envelopes: PreviewEnvelopeView;
};

/** Buyer preview — full FD-T5 envelope content; no open state or reward gating. */
export function BuyerPreviewTreasures({
  envelopes,
}: BuyerPreviewTreasuresProps) {
  const sortedEnvelopes = [...envelopes.envelopes].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return (
    <section className="space-y-6">
      <header className="space-y-1 text-center">
        <h2 className="font-serif text-xl font-semibold">Secret envelopes</h2>
        <p className="text-sm text-muted-foreground">
          Buyer preview — recipients open envelopes in any order before the
          letter and gallery unlock.
        </p>
        <p className="text-sm text-muted-foreground">
          {envelopes.envelopeCount}{" "}
          {envelopes.envelopeCount === 1 ? "envelope" : "envelopes"}
        </p>
      </header>

      {sortedEnvelopes.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          No envelopes saved yet. Add envelopes in Studio before sending
          preview.
        </p>
      ) : (
        <div className="space-y-4">
          {sortedEnvelopes.map((envelope, index) => (
            <EnvelopeContentView
              key={envelope.sortOrder}
              displayNumber={index + 1}
              content={{
                sortOrder: envelope.sortOrder,
                messageText: envelope.messageText,
                photo: envelope.photo,
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
