"use client";

import { useState } from "react";

import { useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";

import { SkyConnectionSceneHost } from "@/features/experience/scene-engine/sky/connection/sky-connection-scene-host";
import { SkyMomentsSceneHost } from "@/features/experience/scene-engine/sky/moments/sky-moments-scene-host";
import {
  SKY_CONNECTION_LAB_EXPERIENCE,
  SKY_CONNECTION_LAB_PHOTOS,
  SKY_CONNECTION_LAB_QUIZ,
} from "@/features/theme-lab/config/sky-connection-fixtures";
import {
  SKY_MOMENTS_LAB_EXPERIENCE,
  SKY_MOMENTS_LAB_PHOTOS,
} from "@/features/theme-lab/config/sky-moments-fixtures";
import { skyMomentsLabTheme } from "@/features/themes/config/sky-moments-lab-theme";

type ModeTab = "moments" | "connection";

/**
 * Sky Theme Lab — Moments locked · Connection Scenes 0–15 living.
 * Production `/e/[token]`: NOT AUTHORIZED.
 *
 * Lab fixtures: `?noPhotos=1` · `?mode=connection`
 */
export function SkyThemeLabPage() {
  const searchParams = useSearchParams();
  const noPhotos = searchParams.get("noPhotos") === "1";
  const modeParam = searchParams.get("mode");
  const [mode, setMode] = useState<ModeTab>(
    modeParam === "connection" ? "connection" : "moments",
  );

  const momentsPhotos = noPhotos ? [] : SKY_MOMENTS_LAB_PHOTOS;
  const connectionPhotos = noPhotos ? [] : SKY_CONNECTION_LAB_PHOTOS;

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-[#1E3A5F]">
      <header className="z-50 shrink-0 border-b border-white/15 bg-[#1E3A5F]/95 px-3 py-2 backdrop-blur-sm sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] font-bold tracking-widest text-[#E8F2FA]/85 uppercase">
            Theme Lab · Sky
          </p>
          <div className="flex flex-wrap gap-1">
            {(["moments", "connection"] as const).map((tab) => (
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
            ))}
          </div>
          {mode === "moments" ? (
            <span className="rounded border border-[#7EB6D9]/45 px-1.5 py-0.5 font-mono text-[10px] text-[#E8F2FA]/90">
              moments · Scene 1–9 · locked
            </span>
          ) : (
            <span className="rounded border border-[#7EB6D9]/45 px-1.5 py-0.5 font-mono text-[10px] text-[#E8F2FA]/90">
              connection · Scenes 0–15 · photobooth
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
      ) : (
        <SkyConnectionSceneHost
          experience={SKY_CONNECTION_LAB_EXPERIENCE}
          photos={connectionPhotos}
          theme={skyMomentsLabTheme}
          quiz={SKY_CONNECTION_LAB_QUIZ}
          showLabChrome
          className="min-h-0 flex-1 bg-[#C5DCEF]"
        />
      )}
    </div>
  );
}
