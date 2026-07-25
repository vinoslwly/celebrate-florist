import type { Theme } from "@/types/theme";

import { skyTheme } from "@/features/themes/config/sky";
import { withThemePresentationFallbacks } from "@/features/themes/config/theme-fallbacks";

/**
 * Theme Lab fixture only — does not mutate production `skyTheme`.
 * Sky Moments Scene Engine tokens; scene art arrives Founder-per-scene.
 */
export const skyMomentsLabTheme: Theme = withThemePresentationFallbacks({
  ...skyTheme,
  presentation: {
    ...skyTheme.presentation,
    accent: "bg-sky-400",
    accentText: "text-[#1E3A5F]",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-[#F8FBFE] via-[#EEF4FA] to-[#E2ECF5]",
    pageAtmospherePreview: "bg-gradient-to-b from-muted/25 to-background",
    borderTint: "border-sky-300/60",
    decorativeIntensity: "medium",
    assets: {
      photoTreatment: "polaroid-tape",
    },
  },
});
