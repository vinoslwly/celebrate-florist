"use client";

import { useCallback, useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  resolveNextSkyMomentsScene,
  SKY_MOMENTS_BALLOON_BURST_SCENE,
  SKY_MOMENTS_GALLERY_SCENE,
  SKY_MOMENTS_GIFT_BOX_SCENE,
  SKY_MOMENTS_GIFT_OPENING_SCENE,
  SKY_MOMENTS_HEART_RAIN_SCENE,
  SKY_MOMENTS_INITIAL_SCENE,
  SKY_MOMENTS_LETTER_CONFIRMATION_SCENE,
  SKY_MOMENTS_LETTER_SCENE,
  SKY_MOMENTS_PHOTOBOOTH_SCENE,
  type SkyMomentsLabSceneId,
} from "@/features/experience/scene-engine/sky/moments/graph";
import { SkyBalloonBurstScene } from "@/features/experience/scene-engine/sky/moments/scenes/balloon-burst-scene";
import { SkyCelebrateLoadingScene } from "@/features/experience/scene-engine/sky/moments/scenes/celebrate-loading-scene";
import { SkyGalleryScene } from "@/features/experience/scene-engine/sky/moments/scenes/gallery-scene";
import { SkyGiftBoxScene } from "@/features/experience/scene-engine/sky/moments/scenes/gift-box-scene";
import { SkyGiftOpeningScene } from "@/features/experience/scene-engine/sky/moments/scenes/gift-opening-scene";
import { SkyHeartRainScene } from "@/features/experience/scene-engine/sky/moments/scenes/heart-rain-scene";
import { SkyLetterConfirmationScene } from "@/features/experience/scene-engine/sky/moments/scenes/letter-confirmation-scene";
import { SkyLetterScene } from "@/features/experience/scene-engine/sky/moments/scenes/letter-scene";
import { SkyPhotoboothScene } from "@/features/experience/scene-engine/sky/moments/scenes/photobooth-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export {
  SKY_MOMENTS_BALLOON_BURST_SCENE,
  SKY_MOMENTS_GALLERY_SCENE,
  SKY_MOMENTS_GIFT_BOX_SCENE,
  SKY_MOMENTS_GIFT_OPENING_SCENE,
  SKY_MOMENTS_HEART_RAIN_SCENE,
  SKY_MOMENTS_INITIAL_SCENE,
  SKY_MOMENTS_LETTER_CONFIRMATION_SCENE,
  SKY_MOMENTS_LETTER_SCENE,
  SKY_MOMENTS_PHOTOBOOTH_SCENE,
  type SkyMomentsLabSceneId,
} from "@/features/experience/scene-engine/sky/moments/graph";

const SCENE_1_DURATION_MS = 2800;

type SkyMomentsSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Sky Moments Theme Lab host — Scene 1–9 living (photobooth terminal).
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 * Does not modify locked Bloom / Warm engines.
 */
export function SkyMomentsSceneHost({
  experience,
  photos,
  theme,
  className,
  showLabChrome = false,
}: SkyMomentsSceneHostProps) {
  const [sceneId, setSceneId] = useState<SkyMomentsLabSceneId>(
    SKY_MOMENTS_INITIAL_SCENE,
  );
  const [journeyKey, setJourneyKey] = useState(0);

  const payload = { experience, photos, theme };
  const hasPhotos = photos.length > 0;

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextSkyMomentsScene(current, { hasPhotos });
      return next ?? current;
    });
  }, [hasPhotos]);

  useEffect(() => {
    if (sceneId !== SKY_MOMENTS_INITIAL_SCENE) return;
    const t = window.setTimeout(() => {
      advance();
    }, SCENE_1_DURATION_MS);
    return () => window.clearTimeout(t);
  }, [sceneId, journeyKey, advance]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sceneId]);

  function restartJourney() {
    setSceneId(SKY_MOMENTS_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

  return (
    <div
      className={cn("relative flex h-full min-h-0 w-full flex-col", className)}
    >
      {showLabChrome ? (
        <div className="z-40 flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-[#1E3A5F]/10 bg-[#EEF4FA] px-3 py-2 text-xs">
          <p className="font-mono text-[11px] text-[#1E3A5F]/70">
            scene · <span className="text-[#1E3A5F]">{sceneId}</span>
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
            {sceneId === SKY_MOMENTS_INITIAL_SCENE ? (
              <SkyCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MOMENTS_GIFT_BOX_SCENE ? (
              <SkyGiftBoxScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MOMENTS_GIFT_OPENING_SCENE ? (
              <SkyGiftOpeningScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MOMENTS_LETTER_CONFIRMATION_SCENE ? (
              <SkyLetterConfirmationScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === SKY_MOMENTS_BALLOON_BURST_SCENE ? (
              <SkyBalloonBurstScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MOMENTS_LETTER_SCENE ? (
              <SkyLetterScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MOMENTS_HEART_RAIN_SCENE ? (
              <SkyHeartRainScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MOMENTS_GALLERY_SCENE ? (
              <SkyGalleryScene payload={payload} onComplete={advance} />
            ) : sceneId === SKY_MOMENTS_PHOTOBOOTH_SCENE ? (
              <SkyPhotoboothScene payload={payload} onComplete={advance} />
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
