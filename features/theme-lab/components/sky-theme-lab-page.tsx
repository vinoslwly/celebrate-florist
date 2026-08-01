"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { SkyConnectionSceneHost } from "@/features/experience/scene-engine/sky/connection/sky-connection-scene-host";
import { SkyMemoriesSceneHost } from "@/features/experience/scene-engine/sky/memories/sky-memories-scene-host";
import { SkyMomentsSceneHost } from "@/features/experience/scene-engine/sky/moments/sky-moments-scene-host";
import { SkyTreasuresSceneHost } from "@/features/experience/scene-engine/sky/treasures/sky-treasures-scene-host";
import {
  SKY_CONNECTION_LAB_EXPERIENCE,
  SKY_CONNECTION_LAB_PHOTOS,
  SKY_CONNECTION_LAB_QUIZ,
} from "@/features/theme-lab/config/sky-connection-fixtures";
import {
  SKY_MEMORIES_LAB_EXPERIENCE,
  SKY_MEMORIES_LAB_MATCH,
  SKY_MEMORIES_LAB_PHOTOS,
  SKY_MEMORIES_LAB_SCORE_RESULT,
} from "@/features/theme-lab/config/sky-memories-fixtures";
import {
  SKY_MOMENTS_LAB_EXPERIENCE,
  SKY_MOMENTS_LAB_PHOTOS,
} from "@/features/theme-lab/config/sky-moments-fixtures";
import {
  SKY_TREASURES_LAB_ENVELOPES,
  SKY_TREASURES_LAB_EXPERIENCE,
  SKY_TREASURES_LAB_PHOTOS,
} from "@/features/theme-lab/config/sky-treasures-fixtures";
import { skyMomentsLabTheme } from "@/features/themes/config/sky-moments-lab-theme";

type ModeTab = "moments" | "connection" | "memories" | "treasures";

/**
 * Sky Theme Lab — Moments + Connection + Memories locked · Treasures Scenes 0–13 living.
 * Production `/e/[token]`: NOT AUTHORIZED.
 *
 * Lab fixtures: `?noPhotos=1` · `?mode=connection|memories|treasures`
 */
export function SkyThemeLabPage() {
  const searchParams = useSearchParams();
  const noPhotos = searchParams.get("noPhotos") === "1";
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState<ModeTab>(
    modeParam === "connection" ||
      modeParam === "memories" ||
      modeParam === "treasures"
      ? modeParam
      : "moments",
  );

  const momentsPhotos = noPhotos ? [] : SKY_MOMENTS_LAB_PHOTOS;
  const connectionPhotos = noPhotos ? [] : SKY_CONNECTION_LAB_PHOTOS;
  const memoriesPhotos = noPhotos ? [] : SKY_MEMORIES_LAB_PHOTOS;
  const treasuresPhotos = noPhotos ? [] : SKY_TREASURES_LAB_PHOTOS;

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-[#1E3A5F]">
      <header className="z-50 shrink-0 border-b border-white/15 bg-[#1E3A5F]/95 px-3 py-2 backdrop-blur-sm sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] font-bold tracking-widest text-[#E8F2FA]/85 uppercase">
            Theme Lab · Sky
          </p>
          <div className="flex flex-wrap gap-1">
            {(["moments", "connection", "memories", "treasures"] as const).map(
              (tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setMode(tab)}
                  className={cn(
                    "rounded border px-2 py-0.5 font-mono text-[10px] capitalize",
                    mode === tab
                      ? "border-[#7EB6D9]/70 bg-[#7EB6D9]/20 text-[#E8F2FA]"
                      : "border-white/25 text-[#E8F2FA]/70 hover:bg-white/10",
                  )}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
          {mode === "moments" ? (
            <span className="rounded border border-[#7EB6D9]/45 px-1.5 py-0.5 font-mono text-[10px] text-[#E8F2FA]/90">
              moments · Scene 1–9 · locked
            </span>
          ) : mode === "connection" ? (
            <span className="rounded border border-[#7EB6D9]/45 px-1.5 py-0.5 font-mono text-[10px] text-[#E8F2FA]/90">
              connection · Scenes 0–15 · locked
            </span>
          ) : mode === "memories" ? (
            <span className="rounded border border-[#7EB6D9]/45 px-1.5 py-0.5 font-mono text-[10px] text-[#E8F2FA]/90">
              memories · Scenes 0–end · locked
            </span>
          ) : (
            <span className="rounded border border-[#7EB6D9]/45 px-1.5 py-0.5 font-mono text-[10px] text-[#E8F2FA]/90">
              treasures · Scenes 0–13 · photobooth
            </span>
          )}
          {noPhotos ? (
            <span className="rounded border border-amber-400/40 px-1.5 py-0.5 font-mono text-[10px] text-amber-100/90">
              no-photo fixture
            </span>
          ) : null}
          <span className="rounded border border-amber-400/40 px-1.5 py-0.5 font-mono text-[10px] text-amber-100/90">
            /e/ not authorized
          </span>
        </div>
      </header>

      {mode === "moments" ? (
        <SkyMomentsSceneHost
          experience={SKY_MOMENTS_LAB_EXPERIENCE}
          photos={momentsPhotos}
          theme={skyMomentsLabTheme}
          showLabChrome
          className="min-h-0 flex-1 bg-[#C5DCEF]"
        />
      ) : mode === "connection" ? (
        <SkyConnectionSceneHost
          experience={SKY_CONNECTION_LAB_EXPERIENCE}
          photos={connectionPhotos}
          theme={skyMomentsLabTheme}
          quiz={SKY_CONNECTION_LAB_QUIZ}
          showLabChrome
          className="min-h-0 flex-1 bg-[#C5DCEF]"
        />
      ) : mode === "memories" ? (
        <SkyMemoriesSceneHost
          experience={SKY_MEMORIES_LAB_EXPERIENCE}
          photos={memoriesPhotos}
          theme={skyMomentsLabTheme}
          match={SKY_MEMORIES_LAB_MATCH}
          scoreResult={SKY_MEMORIES_LAB_SCORE_RESULT}
          showLabChrome
          className="min-h-0 flex-1 bg-[#C5DCEF]"
        />
      ) : (
        <SkyTreasuresSceneHost
          experience={SKY_TREASURES_LAB_EXPERIENCE}
          photos={treasuresPhotos}
          theme={skyMomentsLabTheme}
          envelopes={SKY_TREASURES_LAB_ENVELOPES}
          showLabChrome
          className="min-h-0 flex-1 bg-[#C5DCEF]"
        />
      )}
    </div>
  );
}
