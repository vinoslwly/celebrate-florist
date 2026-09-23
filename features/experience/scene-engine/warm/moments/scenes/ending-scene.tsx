"use client";

import { resolveEndingMessage } from "@/features/experience/lib/ending-message";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";

type WarmExperienceEndingSceneProps = {
  endingMessage?: string | null;
};

/**
 * Closing beat after photobooth — Selesai / Lewati.
 * Body copy comes from Studio (`experiences.ending_message`).
 */
export function WarmExperienceEndingScene({
  endingMessage,
}: WarmExperienceEndingSceneProps) {
  const body = resolveEndingMessage(endingMessage);

  return (
    <div
      className={SCENE_VIEWPORT_LOCK}
      style={{
        background:
          "radial-gradient(ellipse 72% 58% at 50% 38%, #7A1820 0%, #4A0A10 48%, #1E0408 100%)",
      }}
    >
      <div className="flex h-full min-h-0 w-full flex-col items-center justify-center px-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-center">
        <p
          className="font-mono text-[11px] tracking-[0.28em] uppercase"
          style={{ color: "#E8C96A" }}
        >
          Celebrate
        </p>
        <h1
          className="mt-5 font-serif text-4xl font-medium sm:text-5xl"
          style={{ color: "#FFF8F0" }}
        >
          Terima kasih
        </h1>
        <p
          className="mt-6 max-w-sm whitespace-pre-line font-serif text-base leading-relaxed sm:text-lg"
          style={{ color: "#E8D4C0" }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}
