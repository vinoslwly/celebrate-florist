"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { verifyMemoryCodeAction } from "@/features/access/actions/verify-memory-code";

type MemoryCodeGateProps = {
  experienceToken: string;
};

export function MemoryCodeGate({ experienceToken }: MemoryCodeGateProps) {
  const [memoryCode, setMemoryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const errorId = "recipient-memoryCode-error";
  const helperId = "recipient-memoryCode-helper";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const result = await verifyMemoryCodeAction({
      experienceToken,
      memoryCode,
    });

    setBusy(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div
          className="h-1.5 w-full bg-gradient-to-r from-pink-deep to-peach"
          aria-hidden
        />
        <div className="space-y-4 p-6">
          <div className="text-center">
            <p
              className="text-3xl"
              aria-hidden
              data-production-pending="memory-gate-motif"
            >
              🎁
            </p>
            <h1 className="mt-2 font-serif text-2xl font-semibold">
              Your private gift
            </h1>
            <p
              id={helperId}
              className="mt-2 text-sm leading-relaxed text-muted-foreground"
            >
              Enter your Memory Code to open this experience on a new device.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <Field>
              <Label htmlFor="recipient-memoryCode">Memory Code</Label>
              <Input
                id="recipient-memoryCode"
                type="password"
                autoComplete="off"
                required
                value={memoryCode}
                onChange={(event) => setMemoryCode(event.target.value)}
                disabled={busy}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${helperId} ${errorId}` : helperId}
              />
              <FieldError id={errorId}>{error}</FieldError>
            </Field>

            <Button
              type="submit"
              className="w-full min-h-11"
              disabled={busy}
              aria-busy={busy}
            >
              {busy ? "Verifying…" : "Open gift"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
