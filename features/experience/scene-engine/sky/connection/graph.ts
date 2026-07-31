/**
 * Sky Connection Theme Lab scene graph — Scenes 0–15 living
 * (quiz = parameterized `sky.connection.quiz.question.{n}`).
 * Letter transition → end reuses Sky Moments Scene 5–9
 * (balloon → letter → heart-rain → gallery → photobooth).
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */

export const SKY_CONNECTION_INITIAL_SCENE = "sky.connection.celebrate-loading";
export const SKY_CONNECTION_GIFT_INTRODUCTION_SCENE =
  "sky.connection.gift-introduction";
export const SKY_CONNECTION_LOCKED_GIFT_SCENE = "sky.connection.locked-gift";
export const SKY_CONNECTION_CHALLENGE_INVITATION_SCENE =
  "sky.connection.challenge-invitation";
export const SKY_CONNECTION_QUIZ_TRANSITION_SCENE =
  "sky.connection.quiz-transition";
export const SKY_CONNECTION_QUIZ_INTRODUCTION_SCENE =
  "sky.connection.quiz-introduction";
export const SKY_CONNECTION_SCORE_CALCULATION_SCENE =
  "sky.connection.score-calculation";
export const SKY_CONNECTION_SCORE_REVEAL_SCENE = "sky.connection.score-reveal";
/** Reuses Sky Moments balloon-burst (Scene 5). */
export const SKY_CONNECTION_CELEBRATION_TRANSITION_SCENE =
  "sky.connection.celebration-transition";
/** Reuses Sky Moments letter (Scene 6). */
export const SKY_CONNECTION_LETTER_REVEAL_SCENE =
  "sky.connection.letter-reveal";
/** Reuses Sky Moments heart-rain (Scene 7). */
export const SKY_CONNECTION_GALLERY_UNLOCK_SCENE =
  "sky.connection.gallery-unlock";
/** Reuses Sky Moments gallery (Scene 8). */
export const SKY_CONNECTION_GALLERY_SCENE = "sky.connection.gallery";
/** Reuses Sky Moments photobooth (Scene 9) — terminal. */
export const SKY_CONNECTION_PHOTOBOOTH_SCENE = "sky.connection.photobooth";

export const SKY_CONNECTION_STATIC_SCENE_IDS = [
  SKY_CONNECTION_INITIAL_SCENE,
  SKY_CONNECTION_GIFT_INTRODUCTION_SCENE,
  SKY_CONNECTION_LOCKED_GIFT_SCENE,
  SKY_CONNECTION_CHALLENGE_INVITATION_SCENE,
  SKY_CONNECTION_QUIZ_TRANSITION_SCENE,
  SKY_CONNECTION_QUIZ_INTRODUCTION_SCENE,
  SKY_CONNECTION_SCORE_CALCULATION_SCENE,
  SKY_CONNECTION_SCORE_REVEAL_SCENE,
  SKY_CONNECTION_CELEBRATION_TRANSITION_SCENE,
  SKY_CONNECTION_LETTER_REVEAL_SCENE,
  SKY_CONNECTION_GALLERY_UNLOCK_SCENE,
  SKY_CONNECTION_GALLERY_SCENE,
  SKY_CONNECTION_PHOTOBOOTH_SCENE,
] as const;

export type SkyConnectionStaticSceneId =
  (typeof SKY_CONNECTION_STATIC_SCENE_IDS)[number];

/** Parameterized quiz nodes — `sky.connection.quiz.question.{n}` (FD-S11-04). */
export type SkyConnectionQuizQuestionSceneId =
  `sky.connection.quiz.question.${number}`;

export type SkyConnectionLabSceneId =
  SkyConnectionStaticSceneId | SkyConnectionQuizQuestionSceneId;

/** Default Theme Lab question count when host does not pass an override. */
export const SKY_CONNECTION_LAB_DEFAULT_QUIZ_COUNT = 5;

export type SkyConnectionSceneContext = {
  quizQuestionCount: number;
  hasPhotos: boolean;
};

/**
 * Host-driven auto-advance only.
 * Balloon burst + heart rain self-advance via Moments onComplete — not listed here.
 */
export const SKY_CONNECTION_SCENE_DURATIONS_MS: Partial<
  Record<SkyConnectionStaticSceneId, number>
> = {
  [SKY_CONNECTION_INITIAL_SCENE]: 2800,
  /** Bloom GER-01 cinematic override — keep emotional continuity into quiz. */
  [SKY_CONNECTION_QUIZ_TRANSITION_SCENE]: 2500,
  /** Bloom anticipation beat while score settles. */
  [SKY_CONNECTION_SCORE_CALCULATION_SCENE]: 2000,
};

export function isSkyConnectionQuizQuestionScene(
  sceneId: SkyConnectionLabSceneId,
): sceneId is SkyConnectionQuizQuestionSceneId {
  return sceneId.startsWith("sky.connection.quiz.question.");
}

export function parseSkyConnectionQuizQuestionIndex(
  sceneId: SkyConnectionLabSceneId,
): number | null {
  if (!isSkyConnectionQuizQuestionScene(sceneId)) return null;
  const raw = sceneId.slice("sky.connection.quiz.question.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function skyConnectionQuizQuestionSceneId(
  index: number,
): SkyConnectionQuizQuestionSceneId {
  return `sky.connection.quiz.question.${index}`;
}

/**
 * Resolve next Sky Connection scene.
 * After score reveal: Moments 5–9 reuse path.
 * Gallery skip: unlock → photobooth when `hasPhotos === false`.
 */
export function resolveNextSkyConnectionScene(
  current: SkyConnectionLabSceneId,
  context:
    SkyConnectionSceneContext | number = SKY_CONNECTION_LAB_DEFAULT_QUIZ_COUNT,
): SkyConnectionLabSceneId | null {
  const opts: SkyConnectionSceneContext =
    typeof context === "number"
      ? { quizQuestionCount: context, hasPhotos: true }
      : context;
  const count = Math.max(0, Math.floor(opts.quizQuestionCount));

  switch (current) {
    case SKY_CONNECTION_INITIAL_SCENE:
      return SKY_CONNECTION_GIFT_INTRODUCTION_SCENE;
    case SKY_CONNECTION_GIFT_INTRODUCTION_SCENE:
      return SKY_CONNECTION_LOCKED_GIFT_SCENE;
    case SKY_CONNECTION_LOCKED_GIFT_SCENE:
      return SKY_CONNECTION_CHALLENGE_INVITATION_SCENE;
    case SKY_CONNECTION_CHALLENGE_INVITATION_SCENE:
      return SKY_CONNECTION_QUIZ_TRANSITION_SCENE;
    case SKY_CONNECTION_QUIZ_TRANSITION_SCENE:
      return SKY_CONNECTION_QUIZ_INTRODUCTION_SCENE;
    case SKY_CONNECTION_QUIZ_INTRODUCTION_SCENE:
      return count > 0
        ? skyConnectionQuizQuestionSceneId(0)
        : SKY_CONNECTION_SCORE_CALCULATION_SCENE;
    case SKY_CONNECTION_SCORE_CALCULATION_SCENE:
      return SKY_CONNECTION_SCORE_REVEAL_SCENE;
    case SKY_CONNECTION_SCORE_REVEAL_SCENE:
      return SKY_CONNECTION_CELEBRATION_TRANSITION_SCENE;
    case SKY_CONNECTION_CELEBRATION_TRANSITION_SCENE:
      return SKY_CONNECTION_LETTER_REVEAL_SCENE;
    case SKY_CONNECTION_LETTER_REVEAL_SCENE:
      return SKY_CONNECTION_GALLERY_UNLOCK_SCENE;
    case SKY_CONNECTION_GALLERY_UNLOCK_SCENE:
      return opts.hasPhotos
        ? SKY_CONNECTION_GALLERY_SCENE
        : SKY_CONNECTION_PHOTOBOOTH_SCENE;
    case SKY_CONNECTION_GALLERY_SCENE:
      return SKY_CONNECTION_PHOTOBOOTH_SCENE;
    case SKY_CONNECTION_PHOTOBOOTH_SCENE:
      return null;
    default:
      break;
  }

  const qIndex = parseSkyConnectionQuizQuestionIndex(current);
  if (qIndex != null) {
    const next = qIndex + 1;
    if (next < count) return skyConnectionQuizQuestionSceneId(next);
    return SKY_CONNECTION_SCORE_CALCULATION_SCENE;
  }

  return null;
}
