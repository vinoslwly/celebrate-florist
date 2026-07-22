import type { Theme } from "@/types/theme";

import { withThemePresentationFallbacks } from "@/features/themes/config/theme-fallbacks";
import { warmTheme } from "@/features/themes/config/warm";

/**
 * Theme Lab fixture only — does not mutate production `warmTheme`.
 * Warm Moments Scene Engine tokens; scene art arrives Founder-per-scene.
 */
export const warmMomentsLabTheme: Theme = withThemePresentationFallbacks({
  ...warmTheme,
  presentation: {
    ...warmTheme.presentation,
    accent: "bg-rose-800",
    accentText: "text-[#E8D4C0]",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-[#6B0F16] via-[#5A0E14] to-[#4A0A10]",
    pageAtmospherePreview: "bg-gradient-to-b from-muted/25 to-background",
    borderTint: "border-rose-900/50",
    decorativeIntensity: "medium",
    assets: {
      photoTreatment: "polaroid-tape",
    },
  },
});
