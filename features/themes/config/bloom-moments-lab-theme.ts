import type { Theme } from "@/types/theme";

import { bloomTheme } from "@/features/themes/config/bloom";
import { withThemePresentationFallbacks } from "@/features/themes/config/theme-fallbacks";

/**
 * Theme Lab fixture only — does not mutate production `bloomTheme`.
 * Presentation tokens for Moments Scene Engine; scene art arrives Founder-per-scene.
 */
export const bloomMomentsLabTheme: Theme = withThemePresentationFallbacks({
  ...bloomTheme,
  presentation: {
    ...bloomTheme.presentation,
    accent: "bg-pink-300",
    accentText: "text-pink-ink",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-pink-soft/40 via-warmwhite/85 to-peach-soft/30",
    pageAtmospherePreview: "bg-gradient-to-b from-muted/25 to-background",
    borderTint: "border-pink-soft/70",
    decorativeIntensity: "low",
    assets: {
      // Scene 1 uses dedicated splash; further slots filled when Founder delivers.
      photoTreatment: "polaroid-tape",
    },
  },
});

/** Alternate accentText for Theme Lab comparison only. */
export const bloomMomentsLabAccentTextOptions = [
  { id: "pink-ink", className: "text-pink-ink", label: "pink-ink (berry)" },
  { id: "rose-950", className: "text-rose-950", label: "rose-950 (deep rose)" },
] as const;
