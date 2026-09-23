"use client";

import { resolveEndingMessage } from "@/features/experience/lib/ending-message";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";

const FIELD = "linear-gradient(135deg, #C5DCEF 0%, #E8F2FB 48%, #F7FBFE 100%)";
const INK = "#1E3A5F";

type SkyExperienceEndingSceneProps = {
  endingMessage?: string | null;
};

/**
 * Closing beat after photobooth — Selesai / Lewati.
 * Body copy comes from Studio (`experiences.ending_message`).
 */
export function SkyExperienceEndingScene({
  endingMessage,
}: SkyExperienceEndingSceneProps) {
  const body = resolveEndingMessage(endingMessage);

  return (
    <div className={SCENE_VIEWPORT_LOCK} style={{ background: FIELD }}>
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center px-8 text-center">
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase"
          style={{ color: INK }}
        >
          {"// CELEBRATE"}
        </p>
        <h1
          className="mt-5 font-serif text-4xl font-medium sm:text-5xl"
          style={{ color: INK }}
        >
          Terima kasih
        </h1>
        <p
          className="mt-6 max-w-sm whitespace-pre-line font-serif text-base leading-relaxed sm:text-lg"
          style={{ color: INK }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
