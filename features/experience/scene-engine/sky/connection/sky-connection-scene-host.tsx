"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  isSkyConnectionQuizQuestionScene,
  parseSkyConnectionQuizQuestionIndex,
  resolveNextSkyConnectionScene,
  SKY_CONNECTION_CELEBRATION_TRANSITION_SCENE,
  SKY_CONNECTION_CHALLENGE_INVITATION_SCENE,
  SKY_CONNECTION_GALLERY_SCENE,
  SKY_CONNECTION_GALLERY_UNLOCK_SCENE,
  SKY_CONNECTION_GIFT_INTRODUCTION_SCENE,
  SKY_CONNECTION_INITIAL_SCENE,
  SKY_CONNECTION_LETTER_REVEAL_SCENE,
  SKY_CONNECTION_LOCKED_GIFT_SCENE,
  SKY_CONNECTION_PHOTOBOOTH_SCENE,
  SKY_CONNECTION_QUIZ_INTRODUCTION_SCENE,
  SKY_CONNECTION_QUIZ_TRANSITION_SCENE,
  SKY_CONNECTION_SCENE_DURATIONS_MS,
  SKY_CONNECTION_SCORE_CALCULATION_SCENE,
  SKY_CONNECTION_SCORE_REVEAL_SCENE,
  type SkyConnectionLabSceneId,
  type SkyConnectionStaticSceneId,
} from "@/features/experience/scene-engine/sky/connection/graph";
import { SkyConnectionCelebrateLoadingScene } from "@/features/experience/scene-engine/sky/connection/scenes/celebrate-loading-scene";
import { SkyConnectionCelebrationTransitionScene } from "@/features/experience/scene-engine/sky/connection/scenes/celebration-transition-scene";
import { SkyConnectionChallengeInvitationScene } from "@/features/experience/scene-engine/sky/connection/scenes/challenge-invitation-scene";
import { SkyConnectionGalleryScene } from "@/features/experience/scene-engine/sky/connection/scenes/gallery-scene";
import { SkyConnectionGalleryUnlockScene } from "@/features/experience/scene-engine/sky/connection/scenes/gallery-unlock-scene";
import { SkyConnectionGiftIntroductionScene } from "@/features/experience/scene-engine/sky/connection/scenes/gift-introduction-scene";
import { SkyConnectionLetterRevealScene } from "@/features/experience/scene-engine/sky/connection/scenes/letter-reveal-scene";
import { SkyConnectionLockedGiftScene } from "@/features/experience/scene-engine/sky/connection/scenes/locked-gift-scene";
import { SkyConnectionPhotoboothScene } from "@/features/experience/scene-engine/sky/connection/scenes/photobooth-scene";
import { SkyConnectionQuizIntroductionScene } from "@/features/experience/scene-engine/sky/connection/scenes/quiz-introduction-scene";
import { SkyConnectionQuizQuestionScene } from "@/features/experience/scene-engine/sky/connection/scenes/quiz-question-scene";
import { SkyConnectionQuizTransitionScene } from "@/features/experience/scene-engine/sky/connection/scenes/quiz-transition-scene";
import { SkyConnectionScoreCalculationScene } from "@/features/experience/scene-engine/sky/connection/scenes/score-calculation-scene";
import { SkyConnectionScoreRevealScene } from "@/features/experience/scene-engine/sky/connection/scenes/score-reveal-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  SkyConnectionLabQuiz,
  SkyConnectionLabScoreResult,
} from "@/features/theme-lab/config/sky-connection-fixtures";
import { SKY_CONNECTION_LAB_SCORE_RESULT } from "@/features/theme-lab/config/sky-connection-fixtures";

export {
  SKY_CONNECTION_CELEBRATION_TRANSITION_SCENE,
  SKY_CONNECTION_CHALLENGE_INVITATION_SCENE,
  SKY_CONNECTION_GALLERY_SCENE,
  SKY_CONNECTION_GALLERY_UNLOCK_SCENE,
  SKY_CONNECTION_GIFT_INTRODUCTION_SCENE,
  SKY_CONNECTION_INITIAL_SCENE,
  SKY_CONNECTION_LETTER_REVEAL_SCENE,
  SKY_CONNECTION_LOCKED_GIFT_SCENE,
  SKY_CONNECTION_PHOTOBOOTH_SCENE,
  SKY_CONNECTION_QUIZ_INTRODUCTION_SCENE,
  SKY_CONNECTION_QUIZ_TRANSITION_SCENE,
  SKY_CONNECTION_SCORE_CALCULATION_SCENE,
  SKY_CONNECTION_SCORE_REVEAL_SCENE,
  type SkyConnectionLabSceneId,
} from "@/features/experience/scene-engine/sky/connection/graph";

type SkyConnectionSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  quiz: SkyConnectionLabQuiz;
  scoreResult?: SkyConnectionLabScoreResult;
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Sky Connection Theme Lab host — Scenes 0–15 living (through photobooth).
 * Letter transition → end reuses Sky Moments Scene 5–9.
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */
export function SkyConnectionSceneHost({
  experience,
  photos,
  theme,
  quiz,
  scoreResult = SKY_CONNECTION_LAB_SCORE_RESULT,
  className,
  showLabChrome = false,
}: SkyConnectionSceneHostProps) {
  const [sceneId, setSceneId] = useState<SkyConnectionLabSceneId>(
    SKY_CONNECTION_INITIAL_SCENE,
  );
  const [journeyKey, setJourneyKey] = useState(0);

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
      const next = resolveNextSkyConnectionScene(current, sceneContext);
      return next ?? current;
    });
  }, [sceneContext]);

  useEffect(() => {
    if (isSkyConnectionQuizQuestionScene(sceneId)) return;
    const ms =
      SKY_CONNECTION_SCENE_DURATIONS_MS[sceneId as SkyConnectionStaticSceneId];
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
    setSceneId(SKY_CONNECTION_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const questionIndex = parseSkyConnectionQuizQuestionIndex(sceneId);
  const question =
    questionIndex != null ? quiz.questions[questionIndex] : undefined;

  return (
    <div
      className={cn("relative flex h-full min-h-0 w-full flex-col", className)}
    >
      {showLabChrome ? (
        <div className="z-40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E3A5F]/10 bg-[#EEF4FA] px-3 py-2 text-xs">
          <p className="font-mono text-[11px] text-[#1E3A5F]/70">
            scene · <span className="text-[#1E3A5F]">{sceneId}</span>
            {!hasPhotos ? (
              <span className="ml-2 text-amber-700/90">· no-photos</span>
            ) : null}
          </p>
          <button
            type="button"
            className="rounded-md border border-[#1E3A5F]/25 px-2 py-1 font-medium text-[#1E3A5F] hover:bg-[#E4EEF7]"
            onClick={restartJourney}
          >
            Restart journey
          </button>
        </div>
      ) : null}

      <div
        className={cn(
          "relative min-h-0 w-full overflow-hidden bg-[#C5DCEF]",
          showLabChrome ? "h-full flex-1" : "min-h-[100svh]",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className="absolute inset-0 flex h-full min-h-0 flex-col overflow-hidden bg-[#C5DCEF]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
          >
            {question != null && questionIndex != null ? (
              <SkyConnectionQuizQuestionScene
                payload={payload}
                question={question}
                questionIndex={questionIndex}
                totalQuestions={quizQuestionCount}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_INITIAL_SCENE ? (
              <SkyConnectionCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_GIFT_INTRODUCTION_SCENE ? (
              <SkyConnectionGiftIntroductionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_LOCKED_GIFT_SCENE ? (
              <SkyConnectionLockedGiftScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_CHALLENGE_INVITATION_SCENE ? (
              <SkyConnectionChallengeInvitationScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_QUIZ_TRANSITION_SCENE ? (
              <SkyConnectionQuizTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_QUIZ_INTRODUCTION_SCENE ? (
              <SkyConnectionQuizIntroductionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_SCORE_CALCULATION_SCENE ? (
              <SkyConnectionScoreCalculationScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_SCORE_REVEAL_SCENE ? (
              <SkyConnectionScoreRevealScene
                payload={payload}
                scoreResult={scoreResult}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_CELEBRATION_TRANSITION_SCENE ? (
              <SkyConnectionCelebrationTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_LETTER_REVEAL_SCENE ? (
              <SkyConnectionLetterRevealScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_GALLERY_UNLOCK_SCENE ? (
              <SkyConnectionGalleryUnlockScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_GALLERY_SCENE ? (
              <SkyConnectionGalleryScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_CONNECTION_PHOTOBOOTH_SCENE ? (
              <SkyConnectionPhotoboothScene
                payload={payload}
                onComplete={advance}
              />
            ) : (
              <div className="flex h-full min-h-full items-center justify-center bg-[#EEF4FA] px-6 text-center font-mono text-sm text-[#1E3A5F]/80">
                Unknown lab scene · {sceneId}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
