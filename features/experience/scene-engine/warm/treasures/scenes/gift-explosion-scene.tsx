"use client";

import { useId, useMemo } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_POP = [0.22, 1.4, 0.36, 1] as const;

const BG = "#2A0509";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E8D090";

/** Theme Lab default burst count (architecture N = 2–6; six = max cap). */
export const WARM_TREASURES_LAB_EXPLOSION_GIFT_COUNT = 6;

/**
 * Settled fountain — depth like Founder / Bloom reference:
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

const SPARKLES = [
  { top: "10%", left: "14%", delay: 0, size: 3 },
  { top: "8%", left: "50%", delay: 0.2, size: 4 },
  { top: "14%", left: "78%", delay: 0.4, size: 3 },
  { top: "24%", left: "20%", delay: 0.15, size: 2.5 },
  { top: "20%", left: "64%", delay: 0.5, size: 3.5 },
  { top: "30%", left: "40%", delay: 0.3, size: 4 },
  { top: "34%", left: "84%", delay: 0.65, size: 2.5 },
  { top: "16%", left: "32%", delay: 0.8, size: 3 },
  { top: "42%", left: "12%", delay: 0.45, size: 2.5 },
  { top: "38%", left: "72%", delay: 0.25, size: 3 },
] as const;

const FALLING_PETALS = [
  { left: "5%", delay: 0.2, duration: 6.2, size: 16, x: 18 },
  { left: "16%", delay: 0.8, duration: 7, size: 14, x: -12 },
  { left: "40%", delay: 0.35, duration: 6.5, size: 17, x: 12 },
  { left: "66%", delay: 1.1, duration: 7.2, size: 15, x: -16 },
  { left: "80%", delay: 0.5, duration: 6.6, size: 16, x: -10 },
  { left: "92%", delay: 1.4, duration: 7.5, size: 13, x: -14 },
] as const;

const HEART_BURST = [
  { x: -100, y: -130, delay: 0 },
  { x: 50, y: -170, delay: 0.04 },
  { x: 120, y: -110, delay: 0.08 },
  { x: -50, y: -80, delay: 0.1 },
  { x: 90, y: -50, delay: 0.12 },
  { x: -130, y: -60, delay: 0.06 },
] as const;

type MiniTone = "crimson" | "burgundy";

const MINI_TONES: MiniTone[] = [
  "crimson",
  "burgundy",
  "crimson",
  "burgundy",
  "crimson",
  "burgundy",
];

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#C42838"
        opacity="0.9"
      />
      <path
        d="M12 6C10 12 8 16 10 22"
        stroke="#F0D0D0"
        strokeWidth="1"
        opacity="0.3"
      />
    </svg>
  );
}

/** Compact Warm mini gift — crimson / burgundy + gold ribbon only. */
function WarmMiniGiftMark({
  className,
  tone = "crimson",
}: {
  className?: string;
  tone?: MiniTone;
}) {
  const raw = useId().replace(/:/g, "");
  const body = `wmg-body-${raw}`;
  const lid = `wmg-lid-${raw}`;
  const ribbon = `wmg-ribbon-${raw}`;

  const bodyStops =
    tone === "burgundy"
      ? (["#6B1018", "#3A080C"] as const)
      : (["#A51C28", "#6B1018"] as const);

  const lidStops =
    tone === "burgundy"
      ? (["#8B1A22", "#4A0A10"] as const)
      : (["#C42838", "#7A121A"] as const);

  return (
    <svg viewBox="0 0 72 84" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id={body} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={bodyStops[0]} />
          <stop offset="100%" stopColor={bodyStops[1]} />
        </linearGradient>
        <linearGradient id={lid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={lidStops[0]} />
          <stop offset="100%" stopColor={lidStops[1]} />
        </linearGradient>
        <linearGradient id={ribbon} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0D78A" />
          <stop offset="45%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#A67C1A" />
        </linearGradient>
      </defs>
      <ellipse cx="36" cy="78" rx="20" ry="3.5" fill="#1A0406" opacity="0.28" />
      <rect
        x="10"
        y="30"
        width="52"
        height="40"
        rx="5"
        fill={`url(#${body})`}
      />
      <path d="M10 36h52v8H10z" fill={GOLD_SOFT} opacity="0.12" />
      <rect x="28" y="30" width="16" height="40" fill={`url(#${ribbon})`} />
      <rect x="10" y="46" width="52" height="9" fill={`url(#${ribbon})`} />
      <rect x="8" y="16" width="56" height="18" rx="4" fill={`url(#${lid})`} />
      <rect x="28" y="16" width="16" height="18" fill={`url(#${ribbon})`} />
      <ellipse
        cx="22"
        cy="14"
        rx="11"
        ry="6"
        fill={`url(#${ribbon})`}
        transform="rotate(-14 22 14)"
      />
      <ellipse
        cx="50"
        cy="14"
        rx="11"
        ry="6"
        fill={`url(#${ribbon})`}
        transform="rotate(14 50 14)"
      />
      <ellipse cx="36" cy="14" rx="7" ry="5.5" fill="#D4AF37" />
      {/* Gold heart charm */}
      <path
        d="M36 8 C33.5 5.5 30.5 5.5 30.5 8 C30.5 9.8 32.2 11 36 14 C39.8 11 41.5 9.8 41.5 8 C41.5 5.5 38.5 5.5 36 8Z"
        fill={GOLD_SOFT}
      />
      <path
        d="M36 14 L36 22"
        stroke={GOLD}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

type WarmTreasuresGiftExplosionSceneProps = WarmTreasuresSceneProps & {
  giftCount?: number;
};

/**
 * warm.treasures.gift-explosion — Architecture Scenes 4+5 as one beat (~3.6s).
 * Mirrors Bloom Treasures structure; Warm crimson/gold only (no cream boxes).
 * Preparing → lid open → gold POP → mini-gift fountain.
 */
export function WarmTreasuresGiftExplosionScene({
  giftCount = WARM_TREASURES_LAB_EXPLOSION_GIFT_COUNT,
}: WarmTreasuresGiftExplosionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const count = Math.min(6, Math.max(2, Math.floor(giftCount)));
  const paths = useMemo(() => BURST_PATHS.slice(0, count), [count]);

  return (
    <div className={SCENE_VIEWPORT_LOCK} style={{ backgroundColor: BG }}>
      <style>{`
        @keyframes wt-ge-glow {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(0.94); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.12); }
        }
        @keyframes wt-ge-sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1.35); }
        }
        @keyframes wt-ge-ray {
          0%, 100% { opacity: 0.35; }
          50% { opacity: 0.7; }
        }
        @media (prefers-reduced-motion: reduce) {
          .wt-ge-glow, .wt-ge-sparkle, .wt-ge-ray { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 90% 70% at 22% -6%, rgba(180,50,60,0.45) 0%, transparent 52%)",
            "radial-gradient(ellipse 70% 55% at 78% 20%, rgba(100,24,34,0.4) 0%, transparent 55%)",
            "radial-gradient(ellipse 130% 90% at 50% 118%, #0A0103 0%, transparent 48%)",
            "linear-gradient(165deg, #5A121A 0%, #3A080C 42%, #1A0406 100%)",
          ].join(", "),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.09] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div
        aria-hidden
        className="wt-ge-ray pointer-events-none absolute inset-0"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 62%, transparent 0deg, rgba(240,216,120,0.28) 10deg, transparent 22deg, rgba(255,248,230,0.35) 36deg, transparent 50deg, rgba(201,162,74,0.22) 64deg, transparent 82deg)",
          animation: reduceMotion
            ? undefined
            : "wt-ge-ray 2.2s ease-in-out infinite",
        }}
      />

      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            background:
              "radial-gradient(circle at 50% 58%, rgba(240,216,120,0.85) 0%, rgba(165,28,40,0.55) 45%, transparent 70%)",
          }}
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
                opacity: [0, 0.95, 0.95, 0],
                y: ["0vh", "115vh"],
                x: [0, petal.x, petal.x * -0.35],
                rotate: [0, 50, -18, 42],
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
              className="wt-ge-sparkle pointer-events-none absolute z-[2] rounded-full"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                backgroundColor: GOLD_SOFT,
                boxShadow: "0 0 10px rgba(240,216,120,0.65)",
                animation: `wt-ge-sparkle 1.45s ease-in-out ${s.delay}s infinite`,
              }}
            />
          ))
        : null}

      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={
          reduceMotion
            ? undefined
            : { scale: [1, 1, 1.05, 1.02], y: [0, 0, -10, -4] }
        }
        transition={{
          duration: 2.2,
          times: [0, 0.48, 0.6, 1],
          ease: EASE_OUT,
        }}
      >
        <motion.p
          className="absolute top-[5%] right-0 left-0 z-30 px-4 text-center font-serif text-lg tracking-wide sm:top-[6%] sm:text-xl"
          style={{ color: GOLD_SOFT }}
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
          className="wt-ge-glow pointer-events-none absolute top-[62%] left-1/2 z-0 h-[min(70vw,28rem)] w-[min(70vw,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[32rem] sm:w-[32rem]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,248,230,1) 0%, rgba(240,216,120,0.85) 18%, rgba(201,162,74,0.45) 40%, rgba(165,28,40,0.2) 55%, transparent 70%)",
            animation: reduceMotion
              ? undefined
              : "wt-ge-glow 1.25s ease-in-out 1s infinite",
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
                  borderColor: "rgba(240,216,120,0.75)",
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

        {!reduceMotion
          ? HEART_BURST.map((h, i) => (
              <motion.span
                key={i}
                aria-hidden
                className="pointer-events-none absolute top-[62%] left-1/2 z-[18] text-2xl sm:text-3xl"
                style={{ color: GOLD }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: h.x,
                  y: h.y,
                  scale: [0.3, 1.3, 0.95],
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

        <div
          aria-hidden
          className="pointer-events-none absolute top-[62%] left-1/2 z-20"
        >
          {paths.map((path, i) => (
            <motion.div
              key={i}
              className="absolute drop-shadow-[0_18px_32px_rgba(20,4,8,0.55)]"
              style={{
                width: path.size,
                height: path.size * 1.12,
                marginLeft: -path.size / 2,
                marginTop: -(path.size * 1.12) / 2,
                zIndex: path.z,
                filter: path.z < 16 ? "blur(0.55px)" : undefined,
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
                <WarmMiniGiftMark
                  tone={MINI_TONES[i] ?? "crimson"}
                  className="h-full w-full"
                />
              </motion.div>
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
                <WarmGiftBox
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
                  <WarmGiftBox variant="closed" className="h-full w-full" />
                </motion.div>
                <motion.div
                  className="absolute inset-x-0 bottom-[4%]"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.92, duration: 0.28 }}
                >
                  <WarmGiftBox
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
