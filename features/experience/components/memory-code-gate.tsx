"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { verifyMemoryCodeAction } from "@/features/access/actions/verify-memory-code";

type MemoryCodeGateProps = {
  experienceToken: string;
};

export function MemoryCodeGate({ experienceToken }: MemoryCodeGateProps) {
  const [memoryCode, setMemoryCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold">Your private gift</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your Memory Code to open this experience on a new device.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="memoryCode" className="text-sm font-medium">
              Memory Code
            </label>
            <input
              id="memoryCode"
              type="password"
              autoComplete="off"
              value={memoryCode}
              onChange={(event) => setMemoryCode(event.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              disabled={busy}
            />
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? "Verifying…" : "Open gift"}
          </Button>
        </form>
      </div>
    </div>
  );
}
