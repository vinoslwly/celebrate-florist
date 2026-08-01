"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  isSkyTreasuresGiftContentScene,
  parseSkyTreasuresGiftContentSortOrder,
  resolveNextSkyTreasuresScene,
  SKY_TREASURES_BINDER_TRANSITION_SCENE,
  SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE,
  SKY_TREASURES_FINAL_LETTER_SCENE,
  SKY_TREASURES_GALLERY_SCENE,
  SKY_TREASURES_GIFT_EXPLOSION_SCENE,
  SKY_TREASURES_GIFT_GRID_SCENE,
  SKY_TREASURES_GIFT_LOCKED_SCENE,
  SKY_TREASURES_INITIAL_SCENE,
  SKY_TREASURES_LOCKED_GIFT_SCENE,
  SKY_TREASURES_PHOTOBOOTH_SCENE,
  SKY_TREASURES_SCENE_DURATIONS_MS,
  SKY_TREASURES_WELCOME_SCENE,
  skyTreasuresGiftContentSceneId,
  type SkyTreasuresLabSceneId,
  type SkyTreasuresStaticSceneId,
} from "@/features/experience/scene-engine/sky/treasures/graph";
import { SkyTreasuresBinderTransitionScene } from "@/features/experience/scene-engine/sky/treasures/scenes/binder-transition-scene";
import { SkyTreasuresCelebrateLoadingScene } from "@/features/experience/scene-engine/sky/treasures/scenes/celebrate-loading-scene";
import { SkyTreasuresFinalGiftUnlockScene } from "@/features/experience/scene-engine/sky/treasures/scenes/final-gift-unlock-scene";
import { SkyTreasuresFinalLetterScene } from "@/features/experience/scene-engine/sky/treasures/scenes/final-letter-scene";
import { SkyTreasuresGalleryScene } from "@/features/experience/scene-engine/sky/treasures/scenes/gallery-scene";
import { SkyTreasuresGiftContentScene } from "@/features/experience/scene-engine/sky/treasures/scenes/gift-content-scene";
import { SkyTreasuresGiftExplosionScene } from "@/features/experience/scene-engine/sky/treasures/scenes/gift-explosion-scene";
import { SkyTreasuresGiftGridScene } from "@/features/experience/scene-engine/sky/treasures/scenes/gift-grid-scene";
import { SkyTreasuresGiftLockedScene } from "@/features/experience/scene-engine/sky/treasures/scenes/gift-locked-scene";
import { SkyTreasuresLockedGiftScene } from "@/features/experience/scene-engine/sky/treasures/scenes/locked-gift-scene";
import { SkyTreasuresPhotoboothScene } from "@/features/experience/scene-engine/sky/treasures/scenes/photobooth-scene";
import { SkyTreasuresWelcomeScene } from "@/features/experience/scene-engine/sky/treasures/scenes/welcome-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import {
  getSkyTreasuresLabEnvelope,
  type SkyTreasuresLabEnvelope,
} from "@/features/theme-lab/config/sky-treasures-fixtures";

export {
  SKY_TREASURES_BINDER_TRANSITION_SCENE,
  SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE,
  SKY_TREASURES_FINAL_LETTER_SCENE,
  SKY_TREASURES_GALLERY_SCENE,
  SKY_TREASURES_GIFT_EXPLOSION_SCENE,
  SKY_TREASURES_GIFT_GRID_SCENE,
  SKY_TREASURES_GIFT_LOCKED_SCENE,
  SKY_TREASURES_INITIAL_SCENE,
  SKY_TREASURES_LOCKED_GIFT_SCENE,
  SKY_TREASURES_PHOTOBOOTH_SCENE,
  SKY_TREASURES_WELCOME_SCENE,
  type SkyTreasuresLabSceneId,
} from "@/features/experience/scene-engine/sky/treasures/graph";

type SkyTreasuresSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  envelopes?: SkyTreasuresLabEnvelope[];
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Sky Treasures Theme Lab host — Scenes 0–13 (through photobooth).
 * Final Pearl (white). Scene 12 gallery-ending omitted (Moments path).
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 */
export function SkyTreasuresSceneHost({
  experience,
  photos,
  theme,
  className,
  showLabChrome = false,
}: SkyTreasuresSceneHostProps) {
  const [sceneId, setSceneId] = useState<SkyTreasuresLabSceneId>(
    SKY_TREASURES_INITIAL_SCENE,
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
      const next = resolveNextSkyTreasuresScene(current, sceneContext);
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
    setSceneId(skyTreasuresGiftContentSceneId(sortOrder));
  }, []);

  /** Non-final → grid; Final Pearl dismiss → Scene 8 unlock. */
  const dismissGiftContent = useCallback(() => {
    const order = parseSkyTreasuresGiftContentSortOrder(sceneId);
    const envelope =
      order != null ? getSkyTreasuresLabEnvelope(order) : undefined;
    if (envelope?.isFinal) {
      setSceneId(SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE);
      return;
    }
    setSceneId(SKY_TREASURES_GIFT_GRID_SCENE);
  }, [sceneId]);

  useEffect(() => {
    if (isSkyTreasuresGiftContentScene(sceneId)) return;
    if (sceneId === SKY_TREASURES_GIFT_GRID_SCENE) return;
    if (sceneId === SKY_TREASURES_FINAL_LETTER_SCENE) return;
    if (sceneId === SKY_TREASURES_BINDER_TRANSITION_SCENE) return;
    if (sceneId === SKY_TREASURES_GALLERY_SCENE) return;
    if (sceneId === SKY_TREASURES_PHOTOBOOTH_SCENE) return;
    const ms =
      SKY_TREASURES_SCENE_DURATIONS_MS[sceneId as SkyTreasuresStaticSceneId];
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
    setSceneId(SKY_TREASURES_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  const contentSortOrder = parseSkyTreasuresGiftContentSortOrder(sceneId);

  return (
    <div
      className={cn("relative flex h-full min-h-0 w-full flex-col", className)}
    >
      {showLabChrome ? (
        <div className="z-40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E3A5F]/10 bg-[#EEF4FA] px-3 py-2 text-xs">
          <p className="font-mono text-[11px] text-[#1E3A5F]/70">
            scene · <span className="text-[#1E3A5F]">{sceneId}</span>
            {sceneId === SKY_TREASURES_GIFT_GRID_SCENE ? (
              <span className="ml-2 text-[#3D7AAD]">
                · Scene 6 · Final Pearl
              </span>
            ) : null}
            {isSkyTreasuresGiftContentScene(sceneId) ? (
              <span className="ml-2 text-[#3D7AAD]">· Scene 7 · letter</span>
            ) : null}
            {sceneId === SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE ? (
              <span className="ml-2 text-[#3D7AAD]">
                · Scene 8 · pearl unlock
              </span>
            ) : null}
            {sceneId === SKY_TREASURES_FINAL_LETTER_SCENE ? (
              <span className="ml-2 text-[#3D7AAD]">· Scene 9 · letter</span>
            ) : null}
            {sceneId === SKY_TREASURES_BINDER_TRANSITION_SCENE ? (
              <span className="ml-2 text-[#3D7AAD]">· Scene 10 · balloon</span>
            ) : null}
            {sceneId === SKY_TREASURES_GALLERY_SCENE ? (
              <span className="ml-2 text-[#3D7AAD]">· Scene 11 · gallery</span>
            ) : null}
            {sceneId === SKY_TREASURES_PHOTOBOOTH_SCENE ? (
              <span className="ml-2 text-[#3D7AAD]">
                · Scene 13 · photobooth · terminal
              </span>
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
            transition={{ duration: 0.18 }}
          >
            {sceneId === SKY_TREASURES_INITIAL_SCENE ? (
              <SkyTreasuresCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_WELCOME_SCENE ? (
              <SkyTreasuresWelcomeScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_LOCKED_GIFT_SCENE ? (
              <SkyTreasuresLockedGiftScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_GIFT_LOCKED_SCENE ? (
              <SkyTreasuresGiftLockedScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_GIFT_EXPLOSION_SCENE ? (
              <SkyTreasuresGiftExplosionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_GIFT_GRID_SCENE ? (
              <SkyTreasuresGiftGridScene
                payload={payload}
                onComplete={advance}
                openedSortOrders={openedSortOrders}
                onSelectGift={selectGift}
              />
            ) : contentSortOrder != null ? (
              <SkyTreasuresGiftContentScene
                payload={payload}
                sortOrder={contentSortOrder}
                openedSortOrders={openedSortOrders}
                onBack={dismissGiftContent}
              />
            ) : sceneId === SKY_TREASURES_FINAL_GIFT_UNLOCK_SCENE ? (
              <SkyTreasuresFinalGiftUnlockScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_FINAL_LETTER_SCENE ? (
              <SkyTreasuresFinalLetterScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_BINDER_TRANSITION_SCENE ? (
              <SkyTreasuresBinderTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_GALLERY_SCENE ? (
              <SkyTreasuresGalleryScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_TREASURES_PHOTOBOOTH_SCENE ? (
              <SkyTreasuresPhotoboothScene
                payload={payload}
                onComplete={advance}
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#C5DCEF] p-6 text-center">
                <p className="font-mono text-sm text-[#1E3A5F]/80">
                  Unknown Sky Treasures scene: {sceneId}
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
