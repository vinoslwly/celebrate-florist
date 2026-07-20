import type { Theme } from "@/types/theme";

/** Sky — blue foundation with subtle colorful warmth, distinct from Play. */
export const skyTheme: Theme = {
  id: "sky",
  name: "Sky",
  emoji: "☁️",
  feeling: "Achievement",
  flower: "Hydrangea",
  accentClassName: "bg-sky-300",
  presentation: {
    accent: "bg-sky-300",
    accentText: "text-slate-800",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-sky-100/35 via-warmwhite/90 to-sage-soft/15",
    pageAtmospherePreview: "bg-muted/20",
    surfaceTintRecipient: "bg-card",
    surfaceTintPreview: "bg-card/90",
    borderTint: "border-sky-200/75",
    decorativeIntensity: "low",
    assets: {},
  },
};
