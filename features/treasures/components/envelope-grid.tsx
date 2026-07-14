import type { RecipientEnvelopeShell } from "@/features/treasures/types";

type EnvelopeGridProps = {
  envelopes: RecipientEnvelopeShell[];
  activeSortOrder: number | null;
  loadingSortOrder: number | null;
  disabled?: boolean;
  onOpen: (sortOrder: number) => void;
};

function envelopeLabel(index: number): string {
  return `Envelope ${index + 1}`;
}

export function EnvelopeGrid({
  envelopes,
  activeSortOrder,
  loadingSortOrder,
  disabled = false,
  onOpen,
}: EnvelopeGridProps) {
  const sortedEnvelopes = [...envelopes].sort(
    (left, right) => left.sortOrder - right.sortOrder,
  );

  return (
    <section aria-label="Secret envelopes" className="space-y-4">
      <div className="text-center space-y-1">
        <h2 className="font-serif text-2xl font-semibold">Your envelopes</h2>
        <p className="text-sm text-muted-foreground">
          Open any envelope in any order — each one holds a surprise memory.
        </p>
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {sortedEnvelopes.map((envelope, index) => {
          const isActive = activeSortOrder === envelope.sortOrder;
          const isLoading = loadingSortOrder === envelope.sortOrder;
          const icon = envelope.isOpened ? "📬" : "✉️";
          const label = envelopeLabel(index);

          return (
            <li key={envelope.sortOrder}>
              <button
                type="button"
                onClick={() => onOpen(envelope.sortOrder)}
                disabled={disabled || isLoading}
                aria-pressed={isActive}
                aria-busy={isLoading}
                aria-label={
                  envelope.isOpened
                    ? `${label} — opened, tap to view again`
                    : `${label} — closed, tap to open`
                }
                className={[
                  "flex w-full flex-col items-center rounded-xl border px-3 py-5 text-center transition-colors",
                  isActive
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card hover:bg-muted/40",
                  disabled || isLoading ? "opacity-60" : "",
                ].join(" ")}
              >
                <span className="text-3xl" aria-hidden>
                  {icon}
                </span>
                <span className="mt-2 text-sm font-medium">{label}</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {isLoading
                    ? "Opening…"
                    : envelope.isOpened
                      ? "Opened"
                      : "Closed"}
                </span>
                {envelope.isFinal ? (
                  <span className="mt-2 rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                    Final
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
