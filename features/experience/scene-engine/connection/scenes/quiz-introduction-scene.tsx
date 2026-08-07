"use client";

import type { CSSProperties } from "react";

import { motion } from "framer-motion";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";
import {
  allowAmbientLoop,
  MOTION_DURATION,
  MOTION_EASE,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";

/** Static drift petals — density without Framer cost. */
const DRIFT_PETALS = [
  { top: "12%", left: "8%", size: 18, rotate: -18, opacity: 0.75 },
  { top: "18%", left: "78%", size: 14, rotate: 22, opacity: 0.65 },
  { top: "34%", left: "4%", size: 16, rotate: 8, opacity: 0.55 },
  { top: "40%", left: "88%", size: 20, rotate: -12, opacity: 0.7 },
  { top: "58%", left: "10%", size: 15, rotate: 28, opacity: 0.6 },
  { top: "68%", left: "82%", size: 17, rotate: -25, opacity: 0.55 },
  { top: "78%", left: "22%", size: 13, rotate: 14, opacity: 0.5 },
  { top: "22%", left: "48%", size: 11, rotate: -8, opacity: 0.4 },
] as const;

/** Falling petals — CSS only (transform/opacity), capped for mobile. */
const FALL_PETALS = [
  { left: "14%", delay: "0s", duration: "9s", size: 15, drift: "12px" },
  { left: "38%", delay: "2.2s", duration: "10s", size: 13, drift: "-10px" },
  { left: "62%", delay: "1s", duration: "8.5s", size: 17, drift: "14px" },
  { left: "84%", delay: "3.5s", duration: "9.5s", size: 14, drift: "-12px" },
] as const;

function SakuraBloom({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="15"
          rx="10"
          ry="16"
          fill="#F4A0B8"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
      <circle cx="32" cy="32" r="2.6" fill="#E8A850" />
    </svg>
  );
}

/** Corner cluster — visual weight without multiple animated nodes. */
function SakuraCluster({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 140" className={className} aria-hidden fill="none">
      <defs>
        <radialGradient id="qiClusterGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFE8F0" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F4A0B8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="78" r="48" fill="url(#qiClusterGlow)" />
      {/* soft stems */}
      <path
        d="M48 120 C52 90 62 70 78 58"
        stroke="#D8889A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M62 128 C68 100 78 82 98 70"
        stroke="#D8889A"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.35"
      />
      {/* blooms */}
      <g transform="translate(52 40) scale(0.72)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={`a-${deg}`}
            cx="32"
            cy="15"
            rx="10"
            ry="16"
            fill="#F6A8BC"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
        <circle cx="32" cy="32" r="2.5" fill="#E8A850" />
      </g>
      <g transform="translate(82 58) scale(0.55)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={`b-${deg}`}
            cx="32"
            cy="15"
            rx="10"
            ry="16"
            fill="#F28BA8"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
        <circle cx="32" cy="32" r="2.5" fill="#E8A850" />
      </g>
      <g transform="translate(28 72) scale(0.48)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={`c-${deg}`}
            cx="32"
            cy="15"
            rx="10"
            ry="16"
            fill="#F7B4C6"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
        <circle cx="32" cy="32" r="2.5" fill="#E8A850" />
      </g>
      <g transform="translate(70 88) scale(0.38)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={`d-${deg}`}
            cx="32"
            cy="15"
            rx="10"
            ry="16"
            fill="#E8799A"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7" fill="#FFF6E8" />
        <circle cx="32" cy="32" r="2.5" fill="#E8A850" />
      </g>
    </svg>
  );
}

function PetalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.92"
      />
    </svg>
  );
}

/**
 * connection.quiz-introduction — living Founder Scene 5.
 * Emotional density + mobile-safe motion (CSS petals, capped FM loops).
 */
export function ConnectionQuizIntroductionScene({
  onComplete,
}: ConnectionSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] bg-[#F9D6DE]">
      {/* Soft CSS keyframes — one stylesheet, GPU-friendly transforms */}
      <style>{`
        @keyframes qi-petal-fall {
          0% { transform: translate3d(0, -8%, 0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.9; }
          88% { opacity: 0.85; }
          100% { transform: translate3d(var(--qi-drift), 112vh, 0) rotate(55deg); opacity: 0; }
        }
        @keyframes qi-glow-breathe {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(0.96); }
          50% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.06); }
        }
        @keyframes qi-gift-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -10px, 0); }
        }
        @keyframes qi-sparkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.25); }
        }
        @media (prefers-reduced-motion: reduce) {
          .qi-anim-fall, .qi-anim-glow, .qi-anim-float, .qi-anim-sparkle {
            animation: none !important;
          }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 100% 75% at 50% 36%, #FFF8F9 0%, #FCE0E8 42%, #F5C4D0 78%, #EFB0C0 100%)",
        }}
      />

      {/* Warm emotional bloom behind gift */}
      <div
        aria-hidden
        className="qi-anim-glow pointer-events-none absolute top-[42%] left-1/2 h-[58vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.95) 0%, rgba(255,200,220,0.55) 38%, transparent 70%)",
          animation: ambient
            ? "qi-glow-breathe 3.2s ease-in-out infinite"
            : undefined,
          willChange: ambient ? "transform, opacity" : undefined,
        }}
      />

      {/* Soft vignette — fills empty edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 45%, transparent 40%, rgba(200,90,120,0.12) 100%)",
        }}
      />

      {/* Torn paper — more present */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-36 w-40 sm:h-44 sm:w-48"
        style={{
          background:
            "linear-gradient(225deg, rgba(245,190,205,0.95) 0%, rgba(252,220,228,0.5) 45%, transparent 75%)",
          clipPath:
            "polygon(18% 0, 100% 0, 100% 100%, 88% 72%, 100% 48%, 72% 28%, 95% 12%, 55% 0)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-24 w-20 opacity-70 sm:h-28 sm:w-24"
        style={{
          background:
            "linear-gradient(135deg, rgba(245,190,205,0.85) 0%, transparent 70%)",
          clipPath: "polygon(0 0, 100% 0, 70% 40%, 100% 70%, 0 55%)",
        }}
      />

      {/* Corner sakura clusters — large anchors */}
      <SakuraCluster className="pointer-events-none absolute -bottom-6 -left-8 h-44 w-44 drop-shadow-md sm:-bottom-2 sm:-left-2 sm:h-56 sm:w-56" />
      <SakuraCluster className="pointer-events-none absolute top-[34%] -right-10 h-36 w-36 rotate-12 opacity-95 sm:-right-4 sm:h-44 sm:w-44" />
      <SakuraBloom className="pointer-events-none absolute bottom-24 left-[38%] h-14 w-14 opacity-80 sm:bottom-28 sm:h-16 sm:w-16" />
      <SakuraBloom className="pointer-events-none absolute top-[22%] left-[12%] h-10 w-10 opacity-70 sm:h-12 sm:w-12" />

      {/* Static drift petals — atmosphere without JS animation */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {DRIFT_PETALS.map((p, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size * 1.35,
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <PetalMark className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* CSS falling petals — 4 only */}
      {ambient ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALL_PETALS.map((petal, i) => (
            <div
              key={i}
              className="qi-anim-fall absolute"
              style={
                {
                  left: petal.left,
                  top: 0,
                  width: petal.size,
                  height: petal.size * 1.35,
                  ["--qi-drift"]: petal.drift,
                  animation: `qi-petal-fall ${petal.duration} linear ${petal.delay} infinite`,
                  willChange: "transform, opacity",
                } as CSSProperties
              }
            >
              <PetalMark className="h-full w-full" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Soft sparkles near gift — CSS, few nodes */}
      {ambient ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            { top: "40%", left: "26%", size: 5, delay: "0s" },
            { top: "36%", left: "70%", size: 4, delay: "0.6s" },
            { top: "50%", left: "30%", size: 6, delay: "1.1s" },
            { top: "46%", left: "72%", size: 4, delay: "0.3s" },
          ].map((s, i) => (
            <span
              key={i}
              className="qi-anim-sparkle absolute rounded-full bg-white"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 8px rgba(255,255,255,0.9)",
                animation: `qi-sparkle 2.4s ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
          {[
            { top: "42%", left: "22%" },
            { top: "48%", left: "76%" },
          ].map((h, i) => (
            <span
              key={`h-${i}`}
              className="qi-anim-sparkle absolute text-base text-[#E8799A] sm:text-lg"
              style={{
                top: h.top,
                left: h.left,
                animation: `qi-sparkle 2.8s ease-in-out ${i * 0.4}s infinite`,
              }}
            >
              ♥
            </span>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center px-5 pt-12 pb-8 sm:px-10 sm:pt-14 sm:pb-10">
        <div className="flex w-full max-w-lg flex-1 flex-col items-center justify-between gap-3">
          <div className="flex w-full flex-col items-center">
            <motion.h1
              className="text-center font-serif text-[2.05rem] leading-[1.15] font-semibold tracking-tight text-[#7A2436] sm:text-[2.75rem]"
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.base,
                ease: MOTION_EASE.out,
              }}
            >
              How well do you know me?
            </motion.h1>

            <motion.div
              className="mt-5 flex items-center justify-center gap-3.5 text-[#E07090]"
              initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.base,
                delay: reduceMotion ? 0 : 0.1,
                ease: MOTION_EASE.out,
              }}
            >
              <span
                className="h-px w-14 bg-current opacity-75 sm:w-20"
                aria-hidden
              />
              <span className="text-xl sm:text-2xl" aria-hidden>
                ♥
              </span>
              <span
                className="h-px w-14 bg-current opacity-75 sm:w-20"
                aria-hidden
              />
            </motion.div>
          </div>

          <motion.div
            className="relative my-1 flex shrink-0 items-center justify-center"
            initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: reduceMotion
                ? MOTION_DURATION.instant
                : MOTION_DURATION.ceremony,
              delay: reduceMotion ? 0 : 0.12,
              ease: MOTION_EASE.out,
            }}
          >
            <div
              className="qi-anim-float"
              style={{
                animation: ambient
                  ? "qi-gift-float 3.4s ease-in-out 0.85s infinite"
                  : undefined,
                willChange: ambient ? "transform" : undefined,
              }}
            >
              <BloomGiftBox
                variant="closed"
                className="relative h-44 w-44 drop-shadow-[0_18px_28px_rgba(180,70,100,0.28)] sm:h-56 sm:w-56"
              />
            </div>
          </motion.div>

          <div className="flex w-full flex-col items-center">
            <motion.p
              className="max-w-[18rem] text-center font-serif text-[1.05rem] leading-relaxed text-[#8F5E6C] sm:max-w-sm sm:text-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.base,
                delay: reduceMotion ? 0 : 0.2,
                ease: MOTION_EASE.out,
              }}
            >
              Answer every question to{" "}
              <span className="font-semibold text-[#7A2436]">
                unlock your gift.
              </span>
            </motion.p>

            <motion.button
              type="button"
              onClick={onComplete}
              className="mt-7 flex w-full max-w-sm items-center justify-center gap-2.5 rounded-full px-6 py-[1.05rem] font-serif text-lg font-semibold text-white shadow-[0_16px_36px_-10px_rgba(160,50,80,0.55)] focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:ring-offset-2 focus-visible:outline-none sm:mt-9 sm:py-5 sm:text-xl"
              style={{
                background:
                  "linear-gradient(180deg, #ED8AA8 0%, #D46888 48%, #C0456E 100%)",
              }}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: reduceMotion
                  ? MOTION_DURATION.instant
                  : MOTION_DURATION.base,
                delay: reduceMotion ? 0 : 0.28,
                ease: MOTION_EASE.out,
              }}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              aria-label="Start quiz"
            >
              Start
              <span aria-hidden className="text-xl leading-none">
                →
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
