import type { ThemeRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import { ALL_THEMES } from "@/features/themes/config/all-themes";

const FALLBACK_THEME = ALL_THEMES[0]!;

/**
 * Maps a database theme row to static visual tokens in features/themes/config/.
 * Visual config stays in application code per docs/03_DATABASE.md.
 */
export function resolveThemeTokens(theme: ThemeRow): Theme {
  return ALL_THEMES.find((entry) => entry.id === theme.slug) ?? FALLBACK_THEME;
}
