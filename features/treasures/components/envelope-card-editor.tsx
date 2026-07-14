import type { ExperiencePhotoRow } from "@/types/database";

import {
  ENVELOPE_INPUT_CLASS,
  getEnvelopeCardValidation,
} from "@/features/treasures/components/envelope-draft";
import { EnvelopePhotoSelector } from "@/features/treasures/components/envelope-photo-selector";

import type { EnvelopeItemInput } from "@/schemas/studio-envelope";

type EnvelopeCardEditorProps = {
  envelope: EnvelopeItemInput;
  displayNumber: number;
  photos: ExperiencePhotoRow[];
  disabled?: boolean;
  canRemove: boolean;
  onChange: (envelope: EnvelopeItemInput) => void;
  onRemove: () => void;
};

export function EnvelopeCardEditor({
  envelope,
  displayNumber,
  photos,
  disabled = false,
  canRemove,
  onChange,
  onRemove,
}: EnvelopeCardEditorProps) {
  const fieldId = `envelope-${envelope.sortOrder}`;
  const validationMessage = getEnvelopeCardValidation(envelope);
  const hasMessage = Boolean(envelope.messageText?.trim());
  const hasPhoto = envelope.photoSortOrder !== null;

  return (
    <article
      aria-labelledby={`${fieldId}-heading`}
      className={[
        "rounded-xl border bg-muted/20 p-4 space-y-4 transition-colors",
        validationMessage
          ? "border-amber-500/40"
          : hasMessage || hasPhoto
            ? "border-border"
            : "border-dashed border-border",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            aria-hidden
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-lg"
          >
            ✉
          </div>
          <div>
            <h3 id={`${fieldId}-heading`} className="text-sm font-semibold">
              Envelope {displayNumber}
            </h3>
            <p className="text-xs text-muted-foreground">
              One complete memory — message, photo, or both
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled || !canRemove}
          className="text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          aria-label={`Remove envelope ${displayNumber}`}
        >
          Remove
        </button>
      </div>

      <div className="space-y-2">
        <label htmlFor={`${fieldId}-message`} className="text-sm font-medium">
          Hidden message
        </label>
        <textarea
          id={`${fieldId}-message`}
          rows={4}
          value={envelope.messageText ?? ""}
          onChange={(event) =>
            onChange({
              ...envelope,
              messageText: event.target.value.trim()
                ? event.target.value
                : null,
            })
          }
          className={ENVELOPE_INPUT_CLASS}
          disabled={disabled}
          placeholder="Write the surprise message inside this envelope"
        />
      </div>

      <EnvelopePhotoSelector
        fieldId={fieldId}
        value={envelope.photoSortOrder}
        photos={photos}
        disabled={disabled}
        onChange={(photoSortOrder) => onChange({ ...envelope, photoSortOrder })}
      />

      <div className="rounded-lg border border-border bg-background/60 px-3 py-3 space-y-2">
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={envelope.isFinal}
            disabled={disabled}
            onChange={(event) =>
              onChange({ ...envelope, isFinal: event.target.checked })
            }
            className="mt-0.5"
          />
          <span>
            <span className="font-medium">Mark as Final envelope</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Creator label only — helps you remember which memory closes the
              sequence. The letter unlocks after{" "}
              <strong className="font-medium text-foreground">all</strong>{" "}
              envelopes are opened, not this one alone.
            </span>
          </span>
        </label>
      </div>

      {validationMessage ? (
        <p
          role="status"
          className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-100"
        >
          {validationMessage}
        </p>
      ) : hasMessage || hasPhoto ? (
        <p className="text-xs text-muted-foreground">
          Ready — recipient will discover this when they open Envelope{" "}
          {displayNumber}.
        </p>
      ) : null}
    </article>
  );
}
