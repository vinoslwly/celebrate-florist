"use client";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { Photobooth } from "@/features/photobooth/components/photobooth";

/** Terminal Moments scene — existing Photobooth wrapper; Sprint 14 redesign deferred. */
export function PhotoboothScene({ payload }: MomentsSceneProps) {
  const { experience, theme } = payload;

  return (
    <div className="mx-auto flex w-full max-w-lg flex-1 flex-col px-4 py-10 sm:px-6">
      <p
        className="mb-4 text-center font-mono text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
        data-production-pending="moments-photobooth"
      >
        Scene 10 · Photobooth · Production Pending (Sprint 14)
      </p>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Photobooth
          greetingName={experience.greeting_name}
          themeEmoji={theme.emoji}
        />
      </motion.div>
    </div>
  );
}
