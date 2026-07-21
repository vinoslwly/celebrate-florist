"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  MEMORIES_INITIAL_SCENE,
  MEMORIES_SCENE_DURATIONS_MS,
  isMemoriesMatchMemoryScene,
  parseMemoriesMatchMemoryIndex,
  resolveNextMemoriesScene,
  type MemoriesSceneId,
  type MemoriesStaticSceneId,
} from "@/features/experience/scene-engine/memories/graph";
import { memoriesSceneRegistry } from "@/features/experience/scene-engine/memories/registry";
import { MemoriesMatchMemoryScene } from "@/features/experience/scene-engine/memories/scenes/match-memory-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import type {
  BloomMemoriesLabMatch,
  BloomMemoriesLabScoreResult,
} from "@/features/theme-lab/config/bloom-memories-fixtures";
import { MomentsPersistentShell } from "@/features/themes/components/bloom-moments-decorations";

type MemoriesSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  /** Theme Lab match fixture — drives parameterized Scene 6 nodes. */
  match: BloomMemoriesLabMatch;
  /** Theme Lab score fixture — drives Scene 8 reveal (Connection living scene). */
  scoreResult: BloomMemoriesLabScoreResult;
  className?: string;
  /** Lab-only: show scene id chip + restart control. */
  showLabChrome?: boolean;
  initialScene?: MemoriesSceneId;
};

export function MemoriesSceneHost({
  experience,
  photos,
  theme,
  match,
  scoreResult,
  className,
  showLabChrome = false,
  initialScene = MEMORIES_INITIAL_SCENE,
}: MemoriesSceneHostProps) {
  const [sceneId, setSceneId] = useState<MemoriesSceneId>(initialScene);
  const [journeyKey, setJourneyKey] = useState(0);
  const advanceLockRef = useRef(false);

  const memoryPairCount = match.pairs.length;
  const hasPhotos = photos.length > 0;
  const sceneContext = useMemo(
    () => ({ memoryPairCount, hasPhotos }),
    [memoryPairCount, hasPhotos],
  );
  const payload = useMemo(
    () => ({ experience, photos, theme, match, scoreResult }),
    [experience, photos, theme, match, scoreResult],
  );

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextMemoriesScene(current, sceneContext);
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
    if (
      showLabChrome &&
      initialScene !== MEMORIES_INITIAL_SCENE &&
      sceneId === initialScene
    ) {
      return;
    }
    if (isMemoriesMatchMemoryScene(sceneId)) return;
    const ms = MEMORIES_SCENE_DURATIONS_MS[sceneId as MemoriesStaticSceneId];
    if (ms == null) return;
    const t = window.setTimeout(() => {
      setSceneId((current) => {
        const next = resolveNextMemoriesScene(current, sceneContext);
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
    sceneId === "memories.celebrate-loading" ||
    sceneId === "memories.welcome" ||
    sceneId === "memories.locked-gift" ||
    sceneId === "memories.gift-locked" ||
    sceneId === "memories.match-transition" ||
    sceneId === "memories.match-intro" ||
    isMemoriesMatchMemoryScene(sceneId) ||
    sceneId === "memories.calculating" ||
    sceneId === "memories.score-reveal" ||
    sceneId === "memories.memory-transition" ||
    sceneId === "memories.letter-emergence" ||
    sceneId === "memories.letter-reveal" ||
    sceneId === "memories.binder-transition" ||
    sceneId === "memories.gallery" ||
    sceneId === "memories.gallery-ending" ||
    sceneId === "memories.photobooth";

  function restartJourney() {
    setSceneId(MEMORIES_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const memoryIndex = parseMemoriesMatchMemoryIndex(sceneId);
  const pair = memoryIndex != null ? match.pairs[memoryIndex] : undefined;
  const pauseMatchAdvance =
    showLabChrome &&
    initialScene !== MEMORIES_INITIAL_SCENE &&
    sceneId === initialScene &&
    isMemoriesMatchMemoryScene(sceneId);

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
        className={cn(
          showLabChrome ? "min-h-0 flex-1" : undefined,
          isMemoriesMatchMemoryScene(sceneId) && "!overflow-y-auto",
        )}
        fillParent={showLabChrome}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className={cn(
              "flex flex-col",
              showLabChrome ? "h-full min-h-0 flex-1" : "min-h-[100svh]",
              isMemoriesMatchMemoryScene(sceneId) && "min-h-0 overflow-y-auto",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {pair != null && memoryIndex != null ? (
              <MemoriesMatchMemoryScene
                payload={payload}
                pair={pair}
                memoryIndex={memoryIndex}
                totalMemories={memoryPairCount}
                pauseAutoAdvance={pauseMatchAdvance}
                onAnswer={recordAnswerAndAdvance}
                onComplete={advance}
              />
            ) : (
              (() => {
                const Scene =
                  memoriesSceneRegistry[sceneId as MemoriesStaticSceneId];
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
