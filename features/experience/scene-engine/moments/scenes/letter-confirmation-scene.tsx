"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";

type StageHint = "idle" | "nudge";

const BOKEH = [
  {
    top: "-10%",
    right: "-8%",
    size: "44%",
    color: "rgba(247,168,190,0.4)",
    blur: "30px",
  },
  {
    top: "8%",
    left: "-6%",
    size: "28%",
    color: "rgba(255,230,235,0.45)",
    blur: "22px",
  },
  {
    bottom: "-12%",
    left: "-10%",
    size: "42%",
    color: "rgba(242,160,180,0.38)",
    blur: "32px",
  },
  {
    bottom: "-14%",
    right: "-12%",
    size: "50%",
    color: "rgba(247,168,190,0.45)",
    blur: "34px",
  },
] as const;

const FALLING_PETALS = [
  { left: "12%", delay: 0.3, duration: 8.2, size: 15, x: 16 },
  { left: "30%", delay: 1.5, duration: 9, size: 12, x: -12 },
  { left: "52%", delay: 0.7, duration: 7.6, size: 17, x: 10 },
  { left: "70%", delay: 2.2, duration: 8.4, size: 13, x: -14 },
  { left: "86%", delay: 1.1, duration: 7.9, size: 14, x: 8 },
] as const;

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="18"
          rx="9"
          ry="14"
          fill="#F7A8BE"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5.5" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.2" fill="#F48CA8" />
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.9"
      />
    </svg>
  );
}

function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <path
        d="M8 40C10 28 18 20 30 16c-8 2-14 8-18 18Z"
        stroke="#E8A0B4"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M12 36c4-8 12-14 22-16"
        stroke="#F0B4C4"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="14" cy="34" r="2.2" fill="#F7A8BE" />
      <circle cx="20" cy="28" r="1.6" fill="#E8799A" />
      <circle cx="26" cy="24" r="1.2" fill="#F7A8BE" />
    </svg>
  );
}

function RibbonBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 72" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="scene4Ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7B8CC" />
          <stop offset="45%" stopColor="#E8799A" />
          <stop offset="100%" stopColor="#D46888" />
        </linearGradient>
      </defs>
      <ellipse
        cx="34"
        cy="34"
        rx="28"
        ry="16"
        fill="url(#scene4Ribbon)"
        transform="rotate(-18 34 34)"
      />
      <ellipse
        cx="86"
        cy="34"
        rx="28"
        ry="16"
        fill="url(#scene4Ribbon)"
        transform="rotate(18 86 34)"
      />
      <ellipse cx="60" cy="36" rx="12" ry="11" fill="#E8799A" />
      <path
        d="M52 42 Q44 58 38 66"
        stroke="#E8799A"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M68 42 Q76 58 82 66"
        stroke="#D46888"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="36" r="4" fill="#FFF4E8" />
    </svg>
  );
}

/**
 * moments.letter-confirmation — living recreation of Founder Scene 4.
 * Smooth CSS atmosphere only (no photo crops). Open → Scene 5.
 */
export function LetterConfirmationScene({ onComplete }: MomentsSceneProps) {
  const [hint, setHint] = useState<StageHint>("idle");

  function handleMaybeLater() {
    setHint("nudge");
    window.setTimeout(() => setHint("idle"), 1200);
  }

  return (
    <div className={`${SCENE_VIEWPORT_SCROLL} bg-[#F8E4E7]`}>
      {/* Smooth single plane — no stitched crops / banding boxes */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 36%, #FFF9F7 0%, #FCF0F2 28%, #F7E0E6 55%, #F0D0D8 78%, #E8C0CC 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(255,255,255,0.55) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Soft god-ray from top-left */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "conic-gradient(from 210deg at 12% 0%, rgba(255,255,255,0.45), transparent 18%, transparent 100%)",
        }}
        animate={{ opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {BOKEH.map((blob, i) => (
          <motion.div
            key={i}
            className={
              i > 2
                ? "absolute hidden rounded-full sm:block"
                : "absolute rounded-full"
            }
            style={{
              top: "top" in blob ? blob.top : undefined,
              bottom: "bottom" in blob ? blob.bottom : undefined,
              left: "left" in blob ? blob.left : undefined,
              right: "right" in blob ? blob.right : undefined,
              width: blob.size,
              height: blob.size,
              background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              filter: `blur(${blob.blur})`,
            }}
            animate={{ opacity: [0.65, 0.95, 0.65], scale: [1, 1.04, 1] }}
            transition={{
              duration: 5 + i * 0.35,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.15,
            }}
          />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {FALLING_PETALS.map((petal, i) => (
          <motion.div
            key={i}
            className={i > 2 ? "absolute hidden sm:block" : "absolute"}
            style={{
              left: petal.left,
              top: "-6%",
              width: petal.size,
              height: petal.size * 1.35,
            }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: ["0vh", "110vh"],
              x: [0, petal.x, petal.x * -0.4],
              rotate: [0, 40, -20, 55],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Petal className="h-full w-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))] sm:px-6">
        <motion.div
          className="relative w-full max-w-md pt-8"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Heart motif above card */}
          <div className="mb-1 flex items-center justify-center gap-3 text-[#E8A0B4]">
            <span className="h-px w-10 bg-current sm:w-14" aria-hidden />
            <span className="text-sm" aria-hidden>
              ♡
            </span>
            <span className="h-px w-10 bg-current sm:w-14" aria-hidden />
          </div>

          {/* Ribbon perched on card top */}
          <div className="pointer-events-none absolute top-0 left-1/2 z-20 -translate-x-1/2">
            <RibbonBow className="h-14 w-24 sm:h-16 sm:w-28" />
          </div>

          <article className="relative rounded-2xl border border-[#F0C0D0] bg-white/95 px-6 pt-12 pb-7 shadow-[0_22px_55px_-20px_rgba(196,91,122,0.45)] sm:px-10 sm:pt-14 sm:pb-8">
            {/* Double inner frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-3 rounded-xl border border-[#F0C0D0]/70"
            />

            <CornerFlourish className="pointer-events-none absolute top-4 left-4 h-8 w-8 opacity-80" />
            <CornerFlourish className="pointer-events-none absolute top-4 right-4 h-8 w-8 scale-x-[-1] opacity-80" />
            <CornerFlourish className="pointer-events-none absolute bottom-4 left-4 h-8 w-8 scale-y-[-1] opacity-80" />
            <CornerFlourish className="pointer-events-none absolute right-4 bottom-4 h-8 w-8 scale-[-1] opacity-80" />

            <div className="relative text-center">
              <p className="text-[10px] font-semibold tracking-[0.28em] text-[#E39AB0] uppercase sm:text-[11px]">
                Special message
              </p>
              <h2 className="mt-4 font-serif text-xl leading-snug text-[#5C3A42] sm:text-2xl">
                Someone has left a message full of warmth for you.
              </h2>

              <div className="my-5 flex items-center justify-center gap-3 text-[#E8A0B4]">
                <span className="h-px w-10 bg-current" aria-hidden />
                <SakuraMark className="h-5 w-5" />
                <span className="h-px w-10 bg-current" aria-hidden />
              </div>

              <p className="text-base font-semibold text-[#C45B7A] sm:text-lg">
                Would you like to open it?
              </p>

              <motion.button
                type="button"
                aria-label="Open the letter"
                onClick={onComplete}
                className="mt-7 w-full rounded-full bg-gradient-to-b from-[#F48CA8] to-[#E06B8A] px-6 py-3.5 text-sm font-bold tracking-[0.12em] text-white uppercase shadow-[0_10px_24px_-8px_rgba(196,91,122,0.65)] focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none sm:text-[15px]"
                animate={
                  hint === "nudge"
                    ? { scale: [1, 1.04, 1, 1.04, 1] }
                    : { scale: 1 }
                }
                transition={
                  hint === "nudge" ? { duration: 0.7 } : { duration: 0.2 }
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open the letter{" "}
                <span aria-hidden className="ml-1">
                  ♥
                </span>
              </motion.button>

              <button
                type="button"
                onClick={handleMaybeLater}
                className="mt-4 text-[11px] font-semibold tracking-[0.18em] text-[#E39AB0] uppercase transition-colors hover:text-[#C45B7A] focus-visible:underline focus-visible:outline-none"
              >
                Maybe later
              </button>
            </div>
          </article>
        </motion.div>
      </div>
    </div>
  );
}
