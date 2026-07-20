import type { Theme } from "@/types/theme";

/**
 * Pure — **frozen** for V1. Kept for resolver compatibility and existing orders.
 * Not offered for new Studio orders. No active visual refinement.
 */
export const pureTheme: Theme = {
  id: "pure",
  name: "Pure",
  emoji: "🤍",
  feeling: "Calm",
  flower: "Lily",
  accentClassName: "bg-stone-200",
  presentation: {
    accent: "bg-stone-200",
    accentText: "text-stone-700",
    pageAtmosphereRecipient:
      "bg-gradient-to-b from-stone-100/45 via-warmwhite/90 to-background",
    pageAtmospherePreview: "bg-muted/15",
    surfaceTintRecipient: "bg-card",
    surfaceTintPreview: "bg-card/90",
    borderTint: "border-stone-200",
    decorativeIntensity: "low",
    assets: {},
  },
};
