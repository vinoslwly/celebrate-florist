"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { ExperienceRow } from "@/types/database";
import type { Theme } from "@/types/theme";

import {
  TREASURES_INITIAL_SCENE,
  TREASURES_SCENE_DURATIONS_MS,
  isTreasuresGiftContentScene,
  parseTreasuresGiftContentSortOrder,
  resolveNextTreasuresScene,
  treasuresGiftContentSceneId,
  type TreasuresSceneId,
  type TreasuresStaticSceneId,
} from "@/features/experience/scene-engine/treasures/graph";
import { treasuresSceneRegistry } from "@/features/experience/scene-engine/treasures/registry";
import { TreasuresGiftContentScene } from "@/features/experience/scene-engine/treasures/scenes/gift-content-scene";
import { TreasuresGiftGridScene } from "@/features/experience/scene-engine/treasures/scenes/gift-grid-scene";
import type { PublishedPhoto } from "@/features/experience/services/fetch-published-experience.service";
import { getBloomTreasuresLabEnvelope } from "@/features/theme-lab/config/bloom-treasures-fixtures";
import { MomentsPersistentShell } from "@/features/themes/components/bloom-moments-decorations";

type TreasuresSceneHostProps = {
  experience: ExperienceRow;
  photos: PublishedPhoto[];
  theme: Theme;
  className?: string;
  /** Lab-only: show scene id chip + restart control. */
  showLabChrome?: boolean;
  initialScene?: TreasuresSceneId;
};

export function TreasuresSceneHost({
  experience,
  photos,
  theme,
  className,
  showLabChrome = false,
  initialScene = TREASURES_INITIAL_SCENE,
}: TreasuresSceneHostProps) {
  const [sceneId, setSceneId] = useState<TreasuresSceneId>(initialScene);
  const [journeyKey, setJourneyKey] = useState(0);
  const [openedSortOrders, setOpenedSortOrders] = useState<ReadonlySet<number>>(
    () => {
      const seed = parseTreasuresGiftContentSortOrder(initialScene);
      return seed != null ? new Set([seed]) : new Set();
    },
  );

  const hasPhotos = photos.length > 0;
  const sceneContext = useMemo(() => ({ hasPhotos }), [hasPhotos]);

  const payload = useMemo(
    () => ({ experience, photos, theme }),
    [experience, photos, theme],
  );

  const advance = useCallback(() => {
    setSceneId((current) => {
      const next = resolveNextTreasuresScene(current, sceneContext);
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
    setSceneId(treasuresGiftContentSceneId(sortOrder));
  }, []);

  /** Non-final → grid; Final Gold dismiss → Scene 8 unlock (Founder KF flow). */
  const dismissGiftContent = useCallback(() => {
    setSceneId((current) => {
      const order = parseTreasuresGiftContentSortOrder(current);
      const envelope =
        order != null ? getBloomTreasuresLabEnvelope(order) : undefined;
      if (envelope?.isFinal) {
        return "treasures.final-gift-unlock";
      }
      return "treasures.gift-grid";
    });
  }, []);

  useEffect(() => {
    if (
      showLabChrome &&
      initialScene !== TREASURES_INITIAL_SCENE &&
      sceneId === initialScene
    ) {
      return;
    }
    if (isTreasuresGiftContentScene(sceneId)) return;
    if (sceneId === "treasures.gift-grid") return;
    if (sceneId === "treasures.final-letter") return;
    if (sceneId === "treasures.gallery") return;
    if (sceneId === "treasures.photobooth") return;
    const ms = TREASURES_SCENE_DURATIONS_MS[sceneId as TreasuresStaticSceneId];
    if (ms == null) return;
    const t = window.setTimeout(() => {
      setSceneId((current) => {
        const next = resolveNextTreasuresScene(current, sceneContext);
        return next ?? current;
      });
    }, ms);
    return () => window.clearTimeout(t);
  }, [sceneId, journeyKey, showLabChrome, initialScene, sceneContext]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sceneId]);

  const bareShell =
    sceneId === "treasures.celebrate-loading" ||
    sceneId === "treasures.welcome" ||
    sceneId === "treasures.locked-gift" ||
    sceneId === "treasures.gift-locked" ||
    sceneId === "treasures.gift-explosion" ||
    sceneId === "treasures.gift-grid" ||
    isTreasuresGiftContentScene(sceneId) ||
    sceneId === "treasures.final-gift-unlock" ||
    sceneId === "treasures.final-letter" ||
    sceneId === "treasures.binder-transition" ||
    sceneId === "treasures.gallery" ||
    sceneId === "treasures.gallery-ending" ||
    sceneId === "treasures.photobooth";

  function restartJourney() {
    setSceneId(TREASURES_INITIAL_SCENE);
    setOpenedSortOrders(new Set());
    setJourneyKey((k) => k + 1);
  }

  const contentSortOrder = parseTreasuresGiftContentSortOrder(sceneId);
  const StaticScene =
    !isTreasuresGiftContentScene(sceneId) && sceneId !== "treasures.gift-grid"
      ? treasuresSceneRegistry[sceneId as TreasuresStaticSceneId]
      : null;

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
              "flex flex-col",
              showLabChrome ? "h-full min-h-0 flex-1" : "min-h-[100svh]",
            )}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {sceneId === "treasures.gift-grid" ? (
              <TreasuresGiftGridScene
                payload={payload}
                onComplete={advance}
                openedSortOrders={openedSortOrders}
                onSelectGift={selectGift}
              />
            ) : contentSortOrder != null ? (
              <TreasuresGiftContentScene
                payload={payload}
                sortOrder={contentSortOrder}
                openedSortOrders={openedSortOrders}
                onBack={dismissGiftContent}
              />
            ) : StaticScene ? (
              <StaticScene payload={payload} onComplete={advance} />
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
      </MomentsPersistentShell>
    </div>
  );
}
