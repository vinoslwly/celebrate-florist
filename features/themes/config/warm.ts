import type { Theme } from "@/types/theme";

/** Dark red romantic direction — distinct from destructive UI red. */
export const warmTheme: Theme = {
  id: "warm",
  name: "Warm",
  emoji: "🌹",
  feeling: "Close Friendship",
  flower: "Rose",
  accentClassName: "bg-rose-700",
  presentation: {
    accent: "bg-rose-700",
    accentText: "text-rose-950",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-rose-100/30 via-warmwhite/90 to-peach-soft/20",
    pageAtmospherePreview: "bg-gradient-to-b from-muted/25 to-background",
    surfaceTintRecipient: "bg-card",
    surfaceTintPreview: "bg-card/90",
    borderTint: "border-rose-300/55",
    decorativeIntensity: "medium",
    assets: {},
  },
};
