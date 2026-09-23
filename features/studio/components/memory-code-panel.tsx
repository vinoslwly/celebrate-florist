"use client";

import { useId, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldHelper } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  generateMemoryCodeAction,
  setMemoryCodeAction,
} from "@/features/studio/actions/memory-code";
import { isPlaceholderMemoryKeyHash } from "@/features/studio/config/memory-code-sentinel";
import { MEMORY_CODE_PIN_LENGTH } from "@/schemas/studio-memory-code";

type MemoryCodePanelProps = {
  orderId: string;
  experienceId: string;
  memoryKeyHash: string;
  /** Admin reference from order notes — Studio-only, not the security hash. */
  adminMemoryCodeReference: string | null;
  disabled?: boolean;
};

export function MemoryCodePanel({
  orderId,
  experienceId,
  memoryKeyHash,
  adminMemoryCodeReference,
  disabled = false,
}: MemoryCodePanelProps) {
  const router = useRouter();
  const memoryCodeInputId = useId();
  const memoryCodeHelperId = useId();
  const memoryCodeErrorId = useId();
  const [memoryCode, setMemoryCode] = useState("");
  const [busy, setBusy] = useState<"save" | "generate" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const memoryCodeSet = !isPlaceholderMemoryKeyHash(memoryKeyHash);
  const displayedCode = adminMemoryCodeReference;

  async function handleSave() {
    if (!/^\d{6}$/.test(memoryCode.trim())) {
      setFieldError("Memory Code must be exactly 6 digits.");
      setError(null);
      return;
    }

    setBusy("save");
    setError(null);
    setFieldError(null);
    setMessage(null);

    const result = await setMemoryCodeAction({
      orderId,
      experienceId,
      memoryCode,
    });

    setBusy(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setMemoryCode("");
    setMessage("Memory Code saved.");
    router.refresh();
  }

  async function handleGenerate() {
    setBusy("generate");
    setError(null);
    setFieldError(null);
    setMessage(null);

    const result = await generateMemoryCodeAction({
      orderId,
      experienceId,
    });

    setBusy(null);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setMemoryCode("");
    setMessage("Memory Code generated and saved.");
    router.refresh();
  }

  const describedBy = [
    memoryCodeHelperId,
    fieldError ? memoryCodeErrorId : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div>
        <h2 className="font-serif text-base font-semibold text-foreground">
          Access — Memory Code
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Private key for the recipient after the 24-hour grace period. Required
          before publish. Saved here for admin reference during busy days.
        </p>
      </div>

      <p className="text-sm">
        Status:{" "}
        <span
          className={
            memoryCodeSet ? "font-medium text-emerald-600" : "text-destructive"
          }
        >
          {memoryCodeSet ? "Set ✓" : "Not set"}
        </span>
      </p>

      {error ? (
        <div
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground">
          {message}
        </div>
      ) : null}

      {displayedCode ? (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 p-4 space-y-2">
          <p className="text-sm font-medium">
            Current Memory Code (admin reference)
          </p>
          <p className="font-mono text-2xl tracking-[0.35em]">
            {displayedCode}
          </p>
          <FieldHelper>
            Studio-only note on this order. Share separately from the QR link.
          </FieldHelper>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => void navigator.clipboard.writeText(displayedCode)}
          >
            Copy code
          </Button>
        </div>
      ) : memoryCodeSet ? (
        <p className="text-sm text-muted-foreground">
          Code is set but not recorded in admin notes. Generate or save again to
          store a reference you can view later.
        </p>
      ) : null}

      {!disabled ? (
        <>
          <Field>
            <Label htmlFor={memoryCodeInputId}>
              {memoryCodeSet
                ? "Set a new Memory Code"
                : "Enter Memory Code manually"}
            </Label>
            <Input
              id={memoryCodeInputId}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              maxLength={MEMORY_CODE_PIN_LENGTH}
              value={memoryCode}
              onChange={(event) => {
                const digits = event.target.value
                  .replace(/\D/g, "")
                  .slice(0, MEMORY_CODE_PIN_LENGTH);
                setMemoryCode(digits);
                if (fieldError) {
                  setFieldError(null);
                }
              }}
              placeholder="060101"
              disabled={busy !== null}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby={describedBy || undefined}
            />
            <FieldHelper id={memoryCodeHelperId}>
              Exactly 6 digits. Use Generate, or type a PIN such as a birthday.
            </FieldHelper>
            <FieldError id={memoryCodeErrorId}>{fieldError}</FieldError>
          </Field>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={busy !== null}
            >
              {busy === "generate" ? "Generating…" : "Generate code"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleSave()}
              disabled={
                busy !== null || memoryCode.length !== MEMORY_CODE_PIN_LENGTH
              }
            >
              {busy === "save" ? "Saving…" : "Save code"}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-xs text-muted-foreground">
          Published — Memory Code cannot be changed. Use the reference above
          when sharing with the recipient.
        </p>
      )}
    </section>
  );
}
