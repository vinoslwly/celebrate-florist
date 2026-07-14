import type { ExperiencePhotoRow } from "@/types/database";

const PHOTO_SLOTS = [1, 2, 3, 4, 5, 6] as const;

type EnvelopePhotoSelectorProps = {
  value: number | null;
  photos: ExperiencePhotoRow[];
  disabled?: boolean;
  onChange: (photoSortOrder: number | null) => void;
  fieldId: string;
};

/**
 * Optional photo slot — FD-T5 allows message-only envelopes.
 * Recipients see the photo only after opening this envelope (A-4).
 */
export function EnvelopePhotoSelector({
  value,
  photos = [],
  disabled = false,
  onChange,
  fieldId,
}: EnvelopePhotoSelectorProps) {
  const uploadedSlots = new Set(photos.map((photo) => photo.sort_order));

  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-sm font-medium">Memory photo</legend>
      <p className="text-xs text-muted-foreground">
        Optional — add a photo, a message, or both. The recipient discovers this
        only after opening the envelope.
      </p>
      <div
        className="grid grid-cols-3 gap-2 sm:grid-cols-4"
        role="radiogroup"
        aria-labelledby={`${fieldId}-photo-legend`}
      >
        <span id={`${fieldId}-photo-legend`} className="sr-only">
          Photo for this envelope
        </span>

        <label
          htmlFor={`${fieldId}-photo-none`}
          className={[
            "flex flex-col items-center rounded-lg border px-2 py-3 text-center text-xs transition-colors",
            value === null
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-muted/20 text-muted-foreground",
            disabled
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:bg-muted/40",
          ].join(" ")}
        >
          <input
            id={`${fieldId}-photo-none`}
            type="radio"
            name={`${fieldId}-photo-slot`}
            checked={value === null}
            disabled={disabled}
            onChange={() => onChange(null)}
            className="sr-only"
          />
          <span className="font-semibold text-foreground">None</span>
          <span className="mt-1">Message only</span>
        </label>

        {PHOTO_SLOTS.map((slot) => {
          const isUploaded = uploadedSlots.has(slot);
          const isSelected = value === slot;
          const isDisabled = disabled || !isUploaded;
          const inputId = `${fieldId}-photo-slot-${slot}`;

          return (
            <label
              key={slot}
              htmlFor={inputId}
              className={[
                "flex flex-col items-center rounded-lg border px-2 py-3 text-center text-xs transition-colors",
                isSelected
                  ? "border-primary bg-primary/10 text-foreground"
                  : "border-border bg-muted/20 text-muted-foreground",
                isDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-muted/40",
              ].join(" ")}
            >
              <input
                id={inputId}
                type="radio"
                name={`${fieldId}-photo-slot`}
                value={slot}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(slot)}
                className="sr-only"
              />
              <span className="font-semibold text-foreground">
                Photo {slot}
              </span>
              <span className="mt-1">{isUploaded ? "Uploaded" : "Empty"}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
