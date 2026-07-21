/** Sprint 11 Memories scene IDs — Theme Lab presentation (Scenes 0–15). */

export const MEMORIES_STATIC_SCENE_IDS = [
  "memories.celebrate-loading",
  "memories.welcome",
  "memories.locked-gift",
  "memories.gift-locked",
  "memories.match-transition",
  "memories.match-intro",
  "memories.calculating",
  "memories.score-reveal",
  "memories.memory-transition",
  "memories.letter-emergence",
  "memories.letter-reveal",
  "memories.binder-transition",
  "memories.gallery",
  "memories.gallery-ending",
  "memories.photobooth",
] as const;

export type MemoriesStaticSceneId = (typeof MEMORIES_STATIC_SCENE_IDS)[number];

/** Parameterized match nodes — `memories.match.memory.{n}` (FD-S11-10). */
export type MemoriesMatchMemorySceneId = `memories.match.memory.${number}`;

export type MemoriesSceneId =
  MemoriesStaticSceneId | MemoriesMatchMemorySceneId;

export const MEMORIES_INITIAL_SCENE: MemoriesSceneId =
  "memories.celebrate-loading";

/** Default Theme Lab pair count when host does not pass an override. */
export const MEMORIES_LAB_DEFAULT_PAIR_COUNT = 4;

export type MemoriesSceneContext = {
  memoryPairCount: number;
  hasPhotos: boolean;
};

/** Logical duration hints (ms) for auto-advance scenes. */
export const MEMORIES_SCENE_DURATIONS_MS: Partial<
  Record<MemoriesStaticSceneId, number>
> = {
  "memories.celebrate-loading": 2800,
  /** Architecture 1–1.5s; ~1.8s lets the scrapbook burst land. */
  "memories.match-transition": 1800,
  /** Reuses Connection score-calculation pacing (~2s). */
  "memories.calculating": 2000,
  /** Reuses Moments letter-transition origami surge (~3s). */
  "memories.memory-transition": 3000,
  /** Reuses Connection letter-emergence (~1.4s). */
  "memories.letter-emergence": 1400,
  /** Reuses Moments album-unlock (~3s). */
  "memories.binder-transition": 3000,
  /** Reuses Moments gallery ending (~1.6s). */
  "memories.gallery-ending": 1600,
};

export function isMemoriesMatchMemoryScene(
  sceneId: MemoriesSceneId,
): sceneId is MemoriesMatchMemorySceneId {
  return sceneId.startsWith("memories.match.memory.");
}

export function parseMemoriesMatchMemoryIndex(
  sceneId: MemoriesSceneId,
): number | null {
  if (!isMemoriesMatchMemoryScene(sceneId)) return null;
  const raw = sceneId.slice("memories.match.memory.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function memoriesMatchMemorySceneId(
  index: number,
): MemoriesMatchMemorySceneId {
  return `memories.match.memory.${index}`;
}

/**
 * Resolve the next Memories scene after the current one completes.
 * Gallery skip: binder → photobooth when no photos (same as Moments/Connection).
 */
export function resolveNextMemoriesScene(
  current: MemoriesSceneId,
  context: MemoriesSceneContext | number = {
    memoryPairCount: MEMORIES_LAB_DEFAULT_PAIR_COUNT,
    hasPhotos: true,
  },
): MemoriesSceneId | null {
  const opts: MemoriesSceneContext =
    typeof context === "number"
      ? { memoryPairCount: context, hasPhotos: true }
      : context;
  const count = Math.max(0, Math.floor(opts.memoryPairCount));

  if (isMemoriesMatchMemoryScene(current)) {
    const index = parseMemoriesMatchMemoryIndex(current);
    if (index == null) return null;
    if (index + 1 < count) return memoriesMatchMemorySceneId(index + 1);
    return "memories.calculating";
  }

  switch (current) {
    case "memories.celebrate-loading":
      return "memories.welcome";
    case "memories.welcome":
      return "memories.locked-gift";
    case "memories.locked-gift":
      return "memories.gift-locked";
    case "memories.gift-locked":
      return "memories.match-transition";
    case "memories.match-transition":
      return "memories.match-intro";
    case "memories.match-intro":
      return count > 0 ? memoriesMatchMemorySceneId(0) : "memories.calculating";
    case "memories.calculating":
      return "memories.score-reveal";
    case "memories.score-reveal":
      return "memories.memory-transition";
    case "memories.memory-transition":
      return "memories.letter-emergence";
    case "memories.letter-emergence":
      return "memories.letter-reveal";
    case "memories.letter-reveal":
      return "memories.binder-transition";
    case "memories.binder-transition":
      return opts.hasPhotos ? "memories.gallery" : "memories.photobooth";
    case "memories.gallery":
      return "memories.gallery-ending";
    case "memories.gallery-ending":
      return "memories.photobooth";
    case "memories.photobooth":
      return null;
    default:
      return null;
  }
}
