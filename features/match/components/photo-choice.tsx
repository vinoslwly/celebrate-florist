import type { MemoriesGatePhotoOption } from "@/features/experience/types/memories-gate.types";
import { MatchCinematicReveal } from "@/features/match/components/match-cinematic-reveal";

type PhotoChoiceProps = {
  photo: MemoriesGatePhotoOption;
  selected: boolean;
  disabled: boolean;
  name: string;
  onSelect: () => void;
};

/** Dumb photo option — cinematic reveal + selection affordance only. */
export function PhotoChoice({
  photo,
  selected,
  disabled,
  name,
  onSelect,
}: PhotoChoiceProps) {
  const inputId = `${name}-${photo.sortOrder}`;

  return (
    <label
      htmlFor={inputId}
      className={`block cursor-pointer space-y-2 rounded-xl border bg-background p-2 transition-colors ${
        selected
          ? "border-primary bg-primary/5"
          : "border-border hover:border-primary/40"
      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
    >
      <input
        id={inputId}
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        disabled={disabled}
        className="sr-only"
      />
      <MatchCinematicReveal
        signedUrl={photo.signedUrl}
        caption={photo.caption}
        selected={selected}
      />
      {photo.caption?.trim() ? (
        <p className="px-1 text-center text-xs text-muted-foreground">
          {photo.caption}
        </p>
      ) : null}
    </label>
  );
}
