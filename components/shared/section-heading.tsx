type SectionHeadingProps = {
  /** Must match the parent section's `aria-labelledby`. */
  id: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
};

/**
 * Consistent heading block reused by every Landing Page section — keeps
 * heading hierarchy (h2 + optional eyebrow/subtitle) uniform without
 * duplicating markup seven times.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={
        align === "center"
          ? "mx-auto max-w-2xl text-center"
          : "max-w-2xl text-left"
      }
    >
      {eyebrow ? (
        <p className="font-mono text-xs font-bold tracking-widest text-pink-ink uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="mt-2 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
      >
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
      ) : null}
    </div>
  );
}
