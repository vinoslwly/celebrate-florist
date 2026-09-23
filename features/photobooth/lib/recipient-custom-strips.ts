import type { ExperienceRow } from "@/types/database";

import type { PublishedPhotoboothStrip } from "@/features/experience/services/fetch-published-experience.service";
import { customStripsToPresets } from "@/features/photobooth/lib/custom-strip-presets";
import type {
  PhotoboothStripPreset,
  PhotoboothThemeId,
} from "@/features/photobooth/lib/types";

export function recipientStripPresets(
  experience: ExperienceRow,
  themeId: PhotoboothThemeId,
  customStrips: PublishedPhotoboothStrip[] | undefined,
  catalogStrips?: PublishedPhotoboothStrip[],
): PhotoboothStripPreset[] | undefined {
  if (experience.photobooth_strip_source === "custom") {
    if (!customStrips?.length) {
      return undefined;
    }
    return customStripsToPresets(
      themeId,
      customStrips.map((strip) => ({
        id: strip.id,
        layoutId: strip.layout_id,
        frameSrc: strip.signedUrl,
        sortOrder: strip.sort_order,
      })),
    );
  }

  if (!catalogStrips?.length) {
    return undefined;
  }

  return customStripsToPresets(
    themeId,
    catalogStrips.map((strip) => ({
      id: strip.id,
      layoutId: strip.layout_id,
      frameSrc: strip.signedUrl,
      sortOrder: strip.sort_order,
    })),
  );
}

export function recipientCustomStripPresets(
  experience: ExperienceRow,
  themeId: PhotoboothThemeId,
  strips: PublishedPhotoboothStrip[] | undefined,
  catalogStrips?: PublishedPhotoboothStrip[],
): PhotoboothStripPreset[] | undefined {
  return recipientStripPresets(experience, themeId, strips, catalogStrips);
}
