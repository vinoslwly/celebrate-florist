"use client";

import { useState } from "react";

import { BloomExperienceEndingScene } from "@/features/experience/scene-engine/moments/scenes/ending-scene";
import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { recipientCustomStripPresets } from "@/features/photobooth/lib/recipient-custom-strips";

/**
 * Terminal Bloom Moments scene — Layout B, 3 photos.
 * Selesai / Lewati open the thank-you ending.
 */
export function PhotoboothScene({ payload }: MomentsSceneProps) {
  const { experience, theme, photoboothStrips, catalogPhotoboothStrips } =
    payload;
  const [showEnding, setShowEnding] = useState(false);
  const customStripPresets = recipientCustomStripPresets(
    experience,
    "bloom",
    photoboothStrips,
    catalogPhotoboothStrips,
  );

  if (showEnding) {
    return (
      <BloomExperienceEndingScene endingMessage={experience.ending_message} />
    );
  }

  return (
    <div className={`${SCENE_VIEWPORT_SCROLL} bg-[#FFF0F3]`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 140% 110% at 50% 32%, #FFF9F7 0%, #FCEEF1 28%, #F6D4DE 62%, #F0C0D0 100%)",
        }}
      />
      <div className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col px-3 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        <Photobooth
          greetingName={experience.greeting_name}
          themeEmoji={theme.emoji}
          variant="capture"
          themeId="bloom"
          initialLayoutId="B"
          customStripPresets={customStripPresets}
          onComplete={() => setShowEnding(true)}
        />
      </div>
    </div>
  );
}
