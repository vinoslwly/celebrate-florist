"use client";

import { useSearchParams } from "next/navigation";

import { WarmMomentsSceneHost } from "@/features/experience/scene-engine/warm/moments/warm-moments-scene-host";
import {
  WARM_MOMENTS_LAB_EXPERIENCE,
  WARM_MOMENTS_LAB_PHOTOS,
} from "@/features/theme-lab/config/warm-moments-fixtures";
import { warmMomentsLabTheme } from "@/features/themes/config/warm-moments-lab-theme";

/**
 * Warm Theme Lab — Moments Scenes 1–9 living.
 * Connection / Memories / Treasures not started for Warm.
 * Production `/e/[token]` Scene Engine: NOT AUTHORIZED.
 *
 * Lab fixture: `?noPhotos=1` runs the safe gallery-skip path (empty photos).
 */
export function WarmThemeLabPage() {
  const searchParams = useSearchParams();
  const noPhotos = searchParams.get("noPhotos") === "1";
  const photos = noPhotos ? [] : WARM_MOMENTS_LAB_PHOTOS;

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-[#4A0A10]">
      <header className="z-50 shrink-0 border-b border-[#E8D4C0]/20 bg-[#3A080C]/95 px-3 py-2 backdrop-blur-sm sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] font-bold tracking-widest text-[#E8D4C0]/80 uppercase">
            Theme Lab · Warm Moments
          </p>
          <span className="rounded border border-[#E8D4C0]/35 px-1.5 py-0.5 font-mono text-[10px] text-[#E8D4C0]/90">
            Scenes 1–9 living · Moments only
          </span>
          {noPhotos ? (
            <span className="rounded border border-amber-500/40 px-1.5 py-0.5 font-mono text-[10px] text-amber-200/90">
              no-photo fixture
            </span>
          ) : null}
          <span className="rounded border border-amber-500/40 px-1.5 py-0.5 font-mono text-[10px] text-amber-200/90">
            /e/ not authorized
          </span>
        </div>
      </header>

      <WarmMomentsSceneHost
        experience={WARM_MOMENTS_LAB_EXPERIENCE}
        photos={photos}
        theme={warmMomentsLabTheme}
        showLabChrome
        className="min-h-0 flex-1"
      />
    </div>
  );
}
