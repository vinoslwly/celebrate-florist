"use client";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import { Photobooth } from "@/features/photobooth/components/photobooth";

const FIELD =
  "radial-gradient(ellipse at 50% 40%, #8B1A22 0%, #6B0F16 50%, #4A0A10 100%)";
const CREAM = "#E8D4C0";
const GOLD = "#C9A227";

/**
 * Warm Moments terminal photobooth — Bloom Photobooth on a crimson field.
 * Official photobooth redesign deferred to Sprint 14; Theme Lab complement only.
 */
export function WarmPhotoboothScene({ payload }: MomentsSceneProps) {
  const { experience, theme } = payload;

  return (
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{ background: FIELD }}
      data-production-pending="warm-moments-photobooth"
    >
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6">
        <p
          className="mb-2 text-center font-mono text-[10px] font-bold tracking-widest uppercase"
          style={{ color: `${CREAM}99` }}
        >
          Scene 10 · Photobooth · Sprint 14 pending
        </p>
        <p
          className="mb-5 text-center font-serif text-sm"
          style={{ color: GOLD }}
        >
          A crimson keepsake stop — camera stays in your browser.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-[#C9A227]/35 bg-[#FFF8F0]/95 p-1 shadow-[0_20px_50px_-20px_rgba(20,4,8,0.65)]"
        >
          <Photobooth
            greetingName={experience.greeting_name}
            themeEmoji={theme.emoji}
          />
        </motion.div>
      </div>
    </div>
  );
}
