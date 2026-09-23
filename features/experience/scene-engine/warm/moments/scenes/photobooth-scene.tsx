"use client";

import { useState } from "react";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { WarmExperienceEndingScene } from "@/features/experience/scene-engine/warm/moments/scenes/ending-scene";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { recipientCustomStripPresets } from "@/features/photobooth/lib/recipient-custom-strips";

const CRIMSON = "#3A080C";

/**
 * Terminal Warm Moments scene — Layout B, 3 photos, dark crimson Darling field.
 * Selesai / Lewati open the thank-you ending.
 */
export function WarmPhotoboothScene({ payload }: MomentsSceneProps) {
  const { experience, theme, photoboothStrips, catalogPhotoboothStrips } =
    payload;
  const [showEnding, setShowEnding] = useState(false);
  const customStripPresets = recipientCustomStripPresets(
    experience,
    "warm",
    photoboothStrips,
    catalogPhotoboothStrips,
  );

  if (showEnding) {
    return (
      <WarmExperienceEndingScene endingMessage={experience.ending_message} />
    );
  }

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ background: CRIMSON }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 55% at 50% 18%, #8B1A22 0%, #6B0F16 42%, #3A080C 100%)",
        }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-3 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        <Photobooth
          greetingName={experience.greeting_name}
          themeEmoji={theme.emoji}
          variant="capture"
          themeId="warm"
          initialLayoutId="B"
          customStripPresets={customStripPresets}
          onComplete={() => setShowEnding(true)}
        />
      </div>
    </div>
  );
}
