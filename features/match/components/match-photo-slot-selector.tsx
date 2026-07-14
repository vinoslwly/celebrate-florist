import type { ExperiencePhotoRow } from "@/types/database";

const PHOTO_SLOTS = [1, 2, 3, 4, 5, 6] as const;

type MatchPhotoSlotSelectorProps = {
  value: number;
  usedByOtherPairs: Set<number>;
  photos: ExperiencePhotoRow[];
  disabled?: boolean;
  onChange: (photoSortOrder: number) => void;
  fieldId: string;
};

export function MatchPhotoSlotSelector({
  value,
  usedByOtherPairs,
  photos = [],
  disabled = false,
  onChange,
  fieldId,
}: MatchPhotoSlotSelectorProps) {
  const uploadedSlots = new Set(photos.map((photo) => photo.sort_order));

  return (
    <fieldset className="space-y-2" disabled={disabled}>
      <legend className="text-sm font-medium">Correct photo slot</legend>
      <p className="text-xs text-muted-foreground">
        Choose which uploaded photo matches this story. Each slot can only be
        used once.
      </p>
      <div
        className="grid grid-cols-3 gap-2 sm:grid-cols-6"
        role="radiogroup"
        aria-labelledby={`${fieldId}-slot-legend`}
      >
        <span id={`${fieldId}-slot-legend`} className="sr-only">
          Photo slot for this story
        </span>
        {PHOTO_SLOTS.map((slot) => {
          const isUploaded = uploadedSlots.has(slot);
          const isUsedElsewhere = usedByOtherPairs.has(slot);
          const isSelected = value === slot;
          const isDisabled = disabled || !isUploaded || isUsedElsewhere;
          const inputId = `${fieldId}-slot-${slot}`;

          let statusLabel = "Empty";
          if (isUploaded && isUsedElsewhere) {
            statusLabel = "Used";
          } else if (isUploaded) {
            statusLabel = "Uploaded";
          }

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
              <span className="font-semibold text-foreground">Slot {slot}</span>
              <span className="mt-1">{statusLabel}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
