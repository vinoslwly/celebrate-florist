"use client";

import { useCallback, useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  MOMENTS_INITIAL_SCENE,
  MOMENTS_SCENE_DURATIONS_MS,
  type MomentsSceneId,
  resolveNextMomentsScene,
} from "@/features/experience/scene-engine/moments/graph";
import { momentsSceneRegistry } from "@/features/experience/scene-engine/moments/registry";
import {
  getHostSceneFade,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import type {
  PublishedPhoto,
  PublishedPhotoboothStrip,
} from "@/features/experience/services/fetch-published-experience.service";
import { MomentsPersistentShell } from "@/features/themes/components/bloom-moments-decorations";

type MomentsSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  photoboothStrips?: PublishedPhotoboothStrip[];
  catalogPhotoboothStrips?: PublishedPhotoboothStrip[];
  theme: Theme;
  className?: string;
  /** Lab-only: show scene id chip + restart control. */
  showLabChrome?: boolean;
  initialScene?: MomentsSceneId;
};

/**
 * Bloom Moments host — Scene 1–10 (photobooth terminal).
 * Production `/e/[token]` for bloom/Lovey Moments.
 */
export function MomentsSceneHost({
  experience,
  photos,
  photoboothStrips = [],
  catalogPhotoboothStrips = [],
  theme,
  className,
  showLabChrome = false,
  initialScene = MOMENTS_INITIAL_SCENE,
}: MomentsSceneHostProps) {
  const [sceneId, setSceneId] = useState<MomentsSceneId>(initialScene);
  const [journeyKey, setJourneyKey] = useState(0);
  const reduceMotion = useCelebrateReducedMotion();
  const sceneFade = getHostSceneFade(reduceMotion);

  const payload = {
    experience,
    photos,
    photoboothStrips,
    catalogPhotoboothStrips,
    theme,
  };
  const hasPhotos = photos.length > 0;

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextMomentsScene(current, { hasPhotos });
      return next ?? current;
    });
  }, [hasPhotos]);

  /** Timed scenes advance from the host so remounts cannot strand the timer. */
  useEffect(() => {
    const ms = MOMENTS_SCENE_DURATIONS_MS[sceneId];
    if (ms == null) return;
    const t = window.setTimeout(() => {
      setSceneId((current) => {
        const next = resolveNextMomentsScene(current, { hasPhotos });
        return next ?? current;
      });
    }, ms);
    return () => window.clearTimeout(t);
  }, [sceneId, hasPhotos, journeyKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [sceneId]);

  const Scene = momentsSceneRegistry[sceneId];
  const bareShell =
    sceneId === "moments.celebrate-loading" ||
    sceneId === "moments.gift-box" ||
    sceneId === "moments.gift-opening" ||
    sceneId === "moments.letter-confirmation" ||
    sceneId === "moments.letter-transition" ||
    sceneId === "moments.letter" ||
    sceneId === "moments.album-unlock-transition" ||
    sceneId === "moments.gallery" ||
    sceneId === "moments.gallery-ending" ||
    sceneId === "moments.photobooth";

  function restartJourney() {
    setSceneId(MOMENTS_INITIAL_SCENE);
    setJourneyKey((k) => k + 1);
  }

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

      <MomentsPersistentShell
        theme={theme}
        showBrandChip={false}
        bare={bareShell}
        fillParent
        className={
          showLabChrome ? "min-h-0 flex-1" : "h-[100svh] min-h-[100svh]"
        }
      >
        <AnimatePresence mode={sceneFade.presenceMode} initial={false}>
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className="absolute inset-0 flex h-full min-h-0 flex-col overflow-hidden"
            initial={sceneFade.initial}
            animate={sceneFade.animate}
            exit={sceneFade.exit}
            transition={sceneFade.transition}
          >
            <Scene payload={payload} onComplete={advance} />
          </motion.div>
        </AnimatePresence>
      </MomentsPersistentShell>
    </div>
  );
}
