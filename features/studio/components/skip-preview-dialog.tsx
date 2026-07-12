"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { skipPreviewAction } from "@/features/studio/actions/publish";

type SkipPreviewDialogProps = {
  open: boolean;
  orderId: string;
  experienceId: string;
  onClose: () => void;
  onSkipped: () => void;
  onPublishAfterSkip: () => void;
};

export function SkipPreviewDialog({
  open,
  orderId,
  experienceId,
  onClose,
  onSkipped,
  onPublishAfterSkip,
}: SkipPreviewDialogProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  async function handleConfirm() {
    setBusy(true);
    setError(null);

    const result = await skipPreviewAction({
      orderId,
      experienceId,
      confirmOverride: true,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    onSkipped();
  }

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 space-y-3">
      <p className="text-sm font-medium">Skip buyer preview?</p>
      <p className="text-xs text-muted-foreground">
        Use only for repeat customers or urgent deliveries. This records an
        admin override and marks the order as approved without buyer review.
      </p>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          disabled={busy}
          onClick={() => void handleConfirm()}
        >
          {busy ? "Saving…" : "Confirm skip"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            const result = await skipPreviewAction({
              orderId,
              experienceId,
              confirmOverride: true,
            });
            setBusy(false);
            if (!result.ok) {
              setError(result.error.message);
              return;
            }
            onPublishAfterSkip();
          }}
        >
          Skip and publish
        </Button>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
