type PlaceholderMediaProps = {
  label: string;
  className?: string;
};

/**
 * Visual stand-in for content the founder hasn't provided yet (real
 * bouquet photos, theme preview screenshots, etc.). Styled like an
 * empty polaroid slot — deliberately looks unfinished so it's never
 * mistaken for final content, while still matching the brand's warm,
 * playful visual language instead of a sterile dashed box.
 */
export function PlaceholderMedia({ label, className }: PlaceholderMediaProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-pink-soft bg-pink-soft/10 p-6 text-center ${className ?? ""}`}
    >
      <span aria-hidden="true" className="text-3xl">
        🌸
      </span>
      <span className="text-xs font-medium text-pink-ink">{label}</span>
    </div>
  );
}
