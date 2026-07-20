import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import { themeHeaderMotif } from "@/features/themes/config/theme-assets";
import {
  themeAccent,
  themeAccentText,
} from "@/features/themes/config/theme-surfaces";

type LetterViewProps = {
  experience: ExperienceRow;
  theme: Theme;
};

export function LetterView({ experience, theme }: LetterViewProps) {
  const headerMotif = themeHeaderMotif(theme);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className={`h-1.5 w-full ${themeAccent(theme)}`} aria-hidden />
      <div className="space-y-4 p-6 sm:p-8">
        <p
          className={`flex items-center gap-2 text-sm ${themeAccentText(theme)}`}
        >
          {headerMotif ? (
            // eslint-disable-next-line @next/next/no-img-element -- optional theme slot
            <img
              src={headerMotif}
              alt=""
              aria-hidden
              className="h-5 w-5 object-contain"
              loading="lazy"
            />
          ) : (
            <span aria-hidden data-production-pending="theme-mood-indicator">
              {theme.emoji}
            </span>
          )}
          <span>
            {theme.feeling} · {theme.flower}
          </span>
        </p>
        <p className="font-serif text-lg text-foreground">
          Dear {experience.greeting_name},
        </p>
        <div className="max-w-prose whitespace-pre-wrap text-base leading-relaxed text-foreground sm:text-lg">
          {experience.letter_content}
        </div>
        {experience.letter_closing?.trim() ? (
          <p className="font-serif text-lg text-foreground">
            {experience.letter_closing}
          </p>
        ) : null}
        <p className="text-sm text-muted-foreground">
          With love, {experience.closing_name}
        </p>
      </div>
    </section>
  );
}
