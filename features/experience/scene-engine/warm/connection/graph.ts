/**
 * Warm Connection Theme Lab scene graph — Scenes 0–15 living
 * (quiz = parameterized `warm.connection.quiz.question.{n}`).
 */

export const WARM_CONNECTION_INITIAL_SCENE =
  "warm.connection.celebrate-loading";
export const WARM_CONNECTION_GIFT_INTRODUCTION_SCENE =
  "warm.connection.gift-introduction";
export const WARM_CONNECTION_LOCKED_GIFT_SCENE = "warm.connection.locked-gift";
export const WARM_CONNECTION_CHALLENGE_INVITATION_SCENE =
  "warm.connection.challenge-invitation";
export const WARM_CONNECTION_QUIZ_TRANSITION_SCENE =
  "warm.connection.quiz-transition";
export const WARM_CONNECTION_QUIZ_INTRODUCTION_SCENE =
  "warm.connection.quiz-introduction";
export const WARM_CONNECTION_SCORE_CALCULATION_SCENE =
  "warm.connection.score-calculation";
export const WARM_CONNECTION_SCORE_REVEAL_SCENE =
  "warm.connection.score-reveal";
export const WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE =
  "warm.connection.celebration-transition";
export const WARM_CONNECTION_LETTER_EMERGENCE_SCENE =
  "warm.connection.letter-emergence";
export const WARM_CONNECTION_LETTER_REVEAL_SCENE =
  "warm.connection.letter-reveal";
export const WARM_CONNECTION_GALLERY_UNLOCK_SCENE =
  "warm.connection.gallery-unlock";
export const WARM_CONNECTION_GALLERY_SCENE = "warm.connection.gallery";
export const WARM_CONNECTION_GALLERY_ENDING_SCENE =
  "warm.connection.gallery-ending";
export const WARM_CONNECTION_PHOTOBOOTH_SCENE = "warm.connection.photobooth";

export const WARM_CONNECTION_STATIC_SCENE_IDS = [
  WARM_CONNECTION_INITIAL_SCENE,
  WARM_CONNECTION_GIFT_INTRODUCTION_SCENE,
  WARM_CONNECTION_LOCKED_GIFT_SCENE,
  WARM_CONNECTION_CHALLENGE_INVITATION_SCENE,
  WARM_CONNECTION_QUIZ_TRANSITION_SCENE,
  WARM_CONNECTION_QUIZ_INTRODUCTION_SCENE,
  WARM_CONNECTION_SCORE_CALCULATION_SCENE,
  WARM_CONNECTION_SCORE_REVEAL_SCENE,
  WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE,
  WARM_CONNECTION_LETTER_EMERGENCE_SCENE,
  WARM_CONNECTION_LETTER_REVEAL_SCENE,
  WARM_CONNECTION_GALLERY_UNLOCK_SCENE,
  WARM_CONNECTION_GALLERY_SCENE,
  WARM_CONNECTION_GALLERY_ENDING_SCENE,
  WARM_CONNECTION_PHOTOBOOTH_SCENE,
] as const;

export type WarmConnectionStaticSceneId =
  (typeof WARM_CONNECTION_STATIC_SCENE_IDS)[number];

/** Parameterized quiz nodes — `warm.connection.quiz.question.{n}` (FD-S11-04). */
export type WarmConnectionQuizQuestionSceneId =
  `warm.connection.quiz.question.${number}`;

export type WarmConnectionLabSceneId =
  WarmConnectionStaticSceneId | WarmConnectionQuizQuestionSceneId;

/** Default Theme Lab question count when host does not pass an override. */
export const WARM_CONNECTION_LAB_DEFAULT_QUIZ_COUNT = 5;

export type WarmConnectionSceneContext = {
  quizQuestionCount: number;
  hasPhotos: boolean;
};

/** Logical duration hints (ms) for auto-advance scenes — mirrors Bloom Connection. */
export const WARM_CONNECTION_SCENE_DURATIONS_MS: Partial<
  Record<WarmConnectionStaticSceneId, number>
> = {
  [WARM_CONNECTION_INITIAL_SCENE]: 2800,
  /** Romantic quiz bridge — 2s (same as Bloom Connection Scene 4). */
  [WARM_CONNECTION_QUIZ_TRANSITION_SCENE]: 2000,
  /** Soft anticipation while submit settles — ~2s romantic beat (lab). */
  [WARM_CONNECTION_SCORE_CALCULATION_SCENE]: 2000,
  /** Celebration bridge — luxury SVG fireworks bloom. */
  [WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE]: 2300,
  /** Letter emergence — gift opens + To/From head (no CTA). */
  [WARM_CONNECTION_LETTER_EMERGENCE_SCENE]: 1400,
};

export function isWarmConnectionQuizQuestionScene(
  sceneId: WarmConnectionLabSceneId,
): sceneId is WarmConnectionQuizQuestionSceneId {
  return sceneId.startsWith("warm.connection.quiz.question.");
}

export function parseWarmConnectionQuizQuestionIndex(
  sceneId: WarmConnectionLabSceneId,
): number | null {
  if (!isWarmConnectionQuizQuestionScene(sceneId)) return null;
  const raw = sceneId.slice("warm.connection.quiz.question.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function warmConnectionQuizQuestionSceneId(
  index: number,
): WarmConnectionQuizQuestionSceneId {
  return `warm.connection.quiz.question.${index}`;
}

/**
 * Resolve next Warm Connection scene.
 * Gallery skip: unlock → photobooth when `hasPhotos === false`.
 */
export function resolveNextWarmConnectionScene(
  current: WarmConnectionLabSceneId,
  context:
    | WarmConnectionSceneContext
    | number = WARM_CONNECTION_LAB_DEFAULT_QUIZ_COUNT,
): WarmConnectionLabSceneId | null {
  const opts: WarmConnectionSceneContext =
    typeof context === "number"
      ? { quizQuestionCount: context, hasPhotos: true }
      : context;
  const count = Math.max(0, Math.floor(opts.quizQuestionCount));

  switch (current) {
    case WARM_CONNECTION_INITIAL_SCENE:
      return WARM_CONNECTION_GIFT_INTRODUCTION_SCENE;
    case WARM_CONNECTION_GIFT_INTRODUCTION_SCENE:
      return WARM_CONNECTION_LOCKED_GIFT_SCENE;
    case WARM_CONNECTION_LOCKED_GIFT_SCENE:
      return WARM_CONNECTION_CHALLENGE_INVITATION_SCENE;
    case WARM_CONNECTION_CHALLENGE_INVITATION_SCENE:
      return WARM_CONNECTION_QUIZ_TRANSITION_SCENE;
    case WARM_CONNECTION_QUIZ_TRANSITION_SCENE:
      return WARM_CONNECTION_QUIZ_INTRODUCTION_SCENE;
    case WARM_CONNECTION_QUIZ_INTRODUCTION_SCENE:
      return count > 0
        ? warmConnectionQuizQuestionSceneId(0)
        : WARM_CONNECTION_SCORE_CALCULATION_SCENE;
    case WARM_CONNECTION_SCORE_CALCULATION_SCENE:
      return WARM_CONNECTION_SCORE_REVEAL_SCENE;
    case WARM_CONNECTION_SCORE_REVEAL_SCENE:
      return WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE;
    case WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE:
      return WARM_CONNECTION_LETTER_EMERGENCE_SCENE;
    case WARM_CONNECTION_LETTER_EMERGENCE_SCENE:
      return WARM_CONNECTION_LETTER_REVEAL_SCENE;
    case WARM_CONNECTION_LETTER_REVEAL_SCENE:
      return WARM_CONNECTION_GALLERY_UNLOCK_SCENE;
    case WARM_CONNECTION_GALLERY_UNLOCK_SCENE:
      return opts.hasPhotos
        ? WARM_CONNECTION_GALLERY_SCENE
        : WARM_CONNECTION_PHOTOBOOTH_SCENE;
    case WARM_CONNECTION_GALLERY_SCENE:
      return WARM_CONNECTION_GALLERY_ENDING_SCENE;
    case WARM_CONNECTION_GALLERY_ENDING_SCENE:
      return WARM_CONNECTION_PHOTOBOOTH_SCENE;
    case WARM_CONNECTION_PHOTOBOOTH_SCENE:
      return null;
    default:
      break;
  }

  const qIndex = parseWarmConnectionQuizQuestionIndex(current);
  if (qIndex != null) {
    const next = qIndex + 1;
    if (next < count) return warmConnectionQuizQuestionSceneId(next);
    return WARM_CONNECTION_SCORE_CALCULATION_SCENE;
  }

  return null;
}
