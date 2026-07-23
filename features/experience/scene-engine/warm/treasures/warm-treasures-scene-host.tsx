"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  isWarmTreasuresGiftContentScene,
  parseWarmTreasuresGiftContentSortOrder,
  resolveNextWarmTreasuresScene,
  WARM_TREASURES_BINDER_TRANSITION_SCENE,
  WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE,
  WARM_TREASURES_FINAL_LETTER_SCENE,
  WARM_TREASURES_GALLERY_ENDING_SCENE,
  WARM_TREASURES_GALLERY_SCENE,
  WARM_TREASURES_GIFT_EXPLOSION_SCENE,
  WARM_TREASURES_GIFT_GRID_SCENE,
  WARM_TREASURES_GIFT_LOCKED_SCENE,
  WARM_TREASURES_INITIAL_SCENE,
  WARM_TREASURES_LOCKED_GIFT_SCENE,
  WARM_TREASURES_PHOTOBOOTH_SCENE,
  WARM_TREASURES_SCENE_DURATIONS_MS,
  WARM_TREASURES_WELCOME_SCENE,
  warmTreasuresGiftContentSceneId,
  type WarmTreasuresLabSceneId,
  type WarmTreasuresStaticSceneId,
} from "@/features/experience/scene-engine/warm/treasures/graph";
import { WarmTreasuresBinderTransitionScene } from "@/features/experience/scene-engine/warm/treasures/scenes/binder-transition-scene";
import { WarmTreasuresCelebrateLoadingScene } from "@/features/experience/scene-engine/warm/treasures/scenes/celebrate-loading-scene";
import { WarmTreasuresFinalGiftUnlockScene } from "@/features/experience/scene-engine/warm/treasures/scenes/final-gift-unlock-scene";
import { WarmTreasuresFinalLetterScene } from "@/features/experience/scene-engine/warm/treasures/scenes/final-letter-scene";
import { WarmTreasuresGalleryEndingScene } from "@/features/experience/scene-engine/warm/treasures/scenes/gallery-ending-scene";
import { WarmTreasuresGalleryScene } from "@/features/experience/scene-engine/warm/treasures/scenes/gallery-scene";
import { WarmTreasuresGiftContentScene } from "@/features/experience/scene-engine/warm/treasures/scenes/gift-content-scene";
import { WarmTreasuresGiftExplosionScene } from "@/features/experience/scene-engine/warm/treasures/scenes/gift-explosion-scene";
import { WarmTreasuresGiftGridScene } from "@/features/experience/scene-engine/warm/treasures/scenes/gift-grid-scene";
import { WarmTreasuresGiftLockedScene } from "@/features/experience/scene-engine/warm/treasures/scenes/gift-locked-scene";
import { WarmTreasuresLockedGiftScene } from "@/features/experience/scene-engine/warm/treasures/scenes/locked-gift-scene";
import { WarmTreasuresPhotoboothScene } from "@/features/experience/scene-engine/warm/treasures/scenes/photobooth-scene";
import { WarmTreasuresWelcomeScene } from "@/features/experience/scene-engine/warm/treasures/scenes/welcome-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import { getWarmTreasuresLabEnvelope } from "@/features/theme-lab/config/warm-treasures-fixtures";

export {
  WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE,
  WARM_TREASURES_GIFT_EXPLOSION_SCENE,
  WARM_TREASURES_GIFT_GRID_SCENE,
  WARM_TREASURES_GIFT_LOCKED_SCENE,
  WARM_TREASURES_INITIAL_SCENE,
  WARM_TREASURES_LOCKED_GIFT_SCENE,
  WARM_TREASURES_PHOTOBOOTH_SCENE,
  WARM_TREASURES_WELCOME_SCENE,
  type WarmTreasuresLabSceneId,
} from "@/features/experience/scene-engine/warm/treasures/graph";

type WarmTreasuresSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Warm Treasures Theme Lab host — full journey Scenes 0–13 through photobooth.
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */
export function WarmTreasuresSceneHost({
  experience,
  photos,
  theme,
  className,
  showLabChrome = false,
}: WarmTreasuresSceneHostProps) {
  const [sceneId, setSceneId] = useState<WarmTreasuresLabSceneId>(
    WARM_TREASURES_INITIAL_SCENE,
  );
  const [journeyKey, setJourneyKey] = useState(0);
  const [openedSortOrders, setOpenedSortOrders] = useState<ReadonlySet<number>>(
    () => new Set(),
  );

  const hasPhotos = photos.length > 0;
  const sceneContext = useMemo(() => ({ hasPhotos }), [hasPhotos]);
  const payload = useMemo(
    () => ({ experience, photos, theme }),
    [experience, photos, theme],
  );

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextWarmTreasuresScene(current, sceneContext);
      return next ?? current;
    });
  }, [sceneContext]);

  const selectGift = useCallback((sortOrder: number) => {
    setOpenedSortOrders((prev) => {
      if (prev.has(sortOrder)) return prev;
      const next = new Set(prev);
      next.add(sortOrder);
      return next;
    });
    setSceneId(warmTreasuresGiftContentSceneId(sortOrder));
  }, []);

  /** Non-final → grid; Final Gold dismiss → Scene 8 unlock. */
  const dismissGiftContent = useCallback(() => {
    const order = parseWarmTreasuresGiftContentSortOrder(sceneId);
    const envelope =
      order != null ? getWarmTreasuresLabEnvelope(order) : undefined;
    if (envelope?.isFinal) {
      setSceneId(WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE);
      return;
    }
    setSceneId(WARM_TREASURES_GIFT_GRID_SCENE);
  }, [sceneId]);

  useEffect(() => {
    if (isWarmTreasuresGiftContentScene(sceneId)) return;
    if (sceneId === WARM_TREASURES_GIFT_GRID_SCENE) return;
    if (sceneId === WARM_TREASURES_FINAL_LETTER_SCENE) return;
    if (sceneId === WARM_TREASURES_GALLERY_SCENE) return;
    if (sceneId === WARM_TREASURES_PHOTOBOOTH_SCENE) return;
    const ms =
      WARM_TREASURES_SCENE_DURATIONS_MS[sceneId as WarmTreasuresStaticSceneId];
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
    setOpenedSortOrders(new Set());
    setSceneId(WARM_TREASURES_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const contentSortOrder = parseWarmTreasuresGiftContentSortOrder(sceneId);

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
            className="absolute inset-0 z-10 flex min-h-0 flex-col overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sceneId === WARM_TREASURES_INITIAL_SCENE ? (
              <WarmTreasuresCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_WELCOME_SCENE ? (
              <WarmTreasuresWelcomeScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_LOCKED_GIFT_SCENE ? (
              <WarmTreasuresLockedGiftScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_GIFT_LOCKED_SCENE ? (
              <WarmTreasuresGiftLockedScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_GIFT_EXPLOSION_SCENE ? (
              <WarmTreasuresGiftExplosionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_GIFT_GRID_SCENE ? (
              <WarmTreasuresGiftGridScene
                payload={payload}
                onComplete={advance}
                openedSortOrders={openedSortOrders}
                onSelectGift={selectGift}
              />
            ) : contentSortOrder != null ? (
              <WarmTreasuresGiftContentScene
                payload={payload}
                sortOrder={contentSortOrder}
                openedSortOrders={openedSortOrders}
                onBack={dismissGiftContent}
              />
            ) : sceneId === WARM_TREASURES_FINAL_GIFT_UNLOCK_SCENE ? (
              <WarmTreasuresFinalGiftUnlockScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_FINAL_LETTER_SCENE ? (
              <WarmTreasuresFinalLetterScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_BINDER_TRANSITION_SCENE ? (
              <WarmTreasuresBinderTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_GALLERY_SCENE ? (
              <WarmTreasuresGalleryScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_GALLERY_ENDING_SCENE ? (
              <WarmTreasuresGalleryEndingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_TREASURES_PHOTOBOOTH_SCENE ? (
              <WarmTreasuresPhotoboothScene
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
