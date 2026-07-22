"use client";

import { useEffect, useRef } from "react";

import { Cormorant_Garamond, Great_Vibes } from "next/font/google";

import { motion, useReducedMotion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";

const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const editorial = Cormorant_Garamond({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const EASE = [0.22, 1, 0.36, 1] as const;

/** Soft hold before awaiting / next beat. */
export const WARM_GALLERY_ENDING_MS = 2800;

function GoldRule({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-3 ${className ?? ""}`}
    >
      <span
        className="h-px w-12"
        style={{
          background: "linear-gradient(90deg, transparent, #C9A227)",
        }}
      />
      <span
        className="h-1.5 w-1.5 rotate-45"
        style={{ background: "#C9A227" }}
      />
      <span
        className="h-px w-12"
        style={{
          background: "linear-gradient(90deg, #C9A227, transparent)",
        }}
      />
    </div>
  );
}

/**
 * Warm Moments Scene 9 — Gallery ending.
 * Quiet luxury close after the scrapbook gallery.
 */
export function WarmGalleryEndingScene({
  payload,
  onComplete,
}: MomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const name = payload.experience.greeting_name;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ms = reduceMotion ? 600 : WARM_GALLERY_ENDING_MS;
    const t = window.setTimeout(() => onCompleteRef.current(), ms);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div
      className={`${editorial.className} relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden`}
      style={{
        background:
          "radial-gradient(ellipse 72% 58% at 50% 38%, #7A1820 0%, #4A0A10 48%, #1E0408 100%)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 50% 40% at 50% 42%, rgba(255,220,180,0.1) 0%, transparent 70%)",
            "radial-gradient(ellipse 60% 40% at 15% 20%, rgba(140,30,40,0.28) 0%, transparent 55%)",
          ].join(", "),
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-14 text-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45 }}
        >
          <GoldRule />
        </motion.div>

        <motion.p
          className={`${script.className} mt-8 max-w-sm text-[1.85rem] leading-snug text-[#F0D878] sm:text-[2.1rem]`}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          Every moment with you is my favorite memory
        </motion.p>

        <motion.h2
          className="mt-8 text-[2.75rem] font-semibold tracking-tight text-[#FFF8F0] sm:text-5xl"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: reduceMotion ? 0 : 0.12,
            duration: 0.55,
            ease: EASE,
          }}
        >
          Thank you
        </motion.h2>

        <motion.p
          className="mt-4 max-w-xs text-base text-[#E8D4C0]/85 sm:text-lg"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.28, duration: 0.4 }}
        >
          for sharing these warm memories
          {name ? (
            <>
              {" "}
              with <span className="font-semibold text-[#F0D878]">{name}</span>
            </>
          ) : null}
          .
        </motion.p>

        <motion.p
          className="mt-12 text-[11px] tracking-[0.22em] text-[#E8C96A]/70 uppercase"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.45, duration: 0.4 }}
        >
          Preparing your celebration…
        </motion.p>

        <motion.button
          type="button"
          aria-label="Continue"
          onClick={onComplete}
          className="mt-4 text-xs font-medium tracking-wide text-[#E8D4C0]/75 underline-offset-4 hover:underline focus-visible:outline-none"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.55, duration: 0.35 }}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
}
