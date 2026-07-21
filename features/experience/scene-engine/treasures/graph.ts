/** Sprint 11 Treasures scene IDs — Theme Lab presentation (Scenes 0–13 living). */

export const TREASURES_STATIC_SCENE_IDS = [
  "treasures.celebrate-loading",
  "treasures.welcome",
  "treasures.locked-gift",
  "treasures.gift-locked",
  /**
   * Architecture Scenes 4+5 as one Theme Lab beat (~3.6s gift explosion).
   * Scene ID keeps gift-explosion; preparing copy is the intro beat inside it.
   */
  "treasures.gift-explosion",
  /** Scene 6 — interactive gift grid (Final Gold locked until non-finals opened). */
  "treasures.gift-grid",
  /**
   * Scene 8 — Final Gift Unlock: KF1 gold glow (1.5s) → KF2 To/From (2s) = 3.5s.
   */
  "treasures.final-gift-unlock",
  /** Scene 9 — reuses Connection letter-reveal (Moments letter). */
  "treasures.final-letter",
  /** Scene 10 — reuses Connection gallery-unlock (Moments album-unlock). */
  "treasures.binder-transition",
  /** Scene 11 — reuses Connection gallery (skipped when no photos). */
  "treasures.gallery",
  /** Scene 12 — reuses Connection gallery-ending. */
  "treasures.gallery-ending",
  /** Scene 13 — reuses Connection photobooth (terminal). */
  "treasures.photobooth",
] as const;

export type TreasuresStaticSceneId =
  (typeof TREASURES_STATIC_SCENE_IDS)[number];

/** Parameterized gift content — `treasures.gift-content.{sortOrder}` (1-based). */
export type TreasuresGiftContentSceneId = `treasures.gift-content.${number}`;

export type TreasuresSceneId =
  TreasuresStaticSceneId | TreasuresGiftContentSceneId;

export const TREASURES_INITIAL_SCENE: TreasuresSceneId =
  "treasures.celebrate-loading";

/** Theme Lab default gift count (architecture N = 2–6). */
export const TREASURES_LAB_DEFAULT_GIFT_COUNT = 6;

export type TreasuresSceneContext = {
  hasPhotos: boolean;
};

/** Logical duration hints (ms) for auto-advance scenes. */
export const TREASURES_SCENE_DURATIONS_MS: Partial<
  Record<TreasuresStaticSceneId, number>
> = {
  "treasures.celebrate-loading": 2800,
  /** Combined preparing + explosion (Founder: 3–4s total). */
  "treasures.gift-explosion": 3600,
  /** Scene 8 KF1 gold glow (1.5s) + KF2 To/From (2s) = 3.5s. */
  "treasures.final-gift-unlock": 3500,
  /** Scene 10 — same as Connection gallery-unlock / Moments album unlock. */
  "treasures.binder-transition": 3000,
  /** Scene 12 — same as Connection / Moments gallery ending. */
  "treasures.gallery-ending": 1600,
};

export function isTreasuresGiftContentScene(
  sceneId: TreasuresSceneId,
): sceneId is TreasuresGiftContentSceneId {
  return sceneId.startsWith("treasures.gift-content.");
}

export function parseTreasuresGiftContentSortOrder(
  sceneId: TreasuresSceneId,
): number | null {
  if (!isTreasuresGiftContentScene(sceneId)) return null;
  const raw = sceneId.slice("treasures.gift-content.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 1 ? n : null;
}

export function treasuresGiftContentSceneId(
  sortOrder: number,
): TreasuresGiftContentSceneId {
  return `treasures.gift-content.${sortOrder}`;
}

/**
 * Resolve the next Treasures scene after the current one completes.
 * Gift-content back edge is handled in the host (grid vs final-unlock).
 * Gallery skip: binder → photobooth when no photos.
 */
export function resolveNextTreasuresScene(
  current: TreasuresSceneId,
  context: TreasuresSceneContext = { hasPhotos: true },
): TreasuresSceneId | null {
  if (isTreasuresGiftContentScene(current)) {
    return "treasures.gift-grid";
  }
  switch (current) {
    case "treasures.celebrate-loading":
      return "treasures.welcome";
    case "treasures.welcome":
      return "treasures.locked-gift";
    case "treasures.locked-gift":
      return "treasures.gift-locked";
    case "treasures.gift-locked":
      return "treasures.gift-explosion";
    case "treasures.gift-explosion":
      return "treasures.gift-grid";
    case "treasures.gift-grid":
      return null;
    case "treasures.final-gift-unlock":
      return "treasures.final-letter";
    case "treasures.final-letter":
      return "treasures.binder-transition";
    case "treasures.binder-transition":
      return context.hasPhotos ? "treasures.gallery" : "treasures.photobooth";
    case "treasures.gallery":
      return "treasures.gallery-ending";
    case "treasures.gallery-ending":
      return "treasures.photobooth";
    case "treasures.photobooth":
      return null;
    default:
      return null;
  }
}
