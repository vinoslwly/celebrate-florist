import { LetterView } from "@/features/experience/components/letter-view";
import { PhotoGallery } from "@/features/experience/components/photo-gallery";
import { RecipientExperienceShell } from "@/features/experience/components/recipient-experience-shell";
import { MomentsSceneHost } from "@/features/experience/scene-engine/moments/moments-scene-host";
import { SkyMomentsSceneHost } from "@/features/experience/scene-engine/sky/moments/sky-moments-scene-host";
import { WarmMomentsSceneHost } from "@/features/experience/scene-engine/warm/moments/warm-moments-scene-host";
import type { PublishedExperiencePayload } from "@/features/experience/services/fetch-published-experience.service";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { recipientCustomStripPresets } from "@/features/photobooth/lib/recipient-custom-strips";
import type { PhotoboothThemeId } from "@/features/photobooth/lib/types";
import { bloomMomentsLabTheme } from "@/features/themes/config/bloom-moments-lab-theme";
import { resolveThemeTokens } from "@/features/themes/config/resolve-theme";
import { skyMomentsLabTheme } from "@/features/themes/config/sky-moments-lab-theme";
import { warmMomentsLabTheme } from "@/features/themes/config/warm-moments-lab-theme";

type MomentsExperienceProps = {
  payload: PublishedExperiencePayload;
};

export function MomentsExperience({ payload }: MomentsExperienceProps) {
  const {
    experience,
    photos,
    photoboothStrips,
    catalogPhotoboothStrips = [],
    theme: themeRow,
  } = payload;
  const theme = resolveThemeTokens(themeRow);
  const themeId = (
    themeRow.slug === "warm" || themeRow.slug === "sky"
      ? themeRow.slug
      : "bloom"
  ) as PhotoboothThemeId;
  const customStripPresets = recipientCustomStripPresets(
    experience,
    themeId,
    photoboothStrips,
    catalogPhotoboothStrips,
  );

  if (themeRow.slug === "sky") {
    return (
      <SkyMomentsSceneHost
        experience={experience}
        photos={photos}
        photoboothStrips={photoboothStrips}
        catalogPhotoboothStrips={catalogPhotoboothStrips}
        theme={skyMomentsLabTheme}
        className="h-[100svh] bg-[#C5DCEF]"
      />
    );
  }

  if (themeRow.slug === "bloom") {
    return (
      <MomentsSceneHost
        experience={experience}
        photos={photos}
        photoboothStrips={photoboothStrips}
        catalogPhotoboothStrips={catalogPhotoboothStrips}
        theme={bloomMomentsLabTheme}
        className="h-[100svh] bg-[#F8E4E7]"
      />
    );
  }

  if (themeRow.slug === "warm") {
    return (
      <WarmMomentsSceneHost
        experience={experience}
        photos={photos}
        photoboothStrips={photoboothStrips}
        catalogPhotoboothStrips={catalogPhotoboothStrips}
        theme={warmMomentsLabTheme}
        className="h-[100svh] bg-[#4A0A10]"
      />
    );
  }

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
        variant={customStripPresets ? "capture" : "legacy"}
        themeId={themeId}
        customStripPresets={customStripPresets}
      />
    </RecipientExperienceShell>
  );
}
