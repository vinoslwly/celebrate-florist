/** Sprint 11 Connection scene IDs — Theme Lab presentation layer (partial). */

export const CONNECTION_STATIC_SCENE_IDS = [
  "connection.celebrate-loading",
  "connection.gift-introduction",
  "connection.locked-gift",
  "connection.challenge-invitation",
  "connection.quiz-transition",
  "connection.quiz-introduction",
  "connection.score-calculation",
  "connection.score-reveal",
  "connection.celebration-transition",
  "connection.letter-emergence",
  "connection.letter-reveal",
  /** Scene 12 — reuses Moments album unlock transition. */
  "connection.gallery-unlock",
  /** Scene 13 — reuses Moments gallery (skipped when no photos). */
  "connection.gallery",
  /** Scene 14 — reuses Moments gallery ending. */
  "connection.gallery-ending",
  /** Scene 15 — reuses Moments photobooth (Sprint 14 redesign deferred). */
  "connection.photobooth",
] as const;

export type ConnectionStaticSceneId =
  (typeof CONNECTION_STATIC_SCENE_IDS)[number];

/** Parameterized quiz nodes — `connection.quiz.question.{n}` (FD-S11-04). */
export type ConnectionQuizQuestionSceneId =
  `connection.quiz.question.${number}`;

export type ConnectionSceneId =
  ConnectionStaticSceneId | ConnectionQuizQuestionSceneId;

export const CONNECTION_INITIAL_SCENE: ConnectionSceneId =
  "connection.celebrate-loading";

/** Default Theme Lab question count when host does not pass an override. */
export const CONNECTION_LAB_DEFAULT_QUIZ_COUNT = 5;

export type ConnectionSceneContext = {
  quizQuestionCount: number;
  hasPhotos: boolean;
};

/** Logical duration hints (ms) for auto-advance scenes. */
export const CONNECTION_SCENE_DURATIONS_MS: Partial<
  Record<ConnectionStaticSceneId, number>
> = {
  "connection.celebrate-loading": 2800,
  /** Romantic quiz bridge — 2s override (cinematic, not GER-01 default). */
  "connection.quiz-transition": 2000,
  /** Soft anticipation while submit settles — ~2s romantic beat (lab). */
  "connection.score-calculation": 2000,
  /** Celebration bridge — long enough for large SVG fireworks to bloom. */
  "connection.celebration-transition": 2300,
  /** Scene 10 — emotional open + letter head; GER-01 ~1.0–1.5s */
  "connection.letter-emergence": 1400,
  /** Scene 12 — same as Moments album unlock (~3s). */
  "connection.gallery-unlock": 3000,
  /** Scene 14 — same as Moments gallery ending (~1.6s). */
  "connection.gallery-ending": 1600,
};

export function isConnectionQuizQuestionScene(
  sceneId: ConnectionSceneId,
): sceneId is ConnectionQuizQuestionSceneId {
  return sceneId.startsWith("connection.quiz.question.");
}

export function parseConnectionQuizQuestionIndex(
  sceneId: ConnectionSceneId,
): number | null {
  if (!isConnectionQuizQuestionScene(sceneId)) return null;
  const raw = sceneId.slice("connection.quiz.question.".length);
  const n = Number(raw);
  return Number.isInteger(n) && n >= 0 ? n : null;
}

export function connectionQuizQuestionSceneId(
  index: number,
): ConnectionQuizQuestionSceneId {
  return `connection.quiz.question.${index}`;
}

/**
 * Resolve the next Connection scene after the current one completes.
 * Gallery skip: unlock → photobooth hold when no photos (architecture Scene 12→15).
 */
export function resolveNextConnectionScene(
  current: ConnectionSceneId,
  context: ConnectionSceneContext | number = CONNECTION_LAB_DEFAULT_QUIZ_COUNT,
): ConnectionSceneId | null {
  const opts: ConnectionSceneContext =
    typeof context === "number"
      ? { quizQuestionCount: context, hasPhotos: true }
      : context;
  const count = Math.max(0, Math.floor(opts.quizQuestionCount));

  switch (current) {
    case "connection.celebrate-loading":
      return "connection.gift-introduction";
    case "connection.gift-introduction":
      return "connection.locked-gift";
    case "connection.locked-gift":
      return "connection.challenge-invitation";
    case "connection.challenge-invitation":
      return "connection.quiz-transition";
    case "connection.quiz-transition":
      return "connection.quiz-introduction";
    case "connection.quiz-introduction":
      return count > 0
        ? connectionQuizQuestionSceneId(0)
        : "connection.score-calculation";
    case "connection.score-calculation":
      return "connection.score-reveal";
    case "connection.score-reveal":
      return "connection.celebration-transition";
    case "connection.celebration-transition":
      return "connection.letter-emergence";
    case "connection.letter-emergence":
      return "connection.letter-reveal";
    case "connection.letter-reveal":
      return "connection.gallery-unlock";
    case "connection.gallery-unlock":
      return opts.hasPhotos ? "connection.gallery" : "connection.photobooth";
    case "connection.gallery":
      return "connection.gallery-ending";
    case "connection.gallery-ending":
      return "connection.photobooth";
    case "connection.photobooth":
      return null;
    default:
      break;
  }

  const qIndex = parseConnectionQuizQuestionIndex(current);
  if (qIndex != null) {
    const next = qIndex + 1;
    if (next < count) return connectionQuizQuestionSceneId(next);
    return "connection.score-calculation";
  }

  return null;
}
