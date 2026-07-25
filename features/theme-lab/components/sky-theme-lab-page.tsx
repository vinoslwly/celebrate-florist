"use client";

import { useSearchParams } from "next/navigation";

import { SkyMomentsSceneHost } from "@/features/experience/scene-engine/sky/moments/sky-moments-scene-host";
import {
  SKY_MOMENTS_LAB_EXPERIENCE,
  SKY_MOMENTS_LAB_PHOTOS,
} from "@/features/theme-lab/config/sky-moments-fixtures";
import { skyMomentsLabTheme } from "@/features/themes/config/sky-moments-lab-theme";

/**
 * Sky Theme Lab — Moments Scene 1–9 living.
 * Production `/e/[token]`: NOT AUTHORIZED.
 *
 * Lab fixtures: `?noPhotos=1`
 */
export function SkyThemeLabPage() {
  const searchParams = useSearchParams();
  const noPhotos = searchParams.get("noPhotos") === "1";
  const photos = noPhotos ? [] : SKY_MOMENTS_LAB_PHOTOS;

  return (
    <div className="flex h-[100svh] flex-col overflow-hidden bg-[#1E3A5F]">
      <header className="z-50 shrink-0 border-b border-white/15 bg-[#1E3A5F]/95 px-3 py-2 backdrop-blur-sm sm:px-4">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] font-bold tracking-widest text-[#E8F2FA]/85 uppercase">
            Theme Lab · Sky
          </p>
          <span className="rounded border border-[#7EB6D9]/45 px-1.5 py-0.5 font-mono text-[10px] text-[#E8F2FA]/90">
            moments · Scene 1–9
          </span>
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

      {/* Match Scene sky base so mobile overscroll never flashes navy seam */}
      <SkyMomentsSceneHost
        experience={SKY_MOMENTS_LAB_EXPERIENCE}
        photos={photos}
        theme={skyMomentsLabTheme}
        showLabChrome
        className="min-h-0 flex-1 bg-[#C5DCEF]"
      />
    </div>
  );
}
