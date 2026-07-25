"use client";

import { motion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";
import { Photobooth } from "@/features/photobooth/components/photobooth";

const FIELD =
  "radial-gradient(ellipse at 50% 38%, #F8FBFE 0%, #EEF4FA 32%, #C5DCEF 58%, #8EBFDE 100%)";
const NAVY = "#1E3A5F";
const SKY_ACCENT = "#3D7AAD";

/**
 * Sky Moments terminal photobooth — Bloom Photobooth on a sky field.
 * Official photobooth redesign deferred to Sprint 14; Theme Lab complement only.
 */
export function SkyPhotoboothScene({ payload }: SkyMomentsSceneProps) {
  const { experience, theme } = payload;

  return (
    <div
      className={SCENE_VIEWPORT_SCROLL}
      style={{ background: FIELD }}
      data-production-pending="sky-moments-photobooth"
    >
      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6">
        <p
          className="mb-2 text-center font-mono text-[10px] font-bold tracking-widest uppercase"
          style={{ color: `${NAVY}99` }}
        >
          Scene 9 · Photobooth · Sprint 14 pending
        </p>
        <p
          className="mb-5 text-center font-serif text-sm"
          style={{ color: SKY_ACCENT }}
        >
          A sky-blue keepsake stop — camera stays in your browser.
        </p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-[#7EB6D9]/45 bg-[#FFFEFB]/95 p-1 shadow-[0_20px_50px_-20px_rgba(30,58,95,0.35)]"
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
