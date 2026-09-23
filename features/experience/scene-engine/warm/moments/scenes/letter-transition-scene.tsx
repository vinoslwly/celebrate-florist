"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import {
  MOTION_DURATION,
  MOTION_EASE,
  useCelebrateReducedMotion,
} from "@/features/experience/scene-engine/shared/motion";
import { WarmGiftBox } from "@/features/experience/scene-engine/warm/moments/warm-gift-box";

/** Gift opens, roses erupt, then auto-advance — keep this snappy. */
export const WARM_LETTER_TRANSITION_MS = 2100;

const CRIMSON = "#3A080C";

type RoseKind = "side" | "threeq" | "open" | "bud" | "petal";

type RoseSpec = {
  x: number;
  y: number;
  rotate: number;
  delay: number;
  scale: number;
  size: number;
  z: number;
  kind: RoseKind;
  fill: string;
  mid: string;
  inner: string;
  float?: boolean;
  desktop?: boolean;
};

/**
 * Fountain from the gift mouth. Mixed silhouettes — never cloned stamps.
 * Rest on-screen (bouquet hang) instead of flying off.
 */
const ROSES: readonly RoseSpec[] = [
  {
    x: -22,
    y: -428,
    rotate: -9,
    delay: 0.02,
    scale: 1.14,
    size: 214,
    z: 52,
    kind: "side",
    fill: "#C41E2A",
    mid: "#8B1A22",
    inner: "#E8A0A8",
    float: true,
  },
  {
    x: 58,
    y: -452,
    rotate: 12,
    delay: 0.05,
    scale: 1.2,
    size: 228,
    z: 54,
    kind: "threeq",
    fill: "#A51C28",
    mid: "#6B1018",
    inner: "#E07070",
    float: true,
  },
  {
    x: -96,
    y: -398,
    rotate: -18,
    delay: 0.08,
    scale: 1.08,
    size: 196,
    z: 50,
    kind: "open",
    fill: "#B81E2C",
    mid: "#7A121A",
    inner: "#F0C0C4",
  },
  {
    x: 122,
    y: -410,
    rotate: 16,
    delay: 0.1,
    scale: 1.1,
    size: 202,
    z: 51,
    kind: "side",
    fill: "#D44A5A",
    mid: "#A51C28",
    inner: "#F0D78A",
  },
  {
    x: 6,
    y: -338,
    rotate: 3,
    delay: 0.12,
    scale: 0.98,
    size: 176,
    z: 46,
    kind: "threeq",
    fill: "#E03A4A",
    mid: "#C41E2A",
    inner: "#8B1A22",
    float: true,
  },
  {
    x: -158,
    y: -348,
    rotate: -24,
    delay: 0.07,
    scale: 1.02,
    size: 184,
    z: 45,
    kind: "bud",
    fill: "#8B1A22",
    mid: "#4A0A10",
    inner: "#C9A227",
  },
  {
    x: 168,
    y: -360,
    rotate: 22,
    delay: 0.11,
    scale: 1.04,
    size: 188,
    z: 45,
    kind: "open",
    fill: "#A51C28",
    mid: "#6B1018",
    inner: "#E07070",
  },
  {
    x: -58,
    y: -268,
    rotate: -11,
    delay: 0.16,
    scale: 0.92,
    size: 158,
    z: 40,
    kind: "side",
    fill: "#C41E2A",
    mid: "#8B1A22",
    inner: "#E07070",
  },
  {
    x: 78,
    y: -252,
    rotate: 14,
    delay: 0.18,
    scale: 0.9,
    size: 152,
    z: 39,
    kind: "threeq",
    fill: "#E03A4A",
    mid: "#B81E2C",
    inner: "#F0C0C4",
  },
  {
    x: -198,
    y: -262,
    rotate: -28,
    delay: 0.14,
    scale: 0.94,
    size: 164,
    z: 38,
    kind: "open",
    fill: "#B81E2C",
    mid: "#7A121A",
    inner: "#C41E2A",
  },
  {
    x: 208,
    y: -242,
    rotate: 26,
    delay: 0.17,
    scale: 0.9,
    size: 156,
    z: 38,
    kind: "bud",
    fill: "#D44A5A",
    mid: "#8B1A22",
    inner: "#F0D78A",
  },
  {
    x: -124,
    y: -198,
    rotate: -15,
    delay: 0.2,
    scale: 0.84,
    size: 138,
    z: 34,
    kind: "side",
    fill: "#A51C28",
    mid: "#6B1018",
    inner: "#E8A0A8",
    float: true,
  },
  {
    x: 138,
    y: -186,
    rotate: 17,
    delay: 0.22,
    scale: 0.82,
    size: 132,
    z: 33,
    kind: "open",
    fill: "#E07070",
    mid: "#C41E2A",
    inner: "#8B1A22",
  },
  {
    x: -8,
    y: -176,
    rotate: -4,
    delay: 0.19,
    scale: 0.86,
    size: 144,
    z: 36,
    kind: "threeq",
    fill: "#C41E2A",
    mid: "#8B1A22",
    inner: "#E8A0A8",
  },
  {
    x: -72,
    y: -118,
    rotate: 8,
    delay: 0.24,
    scale: 0.72,
    size: 112,
    z: 28,
    kind: "bud",
    fill: "#8B1A22",
    mid: "#4A0A10",
    inner: "#C9A227",
  },
  {
    x: 88,
    y: -108,
    rotate: -7,
    delay: 0.26,
    scale: 0.7,
    size: 108,
    z: 27,
    kind: "bud",
    fill: "#E03A4A",
    mid: "#C41E2A",
    inner: "#F0C0C4",
  },
  {
    x: -28,
    y: -72,
    rotate: -14,
    delay: 0.08,
    scale: 0.62,
    size: 96,
    z: 22,
    kind: "bud",
    fill: "#C41E2A",
    mid: "#8B1A22",
    inner: "#F0D78A",
  },
  {
    x: 36,
    y: -64,
    rotate: 18,
    delay: 0.1,
    scale: 0.58,
    size: 88,
    z: 21,
    kind: "open",
    fill: "#E03A4A",
    mid: "#A51C28",
    inner: "#F0C0C4",
  },
  {
    x: 4,
    y: -48,
    rotate: 6,
    delay: 0.06,
    scale: 0.5,
    size: 74,
    z: 20,
    kind: "threeq",
    fill: "#B81E2C",
    mid: "#7A121A",
    inner: "#E8A0A8",
  },
  {
    x: -54,
    y: -52,
    rotate: -22,
    delay: 0.14,
    scale: 0.48,
    size: 70,
    z: 19,
    kind: "bud",
    fill: "#D44A5A",
    mid: "#C41E2A",
    inner: "#F0C0C4",
  },
  {
    x: -240,
    y: -318,
    rotate: -32,
    delay: 0.13,
    scale: 0.96,
    size: 170,
    z: 36,
    kind: "side",
    fill: "#B81E2C",
    mid: "#7A121A",
    inner: "#E07070",
    desktop: true,
  },
  {
    x: 252,
    y: -304,
    rotate: 30,
    delay: 0.15,
    scale: 0.94,
    size: 166,
    z: 36,
    kind: "threeq",
    fill: "#E03A4A",
    mid: "#A51C28",
    inner: "#8B1A22",
    desktop: true,
  },
  {
    x: -268,
    y: -168,
    rotate: -34,
    delay: 0.23,
    scale: 0.78,
    size: 124,
    z: 26,
    kind: "open",
    fill: "#8B1A22",
    mid: "#4A0A10",
    inner: "#E07070",
    desktop: true,
  },
  {
    x: 278,
    y: -154,
    rotate: 36,
    delay: 0.25,
    scale: 0.76,
    size: 120,
    z: 26,
    kind: "side",
    fill: "#D44A5A",
    mid: "#A51C28",
    inner: "#F0D78A",
    desktop: true,
  },
  {
    x: -48,
    y: -488,
    rotate: -6,
    delay: 0.04,
    scale: 0.88,
    size: 148,
    z: 48,
    kind: "open",
    fill: "#C41E2A",
    mid: "#8B1A22",
    inner: "#E8A0A8",
    float: true,
    desktop: true,
  },
  {
    x: 42,
    y: -502,
    rotate: 8,
    delay: 0.06,
    scale: 0.86,
    size: 142,
    z: 48,
    kind: "bud",
    fill: "#A51C28",
    mid: "#6B1018",
    inner: "#E8C96A",
    desktop: true,
  },
];

const PETALS = [
  { x: -42, y: -290, rotate: 38, delay: 0.1, size: 36, spin: 120 },
  { x: 64, y: -340, rotate: -44, delay: 0.16, size: 42, spin: -160 },
  { x: -118, y: -220, rotate: 62, delay: 0.12, size: 32, spin: 200 },
  { x: 132, y: -250, rotate: -28, delay: 0.22, size: 38, spin: -140 },
  { x: -18, y: -400, rotate: 16, delay: 0.18, size: 28, spin: 90 },
  { x: 86, y: -180, rotate: -70, delay: 0.28, size: 34, spin: -210 },
  { x: -164, y: -310, rotate: 48, delay: 0.2, size: 30, spin: 150 },
  { x: 176, y: -275, rotate: -52, delay: 0.24, size: 40, spin: -180 },
] as const;

const SPARKS = [
  { x: -36, y: -210, delay: 0.04, rot: 38, gold: true },
  { x: 48, y: -250, delay: 0.1, rot: -28, gold: false },
  { x: -102, y: -170, delay: 0.07, rot: 52, gold: true },
  { x: 118, y: -190, delay: 0.16, rot: -44, gold: true },
  { x: -14, y: -290, delay: 0.12, rot: 18, gold: false },
  { x: 76, y: -140, delay: 0.2, rot: -56, gold: true },
] as const;

/**
 * Rose petal — fleshy teardrop, high center tip, soft shoulders.
 * (A deep two-lobe dip reads as cartoon ears, not kelopak.)
 * Base at origin, tip toward -Y.
 */
function Kelopak({
  fill,
  shade,
  variant = "a",
}: {
  fill: string;
  shade: string;
  variant?: "a" | "b" | "c";
}) {
  const d =
    variant === "b"
      ? "M0 6 C-20 3 -28 -8 -18 -22 C-14 -30 0 -38 0 -38 C0 -38 14 -30 18 -22 C28 -8 20 3 0 6Z"
      : variant === "c"
        ? "M0 5 C-14 4 -20 -10 -14 -28 C-10 -36 0 -42 0 -42 C0 -42 10 -36 14 -28 C20 -10 14 4 0 5Z"
        : "M0 6 C-18 4 -24 -8 -16 -22 C-20 -26 -10 -34 -4 -30 C0 -38 0 -38 4 -30 C10 -34 20 -26 16 -22 C24 -8 18 4 0 6Z";

  return (
    <g>
      <path d={d} fill={fill} />
      <path
        d="M0 4 C-8 2 -10 -8 -5 -16 C0 -10 0 -10 5 -16 C10 -8 8 2 0 4Z"
        fill={shade}
        opacity="0.4"
      />
      <path
        d="M0 2 C-1 -6 0 -12 0 -18"
        fill="none"
        stroke={shade}
        strokeWidth="1.15"
        strokeLinecap="round"
        opacity="0.28"
      />
    </g>
  );
}

function isGoldish(hex: string): boolean {
  return /F0D78A|E8C96A|C9A227|D4AF37|E8D4C0|F0C0C4|E8A0A8/i.test(hex);
}

function WarmRose({
  kind,
  fill,
  mid,
}: {
  kind: RoseKind;
  fill: string;
  mid: string;
  inner: string;
}) {
  const rose =
    isGoldish(fill) ||
    fill === "#8B1A22" ||
    fill === "#7A121A" ||
    fill === "#6B1018"
      ? "#E23A4C"
      : fill;
  const wine = isGoldish(mid) || mid === "#4A0A10" ? "#8B1A22" : mid;
  const variant = kind === "threeq" ? "b" : kind === "open" ? "c" : "a";

  return (
    <svg viewBox="-28 -48 56 58" className="h-full w-full" aria-hidden>
      {kind === "open" || kind === "side" ? (
        <g transform="translate(-7 4) rotate(-20) scale(0.92)">
          <Kelopak fill={wine} shade="#5C0C14" variant={variant} />
        </g>
      ) : null}
      <g
        transform={
          kind === "open" || kind === "side"
            ? "translate(6 2) rotate(12)"
            : undefined
        }
      >
        <Kelopak fill={rose} shade={wine} variant={variant} />
      </g>
    </svg>
  );
}

function roseStyle(rose: RoseSpec, reduceMotion: boolean): CSSProperties {
  return {
    width: rose.size,
    height: rose.size,
    marginLeft: -rose.size / 2,
    marginTop: -rose.size / 2,
    zIndex: rose.z,
    ["--tx" as string]: `${rose.x}px`,
    ["--ty" as string]: `${rose.y}px`,
    ["--sc" as string]: String(rose.scale),
    ["--r" as string]: `${rose.rotate}deg`,
    filter: "drop-shadow(0 8px 10px rgba(20,0,4,0.32))",
    animation: reduceMotion
      ? "none"
      : `warm-rose-erupt 1.15s cubic-bezier(0.16, 0.84, 0.28, 1) ${0.08 + rose.delay * 0.55}s both`,
    transform: reduceMotion
      ? `translate3d(${rose.x}px, ${rose.y}px, 0) scale(${rose.scale}) rotate(${rose.rotate}deg)`
      : undefined,
    opacity: reduceMotion ? 1 : undefined,
  };
}

/**
 * Warm Moments Scene 5 — gift lid lifts, roses erupt from the mouth.
 * CSS burst (Framer keyframe arrays skip to the last frame on this path).
 */
export function WarmLetterTransitionScene({ onComplete }: MomentsSceneProps) {
  const reduceMotion = useCelebrateReducedMotion();
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ms = reduceMotion ? 500 : WARM_LETTER_TRANSITION_MS;
    const t = window.setTimeout(() => onCompleteRef.current(), ms);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div
      className={`${SCENE_VIEWPORT_LOCK} isolate`}
      style={{ backgroundColor: CRIMSON }}
    >
      <style>{`
        @keyframes warm-rose-erupt {
          0% {
            opacity: 0;
            transform: translate3d(0, 20px, 0) scale(0.06) rotate(-8deg);
          }
          16% {
            opacity: 1;
            transform: translate3d(calc(var(--tx) * 0.4), calc(var(--ty) * 0.3), 0)
              scale(calc(var(--sc) * 0.58)) rotate(calc(var(--r) * 0.35));
          }
          44% {
            opacity: 1;
            transform: translate3d(calc(var(--tx) * 1.04), calc(var(--ty) * 0.98), 0)
              scale(calc(var(--sc) * 1.1)) rotate(var(--r));
          }
          100% {
            opacity: 1;
            transform: translate3d(var(--tx), calc(var(--ty) - 16px), 0)
              scale(var(--sc)) rotate(calc(var(--r) * 1.05));
          }
        }
        @keyframes warm-rose-float {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(-3deg); }
          50% { transform: translate3d(4px, -14px, 0) rotate(5deg); }
        }
        @keyframes warm-petal-erupt {
          0% {
            opacity: 0;
            transform: translate3d(0, 8px, 0) scale(0.2) rotate(0deg);
          }
          22% { opacity: 1; }
          100% {
            opacity: 0.85;
            transform: translate3d(var(--tx), var(--ty), 0) scale(1) rotate(var(--spin));
          }
        }
        @keyframes warm-spark {
          0% { opacity: 0; transform: translate3d(0, 0, 0) scale(0.3) rotate(0deg); }
          18% { opacity: 1; transform: translate3d(calc(var(--tx) * 0.4), calc(var(--ty) * 0.4), 0) scale(1.15) rotate(var(--r)); }
          100% { opacity: 0; transform: translate3d(var(--tx), var(--ty), 0) scale(0.6) rotate(var(--r)); }
        }
        @keyframes warm-shock {
          0% { opacity: 0.9; transform: scale(0.18); }
          100% { opacity: 0; transform: scale(4.8); }
        }
        @keyframes warm-burst-flash {
          0% { opacity: 0; }
          18% { opacity: 0.42; }
          46% { opacity: 0.08; }
          100% { opacity: 0; }
        }
        @keyframes warm-mouth-glow {
          0% { opacity: 0; transform: translateX(-50%) scale(0.28); }
          35% { opacity: 1; transform: translateX(-50%) scale(1.06); }
          100% { opacity: 0.85; transform: translateX(-50%) scale(1); }
        }
        .warm-rose-float {
          animation: warm-rose-float 3.4s ease-in-out infinite;
        }
        .warm-rose-desktop { display: none; }
        @media (min-width: 640px) {
          .warm-rose-desktop { display: block; }
        }
        @media (prefers-reduced-motion: reduce) {
          .warm-rose-float { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: [
            "radial-gradient(ellipse 90% 70% at 50% 18%, #8B1A22 0%, transparent 58%)",
            "radial-gradient(ellipse 80% 55% at 18% 80%, #5A1016 0%, transparent 55%)",
            "radial-gradient(ellipse 120% 90% at 50% 100%, #1E0408 0%, #3A080C 50%, #4A0A10 100%)",
          ].join(", "),
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[14%] left-1/2 z-[6] h-[min(86vw,28rem)] w-[min(86vw,28rem)] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(255,248,224,0.95) 0%, rgba(232,201,106,0.55) 22%, rgba(165,28,40,0.28) 48%, transparent 72%)",
          animation: reduceMotion
            ? "none"
            : "warm-mouth-glow 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0s both",
          opacity: reduceMotion ? 1 : undefined,
          transform: "translateX(-50%)",
        }}
      />

      {reduceMotion ? null : (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[14%] left-1/2 z-[12] rounded-full border border-[#F0D78A]/80"
            style={{
              width: 78,
              height: 78,
              marginLeft: -39,
              marginBottom: -39,
              animation:
                "warm-shock 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.06s both",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[14%] left-1/2 z-[12] rounded-full border border-white/50"
            style={{
              width: 56,
              height: 56,
              marginLeft: -28,
              marginBottom: -28,
              animation:
                "warm-shock 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.12s both",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[30]"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 78%, rgba(255,248,224,0.7) 0%, rgba(232,201,106,0.2) 36%, transparent 70%)",
              animation: "warm-burst-flash 0.5s ease-out 0.06s both",
            }}
          />
        </>
      )}

      {reduceMotion ? null : (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[14%] left-1/2 z-[15]"
        >
          {SPARKS.map((spark, i) => (
            <span
              key={i}
              className="absolute rotate-45 rounded-[1px]"
              style={{
                width: spark.gold ? 8 : 6,
                height: spark.gold ? 8 : 6,
                marginLeft: -4,
                marginTop: -4,
                background: spark.gold ? "#F0D78A" : "#E07070",
                ["--tx" as string]: `${spark.x}px`,
                ["--ty" as string]: `${spark.y}px`,
                ["--r" as string]: `${spark.rot}deg`,
                animation: `warm-spark 0.7s ease-out ${0.06 + spark.delay * 0.5}s both`,
              }}
            />
          ))}
        </div>
      )}

      {reduceMotion ? null : (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-[14%] left-1/2 z-[18]"
        >
          {PETALS.map((petal, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: petal.size,
                height: petal.size * 1.35,
                marginLeft: -petal.size / 2,
                marginTop: -(petal.size * 1.35) / 2,
                ["--tx" as string]: `${petal.x}px`,
                ["--ty" as string]: `${petal.y}px`,
                ["--spin" as string]: `${petal.spin}deg`,
                animation: `warm-petal-erupt 1.05s cubic-bezier(0.16, 0.84, 0.32, 1) ${0.1 + petal.delay * 0.55}s both`,
              }}
            >
              <WarmRose
                kind="petal"
                fill={i % 2 === 0 ? "#E23A4C" : "#C41E3A"}
                mid="#8B1A22"
                inner="#F0C0C4"
              />
            </div>
          ))}
        </div>
      )}

      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[14%] left-1/2 z-20"
      >
        {ROSES.map((rose, i) => (
          <div
            key={i}
            className={rose.desktop ? "warm-rose-desktop absolute" : "absolute"}
            style={roseStyle(rose, reduceMotion)}
          >
            <div
              className={
                rose.float && !reduceMotion
                  ? "warm-rose-float h-full w-full"
                  : "h-full w-full"
              }
            >
              <WarmRose
                kind={rose.kind}
                fill={rose.fill}
                mid={rose.mid}
                inner={rose.inner}
              />
            </div>
          </div>
        ))}
      </div>

      <motion.div
        className="absolute bottom-[3%] left-1/2 z-10 w-[min(58vw,13.5rem)] -translate-x-1/2 sm:bottom-[4%] sm:w-[min(48vw,15rem)]"
        initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: reduceMotion
            ? MOTION_DURATION.instant
            : MOTION_DURATION.base,
          ease: MOTION_EASE.out,
        }}
      >
        <div className="relative mx-auto aspect-[280/160] w-full">
          {reduceMotion ? (
            <WarmGiftBox
              variant="open"
              className="h-full w-full"
              reduceMotion
            />
          ) : (
            <>
              <motion.div
                className="absolute inset-0"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{
                  delay: 0.04,
                  duration: MOTION_DURATION.fast,
                  ease: MOTION_EASE.out,
                }}
              >
                <WarmGiftBox variant="closed" className="h-full w-full" />
              </motion.div>
              <motion.div
                className="absolute inset-0 origin-bottom"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.02,
                  duration: 0.18,
                  ease: MOTION_EASE.pop,
                }}
              >
                <WarmGiftBox
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
