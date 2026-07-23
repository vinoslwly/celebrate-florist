"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  isWarmMemoriesMatchMemoryScene,
  parseWarmMemoriesMatchMemoryIndex,
  resolveNextWarmMemoriesScene,
  WARM_MEMORIES_CALCULATING_SCENE,
  WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE,
  WARM_MEMORIES_GALLERY_ENDING_SCENE,
  WARM_MEMORIES_GALLERY_SCENE,
  WARM_MEMORIES_GALLERY_UNLOCK_SCENE,
  WARM_MEMORIES_GIFT_LOCKED_SCENE,
  WARM_MEMORIES_INITIAL_SCENE,
  WARM_MEMORIES_LETTER_EMERGENCE_SCENE,
  WARM_MEMORIES_LETTER_REVEAL_SCENE,
  WARM_MEMORIES_LOCKED_GIFT_SCENE,
  WARM_MEMORIES_MATCH_INTRO_SCENE,
  WARM_MEMORIES_MATCH_TRANSITION_SCENE,
  WARM_MEMORIES_PHOTOBOOTH_SCENE,
  WARM_MEMORIES_SCENE_DURATIONS_MS,
  WARM_MEMORIES_SCORE_REVEAL_SCENE,
  WARM_MEMORIES_WELCOME_SCENE,
  type WarmMemoriesLabSceneId,
  type WarmMemoriesStaticSceneId,
} from "@/features/experience/scene-engine/warm/memories/graph";
import { WarmMemoriesCalculatingScene } from "@/features/experience/scene-engine/warm/memories/scenes/calculating-scene";
import { WarmMemoriesCelebrateLoadingScene } from "@/features/experience/scene-engine/warm/memories/scenes/celebrate-loading-scene";
import { WarmMemoriesCelebrationTransitionScene } from "@/features/experience/scene-engine/warm/memories/scenes/celebration-transition-scene";
import { WarmMemoriesGalleryEndingScene } from "@/features/experience/scene-engine/warm/memories/scenes/gallery-ending-scene";
import { WarmMemoriesGalleryScene } from "@/features/experience/scene-engine/warm/memories/scenes/gallery-scene";
import { WarmMemoriesGalleryUnlockScene } from "@/features/experience/scene-engine/warm/memories/scenes/gallery-unlock-scene";
import { WarmMemoriesGiftLockedScene } from "@/features/experience/scene-engine/warm/memories/scenes/gift-locked-scene";
import { WarmMemoriesLetterEmergenceScene } from "@/features/experience/scene-engine/warm/memories/scenes/letter-emergence-scene";
import { WarmMemoriesLetterRevealScene } from "@/features/experience/scene-engine/warm/memories/scenes/letter-reveal-scene";
import { WarmMemoriesLockedGiftScene } from "@/features/experience/scene-engine/warm/memories/scenes/locked-gift-scene";
import { WarmMemoriesMatchIntroScene } from "@/features/experience/scene-engine/warm/memories/scenes/match-intro-scene";
import { WarmMemoriesMatchMemoryScene } from "@/features/experience/scene-engine/warm/memories/scenes/match-memory-scene";
import { WarmMemoriesMatchTransitionScene } from "@/features/experience/scene-engine/warm/memories/scenes/match-transition-scene";
import { WarmMemoriesPhotoboothScene } from "@/features/experience/scene-engine/warm/memories/scenes/photobooth-scene";
import { WarmMemoriesScoreRevealScene } from "@/features/experience/scene-engine/warm/memories/scenes/score-reveal-scene";
import { WarmMemoriesWelcomeScene } from "@/features/experience/scene-engine/warm/memories/scenes/welcome-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  WarmMemoriesLabMatch,
  WarmMemoriesLabScoreResult,
} from "@/features/theme-lab/config/warm-memories-fixtures";

export {
  WARM_MEMORIES_CALCULATING_SCENE,
  WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE,
  WARM_MEMORIES_GALLERY_ENDING_SCENE,
  WARM_MEMORIES_GALLERY_SCENE,
  WARM_MEMORIES_GALLERY_UNLOCK_SCENE,
  WARM_MEMORIES_GIFT_LOCKED_SCENE,
  WARM_MEMORIES_INITIAL_SCENE,
  WARM_MEMORIES_LETTER_EMERGENCE_SCENE,
  WARM_MEMORIES_LETTER_REVEAL_SCENE,
  WARM_MEMORIES_LOCKED_GIFT_SCENE,
  WARM_MEMORIES_MATCH_INTRO_SCENE,
  WARM_MEMORIES_MATCH_TRANSITION_SCENE,
  WARM_MEMORIES_PHOTOBOOTH_SCENE,
  WARM_MEMORIES_SCORE_REVEAL_SCENE,
  WARM_MEMORIES_WELCOME_SCENE,
  type WarmMemoriesLabSceneId,
} from "@/features/experience/scene-engine/warm/memories/graph";

type WarmMemoriesSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  /** Theme Lab match fixture — drives parameterized match nodes. */
  match: WarmMemoriesLabMatch;
  /** Theme Lab score fixture — drives score-reveal (Warm Connection living). */
  scoreResult: WarmMemoriesLabScoreResult;
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Warm Memories Theme Lab host — full journey through photobooth.
 * Match gameplay is Warm Memories–specific; calculating → photobooth
 * reuses Warm Connection living scenes (same as Bloom Memories → Connection).
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */
export function WarmMemoriesSceneHost({
  experience,
  photos,
  theme,
  match,
  scoreResult,
  className,
  showLabChrome = false,
}: WarmMemoriesSceneHostProps) {
  const [sceneId, setSceneId] = useState<WarmMemoriesLabSceneId>(
    WARM_MEMORIES_INITIAL_SCENE,
  );
  const [journeyKey, setJourneyKey] = useState(0);
  const advanceLockRef = useRef(false);

  const memoryPairCount = match.pairs.length;
  const hasPhotos = photos.length > 0;
  const sceneContext = useMemo(
    () => ({ memoryPairCount, hasPhotos }),
    [memoryPairCount, hasPhotos],
  );
  const payload = useMemo(
    () => ({ experience, photos, theme, scoreResult }),
    [experience, photos, theme, scoreResult],
  );

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextWarmMemoriesScene(current, sceneContext);
      return next ?? current;
    });
  }, [sceneContext]);

  const recordAnswerAndAdvance = useCallback(
    (_storySortOrder: number) => {
      if (advanceLockRef.current) return;
      advanceLockRef.current = true;
      advance();
    },
    [advance],
  );

  useEffect(() => {
    advanceLockRef.current = false;
  }, [sceneId]);

  useEffect(() => {
    if (isWarmMemoriesMatchMemoryScene(sceneId)) return;
    const ms =
      WARM_MEMORIES_SCENE_DURATIONS_MS[sceneId as WarmMemoriesStaticSceneId];
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
    setSceneId(WARM_MEMORIES_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const memoryIndex = parseWarmMemoriesMatchMemoryIndex(sceneId);
  const pair = memoryIndex != null ? match.pairs[memoryIndex] : undefined;

  return (
    <div
      className={cn("relative flex h-full min-h-0 w-full flex-col", className)}
    >
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

      <div
        className={cn(
          "relative min-h-0 w-full overflow-hidden",
          showLabChrome ? "h-full flex-1" : "min-h-[100svh]",
        )}
      >
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className={cn(
              "absolute inset-0 z-10 flex min-h-0 flex-col",
              isWarmMemoriesMatchMemoryScene(sceneId)
                ? "overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
                : "overflow-hidden",
            )}
            style={
              isWarmMemoriesMatchMemoryScene(sceneId)
                ? { backgroundColor: "#3A080C" }
                : undefined
            }
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {pair != null && memoryIndex != null ? (
              <WarmMemoriesMatchMemoryScene
                payload={payload}
                pair={pair}
                memoryIndex={memoryIndex}
                totalMemories={memoryPairCount}
                onAnswer={recordAnswerAndAdvance}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_INITIAL_SCENE ? (
              <WarmMemoriesCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_WELCOME_SCENE ? (
              <WarmMemoriesWelcomeScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_LOCKED_GIFT_SCENE ? (
              <WarmMemoriesLockedGiftScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_GIFT_LOCKED_SCENE ? (
              <WarmMemoriesGiftLockedScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_MATCH_TRANSITION_SCENE ? (
              <WarmMemoriesMatchTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_MATCH_INTRO_SCENE ? (
              <WarmMemoriesMatchIntroScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_CALCULATING_SCENE ? (
              <WarmMemoriesCalculatingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_SCORE_REVEAL_SCENE ? (
              <WarmMemoriesScoreRevealScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_CELEBRATION_TRANSITION_SCENE ? (
              <WarmMemoriesCelebrationTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_LETTER_EMERGENCE_SCENE ? (
              <WarmMemoriesLetterEmergenceScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_LETTER_REVEAL_SCENE ? (
              <WarmMemoriesLetterRevealScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_GALLERY_UNLOCK_SCENE ? (
              <WarmMemoriesGalleryUnlockScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_GALLERY_SCENE ? (
              <WarmMemoriesGalleryScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_GALLERY_ENDING_SCENE ? (
              <WarmMemoriesGalleryEndingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MEMORIES_PHOTOBOOTH_SCENE ? (
              <WarmMemoriesPhotoboothScene
                payload={payload}
                onComplete={advance}
              />
            ) : (
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
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
