import type { Theme } from "@/types/theme";

export const bloomTheme: Theme = {
  id: "bloom",
  name: "Bloom",
  emoji: "🌸",
  feeling: "Romantic",
  flower: "Cherry Blossom",
  accentClassName: "bg-pink-300",
  presentation: {
    accent: "bg-pink-300",
    accentText: "text-pink-ink",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-pink-soft/35 via-warmwhite/80 to-peach-soft/25",
    pageAtmospherePreview: "bg-gradient-to-b from-muted/30 to-background",
    surfaceTintRecipient: "bg-card",
    surfaceTintPreview: "bg-card/90",
    borderTint: "border-pink-soft/70",
    decorativeIntensity: "medium",
    assets: {},
  },
};
