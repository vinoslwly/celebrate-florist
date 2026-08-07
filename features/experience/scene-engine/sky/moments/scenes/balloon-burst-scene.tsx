"use client";

import { useEffect } from "react";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import {
  allowAmbientLoop,
  MOTION_DURATION,
  MOTION_EASE,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

const SKY_BASE = "#C5DCEF";
const EASE_POP = [0.18, 1.15, 0.32, 1] as const;

/** Auto-advance after fountain settles. */
export const SKY_BALLOON_BURST_DURATION_MS = 5000;

type BalloonPattern = "solid" | "stars" | "stripes";

type BalloonSpec = {
  x: number;
  y: number;
  rotate: number;
  delay: number;
  scale: number;
  size: number;
  z: number;
  pattern: BalloonPattern;
  /** Soft CSS float after burst — only a few, keeps mobile smooth */
  float?: boolean;
};

/**
 * Dense fountain from gift mouth — many large balloons to cover the screen.
 * Performance: one-shot Framer burst; CSS float on a small subset only;
 * lightweight SVG (no per-instance gradient ids).
 */
const BALLOONS: readonly BalloonSpec[] = [
  // —— High plume (largest, covers top of screen) ——
  {
    x: -20,
    y: -500,
    rotate: -5,
    delay: 0.02,
    scale: 1.18,
    size: 220,
    z: 46,
    pattern: "solid",
    float: true,
  },
  {
    x: 48,
    y: -520,
    rotate: 7,
    delay: 0.04,
    scale: 1.24,
    size: 240,
    z: 48,
    pattern: "stars",
    float: true,
  },
  {
    x: -90,
    y: -470,
    rotate: -12,
    delay: 0.06,
    scale: 1.12,
    size: 205,
    z: 44,
    pattern: "stripes",
  },
  {
    x: 120,
    y: -485,
    rotate: 14,
    delay: 0.07,
    scale: 1.14,
    size: 210,
    z: 45,
    pattern: "solid",
  },
  {
    x: 10,
    y: -430,
    rotate: 2,
    delay: 0.09,
    scale: 1.05,
    size: 190,
    z: 42,
    pattern: "stars",
    float: true,
  },
  {
    x: -160,
    y: -430,
    rotate: -18,
    delay: 0.05,
    scale: 1.08,
    size: 195,
    z: 43,
    pattern: "stars",
  },
  {
    x: 175,
    y: -440,
    rotate: 20,
    delay: 0.08,
    scale: 1.1,
    size: 200,
    z: 43,
    pattern: "stripes",
    float: true,
  },
  // —— Upper mid fill ——
  {
    x: -55,
    y: -360,
    rotate: -8,
    delay: 0.1,
    scale: 1.0,
    size: 175,
    z: 38,
    pattern: "solid",
  },
  {
    x: 70,
    y: -350,
    rotate: 9,
    delay: 0.11,
    scale: 0.98,
    size: 170,
    z: 37,
    pattern: "stars",
  },
  {
    x: -200,
    y: -350,
    rotate: -22,
    delay: 0.12,
    scale: 1.0,
    size: 175,
    z: 36,
    pattern: "stripes",
  },
  {
    x: 215,
    y: -340,
    rotate: 24,
    delay: 0.13,
    scale: 0.98,
    size: 170,
    z: 36,
    pattern: "solid",
    float: true,
  },
  {
    x: -130,
    y: -300,
    rotate: -14,
    delay: 0.14,
    scale: 0.95,
    size: 160,
    z: 34,
    pattern: "solid",
  },
  {
    x: 145,
    y: -290,
    rotate: 16,
    delay: 0.15,
    scale: 0.94,
    size: 158,
    z: 34,
    pattern: "stars",
  },
  {
    x: -5,
    y: -290,
    rotate: -2,
    delay: 0.12,
    scale: 0.96,
    size: 165,
    z: 35,
    pattern: "stripes",
  },
  {
    x: -260,
    y: -280,
    rotate: -28,
    delay: 0.16,
    scale: 0.9,
    size: 150,
    z: 32,
    pattern: "stars",
  },
  {
    x: 275,
    y: -270,
    rotate: 30,
    delay: 0.17,
    scale: 0.88,
    size: 148,
    z: 31,
    pattern: "solid",
  },
  // —— Mid fan / side coverage ——
  {
    x: -95,
    y: -230,
    rotate: -10,
    delay: 0.18,
    scale: 0.9,
    size: 150,
    z: 30,
    pattern: "solid",
    float: true,
  },
  {
    x: 105,
    y: -220,
    rotate: 11,
    delay: 0.19,
    scale: 0.88,
    size: 145,
    z: 29,
    pattern: "stripes",
  },
  {
    x: -185,
    y: -210,
    rotate: -20,
    delay: 0.2,
    scale: 0.85,
    size: 140,
    z: 28,
    pattern: "stars",
  },
  {
    x: 200,
    y: -200,
    rotate: 22,
    delay: 0.21,
    scale: 0.84,
    size: 138,
    z: 28,
    pattern: "solid",
  },
  {
    x: -320,
    y: -250,
    rotate: -34,
    delay: 0.18,
    scale: 0.82,
    size: 135,
    z: 27,
    pattern: "stripes",
  },
  {
    x: 335,
    y: -235,
    rotate: 36,
    delay: 0.2,
    scale: 0.8,
    size: 132,
    z: 26,
    pattern: "stars",
  },
  {
    x: -40,
    y: -185,
    rotate: 4,
    delay: 0.22,
    scale: 0.82,
    size: 135,
    z: 27,
    pattern: "stars",
  },
  {
    x: 45,
    y: -175,
    rotate: -5,
    delay: 0.23,
    scale: 0.8,
    size: 130,
    z: 26,
    pattern: "solid",
  },
  // —— Lower depth (leaving the mouth) ——
  {
    x: -110,
    y: -130,
    rotate: -12,
    delay: 0.24,
    scale: 0.7,
    size: 115,
    z: 22,
    pattern: "stripes",
  },
  {
    x: 125,
    y: -120,
    rotate: 14,
    delay: 0.25,
    scale: 0.68,
    size: 112,
    z: 21,
    pattern: "solid",
  },
  {
    x: -15,
    y: -110,
    rotate: 2,
    delay: 0.23,
    scale: 0.66,
    size: 108,
    z: 20,
    pattern: "stars",
  },
  {
    x: -230,
    y: -145,
    rotate: -24,
    delay: 0.26,
    scale: 0.72,
    size: 118,
    z: 23,
    pattern: "solid",
  },
  {
    x: 245,
    y: -135,
    rotate: 26,
    delay: 0.27,
    scale: 0.7,
    size: 115,
    z: 22,
    pattern: "stars",
  },
  {
    x: -170,
    y: -85,
    rotate: -18,
    delay: 0.28,
    scale: 0.58,
    size: 95,
    z: 18,
    pattern: "stripes",
  },
  {
    x: 185,
    y: -78,
    rotate: 20,
    delay: 0.29,
    scale: 0.56,
    size: 92,
    z: 17,
    pattern: "solid",
  },
  {
    x: 25,
    y: -70,
    rotate: -3,
    delay: 0.27,
    scale: 0.55,
    size: 90,
    z: 16,
    pattern: "stars",
  },
  // —— Extra screen-edge fillers ——
  {
    x: -300,
    y: -380,
    rotate: -30,
    delay: 0.1,
    scale: 0.95,
    size: 165,
    z: 33,
    pattern: "solid",
  },
  {
    x: 310,
    y: -370,
    rotate: 32,
    delay: 0.11,
    scale: 0.94,
    size: 162,
    z: 33,
    pattern: "stars",
  },
  {
    x: -350,
    y: -180,
    rotate: -36,
    delay: 0.21,
    scale: 0.75,
    size: 125,
    z: 24,
    pattern: "solid",
  },
  {
    x: 360,
    y: -170,
    rotate: 38,
    delay: 0.22,
    scale: 0.74,
    size: 122,
    z: 24,
    pattern: "stripes",
  },
  {
    x: -75,
    y: -400,
    rotate: -7,
    delay: 0.08,
    scale: 0.92,
    size: 155,
    z: 40,
    pattern: "solid",
  },
  {
    x: 95,
    y: -395,
    rotate: 8,
    delay: 0.09,
    scale: 0.9,
    size: 152,
    z: 39,
    pattern: "stripes",
    float: true,
  },
  // —— Mid-screen cover layer (closes empty sky gaps) ——
  {
    x: -140,
    y: -255,
    rotate: -11,
    delay: 0.14,
    scale: 1.05,
    size: 185,
    z: 35,
    pattern: "stars",
  },
  {
    x: 155,
    y: -245,
    rotate: 13,
    delay: 0.15,
    scale: 1.02,
    size: 180,
    z: 35,
    pattern: "solid",
  },
  {
    x: -30,
    y: -250,
    rotate: -3,
    delay: 0.13,
    scale: 1.08,
    size: 195,
    z: 36,
    pattern: "stripes",
    float: true,
  },
  {
    x: 35,
    y: -315,
    rotate: 5,
    delay: 0.12,
    scale: 1.06,
    size: 188,
    z: 37,
    pattern: "stars",
  },
  {
    x: -220,
    y: -255,
    rotate: -19,
    delay: 0.16,
    scale: 0.98,
    size: 168,
    z: 33,
    pattern: "solid",
  },
  {
    x: 235,
    y: -245,
    rotate: 21,
    delay: 0.17,
    scale: 0.96,
    size: 165,
    z: 33,
    pattern: "stripes",
  },
  {
    x: -280,
    y: -320,
    rotate: -26,
    delay: 0.13,
    scale: 0.92,
    size: 158,
    z: 34,
    pattern: "stars",
  },
  {
    x: 290,
    y: -310,
    rotate: 28,
    delay: 0.14,
    scale: 0.9,
    size: 155,
    z: 34,
    pattern: "solid",
  },
  {
    x: -60,
    y: -165,
    rotate: 6,
    delay: 0.2,
    scale: 0.95,
    size: 160,
    z: 29,
    pattern: "stars",
  },
  {
    x: 80,
    y: -155,
    rotate: -6,
    delay: 0.21,
    scale: 0.93,
    size: 155,
    z: 29,
    pattern: "solid",
  },
  {
    x: -155,
    y: -170,
    rotate: -15,
    delay: 0.22,
    scale: 0.88,
    size: 145,
    z: 28,
    pattern: "stripes",
  },
  {
    x: 170,
    y: -160,
    rotate: 17,
    delay: 0.23,
    scale: 0.86,
    size: 142,
    z: 28,
    pattern: "stars",
  },
];

const CONFETTI = [
  { x: -40, y: -220, delay: 0.05, rot: 40 },
  { x: 55, y: -260, delay: 0.12, rot: -30 },
  { x: -110, y: -180, delay: 0.08, rot: 55 },
  { x: 130, y: -200, delay: 0.18, rot: -45 },
  { x: -20, y: -300, delay: 0.15, rot: 20 },
  { x: 80, y: -150, delay: 0.22, rot: -60 },
] as const;

const TWINKLES = [
  { top: "8%", left: "20%", delay: 0.2 },
  { top: "5%", left: "50%", delay: 0.5 },
  { top: "12%", left: "78%", delay: 0.35 },
  { top: "26%", left: "10%", delay: 0.6 },
  { top: "20%", left: "88%", delay: 0.4 },
] as const;

const FILL: Record<BalloonPattern, string> = {
  solid: "#A8D0EA",
  stars: "#9EC8E4",
  stripes: "#B5D8EE",
};

/** Lightweight balloon — no unique gradient ids (mobile-friendly at high count). */
function SkyBalloon({
  className,
  pattern = "solid",
}: {
  className?: string;
  pattern?: BalloonPattern;
}) {
  return (
    <svg viewBox="0 0 120 150" className={className} aria-hidden fill="none">
      <path
        d="M60 112 C52 124 68 132 56 148"
        stroke="#EEF4FA"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.95"
      />
      <ellipse cx="60" cy="58" rx="46" ry="54" fill={FILL[pattern]} />
      {/* Soft sheen without gradient defs */}
      <ellipse
        cx="44"
        cy="38"
        rx="15"
        ry="22"
        fill="#FFFFFF"
        opacity="0.48"
        transform="rotate(-18 44 38)"
      />
      <ellipse cx="68" cy="72" rx="28" ry="32" fill="#6BA3C9" opacity="0.12" />
      <path d="M54 110 L60 118 L66 110 Z" fill="#7EB6D9" />

      {pattern === "stars" ? (
        <g fill="#FFFEFB" opacity="0.9">
          <path d="M42 48 l2.2 4.4 4.8.4-3.6 3.2 1.1 4.7L42 58.5 37.5 61.3l1.1-4.7-3.6-3.2 4.8-.4Z" />
          <path d="M72 34 l1.8 3.6 4 .3-3 2.7.9 3.9L72 42.6 68.3 44.9l.9-3.9-3-2.7 4-.3Z" />
          <path d="M78 72 l1.6 3.2 3.5.3-2.6 2.3.8 3.4L78 79.5 74.7 81.5l.8-3.4-2.6-2.3 3.5-.3Z" />
          <path d="M38 78 l1.4 2.8 3.1.25-2.3 2 .7 3L38 84.5 34.9 86.2l.7-3-2.3-2 3.1-.25Z" />
        </g>
      ) : null}

      {pattern === "stripes" ? (
        <g
          stroke="#FFFEFB"
          strokeWidth="5"
          opacity="0.55"
          strokeLinecap="round"
        >
          <path d="M28 40 Q60 28 92 40" />
          <path d="M24 58 Q60 48 96 58" />
          <path d="M28 76 Q60 68 92 76" />
        </g>
      ) : null}
    </svg>
  );
}

/**
 * sky.moments.balloon-burst — Founder Scene 5.
 * Dense balloon fountain from gift mouth; optimized for mobile smoothness.
 */
export function SkyBalloonBurstScene({ onComplete }: SkyMomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const ambient = allowAmbientLoop(reduceMotion);

  useEffect(() => {
    const ms = reduceMotion ? 1600 : SKY_BALLOON_BURST_DURATION_MS;
    const t = window.setTimeout(() => onComplete(), ms);
    return () => window.clearTimeout(t);
  }, [onComplete, reduceMotion]);

  return (
    <div
      className={cn(SCENE_VIEWPORT_LOCK, "isolate")}
      style={{
        backgroundColor: SKY_BASE,
        backgroundImage:
          "linear-gradient(180deg, #F4FAFE 0%, #D6EAF8 45%, #B8D4EA 100%)",
      }}
    >
      <style>{`
        @keyframes sky-b-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -11px, 0); }
        }
        .sky-b-float {
          animation: sky-b-float 3.4s ease-in-out infinite;
          will-change: transform;
        }
        @media (prefers-reduced-motion: reduce) {
          .sky-b-float { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 75% 60% at 50% 35%, rgba(255,255,255,0.45) 0%, transparent 70%)",
        }}
      />

      {/* Soft cloud bed */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[34%]"
        style={{
          background:
            "radial-gradient(ellipse 90% 75% at 50% 100%, rgba(255,255,255,0.98) 0%, rgba(247,251,254,0.75) 45%, transparent 75%)",
        }}
      />

      {/* Few twinkles */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[8]">
        {TWINKLES.map((s, i) => (
          <motion.span
            key={i}
            className="absolute h-1.5 w-1.5 rotate-45 bg-white"
            style={{
              top: s.top,
              left: s.left,
              boxShadow: "0 0 12px rgba(255,255,255,0.95)",
            }}
            animate={
              ambient
                ? { opacity: [0.25, 1, 0.25], scale: [0.7, 1.25, 0.7] }
                : { opacity: 0.65, scale: 1 }
            }
            transition={
              ambient
                ? {
                    delay: 1.4 + s.delay,
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: MOTION_DURATION.instant }
            }
          />
        ))}
      </div>

      {/* Gift mouth glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-[14%] left-1/2 z-[6] h-[min(78vw,24rem)] w-[min(78vw,24rem)] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,248,235,0.7) 22%, rgba(184,212,234,0.4) 48%, transparent 70%)",
        }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.35 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: reduceMotion ? 0 : 0.5,
          duration: reduceMotion
            ? MOTION_DURATION.instant
            : MOTION_DURATION.ceremony,
          ease: MOTION_EASE.out,
        }}
      />

      {ambient ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-[14%] left-1/2 z-[12] rounded-full border border-white/80"
          style={{ width: 72, height: 72, marginLeft: -36, marginBottom: -36 }}
          initial={{ opacity: 0, scale: 0.2 }}
          animate={{ opacity: [0, 0.65, 0], scale: [0.2, 3.6, 4.4] }}
          transition={{
            delay: 1.05,
            duration: 1.05,
            ease: MOTION_EASE.out,
          }}
        />
      ) : null}

      {ambient ? (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[14%] left-1/2 z-[15]"
        >
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              className="absolute h-2 w-1.5 rounded-[1px] bg-[#7EB6D9]/85"
              style={{ marginLeft: -3, marginTop: -4 }}
              initial={{ opacity: 0, x: 0, y: 0, rotate: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: c.x,
                y: c.y,
                rotate: c.rot,
              }}
              transition={{
                delay: 1.12 + c.delay,
                duration: 1.7,
                ease: MOTION_EASE.out,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Dense balloon fountain — GPU transform only */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[14%] left-1/2 z-20"
      >
        {BALLOONS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              width: b.size,
              height: b.size * 1.25,
              marginLeft: -b.size / 2,
              marginTop: -(b.size * 1.25) / 2,
              zIndex: b.z,
            }}
            initial={
              reduceMotion
                ? {
                    opacity: 1,
                    x: b.x,
                    y: b.y,
                    scale: b.scale,
                    rotate: b.rotate,
                  }
                : { opacity: 0, x: 0, y: 20, scale: 0.06, rotate: 0 }
            }
            animate={{
              opacity: 1,
              x: b.x,
              y: b.y,
              scale: b.scale,
              rotate: b.rotate,
            }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 1.05 + b.delay,
                    duration: 1.15,
                    ease: EASE_POP,
                  }
            }
          >
            <div
              className={
                ambient && b.float
                  ? "sky-b-float h-full w-full"
                  : "h-full w-full"
              }
              style={
                ambient && b.float
                  ? { animationDelay: `${2.4 + b.delay}s` }
                  : undefined
              }
            >
              <SkyBalloon pattern={b.pattern} className="h-full w-full" />
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="absolute bottom-[3%] left-1/2 z-10 w-[min(58vw,13.5rem)] -translate-x-1/2 sm:bottom-[4%] sm:w-[min(48vw,15rem)]"
        initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: reduceMotion
            ? MOTION_DURATION.instant
            : MOTION_DURATION.ceremony,
          ease: MOTION_EASE.out,
        }}
      >
        <div className="relative mx-auto aspect-[280/160] w-full">
          {reduceMotion ? (
            <SkyGiftBox variant="open" className="h-full w-full" reduceMotion />
          ) : (
            <>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0, scale: 1.04 }}
                transition={{
                  delay: 0.75,
                  duration: MOTION_DURATION.fast,
                  ease: MOTION_EASE.out,
                }}
              >
                <SkyGiftBox variant="closed" className="h-full w-full" />
              </motion.div>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, duration: 0.25 }}
              >
                <SkyGiftBox
                  variant="open"
                  animateLid
                  className="h-full w-full"
                />
              </motion.div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
