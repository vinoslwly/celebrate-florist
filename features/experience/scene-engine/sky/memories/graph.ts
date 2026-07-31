/**
 * Sky Memories Theme Lab scene graph — Scenes 0–end.
 * 0–3 reuse Sky Connection; 4–6 Sky Memories–owned match;
 * 7–end reuse Sky Connection living tail (no letter-emergence / gallery-ending —
 * those are deferred on Sky Connection itself).
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */

export const SKY_MEMORIES_INITIAL_SCENE = "sky.memories.celebrate-loading";
export const SKY_MEMORIES_WELCOME_SCENE = "sky.memories.welcome";
export const SKY_MEMORIES_LOCKED_GIFT_SCENE = "sky.memories.locked-gift";
export const SKY_MEMORIES_GIFT_LOCKED_SCENE = "sky.memories.gift-locked";
export const SKY_MEMORIES_MATCH_TRANSITION_SCENE =
  "sky.memories.match-transition";
export const SKY_MEMORIES_MATCH_INTRO_SCENE = "sky.memories.match-intro";
export const SKY_MEMORIES_CALCULATING_SCENE = "sky.memories.calculating";
export const SKY_MEMORIES_SCORE_REVEAL_SCENE = "sky.memories.score-reveal";
export const SKY_MEMORIES_CELEBRATION_TRANSITION_SCENE =
  "sky.memories.celebration-transition";
export const SKY_MEMORIES_LETTER_REVEAL_SCENE = "sky.memories.letter-reveal";
export const SKY_MEMORIES_GALLERY_UNLOCK_SCENE = "sky.memories.gallery-unlock";
export const SKY_MEMORIES_GALLERY_SCENE = "sky.memories.gallery";
export const SKY_MEMORIES_PHOTOBOOTH_SCENE = "sky.memories.photobooth";

export const SKY_MEMORIES_STATIC_SCENE_IDS = [
  SKY_MEMORIES_INITIAL_SCENE,
  SKY_MEMORIES_WELCOME_SCENE,
  SKY_MEMORIES_LOCKED_GIFT_SCENE,
  SKY_MEMORIES_GIFT_LOCKED_SCENE,
  SKY_MEMORIES_MATCH_TRANSITION_SCENE,
  SKY_MEMORIES_MATCH_INTRO_SCENE,
  SKY_MEMORIES_CALCULATING_SCENE,
  SKY_MEMORIES_SCORE_REVEAL_SCENE,
  SKY_MEMORIES_CELEBRATION_TRANSITION_SCENE,
  SKY_MEMORIES_LETTER_REVEAL_SCENE,
  SKY_MEMORIES_GALLERY_UNLOCK_SCENE,
  SKY_MEMORIES_GALLERY_SCENE,
  SKY_MEMORIES_PHOTOBOOTH_SCENE,
] as const;

export type SkyMemoriesStaticSceneId =
  (typeof SKY_MEMORIES_STATIC_SCENE_IDS)[number];

/** Parameterized match nodes — `sky.memories.match.memory.{n}`. */
export type SkyMemoriesMatchMemorySceneId =
  `sky.memories.match.memory.${number}`;

export type SkyMemoriesLabSceneId =
  SkyMemoriesStaticSceneId | SkyMemoriesMatchMemorySceneId;

/** Default Theme Lab pair count when host does not pass an override. */
export const SKY_MEMORIES_LAB_DEFAULT_PAIR_COUNT = 4;

export type SkyMemoriesSceneContext = {
  memoryPairCount: number;
  hasPhotos: boolean;
};

/**
 * Timed auto-advance.
 * Celebration + gallery-unlock self-advance via Moments onComplete — not listed.
 */
export const SKY_MEMORIES_SCENE_DURATIONS_MS: Partial<
  Record<SkyMemoriesStaticSceneId, number>
> = {
  [SKY_MEMORIES_INITIAL_SCENE]: 2800,
  [SKY_MEMORIES_MATCH_TRANSITION_SCENE]: 2500,
  [SKY_MEMORIES_CALCULATING_SCENE]: 2000,
};

export function isSkyMemoriesMatchMemoryScene(
  sceneId: SkyMemoriesLabSceneId,
): sceneId is SkyMemoriesMatchMemorySceneId {
  return sceneId.startsWith("sky.memories.match.memory.");
}

export function parseSkyMemoriesMatchMemoryIndex(
  sceneId: SkyMemoriesLabSceneId,
): number | null {
  if (!isSkyMemoriesMatchMemoryScene(sceneId)) return null;
  const raw = sceneId.slice("sky.memories.match.memory.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function skyMemoriesMatchMemorySceneId(
  index: number,
): SkyMemoriesMatchMemorySceneId {
  return `sky.memories.match.memory.${index}`;
}

/**
 * Resolve next Sky Memories scene.
 * Match → calculating → score → celebration → letter → unlock → gallery → photobooth.
 * Gallery skip: unlock → photobooth when `hasPhotos === false`.
 */
export function resolveNextSkyMemoriesScene(
  current: SkyMemoriesLabSceneId,
  context: SkyMemoriesSceneContext = {
    memoryPairCount: SKY_MEMORIES_LAB_DEFAULT_PAIR_COUNT,
    hasPhotos: true,
  },
): SkyMemoriesLabSceneId | null {
  const count = Math.max(0, Math.floor(context.memoryPairCount));

  if (isSkyMemoriesMatchMemoryScene(current)) {
    const index = parseSkyMemoriesMatchMemoryIndex(current);
    if (index == null) return null;
    if (index + 1 < count) return skyMemoriesMatchMemorySceneId(index + 1);
    return SKY_MEMORIES_CALCULATING_SCENE;
  }

  switch (current) {
    case SKY_MEMORIES_INITIAL_SCENE:
      return SKY_MEMORIES_WELCOME_SCENE;
    case SKY_MEMORIES_WELCOME_SCENE:
      return SKY_MEMORIES_LOCKED_GIFT_SCENE;
    case SKY_MEMORIES_LOCKED_GIFT_SCENE:
      return SKY_MEMORIES_GIFT_LOCKED_SCENE;
    case SKY_MEMORIES_GIFT_LOCKED_SCENE:
      return SKY_MEMORIES_MATCH_TRANSITION_SCENE;
    case SKY_MEMORIES_MATCH_TRANSITION_SCENE:
      return SKY_MEMORIES_MATCH_INTRO_SCENE;
    case SKY_MEMORIES_MATCH_INTRO_SCENE:
      return count > 0 ? skyMemoriesMatchMemorySceneId(0) : null;
    case SKY_MEMORIES_CALCULATING_SCENE:
      return SKY_MEMORIES_SCORE_REVEAL_SCENE;
    case SKY_MEMORIES_SCORE_REVEAL_SCENE:
      return SKY_MEMORIES_CELEBRATION_TRANSITION_SCENE;
    case SKY_MEMORIES_CELEBRATION_TRANSITION_SCENE:
      return SKY_MEMORIES_LETTER_REVEAL_SCENE;
    case SKY_MEMORIES_LETTER_REVEAL_SCENE:
      return SKY_MEMORIES_GALLERY_UNLOCK_SCENE;
    case SKY_MEMORIES_GALLERY_UNLOCK_SCENE:
      return context.hasPhotos
        ? SKY_MEMORIES_GALLERY_SCENE
        : SKY_MEMORIES_PHOTOBOOTH_SCENE;
    case SKY_MEMORIES_GALLERY_SCENE:
      return SKY_MEMORIES_PHOTOBOOTH_SCENE;
    case SKY_MEMORIES_PHOTOBOOTH_SCENE:
      return null;
    default:
      return null;
  }
}
