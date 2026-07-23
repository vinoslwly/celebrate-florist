/**
 * Warm Memories Theme Lab scene graph — Scenes 0–5 + match + Connection tail.
 * (0–3 = ceremony; 4–5 = match splash/intro; match.memory.{n}; then
 * calculating → photobooth reuses Warm Connection living scenes.)
 */

export const WARM_MEMORIES_INITIAL_SCENE = "warm.memories.celebrate-loading";
export const WARM_MEMORIES_WELCOME_SCENE = "warm.memories.welcome";
export const WARM_MEMORIES_LOCKED_GIFT_SCENE = "warm.memories.locked-gift";
export const WARM_MEMORIES_GIFT_LOCKED_SCENE = "warm.memories.gift-locked";
export const WARM_MEMORIES_MATCH_TRANSITION_SCENE =
  "warm.memories.match-transition";
export const WARM_MEMORIES_MATCH_INTRO_SCENE = "warm.memories.match-intro";
export const WARM_MEMORIES_CALCULATING_SCENE = "warm.memories.calculating";
export const WARM_MEMORIES_SCORE_REVEAL_SCENE = "warm.memories.score-reveal";
export const WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE =
  "warm.memories.celebration-transition";
export const WARM_MEMORIES_LETTER_EMERGENCE_SCENE =
  "warm.memories.letter-emergence";
export const WARM_MEMORIES_LETTER_REVEAL_SCENE = "warm.memories.letter-reveal";
export const WARM_MEMORIES_GALLERY_UNLOCK_SCENE =
  "warm.memories.gallery-unlock";
export const WARM_MEMORIES_GALLERY_SCENE = "warm.memories.gallery";
export const WARM_MEMORIES_GALLERY_ENDING_SCENE =
  "warm.memories.gallery-ending";
export const WARM_MEMORIES_PHOTOBOOTH_SCENE = "warm.memories.photobooth";

export const WARM_MEMORIES_STATIC_SCENE_IDS = [
  WARM_MEMORIES_INITIAL_SCENE,
  WARM_MEMORIES_WELCOME_SCENE,
  WARM_MEMORIES_LOCKED_GIFT_SCENE,
  WARM_MEMORIES_GIFT_LOCKED_SCENE,
  WARM_MEMORIES_MATCH_TRANSITION_SCENE,
  WARM_MEMORIES_MATCH_INTRO_SCENE,
  WARM_MEMORIES_CALCULATING_SCENE,
  WARM_MEMORIES_SCORE_REVEAL_SCENE,
  WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE,
  WARM_MEMORIES_LETTER_EMERGENCE_SCENE,
  WARM_MEMORIES_LETTER_REVEAL_SCENE,
  WARM_MEMORIES_GALLERY_UNLOCK_SCENE,
  WARM_MEMORIES_GALLERY_SCENE,
  WARM_MEMORIES_GALLERY_ENDING_SCENE,
  WARM_MEMORIES_PHOTOBOOTH_SCENE,
] as const;

export type WarmMemoriesStaticSceneId =
  (typeof WARM_MEMORIES_STATIC_SCENE_IDS)[number];

/** Parameterized match nodes — `warm.memories.match.memory.{n}`. */
export type WarmMemoriesMatchMemorySceneId =
  `warm.memories.match.memory.${number}`;

export type WarmMemoriesLabSceneId =
  WarmMemoriesStaticSceneId | WarmMemoriesMatchMemorySceneId;

/** Default Theme Lab pair count when host does not pass an override. */
export const WARM_MEMORIES_LAB_DEFAULT_PAIR_COUNT = 4;

export type WarmMemoriesSceneContext = {
  memoryPairCount: number;
  hasPhotos: boolean;
};

/** Timed auto-advance — mirrors Warm Connection / Bloom Memories. */
export const WARM_MEMORIES_SCENE_DURATIONS_MS: Partial<
  Record<WarmMemoriesStaticSceneId, number>
> = {
  [WARM_MEMORIES_INITIAL_SCENE]: 2800,
  /** Scrapbook MEMORY MATCH celebration — longer beat so heboh lands. */
  [WARM_MEMORIES_MATCH_TRANSITION_SCENE]: 2300,
  /** Soft anticipation — same as Warm Connection score-calculation. */
  [WARM_MEMORIES_CALCULATING_SCENE]: 2000,
  /** Celebration bridge — reuses Warm Connection fireworks. */
  [WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE]: 2300,
  /** Letter emergence — gift opens + To/From head. */
  [WARM_MEMORIES_LETTER_EMERGENCE_SCENE]: 1400,
};

export function isWarmMemoriesMatchMemoryScene(
  sceneId: WarmMemoriesLabSceneId,
): sceneId is WarmMemoriesMatchMemorySceneId {
  return sceneId.startsWith("warm.memories.match.memory.");
}

export function parseWarmMemoriesMatchMemoryIndex(
  sceneId: WarmMemoriesLabSceneId,
): number | null {
  if (!isWarmMemoriesMatchMemoryScene(sceneId)) return null;
  const raw = sceneId.slice("warm.memories.match.memory.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function warmMemoriesMatchMemorySceneId(
  index: number,
): WarmMemoriesMatchMemorySceneId {
  return `warm.memories.match.memory.${index}`;
}

/**
 * Resolve next Warm Memories scene.
 * Match → calculating → … → photobooth (Warm Connection living tail).
 * Gallery skip: unlock → photobooth when `hasPhotos === false`.
 */
export function resolveNextWarmMemoriesScene(
  current: WarmMemoriesLabSceneId,
  context: WarmMemoriesSceneContext = {
    memoryPairCount: WARM_MEMORIES_LAB_DEFAULT_PAIR_COUNT,
    hasPhotos: true,
  },
): WarmMemoriesLabSceneId | null {
  const count = Math.max(0, Math.floor(context.memoryPairCount));

  if (isWarmMemoriesMatchMemoryScene(current)) {
    const index = parseWarmMemoriesMatchMemoryIndex(current);
    if (index == null) return null;
    if (index + 1 < count) return warmMemoriesMatchMemorySceneId(index + 1);
    return WARM_MEMORIES_CALCULATING_SCENE;
  }

  switch (current) {
    case WARM_MEMORIES_INITIAL_SCENE:
      return WARM_MEMORIES_WELCOME_SCENE;
    case WARM_MEMORIES_WELCOME_SCENE:
      return WARM_MEMORIES_LOCKED_GIFT_SCENE;
    case WARM_MEMORIES_LOCKED_GIFT_SCENE:
      return WARM_MEMORIES_GIFT_LOCKED_SCENE;
    case WARM_MEMORIES_GIFT_LOCKED_SCENE:
      return WARM_MEMORIES_MATCH_TRANSITION_SCENE;
    case WARM_MEMORIES_MATCH_TRANSITION_SCENE:
      return WARM_MEMORIES_MATCH_INTRO_SCENE;
    case WARM_MEMORIES_MATCH_INTRO_SCENE:
      return count > 0
        ? warmMemoriesMatchMemorySceneId(0)
        : WARM_MEMORIES_CALCULATING_SCENE;
    case WARM_MEMORIES_CALCULATING_SCENE:
      return WARM_MEMORIES_SCORE_REVEAL_SCENE;
    case WARM_MEMORIES_SCORE_REVEAL_SCENE:
      return WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE;
    case WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE:
      return WARM_MEMORIES_LETTER_EMERGENCE_SCENE;
    case WARM_MEMORIES_LETTER_EMERGENCE_SCENE:
      return WARM_MEMORIES_LETTER_REVEAL_SCENE;
    case WARM_MEMORIES_LETTER_REVEAL_SCENE:
      return WARM_MEMORIES_GALLERY_UNLOCK_SCENE;
    case WARM_MEMORIES_GALLERY_UNLOCK_SCENE:
      return context.hasPhotos
        ? WARM_MEMORIES_GALLERY_SCENE
        : WARM_MEMORIES_PHOTOBOOTH_SCENE;
    case WARM_MEMORIES_GALLERY_SCENE:
      return WARM_MEMORIES_GALLERY_ENDING_SCENE;
    case WARM_MEMORIES_GALLERY_ENDING_SCENE:
      return WARM_MEMORIES_PHOTOBOOTH_SCENE;
    case WARM_MEMORIES_PHOTOBOOTH_SCENE:
      return null;
    default:
      return null;
  }
}
