"use client";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { Photobooth } from "@/features/photobooth/components/photobooth";

/**
 * Terminal Moments scene — Sprint 14 strip composition host (Bloom Theme Lab).
 * Scene ID / graph unchanged. Warm/Sky wrappers still use their own shells + legacy default.
 */
export function PhotoboothScene({ payload }: MomentsSceneProps) {
  const { experience, theme } = payload;

  return (
    <div className={SCENE_VIEWPORT_SCROLL}>
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-3 py-6 sm:px-6 sm:py-8">
        <p
          className="mb-3 text-center font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
          data-production-pending="moments-photobooth"
        >
          Scene 10 · Photobooth · Strip + filters (Sprint 14.4)
        </p>
        <Photobooth
          variant="capture"
          themeId="bloom"
          greetingName={experience.greeting_name}
          themeEmoji={theme.emoji}
          initialLayoutId="B"
        />
      </div>
    </div>
  );
}
