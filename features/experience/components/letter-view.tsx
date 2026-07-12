import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

type LetterViewProps = {
  experience: ExperienceRow;
  theme: Theme;
};

export function LetterView({ experience, theme }: LetterViewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card/80 shadow-sm backdrop-blur">
      <div className={`h-1.5 w-full ${theme.accentClassName}`} aria-hidden />
      <div className="p-6">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span aria-hidden>{theme.emoji}</span>
          <span>
            {theme.feeling} · {theme.flower}
          </span>
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Dear {experience.greeting_name},
        </p>
        <div className="mt-4 whitespace-pre-wrap font-serif text-lg leading-relaxed text-foreground">
          {experience.letter_content}
        </div>
        <p className="mt-6 font-serif text-lg text-foreground">
          {experience.letter_closing}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          With love, {experience.closing_name}
        </p>
      </div>
    </section>
  );
}
