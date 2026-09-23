"use client";

import { resolveEndingMessage } from "@/features/experience/lib/ending-message";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";

type BloomExperienceEndingSceneProps = {
  endingMessage?: string | null;
};

/**
 * Closing beat after photobooth — Selesai / Lewati.
 * Body copy comes from Studio (`experiences.ending_message`).
 */
export function BloomExperienceEndingScene({
  endingMessage,
}: BloomExperienceEndingSceneProps) {
  const body = resolveEndingMessage(endingMessage);

  return (
    <div className={`${SCENE_VIEWPORT_LOCK} bg-[#F8E4E7]`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 140% 110% at 50% 38%, #FFF9F7 0%, #FCEEF1 32%, #F6D4DE 68%, #EBB8C8 100%)",
        }}
      />
      <div className="relative z-10 flex h-full min-h-0 w-full flex-col items-center justify-center px-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <p className="font-mono text-[11px] tracking-[0.28em] text-[#C45B7A] uppercase">
          Celebrate
        </p>
        <h1 className="mt-5 font-serif text-4xl font-medium text-[#8B2E3E] sm:text-5xl">
          Terima kasih
        </h1>
        <p className="mt-6 max-w-sm whitespace-pre-line font-serif text-base leading-relaxed text-[#6B4450] sm:text-lg">
          {body}
        </p>
      </div>
    </div>
  );
}
