type MatchCinematicRevealProps = {
  signedUrl: string;
  caption: string | null;
  selected: boolean;
};

/**
 * FD-M1 / FD-M2 — single cinematic reveal presentation (CSS only, recipient-only).
 * ~25% centered visible window with feathered edge on black surround.
 */
export function MatchCinematicReveal({
  signedUrl,
  caption,
  selected,
}: MatchCinematicRevealProps) {
  const alt = caption?.trim() || "A memory waiting to be matched";

  return (
    <div
      className={`relative aspect-square overflow-hidden rounded-lg bg-black transition-shadow ${
        selected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
          : ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={signedUrl}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 12%, rgba(0,0,0,0.35) 18%, rgba(0,0,0,0.75) 28%, black 42%)",
        }}
        aria-hidden
      />
    </div>
  );
}
