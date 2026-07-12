import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import type { PublishedExperiencePayload } from "@/features/experience/services/fetch-published-experience.service";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { QuizPlayer } from "@/features/quiz/components/quiz-player";
import type { RecipientQuizView } from "@/features/quiz/types";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";

type ConnectionExperienceProps = {
  payload: PublishedExperiencePayload;
  quiz: RecipientQuizView;
  experienceToken: string;
};

export function ConnectionExperience({
  payload,
  quiz,
  experienceToken,
}: ConnectionExperienceProps) {
  const { experience, photos, theme: themeRow } = payload;
  const theme = resolveThemeTokens(themeRow);

  return (
    <div className="relative mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-40 opacity-15 ${theme.accentClassName}`}
        aria-hidden
      />
      <header className="relative text-center">
        <p className="text-4xl" aria-hidden>
          {theme.emoji}
        </p>
        <p className="mt-2 text-sm uppercase tracking-widest text-muted-foreground">
          {theme.name} · A gift for you
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">
          {experience.greeting_name}
        </h1>
      </header>

      <LetterView experience={experience} theme={theme} />
      <PhotoGallery photos={photos} theme={theme} />
      <QuizPlayer
        experienceId={experience.id}
        experienceToken={experienceToken}
        quiz={quiz}
      />
      <Photobooth
        greetingName={experience.greeting_name}
        themeEmoji={theme.emoji}
      />
    </div>
  );
}
