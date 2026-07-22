"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  CONNECTION_INITIAL_SCENE,
  CONNECTION_SCENE_DURATIONS_MS,
  isConnectionQuizQuestionScene,
  parseConnectionQuizQuestionIndex,
  resolveNextConnectionScene,
  type ConnectionSceneId,
  type ConnectionStaticSceneId,
} from "@/features/experience/scene-engine/connection/graph";
import { connectionSceneRegistry } from "@/features/experience/scene-engine/connection/registry";
import { ConnectionQuizQuestionScene } from "@/features/experience/scene-engine/connection/scenes/quiz-question-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  BloomConnectionLabQuiz,
  BloomConnectionLabScoreResult,
} from "@/features/theme-lab/config/bloom-connection-fixtures";
import { MomentsPersistentShell } from "@/features/themes/components/bloom-moments-decorations";

type ConnectionSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  /** Theme Lab quiz fixture — drives parameterized Scene 6 nodes. */
  quiz: BloomConnectionLabQuiz;
  /** Theme Lab score fixture — drives Scene 8 reveal. */
  scoreResult: BloomConnectionLabScoreResult;
  className?: string;
  /** Lab-only: show scene id chip + restart control. */
  showLabChrome?: boolean;
  initialScene?: ConnectionSceneId;
};

export function ConnectionSceneHost({
  experience,
  photos,
  theme,
  quiz,
  scoreResult,
  className,
  showLabChrome = false,
  initialScene = CONNECTION_INITIAL_SCENE,
}: ConnectionSceneHostProps) {
  const [sceneId, setSceneId] = useState<ConnectionSceneId>(initialScene);
  const [journeyKey, setJourneyKey] = useState(0);

  const quizQuestionCount = quiz.questions.length;
  const hasPhotos = photos.length > 0;
  const sceneContext = useMemo(
    () => ({ quizQuestionCount, hasPhotos }),
    [quizQuestionCount, hasPhotos],
  );
  const payload = useMemo(
    () => ({ experience, photos, theme, quiz, scoreResult }),
    [experience, photos, theme, quiz, scoreResult],
  );

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextConnectionScene(current, sceneContext);
      return next ?? current;
    });
  }, [sceneContext]);

  /** Timed scenes advance from the host so remounts cannot strand the timer. */
  useEffect(() => {
    /** Lab deep-link (?connectionScene=…) holds timed scenes for visual review. */
    if (
      showLabChrome &&
      initialScene !== CONNECTION_INITIAL_SCENE &&
      sceneId === initialScene
    ) {
      return;
    }
    if (isConnectionQuizQuestionScene(sceneId)) return;
    const ms =
      CONNECTION_SCENE_DURATIONS_MS[sceneId as ConnectionStaticSceneId];
    if (ms == null) return;
    const t = window.setTimeout(() => {
      setSceneId((current) => {
        const next = resolveNextConnectionScene(current, sceneContext);
        return next ?? current;
      });
    }, ms);
    return () => window.clearTimeout(t);
  }, [sceneId, journeyKey, sceneContext, showLabChrome, initialScene]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sceneId]);

  const bareShell =
    sceneId === "connection.celebrate-loading" ||
    sceneId === "connection.gift-introduction" ||
    sceneId === "connection.locked-gift" ||
    sceneId === "connection.challenge-invitation" ||
    sceneId === "connection.quiz-transition" ||
    sceneId === "connection.quiz-introduction" ||
    isConnectionQuizQuestionScene(sceneId) ||
    sceneId === "connection.score-calculation" ||
    sceneId === "connection.score-reveal" ||
    sceneId === "connection.celebration-transition" ||
    sceneId === "connection.letter-emergence" ||
    sceneId === "connection.letter-reveal" ||
    sceneId === "connection.gallery-unlock" ||
    sceneId === "connection.gallery" ||
    sceneId === "connection.gallery-ending" ||
    sceneId === "connection.photobooth";

  function restartJourney() {
    setSceneId(CONNECTION_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const questionIndex = parseConnectionQuizQuestionIndex(sceneId);
  const question =
    questionIndex != null ? quiz.questions[questionIndex] : undefined;

  return (
    <div className={cn("relative flex w-full flex-col", className)}>
      {showLabChrome ? (
        <div className="z-40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-card/90 px-3 py-2 text-xs backdrop-blur-sm">
          <p className="font-mono text-[11px] text-muted-foreground">
            scene · <span className="text-foreground">{sceneId}</span>
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

      <MomentsPersistentShell
        theme={theme}
        showBrandChip={false}
        bare={bareShell}
        className={showLabChrome ? "min-h-0 flex-1" : undefined}
        fillParent={showLabChrome}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className={cn(
              "flex min-h-0 flex-col overflow-hidden",
              showLabChrome ? "h-full w-full flex-1" : "min-h-[100svh]",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {question != null && questionIndex != null ? (
              <ConnectionQuizQuestionScene
                payload={payload}
                question={question}
                questionIndex={questionIndex}
                totalQuestions={quizQuestionCount}
                onComplete={advance}
              />
            ) : (
              (() => {
                const Scene =
                  connectionSceneRegistry[sceneId as ConnectionStaticSceneId];
                if (!Scene) {
                  return (
                    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
                      <p className="font-mono text-xs text-muted-foreground">
                        Unknown lab scene · {sceneId}
                      </p>
                      <button
                        type="button"
                        className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted/40"
                        onClick={restartJourney}
                      >
                        Restart journey
                      </button>
                    </div>
                  );
                }
                return <Scene payload={payload} onComplete={advance} />;
              })()
            )}
          </motion.div>
        </AnimatePresence>
      </MomentsPersistentShell>
    </div>
  );
}
