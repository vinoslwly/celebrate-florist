"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { WarmConnectionSceneHost } from "@/features/experience/scene-engine/warm/connection/warm-connection-scene-host";
import { WarmMomentsSceneHost } from "@/features/experience/scene-engine/warm/moments/warm-moments-scene-host";
import {
  WARM_CONNECTION_LAB_EXPERIENCE,
  WARM_CONNECTION_LAB_PHOTOS,
  WARM_CONNECTION_LAB_QUIZ,
  WARM_CONNECTION_LAB_SCORE_RESULT,
} from "@/features/theme-lab/config/warm-connection-fixtures";
import {
  WARM_MOMENTS_LAB_EXPERIENCE,
  WARM_MOMENTS_LAB_PHOTOS,
} from "@/features/theme-lab/config/warm-moments-fixtures";
import { warmMomentsLabTheme } from "@/features/themes/config/warm-moments-lab-theme";

type ModeTab = "moments" | "connection";

const IMPLEMENTED_MODES: ModeTab[] = ["moments", "connection"];
const PENDING_MODES = ["memories", "treasures"] as const;

/**
 * Warm Theme Lab — Moments (1–10) + Connection (0–15 photobooth) living.
 * Memories / Treasures not started. Production `/e/[token]`: NOT AUTHORIZED.
 *
 * Lab fixtures: `?noPhotos=1` (Moments / Connection gallery skip) · `?mode=connection`
 * Invalid `?warmConnectionScene=` is ignored (no deep-link whitelist yet).
 */
export function WarmThemeLabPage() {
  const searchParams = useSearchParams();
  const noPhotos = searchParams.get("noPhotos") === "1";
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState<ModeTab>(
    modeParam === "connection" ? "connection" : "moments",
  );

  const momentsPhotos = noPhotos ? [] : WARM_MOMENTS_LAB_PHOTOS;
  const connectionPhotos = noPhotos ? [] : WARM_CONNECTION_LAB_PHOTOS;

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-[#4A0A10]">
      <header className="z-50 shrink-0 border-b border-[#E8D4C0]/20 bg-[#3A080C]/95 px-3 py-2 backdrop-blur-sm sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] font-bold tracking-widest text-[#E8D4C0]/80 uppercase">
            Theme Lab · Warm
          </p>
          <div className="flex flex-wrap gap-1">
            {IMPLEMENTED_MODES.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMode(tab)}
                className={cn(
                  "rounded border px-2 py-0.5 font-mono text-[10px] capitalize",
                  mode === tab
                    ? "border-[#C9A227]/70 bg-[#C9A227]/15 text-[#F0D878]"
                    : "border-[#E8D4C0]/30 text-[#E8D4C0]/75 hover:bg-[#E8D4C0]/10",
                )}
              >
                {tab}
              </button>
            ))}
            {PENDING_MODES.map((tab) => (
              <span
                key={tab}
                className="cursor-not-allowed rounded border border-[#E8D4C0]/15 px-2 py-0.5 font-mono text-[10px] text-[#E8D4C0]/35 capitalize opacity-50"
              >
                {tab}
              </span>
            ))}
          </div>
          {mode === "moments" ? (
            <span className="rounded border border-[#E8D4C0]/35 px-1.5 py-0.5 font-mono text-[10px] text-[#E8D4C0]/90">
              Scenes 1–10 · photobooth stub
            </span>
          ) : (
            <span className="rounded border border-[#E8D4C0]/35 px-1.5 py-0.5 font-mono text-[10px] text-[#E8D4C0]/90">
              Scenes 0–15 · photobooth
            </span>
          )}
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

      {mode === "moments" ? (
        <WarmMomentsSceneHost
          experience={WARM_MOMENTS_LAB_EXPERIENCE}
          photos={momentsPhotos}
          theme={warmMomentsLabTheme}
          showLabChrome
          className="min-h-0 flex-1"
        />
      ) : (
        <WarmConnectionSceneHost
          experience={WARM_CONNECTION_LAB_EXPERIENCE}
          photos={connectionPhotos}
          theme={warmMomentsLabTheme}
          quiz={WARM_CONNECTION_LAB_QUIZ}
          scoreResult={WARM_CONNECTION_LAB_SCORE_RESULT}
          showLabChrome
          className="min-h-0 flex-1"
        />
      )}
    </div>
  );
}
