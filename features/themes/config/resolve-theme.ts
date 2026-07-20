import type { ThemeRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import { ALL_THEMES } from "@/features/themes/config/all-themes";
import {
  NEUTRAL_UNKNOWN_THEME,
  withThemePresentationFallbacks,
} from "@/features/themes/config/theme-fallbacks";

/**
 * Maps a database theme row to static visual tokens in features/themes/config/.
 * Visual config stays in application code per docs/03_DATABASE.md.
 */
export function resolveThemeTokens(theme: ThemeRow): Theme {
  const matched = ALL_THEMES.find((entry) => entry.id === theme.slug);

  if (!matched) {
    return withThemePresentationFallbacks({
      ...NEUTRAL_UNKNOWN_THEME,
      id: theme.slug,
      name: theme.name,
    });
  }

  return withThemePresentationFallbacks(matched);
}
