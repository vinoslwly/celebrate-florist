import { Button } from "@/components/ui/button";

type MatchSubmitFooterProps = {
  busy: boolean;
  canSubmit: boolean;
  onSubmit: () => void;
};

/** Single submit affordance — FD-M3: no retry, no play again. */
export function MatchSubmitFooter({
  busy,
  canSubmit,
  onSubmit,
}: MatchSubmitFooterProps) {
  return (
    <div className="flex justify-center pt-2">
      <Button type="button" onClick={onSubmit} disabled={busy || !canSubmit}>
        {busy ? "Submitting…" : "Submit matches"}
      </Button>
    </div>
  );
}
