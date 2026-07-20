import type { Theme } from "@/types/theme";

/** Playful direction — brown foundation with cheerful colorful accents. */
export const playTheme: Theme = {
  id: "play",
  name: "Play",
  emoji: "🧸",
  feeling: "Fun",
  flower: "Daisy",
  accentClassName: "bg-amber-400",
  presentation: {
    accent: "bg-amber-400",
    accentText: "text-foreground",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-cream-soft/55 via-warmwhite/85 to-sage-soft/25",
    pageAtmospherePreview: "bg-muted/20",
    surfaceTintRecipient: "bg-card",
    surfaceTintPreview: "bg-card/90",
    borderTint: "border-amber-300/65",
    decorativeIntensity: "medium",
    assets: {},
  },
};
