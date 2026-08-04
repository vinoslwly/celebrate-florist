"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  getHostSceneFade,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import {
  isSkyMemoriesMatchMemoryScene,
  parseSkyMemoriesMatchMemoryIndex,
  resolveNextSkyMemoriesScene,
  SKY_MEMORIES_CALCULATING_SCENE,
  SKY_MEMORIES_CELEBRATION_TRANSITION_SCENE,
  SKY_MEMORIES_GALLERY_SCENE,
  SKY_MEMORIES_GALLERY_UNLOCK_SCENE,
  SKY_MEMORIES_GIFT_LOCKED_SCENE,
  SKY_MEMORIES_INITIAL_SCENE,
  SKY_MEMORIES_LETTER_REVEAL_SCENE,
  SKY_MEMORIES_LOCKED_GIFT_SCENE,
  SKY_MEMORIES_MATCH_INTRO_SCENE,
  SKY_MEMORIES_MATCH_TRANSITION_SCENE,
  SKY_MEMORIES_PHOTOBOOTH_SCENE,
  SKY_MEMORIES_SCENE_DURATIONS_MS,
  SKY_MEMORIES_SCORE_REVEAL_SCENE,
  SKY_MEMORIES_WELCOME_SCENE,
  type SkyMemoriesLabSceneId,
  type SkyMemoriesStaticSceneId,
} from "@/features/experience/scene-engine/sky/memories/graph";
import { SkyMemoriesCalculatingScene } from "@/features/experience/scene-engine/sky/memories/scenes/calculating-scene";
import { SkyMemoriesCelebrateLoadingScene } from "@/features/experience/scene-engine/sky/memories/scenes/celebrate-loading-scene";
import { SkyMemoriesCelebrationTransitionScene } from "@/features/experience/scene-engine/sky/memories/scenes/celebration-transition-scene";
import { SkyMemoriesGalleryScene } from "@/features/experience/scene-engine/sky/memories/scenes/gallery-scene";
import { SkyMemoriesGalleryUnlockScene } from "@/features/experience/scene-engine/sky/memories/scenes/gallery-unlock-scene";
import { SkyMemoriesGiftLockedScene } from "@/features/experience/scene-engine/sky/memories/scenes/gift-locked-scene";
import { SkyMemoriesLetterRevealScene } from "@/features/experience/scene-engine/sky/memories/scenes/letter-reveal-scene";
import { SkyMemoriesLockedGiftScene } from "@/features/experience/scene-engine/sky/memories/scenes/locked-gift-scene";
import { SkyMemoriesMatchIntroScene } from "@/features/experience/scene-engine/sky/memories/scenes/match-intro-scene";
import { SkyMemoriesMatchMemoryScene } from "@/features/experience/scene-engine/sky/memories/scenes/match-memory-scene";
import { SkyMemoriesMatchTransitionScene } from "@/features/experience/scene-engine/sky/memories/scenes/match-transition-scene";
import { SkyMemoriesPhotoboothScene } from "@/features/experience/scene-engine/sky/memories/scenes/photobooth-scene";
import { SkyMemoriesScoreRevealScene } from "@/features/experience/scene-engine/sky/memories/scenes/score-reveal-scene";
import { SkyMemoriesWelcomeScene } from "@/features/experience/scene-engine/sky/memories/scenes/welcome-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  SkyMemoriesLabMatch,
  SkyMemoriesLabScoreResult,
} from "@/features/theme-lab/config/sky-memories-fixtures";

export {
  SKY_MEMORIES_CALCULATING_SCENE,
  SKY_MEMORIES_GIFT_LOCKED_SCENE,
  SKY_MEMORIES_INITIAL_SCENE,
  SKY_MEMORIES_LOCKED_GIFT_SCENE,
  SKY_MEMORIES_MATCH_INTRO_SCENE,
  SKY_MEMORIES_MATCH_TRANSITION_SCENE,
  SKY_MEMORIES_PHOTOBOOTH_SCENE,
  SKY_MEMORIES_WELCOME_SCENE,
  type SkyMemoriesLabSceneId,
} from "@/features/experience/scene-engine/sky/memories/graph";

type SkyMemoriesSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  match: SkyMemoriesLabMatch;
  scoreResult?: SkyMemoriesLabScoreResult;
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Sky Memories Theme Lab host — full journey through photobooth.
 * 0–3 / 7–end reuse Sky Connection; 4–6 are Sky Memories–owned.
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */
export function SkyMemoriesSceneHost({
  experience,
  photos,
  theme,
  match,
  scoreResult,
  className,
  showLabChrome = false,
}: SkyMemoriesSceneHostProps) {
  const [sceneId, setSceneId] = useState<SkyMemoriesLabSceneId>(
    SKY_MEMORIES_INITIAL_SCENE,
  );
  const [journeyKey, setJourneyKey] = useState(0);
  const reduceMotion = useCelebrateReducedMotion();
  const sceneFade = getHostSceneFade(reduceMotion);
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
      const next = resolveNextSkyMemoriesScene(current, sceneContext);
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
    if (isSkyMemoriesMatchMemoryScene(sceneId)) return;
    const ms =
      SKY_MEMORIES_SCENE_DURATIONS_MS[sceneId as SkyMemoriesStaticSceneId];
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
    setSceneId(SKY_MEMORIES_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const memoryIndex = parseSkyMemoriesMatchMemoryIndex(sceneId);
  const pair = memoryIndex != null ? match.pairs[memoryIndex] : undefined;

  return (
    <div
      className={cn("relative flex h-full min-h-0 w-full flex-col", className)}
    >
      {showLabChrome ? (
        <div className="z-40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E3A5F]/10 bg-[#EEF4FA] px-3 py-2 text-xs">
          <p className="font-mono text-[11px] text-[#1E3A5F]/70">
            scene · <span className="text-[#1E3A5F]">{sceneId}</span>
            {sceneId === SKY_MEMORIES_PHOTOBOOTH_SCENE ? (
              <span className="ml-2 text-[#3D7AAD]">· terminal</span>
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
        <AnimatePresence mode={sceneFade.presenceMode} initial={false}>
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className={cn(
              "absolute inset-0 z-10 flex min-h-0 flex-col",
              isSkyMemoriesMatchMemoryScene(sceneId)
                ? "overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
                : "overflow-hidden bg-[#C5DCEF]",
            )}
            style={
              isSkyMemoriesMatchMemoryScene(sceneId)
                ? { backgroundColor: "#9EC9E6" }
                : undefined
            }
            initial={sceneFade.initial}
            animate={sceneFade.animate}
            exit={sceneFade.exit}
            transition={sceneFade.transition}
          >
            {pair != null && memoryIndex != null ? (
              <SkyMemoriesMatchMemoryScene
                payload={payload}
                pair={pair}
                memoryIndex={memoryIndex}
                totalMemories={memoryPairCount}
                onAnswer={recordAnswerAndAdvance}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_INITIAL_SCENE ? (
              <SkyMemoriesCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_WELCOME_SCENE ? (
              <SkyMemoriesWelcomeScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MEMORIES_LOCKED_GIFT_SCENE ? (
              <SkyMemoriesLockedGiftScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_GIFT_LOCKED_SCENE ? (
              <SkyMemoriesGiftLockedScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_MATCH_TRANSITION_SCENE ? (
              <SkyMemoriesMatchTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_MATCH_INTRO_SCENE ? (
              <SkyMemoriesMatchIntroScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_CALCULATING_SCENE ? (
              <SkyMemoriesCalculatingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_SCORE_REVEAL_SCENE ? (
              <SkyMemoriesScoreRevealScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_CELEBRATION_TRANSITION_SCENE ? (
              <SkyMemoriesCelebrationTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_LETTER_REVEAL_SCENE ? (
              <SkyMemoriesLetterRevealScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_GALLERY_UNLOCK_SCENE ? (
              <SkyMemoriesGalleryUnlockScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MEMORIES_GALLERY_SCENE ? (
              <SkyMemoriesGalleryScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MEMORIES_PHOTOBOOTH_SCENE ? (
              <SkyMemoriesPhotoboothScene
                payload={payload}
                onComplete={advance}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#C5DCEF] p-6 text-center">
                <p className="font-mono text-sm text-[#1E3A5F]/80">
                  Unknown Sky Memories scene: {sceneId}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
