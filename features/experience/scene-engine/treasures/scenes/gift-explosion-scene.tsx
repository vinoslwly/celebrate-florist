"use client";

import { useId, useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";
import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_POP = [0.22, 1.4, 0.36, 1] as const;

/** Theme Lab default burst count (architecture N = 2–6; six = max cap). */
export const TREASURES_LAB_EXPLOSION_GIFT_COUNT = 6;

/**
 * Settled fountain — depth like Founder reference:
 * FAR = tiny near the gift mouth · MID = medium arc · NEAR = large toward camera.
 */
const BURST_PATHS = [
  // NEAR (closest to camera) — largest, higher in the frame
  { x: -62, y: -162, rotate: -14, delay: 0.02, scale: 1.22, size: 138, z: 28 },
  { x: 78, y: -172, rotate: 13, delay: 0.04, scale: 1.28, size: 146, z: 30 },
  // MID — arc between near and far
  { x: -122, y: -92, rotate: -20, delay: 0.08, scale: 0.86, size: 94, z: 20 },
  { x: 128, y: -84, rotate: 22, delay: 0.1, scale: 0.84, size: 90, z: 20 },
  // FAR — tiny, just leaving the glowing mouth
  { x: -14, y: -32, rotate: -8, delay: 0.16, scale: 0.46, size: 52, z: 14 },
  { x: 28, y: -38, rotate: 10, delay: 0.18, scale: 0.42, size: 48, z: 13 },
] as const;

const SPARKLES = [
  { top: "10%", left: "14%", delay: 0, size: "text-base" },
  { top: "8%", left: "50%", delay: 0.2, size: "text-lg" },
  { top: "14%", left: "78%", delay: 0.4, size: "text-base" },
  { top: "24%", left: "20%", delay: 0.15, size: "text-sm" },
  { top: "20%", left: "64%", delay: 0.5, size: "text-base" },
  { top: "30%", left: "40%", delay: 0.3, size: "text-lg" },
  { top: "34%", left: "84%", delay: 0.65, size: "text-sm" },
  { top: "16%", left: "32%", delay: 0.8, size: "text-base" },
  { top: "42%", left: "12%", delay: 0.45, size: "text-sm" },
  { top: "38%", left: "72%", delay: 0.25, size: "text-base" },
] as const;

const FALLING_PETALS = [
  { left: "5%", delay: 0.2, duration: 6.2, size: 18, x: 20 },
  { left: "16%", delay: 0.8, duration: 7, size: 16, x: -12 },
  { left: "40%", delay: 0.35, duration: 6.5, size: 20, x: 14 },
  { left: "66%", delay: 1.1, duration: 7.2, size: 17, x: -18 },
  { left: "80%", delay: 0.5, duration: 6.6, size: 19, x: -10 },
  { left: "92%", delay: 1.4, duration: 7.5, size: 15, x: -16 },
] as const;

const HEART_BURST = [
  { x: -100, y: -130, delay: 0 },
  { x: 50, y: -170, delay: 0.04 },
  { x: 120, y: -110, delay: 0.08 },
  { x: -50, y: -80, delay: 0.1 },
  { x: 90, y: -50, delay: 0.12 },
  { x: -130, y: -60, delay: 0.06 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.95"
      />
    </svg>
  );
}

function MiniGiftMark({ className }: { className?: string }) {
  const raw = useId().replace(/:/g, "");
  const body = `mg-body-${raw}`;
  const lid = `mg-lid-${raw}`;
  const ribbon = `mg-ribbon-${raw}`;

  return (
    <svg viewBox="0 0 72 78" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F9C4D4" />
          <stop offset="100%" stopColor="#E890A8" />
        </linearGradient>
        <linearGradient id={lid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBD0DC" />
          <stop offset="100%" stopColor="#F2A8BE" />
        </linearGradient>
        <linearGradient id={ribbon} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7B8CC" />
          <stop offset="100%" stopColor="#D46888" />
        </linearGradient>
      </defs>
      <ellipse cx="36" cy="72" rx="22" ry="4" fill="#C45B7A" opacity="0.22" />
      <rect
        x="10"
        y="28"
        width="52"
        height="40"
        rx="5"
        fill={`url(#${body})`}
      />
      <rect x="28" y="28" width="16" height="40" fill={`url(#${ribbon})`} />
      <rect x="10" y="44" width="52" height="10" fill={`url(#${ribbon})`} />
      <rect x="8" y="14" width="56" height="18" rx="4" fill={`url(#${lid})`} />
      <rect x="28" y="14" width="16" height="18" fill={`url(#${ribbon})`} />
      <ellipse
        cx="22"
        cy="12"
        rx="11"
        ry="6"
        fill={`url(#${ribbon})`}
        transform="rotate(-14 22 12)"
      />
      <ellipse
        cx="50"
        cy="12"
        rx="11"
        ry="6"
        fill={`url(#${ribbon})`}
        transform="rotate(14 50 12)"
      />
      <ellipse cx="36" cy="12" rx="7" ry="6" fill="#E8799A" />
      <g transform="translate(29 3)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="7"
            cy="3"
            rx="2.4"
            ry="4.2"
            fill="#F7A8BE"
            transform={`rotate(${deg} 7 7)`}
          />
        ))}
        <circle cx="7" cy="7" r="1.8" fill="#FFF4E8" />
      </g>
    </svg>
  );
}

type TreasuresGiftExplosionSceneProps = TreasuresSceneProps & {
  giftCount?: number;
};

/**
 * Architecture Scenes 4+5 as one Theme Lab beat (~3.6s).
 * Hero-scale gift fills the frame; POP floods the upper half with mini gifts.
 */
export function TreasuresGiftExplosionScene({
  giftCount = TREASURES_LAB_EXPLOSION_GIFT_COUNT,
}: TreasuresGiftExplosionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = Math.min(6, Math.max(2, Math.floor(giftCount)));
  const paths = useMemo(() => BURST_PATHS.slice(0, count), [count]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] bg-[#EFA8BC]">
      <style>{`
        @keyframes ge-glow {
          0%, 100% { opacity: 0.75; transform: translate(-50%, -50%) scale(0.94); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.14); }
        }
        @keyframes ge-sparkle {
          0%, 100% { opacity: 0.25; transform: scale(0.8) rotate(0deg); }
          50% { opacity: 1; transform: scale(1.4) rotate(14deg); }
        }
        @keyframes ge-ray {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.75; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ge-glow, .ge-sparkle, .ge-ray { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 95% 75% at 18% -8%, rgba(255,255,255,0.9) 0%, transparent 50%), radial-gradient(ellipse 150% 120% at 50% 58%, #FFEAF2 0%, #F8C8D8 40%, #EFA0B8 75%, #E088A4 100%)",
        }}
      />

      <div
        aria-hidden
        className="ge-ray pointer-events-none absolute inset-0"
        style={{
          background:
            "conic-gradient(from 205deg at 10% -4%, transparent 0deg, rgba(255,255,255,0.55) 12deg, transparent 26deg, rgba(255,248,230,0.4) 40deg, transparent 56deg, rgba(255,255,255,0.28) 70deg, transparent 88deg)",
          animation: reduceMotion
            ? undefined
            : "ge-ray 2.2s ease-in-out infinite",
        }}
      />

      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6] bg-[#FFF8F0]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.85, 0] }}
          transition={{
            duration: 1.9,
            times: [0, 0.5, 0.56, 0.76],
            ease: "easeOut",
          }}
        />
      ) : null}

      {!reduceMotion
        ? FALLING_PETALS.map((petal, i) => (
            <motion.div
              key={i}
              aria-hidden
              className="pointer-events-none absolute z-[1]"
              style={{
                left: petal.left,
                top: "-10%",
                width: petal.size,
                height: petal.size * 1.35,
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: ["0vh", "115vh"],
                x: [0, petal.x, petal.x * -0.35],
                rotate: [0, 55, -20, 45],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay + 0.7,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))
        : null}

      {!reduceMotion
        ? SPARKLES.map((s, i) => (
            <span
              key={i}
              aria-hidden
              className={`ge-sparkle pointer-events-none absolute z-[2] text-[#FFF8E0] ${s.size}`}
              style={{
                top: s.top,
                left: s.left,
                animation: `ge-sparkle 1.4s ease-in-out ${s.delay}s infinite`,
              }}
            >
              ✦
            </span>
          ))
        : null}

      {/* Full-viewport stage — no nested clip so fountain stays visible */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1, 1.06, 1.02], y: [0, 0, -10, -4] }
        }
        transition={{
          duration: 2.2,
          times: [0, 0.48, 0.6, 1],
          ease: EASE_OUT,
        }}
      >
        <motion.p
          className="absolute top-[5%] right-0 left-0 z-30 px-4 text-center font-serif text-lg tracking-wide text-[#7A3048] sm:top-[6%] sm:text-xl"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: [0, 1, 1, 0], y: [12, 0, 0, -8] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 1.3, times: [0, 0.16, 0.58, 1], ease: EASE_OUT }
          }
        >
          Preparing your surprises…
        </motion.p>

        {/* Glow anchored to gift mouth */}
        <motion.div
          aria-hidden
          className="ge-glow pointer-events-none absolute top-[62%] left-1/2 z-0 h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[32rem] sm:w-[32rem]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,252,240,1) 0%, rgba(255,220,170,0.9) 20%, rgba(247,168,190,0.5) 45%, transparent 68%)",
            animation: reduceMotion
              ? undefined
              : "ge-glow 1.25s ease-in-out 1s infinite",
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.7, duration: 0.8 }}
        />

        {/* Shockwaves */}
        {!reduceMotion
          ? [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                aria-hidden
                className="pointer-events-none absolute top-[62%] left-1/2 z-[12] rounded-full border-2 border-[#FFF8E8]/90"
                style={{
                  width: 100,
                  height: 100,
                  marginLeft: -50,
                  marginTop: -50,
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 0.85, 0],
                  scale: [0.3, 2.8 + i * 0.7, 3.8 + i],
                }}
                transition={{
                  delay: 1.48 + i * 0.07,
                  duration: 0.95,
                  ease: EASE_OUT,
                }}
              />
            ))
          : null}

        {/* Hearts */}
        {!reduceMotion
          ? HEART_BURST.map((h, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="pointer-events-none absolute top-[62%] left-1/2 z-[18] text-2xl text-[#E8799A] sm:text-3xl"
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: h.x,
                  y: h.y,
                  scale: [0.3, 1.35, 0.95],
                }}
                transition={{
                  delay: 1.52 + h.delay,
                  duration: 1.15,
                  ease: EASE_OUT,
                }}
              >
                ♥
              </motion.span>
            ))
          : null}

        {/* Mini gifts — bouquet origin just above the open gift mouth */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-[62%] left-1/2 z-20"
        >
          {paths.map((path, i) => (
            <motion.div
              key={i}
              className="absolute drop-shadow-[0_18px_32px_rgba(120,30,60,0.45)]"
              style={{
                width: path.size,
                height: path.size * 1.08,
                marginLeft: -path.size / 2,
                marginTop: -(path.size * 1.08) / 2,
                zIndex: path.z,
                // Far boxes read as deeper / softer (Founder near-far depth)
                filter: path.z < 16 ? "blur(0.6px)" : undefined,
                opacity: path.z < 16 ? 0.92 : 1,
              }}
              initial={
                reduceMotion
                  ? {
                      opacity: 1,
                      x: path.x,
                      y: path.y,
                      rotate: path.rotate,
                      scale: path.scale,
                    }
                  : { opacity: 0, x: 0, y: 28, scale: 0.06, rotate: 0 }
              }
              animate={{
                opacity: 1,
                x: path.x,
                y: path.y,
                scale: path.scale,
                rotate: path.rotate,
              }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay: 1.5 + path.delay,
                      duration: 1.05,
                      ease: EASE_POP,
                    }
              }
            >
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [0, -8, 0],
                        rotate: [
                          path.rotate,
                          path.rotate + 3,
                          path.rotate - 2,
                          path.rotate,
                        ],
                      }
                }
                transition={{
                  delay: 2.55 + path.delay,
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <MiniGiftMark className="h-full w-full" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Hero gift — large, anchored lower-center like the reference */}
        <motion.div
          className="absolute bottom-[6%] left-1/2 z-10 w-[min(92vw,30rem)] -translate-x-1/2 sm:bottom-[5%] sm:w-[min(88vw,34rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.78 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <div className="relative mx-auto aspect-[220/240] w-full">
            {reduceMotion ? (
              <div className="absolute inset-x-0 bottom-[4%] w-full">
                <BloomGiftBox
                  variant="open"
                  className="mx-auto aspect-[280/160] w-full"
                />
              </div>
            ) : (
              <>
                <motion.div
                  className="absolute inset-0"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0, scale: 1.05 }}
                  transition={{ delay: 0.98, duration: 0.3, ease: EASE_OUT }}
                >
                  <BloomGiftBox variant="closed" className="h-full w-full" />
                </motion.div>
                <motion.div
                  className="absolute inset-x-0 bottom-[4%]"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.92, duration: 0.28 }}
                >
                  <BloomGiftBox
                    variant="open"
                    animateLid
                    className="aspect-[280/160] w-full"
                  />
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
