"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  getHostSceneFade,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import {
  isWarmConnectionQuizQuestionScene,
  parseWarmConnectionQuizQuestionIndex,
  resolveNextWarmConnectionScene,
  WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE,
  WARM_CONNECTION_CHALLENGE_INVITATION_SCENE,
  WARM_CONNECTION_GALLERY_ENDING_SCENE,
  WARM_CONNECTION_GALLERY_SCENE,
  WARM_CONNECTION_GALLERY_UNLOCK_SCENE,
  WARM_CONNECTION_GIFT_INTRODUCTION_SCENE,
  WARM_CONNECTION_INITIAL_SCENE,
  WARM_CONNECTION_LETTER_EMERGENCE_SCENE,
  WARM_CONNECTION_LETTER_REVEAL_SCENE,
  WARM_CONNECTION_LOCKED_GIFT_SCENE,
  WARM_CONNECTION_PHOTOBOOTH_SCENE,
  WARM_CONNECTION_QUIZ_INTRODUCTION_SCENE,
  WARM_CONNECTION_QUIZ_TRANSITION_SCENE,
  WARM_CONNECTION_SCENE_DURATIONS_MS,
  WARM_CONNECTION_SCORE_CALCULATION_SCENE,
  WARM_CONNECTION_SCORE_REVEAL_SCENE,
  type WarmConnectionLabSceneId,
  type WarmConnectionStaticSceneId,
} from "@/features/experience/scene-engine/warm/connection/graph";
import { WarmConnectionCelebrateLoadingScene } from "@/features/experience/scene-engine/warm/connection/scenes/celebrate-loading-scene";
import { WarmConnectionCelebrationTransitionScene } from "@/features/experience/scene-engine/warm/connection/scenes/celebration-transition-scene";
import { WarmConnectionChallengeInvitationScene } from "@/features/experience/scene-engine/warm/connection/scenes/challenge-invitation-scene";
import { WarmConnectionGalleryEndingScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-ending-scene";
import { WarmConnectionGalleryScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-scene";
import { WarmConnectionGalleryUnlockScene } from "@/features/experience/scene-engine/warm/connection/scenes/gallery-unlock-scene";
import { WarmConnectionGiftIntroductionScene } from "@/features/experience/scene-engine/warm/connection/scenes/gift-introduction-scene";
import { WarmConnectionLetterEmergenceScene } from "@/features/experience/scene-engine/warm/connection/scenes/letter-emergence-scene";
import { WarmConnectionLetterRevealScene } from "@/features/experience/scene-engine/warm/connection/scenes/letter-reveal-scene";
import { WarmConnectionLockedGiftScene } from "@/features/experience/scene-engine/warm/connection/scenes/locked-gift-scene";
import { WarmConnectionPhotoboothScene } from "@/features/experience/scene-engine/warm/connection/scenes/photobooth-scene";
import { WarmConnectionQuizIntroductionScene } from "@/features/experience/scene-engine/warm/connection/scenes/quiz-introduction-scene";
import { WarmConnectionQuizQuestionScene } from "@/features/experience/scene-engine/warm/connection/scenes/quiz-question-scene";
import { WarmConnectionQuizTransitionScene } from "@/features/experience/scene-engine/warm/connection/scenes/quiz-transition-scene";
import { WarmConnectionScoreCalculationScene } from "@/features/experience/scene-engine/warm/connection/scenes/score-calculation-scene";
import { WarmConnectionScoreRevealScene } from "@/features/experience/scene-engine/warm/connection/scenes/score-reveal-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  WarmConnectionLabQuiz,
  WarmConnectionLabScoreResult,
} from "@/features/theme-lab/config/warm-connection-fixtures";

export {
  WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE,
  WARM_CONNECTION_CHALLENGE_INVITATION_SCENE,
  WARM_CONNECTION_GALLERY_ENDING_SCENE,
  WARM_CONNECTION_GALLERY_SCENE,
  WARM_CONNECTION_GALLERY_UNLOCK_SCENE,
  WARM_CONNECTION_GIFT_INTRODUCTION_SCENE,
  WARM_CONNECTION_INITIAL_SCENE,
  WARM_CONNECTION_LETTER_EMERGENCE_SCENE,
  WARM_CONNECTION_LETTER_REVEAL_SCENE,
  WARM_CONNECTION_LOCKED_GIFT_SCENE,
  WARM_CONNECTION_PHOTOBOOTH_SCENE,
  WARM_CONNECTION_QUIZ_INTRODUCTION_SCENE,
  WARM_CONNECTION_QUIZ_TRANSITION_SCENE,
  WARM_CONNECTION_SCORE_CALCULATION_SCENE,
  WARM_CONNECTION_SCORE_REVEAL_SCENE,
  type WarmConnectionLabSceneId,
} from "@/features/experience/scene-engine/warm/connection/graph";

type WarmConnectionSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  /** Theme Lab quiz fixture — drives parameterized Scene 6 nodes. */
  quiz: WarmConnectionLabQuiz;
  /** Theme Lab score fixture — drives Scene 8 reveal. */
  scoreResult: WarmConnectionLabScoreResult;
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Warm Connection Theme Lab host — Scenes 0–15 living (through photobooth).
 * Timed scenes mirror Bloom Connection; album unlock / gallery ending self-advance.
 */
export function WarmConnectionSceneHost({
  experience,
  photos,
  theme,
  quiz,
  scoreResult,
  className,
  showLabChrome = false,
}: WarmConnectionSceneHostProps) {
  const [sceneId, setSceneId] = useState<WarmConnectionLabSceneId>(
    WARM_CONNECTION_INITIAL_SCENE,
  );
  const [journeyKey, setJourneyKey] = useState(0);
  const reduceMotion = useCelebrateReducedMotion();
  const sceneFade = getHostSceneFade(reduceMotion);

  const quizQuestionCount = quiz.questions.length;
  const hasPhotos = photos.length > 0;
  const sceneContext = useMemo(
    () => ({ quizQuestionCount, hasPhotos }),
    [quizQuestionCount, hasPhotos],
  );
  const payload = useMemo(
    () => ({ experience, photos, theme }),
    [experience, photos, theme],
  );

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextWarmConnectionScene(current, sceneContext);
      return next ?? current;
    });
  }, [sceneContext]);

  useEffect(() => {
    if (isWarmConnectionQuizQuestionScene(sceneId)) return;
    const ms =
      WARM_CONNECTION_SCENE_DURATIONS_MS[
        sceneId as WarmConnectionStaticSceneId
      ];
    if (ms == null) return;
    const t = window.setTimeout(() => {
      advance();
    }, ms);
    return () => window.clearTimeout(t);
  }, [sceneId, journeyKey, advance]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sceneId]);

  function restartJourney() {
    setSceneId(WARM_CONNECTION_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const questionIndex = parseWarmConnectionQuizQuestionIndex(sceneId);
  const question =
    questionIndex != null ? quiz.questions[questionIndex] : undefined;

  return (
    <div
      className={cn("relative flex h-full min-h-0 w-full flex-col", className)}
    >
      {showLabChrome ? (
        <div className="z-40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-card/90 px-3 py-2 text-xs backdrop-blur-sm">
          <p className="font-mono text-[11px] text-muted-foreground">
            scene · <span className="text-foreground">{sceneId}</span>
            {!hasPhotos ? (
              <span className="ml-2 text-amber-700/90">· no-photos</span>
            ) : null}
          </p>
          <button
            type="button"
            className="rounded-md border border-border px-2 py-1 font-medium text-foreground hover:bg-muted/40"
            onClick={restartJourney}
          >
            Restart journey
          </button>
        </div>
      ) : null}

      <div
        className={cn(
          "relative min-h-0 w-full overflow-hidden",
          showLabChrome ? "h-full flex-1" : "min-h-[100svh]",
        )}
      >
        <AnimatePresence mode={sceneFade.presenceMode} initial={false}>
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className="absolute inset-0 z-10 flex min-h-0 flex-col overflow-hidden"
            initial={sceneFade.initial}
            animate={sceneFade.animate}
            exit={sceneFade.exit}
            transition={sceneFade.transition}
          >
            {question != null && questionIndex != null ? (
              <WarmConnectionQuizQuestionScene
                payload={payload}
                question={question}
                questionIndex={questionIndex}
                totalQuestions={quizQuestionCount}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_INITIAL_SCENE ? (
              <WarmConnectionCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_GIFT_INTRODUCTION_SCENE ? (
              <WarmConnectionGiftIntroductionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_LOCKED_GIFT_SCENE ? (
              <WarmConnectionLockedGiftScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_CHALLENGE_INVITATION_SCENE ? (
              <WarmConnectionChallengeInvitationScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_QUIZ_TRANSITION_SCENE ? (
              <WarmConnectionQuizTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_QUIZ_INTRODUCTION_SCENE ? (
              <WarmConnectionQuizIntroductionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_SCORE_CALCULATION_SCENE ? (
              <WarmConnectionScoreCalculationScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_SCORE_REVEAL_SCENE ? (
              <WarmConnectionScoreRevealScene
                payload={payload}
                scoreResult={scoreResult}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_CELEBRATION_TRANSITION_SCENE ? (
              <WarmConnectionCelebrationTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_LETTER_EMERGENCE_SCENE ? (
              <WarmConnectionLetterEmergenceScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_LETTER_REVEAL_SCENE ? (
              <WarmConnectionLetterRevealScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_GALLERY_UNLOCK_SCENE ? (
              <WarmConnectionGalleryUnlockScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_GALLERY_SCENE ? (
              <WarmConnectionGalleryScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_GALLERY_ENDING_SCENE ? (
              <WarmConnectionGalleryEndingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_CONNECTION_PHOTOBOOTH_SCENE ? (
              <WarmConnectionPhotoboothScene
                payload={payload}
                onComplete={advance}
              />
            ) : (
              <div
                className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, #8B1A22 0%, #6B0F16 50%, #4A0A10 100%)",
                }}
              >
                <p className="font-mono text-[11px] tracking-widest text-[#E8D4C0]/70 uppercase">
                  Warm Connection · Theme Lab
                </p>
                <p className="max-w-sm font-serif text-lg text-[#E8D4C0]">
                  Unknown scene · {sceneId}
                </p>
                <button
                  type="button"
                  className="text-xs text-[#E8D4C0]/70 underline-offset-2 hover:underline"
                  onClick={restartJourney}
                >
                  Restart from Scene 0
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
