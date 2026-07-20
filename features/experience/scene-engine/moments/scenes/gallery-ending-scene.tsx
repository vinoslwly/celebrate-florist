"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="17"
          rx="10"
          ry="15"
          fill="#F4A0B8"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5.5" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.4" fill="#E07090" />
    </svg>
  );
}

function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden fill="none">
      <path
        d="M5 16 C10 6 20 4 24 9 C16 12 11 18 9 24 C7 21 5 18 5 16Z"
        fill="#C45B7A"
        opacity="0.7"
      />
    </svg>
  );
}

/**
 * moments.gallery-ending — soft closing beat before photobooth.
 * Intentionally light: no particle rain, opacity/transform only.
 */
export function GalleryEndingScene({ payload, onComplete }: MomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const name = payload.experience.greeting_name;

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-[#F0C8D4]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 140% 100% at 50% 40%, #FFFCFB 0%, #FDF0F4 36%, #F0C8D4 72%, #E0A8BC 100%)",
        }}
      />
      {/* Soft static glow — no pulse loop */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] left-1/2 h-[40vmin] w-[40vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.65) 0%, transparent 70%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, #F0A8BC 45%, #D87898 100%)",
          clipPath: "ellipse(105% 100% at 50% 100%)",
        }}
      />
      <SakuraMark className="pointer-events-none absolute bottom-6 left-[12%] h-12 w-12 opacity-90" />
      <SakuraMark className="pointer-events-none absolute right-[14%] bottom-8 h-11 w-11 opacity-80" />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-12 text-center">
        <motion.div
          className="mb-5 flex items-center justify-center gap-3"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#E8B0C0]" />
          <LeafMark className="h-4 w-4" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#E8B0C0]" />
        </motion.div>

        <motion.p
          className="max-w-md font-serif text-xl text-[#5C1E30] italic sm:text-2xl"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          Every moment with you is my favorite memory
        </motion.p>

        <motion.h2
          className="mt-8 font-serif text-5xl font-semibold tracking-tight text-[#5C1E30] sm:text-6xl"
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
          className="mt-4 font-serif text-lg text-[#6B3A48] sm:text-xl"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.28, duration: 0.4 }}
        >
          for sharing these memories
          {name ? (
            <>
              {" "}
              with <span className="font-semibold text-[#8B2E3E]">{name}</span>
            </>
          ) : null}
          .
        </motion.p>

        <motion.p
          className="mt-12 font-serif text-sm tracking-wide text-[#9B5A6E]"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.45, duration: 0.4 }}
        >
          Preparing your celebration…
        </motion.p>

        <motion.button
          type="button"
          aria-label="Continue to photobooth"
          onClick={onComplete}
          className="mt-4 text-xs font-medium tracking-wide text-[#C45B7A] underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none"
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
