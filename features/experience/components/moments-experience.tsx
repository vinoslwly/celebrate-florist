import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import { RecipientExperienceShell } from "@/features/experience/components/recipient-experience-shell";
import type { PublishedExperiencePayload } from "@/features/experience/services/fetch-published-experience.service";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";

type MomentsExperienceProps = {
  payload: PublishedExperiencePayload;
};

export function MomentsExperience({ payload }: MomentsExperienceProps) {
  const { experience, photos, theme: themeRow } = payload;
  const theme = resolveThemeTokens(themeRow);

  return (
    <RecipientExperienceShell
      theme={theme}
      greetingName={experience.greeting_name}
    >
      <LetterView experience={experience} theme={theme} />
      <PhotoGallery photos={photos} theme={theme} />
      <Photobooth
        greetingName={experience.greeting_name}
        themeEmoji={theme.emoji}
      />
    </RecipientExperienceShell>
  );
}
