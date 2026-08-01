"use client";

import { useId, useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";
import type { SkyTreasuresSceneProps } from "@/features/experience/scene-engine/sky/treasures/types";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_POP = [0.22, 1.4, 0.36, 1] as const;

const INK = "#1E3A5F";
const SKY_SOFT = "#C5DCEF";
const GOLD = "#F0D878";
const RIBBON_CREAM = "#FFFEFB";
const RIBBON_SKY = "#A8D0EA";
const RIBBON_SKY_DEEP = "#7EB6D9";

/** Theme Lab default burst count (architecture N = 2–6; six = max cap). */
export const SKY_TREASURES_LAB_EXPLOSION_GIFT_COUNT = 6;

/**
 * Settled fountain — depth like Bloom / Founder Sky ref:
 * FAR = tiny near the gift mouth · MID = medium arc · NEAR = large toward camera.
 */
const BURST_PATHS = [
  { x: -62, y: -162, rotate: -14, delay: 0.02, scale: 1.22, size: 138, z: 28 },
  { x: 78, y: -172, rotate: 13, delay: 0.04, scale: 1.28, size: 146, z: 30 },
  { x: -122, y: -92, rotate: -20, delay: 0.08, scale: 0.86, size: 94, z: 20 },
  { x: 128, y: -84, rotate: 22, delay: 0.1, scale: 0.84, size: 90, z: 20 },
  { x: -14, y: -32, rotate: -8, delay: 0.16, scale: 0.46, size: 52, z: 14 },
  { x: 28, y: -38, rotate: 10, delay: 0.18, scale: 0.42, size: 48, z: 13 },
] as const;

type MiniPattern = "stripes" | "dots" | "solid" | "soft";

const MINI_PATTERNS: MiniPattern[] = [
  "soft",
  "stripes",
  "dots",
  "solid",
  "stripes",
  "soft",
];

/** Cream + sky ribbons only — no coral/warm accents (breaks Sky palette). */
const MINI_RIBBONS = [
  RIBBON_CREAM,
  RIBBON_SKY,
  RIBBON_CREAM,
  RIBBON_SKY_DEEP,
  RIBBON_CREAM,
  RIBBON_SKY,
] as const;

const SPARKLES = [
  { top: "11%", left: "18%", delay: 0, size: 10 },
  { top: "9%", left: "52%", delay: 0.15, size: 13 },
  { top: "14%", left: "78%", delay: 0.3, size: 10 },
  { top: "24%", left: "28%", delay: 0.2, size: 9 },
  { top: "20%", left: "68%", delay: 0.4, size: 11 },
] as const;

function SoftStar({
  className,
  fill = GOLD,
}: {
  className?: string;
  fill?: string;
}) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill={fill}>
      <path d="M8 0.5 9.2 6.8 15.5 8 9.2 9.2 8 15.5 6.8 9.2 0.5 8 6.8 6.8Z" />
    </svg>
  );
}

function SoftSnowflake({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none">
      <g stroke="#7EB6D9" strokeWidth="1.6" strokeLinecap="round">
        <path d="M16 4v24M4 16h24M7.5 7.5l17 17M24.5 7.5l-17 17" />
        <path d="M16 8l-2.5 2.5M16 8l2.5 2.5M16 24l-2.5-2.5M16 24l2.5-2.5" />
        <path d="M8 16l2.5-2.5M8 16l2.5 2.5M24 16l-2.5-2.5M24 16l-2.5 2.5" />
      </g>
      <circle
        cx="16"
        cy="16"
        r="2.2"
        fill="#FFFEFB"
        stroke="#A8D0EA"
        strokeWidth="1"
      />
    </svg>
  );
}

function SoftCrescent({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden fill="none">
      <path
        d="M18 4.5C12 5.5 7.5 11 8.5 17.5C9.5 23.5 15.5 27.5 21.5 26C16 25.5 12 20.5 13 14.5C13.8 9.5 16.5 6 18 4.5Z"
        fill="#F4FAFE"
        stroke="#A8C8E0"
        strokeWidth="1.2"
      />
      <circle cx="19" cy="12" r="1.1" fill={GOLD} opacity="0.85" />
    </svg>
  );
}

function SoftPaperPlane({ className }: { className?: string }) {
  const raw = useId().replace(/:/g, "");
  const wing = `stp-wing-${raw}`;
  const fold = `stp-fold-${raw}`;

  return (
    <svg viewBox="0 0 72 44" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={wing} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFEFB" />
          <stop offset="55%" stopColor="#E8F4FC" />
          <stop offset="100%" stopColor="#C5DCEF" />
        </linearGradient>
        <linearGradient id={fold} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6EAF6" />
          <stop offset="100%" stopColor="#9EC4DE" />
        </linearGradient>
      </defs>
      <ellipse cx="34" cy="38" rx="18" ry="3" fill={INK} opacity="0.1" />
      <path
        d="M6 24 L64 8 L32 36 L26 26 Z"
        fill={`url(#${wing})`}
        stroke="#A8C8E0"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M6 24 L26 26 L32 36"
        fill={`url(#${fold})`}
        stroke="#8BB4D0"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path
        d="M26 26 L44 16"
        stroke="#7EB6D9"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

/**
 * Felt / paper-craft mini gift — pattern + ribbon variety.
 * Shared paint ids per instance (useId) so multiple gifts don't collide.
 */
function SkyMiniGiftMark({
  className,
  pattern = "solid",
  ribbon = RIBBON_CREAM,
}: {
  className?: string;
  pattern?: MiniPattern;
  ribbon?: string;
}) {
  const raw = useId().replace(/:/g, "");
  const body = `smg-body-${raw}`;
  const lid = `smg-lid-${raw}`;
  const rib = `smg-rib-${raw}`;
  const pat = `smg-pat-${raw}`;

  return (
    <svg viewBox="0 0 72 84" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#B8D8F0" />
          <stop offset="55%" stopColor="#7EB6D9" />
          <stop offset="100%" stopColor="#5A9BC4" />
        </linearGradient>
        <linearGradient id={lid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D6EAF6" />
          <stop offset="100%" stopColor="#7EB6D9" />
        </linearGradient>
        <linearGradient id={rib} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ribbon} />
          <stop offset="100%" stopColor={ribbon} stopOpacity="0.92" />
        </linearGradient>
        {pattern === "stripes" ? (
          <pattern id={pat} width="8" height="8" patternUnits="userSpaceOnUse">
            <rect width="8" height="8" fill={`url(#${body})`} />
            <rect width="3.5" height="8" fill="#FFFEFB" opacity="0.4" />
          </pattern>
        ) : null}
        {pattern === "dots" ? (
          <pattern
            id={pat}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <rect width="10" height="10" fill={`url(#${body})`} />
            <circle cx="5" cy="5" r="1.6" fill="#FFFEFB" opacity="0.45" />
          </pattern>
        ) : null}
        {pattern === "soft" ? (
          <linearGradient id={pat} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C5DCEF" />
            <stop offset="50%" stopColor="#7EB6D9" />
            <stop offset="100%" stopColor="#5A9BC4" />
          </linearGradient>
        ) : null}
      </defs>
      <ellipse cx="36" cy="78" rx="20" ry="3.5" fill={INK} opacity="0.18" />
      <rect
        x="10"
        y="30"
        width="52"
        height="40"
        rx="5"
        fill={pattern === "solid" ? `url(#${body})` : `url(#${pat})`}
      />
      <rect
        x="10"
        y="30"
        width="52"
        height="8"
        rx="2"
        fill="white"
        opacity="0.14"
      />
      <rect x="28" y="30" width="16" height="40" fill={`url(#${rib})`} />
      <rect x="10" y="46" width="52" height="9" fill={`url(#${rib})`} />
      <rect x="8" y="16" width="56" height="18" rx="4" fill={`url(#${lid})`} />
      <rect
        x="8"
        y="16"
        width="56"
        height="5"
        rx="2"
        fill="white"
        opacity="0.2"
      />
      <rect x="28" y="16" width="16" height="18" fill={`url(#${rib})`} />
      <ellipse
        cx="22"
        cy="14"
        rx="11"
        ry="6"
        fill={`url(#${rib})`}
        transform="rotate(-14 22 14)"
      />
      <ellipse
        cx="50"
        cy="14"
        rx="11"
        ry="6"
        fill={`url(#${rib})`}
        transform="rotate(14 50 14)"
      />
      <ellipse cx="36" cy="14" rx="7" ry="5.5" fill={ribbon} />
      <ellipse cx="34" cy="12" rx="2.2" ry="1.4" fill="white" opacity="0.45" />
    </svg>
  );
}

type SkyTreasuresGiftExplosionSceneProps = SkyTreasuresSceneProps & {
  giftCount?: number;
};

/**
 * sky.treasures.gift-explosion — Architecture Scenes 4+5 as one beat (~3.6s).
 * Bloom structure · quiet Sky field (stars / snowflake / crescent / plane).
 * Preparing → lid open → golden POP → mini-gift fountain.
 * Mobile-light: one-shot motion · no cloud frame · no feTurbulence.
 */
export function SkyTreasuresGiftExplosionScene({
  giftCount = SKY_TREASURES_LAB_EXPLOSION_GIFT_COUNT,
}: SkyTreasuresGiftExplosionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = Math.min(6, Math.max(2, Math.floor(giftCount)));
  const paths = useMemo(() => BURST_PATHS.slice(0, count), [count]);

  return (
    <div className={SCENE_VIEWPORT_LOCK} style={{ backgroundColor: SKY_SOFT }}>
      <style>{`
        @keyframes st-ge-glow {
          0%, 100% { opacity: 0.72; transform: translate(-50%, -50%) scale(0.94); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        @keyframes st-ge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .st-ge-glow, .st-ge-float { animation: none !important; }
        }
      `}</style>

      {/* Quiet sky — gift fountain stays the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(255,255,255,0.65) 0%, transparent 55%)",
            "linear-gradient(170deg, #E4F0F9 0%, #C5DCEF 55%, #B4CFE3 100%)",
          ].join(", "),
        }}
      />

      {/* Sparse Sky accents — no cloud frame */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[10%] left-[9%] z-[3] w-9 opacity-75 sm:w-10"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ delay: 0.35, duration: 0.55, ease: EASE_OUT }}
      >
        <SoftSnowflake className="h-auto w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[11%] right-[10%] z-[3] w-8 opacity-80 sm:w-9"
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 0.8, y: 0 }}
        transition={{ delay: 0.42, duration: 0.55, ease: EASE_OUT }}
      >
        <SoftCrescent className="h-auto w-full" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[22%] left-[7%] z-[3] w-3.5 opacity-65"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.65, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.45, ease: EASE_OUT }}
      >
        <SoftStar className="h-full w-full" fill={GOLD} />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[20%] right-[8%] z-[3] w-3 opacity-60"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.6, scale: 1 }}
        transition={{ delay: 0.55, duration: 0.45, ease: EASE_OUT }}
      >
        <SoftStar className="h-full w-full" fill="#D6EAF6" />
      </motion.div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[8%] left-1/2 z-[3] w-11 -translate-x-1/2 opacity-70 sm:w-12"
        initial={reduceMotion ? false : { opacity: 0, x: -10 }}
        animate={{ opacity: 0.7, x: 0 }}
        transition={{ delay: 0.38, duration: 0.65, ease: EASE_OUT }}
      >
        <SoftPaperPlane className="h-auto w-full" />
      </motion.div>

      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            background:
              "radial-gradient(circle at 50% 58%, rgba(255,252,240,0.8) 0%, rgba(240,216,120,0.25) 30%, transparent 58%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.8, 0] }}
          transition={{
            duration: 1.9,
            times: [0, 0.5, 0.56, 0.76],
            ease: "easeOut",
          }}
        />
      ) : null}

      {!reduceMotion
        ? SPARKLES.map((s, i) => (
            <motion.span
              key={i}
              aria-hidden
              className="pointer-events-none absolute z-[5]"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
              }}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{
                opacity: [0, 1, 0.75, 0],
                scale: [0.4, 1.15, 1, 0.7],
              }}
              transition={{
                delay: 1.45 + s.delay,
                duration: 1.45,
                ease: EASE_OUT,
              }}
            >
              <SoftStar
                className="h-full w-full"
                fill={i % 2 === 0 ? GOLD : "#FFFEFB"}
              />
            </motion.span>
          ))
        : null}

      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1, 1.04, 1.015], y: [0, 0, -8, -3] }
        }
        transition={{
          duration: 2.2,
          times: [0, 0.48, 0.6, 1],
          ease: EASE_OUT,
        }}
      >
        <motion.p
          className="absolute top-[5%] right-0 left-0 z-30 px-4 text-center font-serif text-lg tracking-wide sm:top-[6%] sm:text-xl"
          style={{ color: INK }}
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

        <motion.div
          aria-hidden
          className="st-ge-glow pointer-events-none absolute top-[62%] left-1/2 z-0 h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[32rem] sm:w-[32rem]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,252,240,1) 0%, rgba(240,216,120,0.55) 22%, rgba(197,220,239,0.35) 48%, transparent 70%)",
            animation: reduceMotion
              ? undefined
              : "st-ge-glow 1.3s ease-in-out 1s 3",
          }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.7, duration: 0.8 }}
        />

        {!reduceMotion
          ? [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                aria-hidden
                className="pointer-events-none absolute top-[62%] left-1/2 z-[12] rounded-full border-2"
                style={{
                  width: 100,
                  height: 100,
                  marginLeft: -50,
                  marginTop: -50,
                  borderColor: "rgba(255,252,240,0.85)",
                }}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 0.8, 0],
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

        <div
          aria-hidden
          className="pointer-events-none absolute top-[62%] left-1/2 z-20"
        >
          {paths.map((path, i) => (
            <motion.div
              key={i}
              className="absolute drop-shadow-[0_16px_28px_rgba(30,58,95,0.35)]"
              style={{
                width: path.size,
                height: path.size * 1.12,
                marginLeft: -path.size / 2,
                marginTop: -(path.size * 1.12) / 2,
                zIndex: path.z,
                opacity: path.z < 16 ? 0.88 : 1,
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
              <div
                className={
                  !reduceMotion && path.z >= 20 ? "st-ge-float" : undefined
                }
                style={
                  !reduceMotion && path.z >= 20
                    ? {
                        animation: `st-ge-float ${2.6 + i * 0.15}s ease-in-out ${2.55 + path.delay}s 2`,
                      }
                    : undefined
                }
              >
                <SkyMiniGiftMark
                  pattern={MINI_PATTERNS[i] ?? "solid"}
                  ribbon={MINI_RIBBONS[i] ?? RIBBON_CREAM}
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="absolute bottom-[6%] left-1/2 z-10 w-[min(92vw,30rem)] -translate-x-1/2 sm:bottom-[5%] sm:w-[min(88vw,34rem)]"
          initial={reduceMotion ? false : { opacity: 0, y: 48, scale: 0.78 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          <div className="relative mx-auto aspect-[220/240] w-full">
            {reduceMotion ? (
              <div className="absolute inset-x-0 bottom-[4%] w-full">
                <SkyGiftBox
                  variant="open"
                  reduceMotion
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
                  <SkyGiftBox variant="closed" className="h-full w-full" />
                </motion.div>
                <motion.div
                  className="absolute inset-x-0 bottom-[4%]"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.92, duration: 0.28 }}
                >
                  <SkyGiftBox
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
