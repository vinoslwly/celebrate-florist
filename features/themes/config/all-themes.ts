import type { Theme } from "@/types/theme";

import { bloomTheme } from "./bloom";
import { playTheme } from "./play";
import { pureTheme } from "./pure";
import { skyTheme } from "./sky";
import { warmTheme } from "./warm";

/**
 * All Experience Themes in their canonical display order. This is an
 * aggregation module (not a re-export barrel) — it exists because the
 * Landing Page and, later, the Experience Editor both need to iterate
 * over "every theme", which a single-file import list can't provide
 * without this.
 *
 * V1 active subset for new orders: bloom, warm, play, sky — see active-themes.ts.
 * Pure remains for backward compatibility and Landing catalog continuity.
 */
export const ALL_THEMES: Theme[] = [
  bloomTheme,
  skyTheme,
  pureTheme,
  warmTheme,
  playTheme,
];

/** Active V1 themes for validation matrices (excludes frozen Pure). */
export const ACTIVE_V1_THEMES: Theme[] = [
  bloomTheme,
  warmTheme,
  playTheme,
  skyTheme,
];
