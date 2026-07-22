"use client";

import { useCallback, useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  resolveNextWarmMomentsScene,
  WARM_MOMENTS_ALBUM_UNLOCK_SCENE,
  WARM_MOMENTS_AWAITING_SCENE,
  WARM_MOMENTS_GALLERY_ENDING_SCENE,
  WARM_MOMENTS_GALLERY_SCENE,
  WARM_MOMENTS_GIFT_BOX_SCENE,
  WARM_MOMENTS_GIFT_OPENING_SCENE,
  WARM_MOMENTS_INITIAL_SCENE,
  WARM_MOMENTS_LETTER_CONFIRMATION_SCENE,
  WARM_MOMENTS_LETTER_SCENE,
  WARM_MOMENTS_LETTER_TRANSITION_SCENE,
  type WarmMomentsLabSceneId,
} from "@/features/experience/scene-engine/warm/moments/graph";
import { WarmAlbumUnlockTransitionScene } from "@/features/experience/scene-engine/warm/moments/scenes/album-unlock-transition-scene";
import { WarmCelebrateLoadingScene } from "@/features/experience/scene-engine/warm/moments/scenes/celebrate-loading-scene";
import { WarmGalleryEndingScene } from "@/features/experience/scene-engine/warm/moments/scenes/gallery-ending-scene";
import { WarmGalleryScene } from "@/features/experience/scene-engine/warm/moments/scenes/gallery-scene";
import { WarmGiftBoxScene } from "@/features/experience/scene-engine/warm/moments/scenes/gift-box-scene";
import { WarmGiftOpeningScene } from "@/features/experience/scene-engine/warm/moments/scenes/gift-opening-scene";
import { WarmLetterConfirmationScene } from "@/features/experience/scene-engine/warm/moments/scenes/letter-confirmation-scene";
import { WarmLetterScene } from "@/features/experience/scene-engine/warm/moments/scenes/letter-scene";
import { WarmLetterTransitionScene } from "@/features/experience/scene-engine/warm/moments/scenes/letter-transition-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";

export {
  WARM_MOMENTS_ALBUM_UNLOCK_SCENE,
  WARM_MOMENTS_AWAITING_SCENE,
  WARM_MOMENTS_GALLERY_ENDING_SCENE,
  WARM_MOMENTS_GALLERY_SCENE,
  WARM_MOMENTS_GIFT_BOX_SCENE,
  WARM_MOMENTS_GIFT_OPENING_SCENE,
  WARM_MOMENTS_INITIAL_SCENE,
  WARM_MOMENTS_LETTER_CONFIRMATION_SCENE,
  WARM_MOMENTS_LETTER_SCENE,
  WARM_MOMENTS_LETTER_TRANSITION_SCENE,
  type WarmMomentsLabSceneId,
} from "@/features/experience/scene-engine/warm/moments/graph";

const SCENE_1_DURATION_MS = 2800;

type WarmMomentsSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  className?: string;
  showLabChrome?: boolean;
};

/**
 * Warm Moments Theme Lab host — Scenes 1–9 living; then hold for next Founder ref.
 * Does not modify locked Bloom Moments engine.
 */
export function WarmMomentsSceneHost({
  experience,
  photos,
  theme,
  className,
  showLabChrome = false,
}: WarmMomentsSceneHostProps) {
  const [sceneId, setSceneId] = useState<WarmMomentsLabSceneId>(
    WARM_MOMENTS_INITIAL_SCENE,
  );
  const [journeyKey, setJourneyKey] = useState(0);

  const payload = { experience, photos, theme };
  const hasPhotos = photos.length > 0;

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextWarmMomentsScene(current, { hasPhotos });
      return next ?? current;
    });
  }, [hasPhotos]);

  useEffect(() => {
    if (sceneId !== WARM_MOMENTS_INITIAL_SCENE) return;
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
    setSceneId(WARM_MOMENTS_INITIAL_SCENE);
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
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={`${journeyKey}:${sceneId}`}
            className="absolute inset-0 z-10 flex min-h-0 flex-col overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sceneId === WARM_MOMENTS_INITIAL_SCENE ? (
              <WarmCelebrateLoadingScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MOMENTS_GIFT_BOX_SCENE ? (
              <WarmGiftBoxScene payload={payload} onComplete={advance} />
            ) : sceneId === WARM_MOMENTS_GIFT_OPENING_SCENE ? (
              <WarmGiftOpeningScene payload={payload} onComplete={advance} />
            ) : sceneId === WARM_MOMENTS_LETTER_CONFIRMATION_SCENE ? (
              <WarmLetterConfirmationScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MOMENTS_LETTER_TRANSITION_SCENE ? (
              <WarmLetterTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MOMENTS_LETTER_SCENE ? (
              <WarmLetterScene payload={payload} onComplete={advance} />
            ) : sceneId === WARM_MOMENTS_ALBUM_UNLOCK_SCENE ? (
              <WarmAlbumUnlockTransitionScene
                payload={payload}
                onComplete={advance}
              />
            ) : sceneId === WARM_MOMENTS_GALLERY_SCENE ? (
              <WarmGalleryScene payload={payload} onComplete={advance} />
            ) : sceneId === WARM_MOMENTS_GALLERY_ENDING_SCENE ? (
              <WarmGalleryEndingScene payload={payload} onComplete={advance} />
            ) : (
              <div
                className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-16 text-center"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 40%, #8B1A22 0%, #6B0F16 50%, #4A0A10 100%)",
                }}
              >
                <p className="font-mono text-[11px] tracking-widest text-[#E8D4C0]/70 uppercase">
                  Warm Moments · Theme Lab
                </p>
                <p className="max-w-sm font-serif text-lg text-[#E8D4C0]">
                  {hasPhotos
                    ? "Journey complete through gallery ending. Awaiting Founder reference for photobooth."
                    : "Journey complete (no-photo path — gallery skipped). Awaiting Founder reference for photobooth."}
                </p>
                <button
                  type="button"
                  className="rounded-md border border-[#E8D4C0]/45 px-3 py-1.5 text-sm font-medium text-[#E8D4C0] hover:bg-[#E8D4C0]/10"
                  onClick={() => setSceneId(WARM_MOMENTS_LETTER_SCENE)}
                >
                  Replay Scene 6
                </button>
                <button
                  type="button"
                  className="rounded-md border border-[#E8D4C0]/45 px-3 py-1.5 text-sm font-medium text-[#E8D4C0] hover:bg-[#E8D4C0]/10"
                  onClick={() => setSceneId(WARM_MOMENTS_ALBUM_UNLOCK_SCENE)}
                >
                  Replay Album Unlock
                </button>
                {hasPhotos ? (
                  <button
                    type="button"
                    className="rounded-md border border-[#E8D4C0]/45 px-3 py-1.5 text-sm font-medium text-[#E8D4C0] hover:bg-[#E8D4C0]/10"
                    onClick={() => setSceneId(WARM_MOMENTS_GALLERY_SCENE)}
                  >
                    Replay Gallery
                  </button>
                ) : null}
                <button
                  type="button"
                  className="text-xs text-[#E8D4C0]/70 underline-offset-2 hover:underline"
                  onClick={restartJourney}
                >
                  Restart from Scene 1
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
