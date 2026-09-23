"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { SkyExperienceEndingScene } from "@/features/experience/scene-engine/sky/moments/scenes/ending-scene";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";
import { Photobooth } from "@/features/photobooth/components/photobooth";
import { recipientCustomStripPresets } from "@/features/photobooth/lib/recipient-custom-strips";

const NAVY = "#071A33";

/**
 * Sky Moments terminal photobooth — 3-frame Layout B, navy participant UI.
 * Selesai / Lewati open the thank-you ending (not a dead-end host advance).
 */
export function SkyPhotoboothScene({ payload }: SkyMomentsSceneProps) {
  const { experience, theme, photoboothStrips, catalogPhotoboothStrips } =
    payload;
  const [showEnding, setShowEnding] = useState(false);
  const customStripPresets = recipientCustomStripPresets(
    experience,
    "sky",
    photoboothStrips,
    catalogPhotoboothStrips,
  );

  if (showEnding) {
    return (
      <SkyExperienceEndingScene endingMessage={experience.ending_message} />
    );
  }

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ background: NAVY }}>
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Photobooth
            greetingName={experience.greeting_name}
            themeEmoji={theme.emoji}
            variant="capture"
            themeId="sky"
            customStripPresets={customStripPresets}
            onComplete={() => setShowEnding(true)}
          />
        </motion.div>
      </div>
    </div>
  );
}
