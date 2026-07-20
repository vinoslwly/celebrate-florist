import type { ExperiencePhotoRow } from "@/types/database";

import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getEnvelopeCardValidation } from "@/features/treasures/components/envelope-draft";
import { EnvelopePhotoSelector } from "@/features/treasures/components/envelope-photo-selector";
import {
  giftDisplayName,
  GiftMotif,
} from "@/features/treasures/components/gift-presentation";

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
  const giftName = giftDisplayName(displayNumber - 1);
  const kind = envelope.isFinal ? "final" : "standard";

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
        envelope.isFinal ? "ring-1 ring-pink-ink/15" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <GiftMotif state="closed" kind={kind} size="sm" />
          <div>
            <h3 id={`${fieldId}-heading`} className="text-sm font-semibold">
              {giftName}
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
          aria-label={`Remove ${giftName}`}
        >
          Remove
        </button>
      </div>

      <Field>
        <Label htmlFor={`${fieldId}-message`}>Hidden message</Label>
        <Textarea
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
          disabled={disabled}
          placeholder="Write the surprise message inside this gift"
        />
      </Field>

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
            <span className="font-medium">Mark as Final gift</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              Creator label only — helps you remember which memory closes the
              sequence. The letter unlocks after{" "}
              <strong className="font-medium text-foreground">all</strong> gifts
              are opened, not this one alone.
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
          Ready — recipient will discover this when they open {giftName}.
        </p>
      ) : null}
    </article>
  );
}
