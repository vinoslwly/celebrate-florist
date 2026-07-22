"use client";

import { useEffect, useId, useRef } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";

/** Heboh rose-rain beat, then auto-advance. */
export const WARM_LETTER_TRANSITION_MS = 2000;

type PetalSpec = {
  left: string;
  size: string;
  delay: number;
  duration: number;
  x: number;
  rotateFrom: number;
  rotateTo: number;
  blur: number;
  opacity: number;
  z: number;
  tone: "deep" | "bright" | "shadow";
};

const TONES = ["deep", "bright", "shadow"] as const;

/** Deterministic pseudo-hash — SSR/client safe, no Math.random. */
function mix(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Dense multi-wave rain — ~70 petals, large foreground, fast + chaotic sway.
 */
function buildPetals(): PetalSpec[] {
  const out: PetalSpec[] = [];

  // Wave A — immediate giants (screen-covering)
  for (let i = 0; i < 10; i++) {
    const m = mix(i + 1);
    const m2 = mix(i + 40);
    out.push({
      left: `${-10 + i * 12 + m * 4}%`,
      size: `${48 + m * 22}vmin`,
      delay: m * 0.1,
      duration: 1.15 + m2 * 0.35,
      x: (m - 0.5) * 140,
      rotateFrom: -55 + m * 90,
      rotateTo: -20 + m2 * 100,
      blur: 5 + m * 6,
      opacity: 0.78 + m * 0.16,
      z: 40 + i,
      tone: TONES[i % 3]!,
    });
  }

  // Wave B — mid dense fill
  for (let i = 0; i < 28; i++) {
    const m = mix(i + 100);
    const m2 = mix(i + 200);
    out.push({
      left: `${-6 + ((i * 17 + m * 30) % 108)}%`,
      size: `${20 + m * 24}vmin`,
      delay: 0.02 + m * 0.28,
      duration: 1.05 + m2 * 0.4,
      x: (m2 - 0.5) * 120,
      rotateFrom: -60 + m * 110,
      rotateTo: -40 + m2 * 120,
      blur: m > 0.7 ? 2 + m * 3 : 0,
      opacity: 0.82 + m * 0.14,
      z: 16 + (i % 14),
      tone: TONES[(i + 1) % 3]!,
    });
  }

  // Wave C — second burst (mid-scene heboh)
  for (let i = 0; i < 18; i++) {
    const m = mix(i + 300);
    const m2 = mix(i + 400);
    out.push({
      left: `${-8 + ((i * 13 + m * 40) % 110)}%`,
      size: `${26 + m * 28}vmin`,
      delay: 0.45 + m * 0.28,
      duration: 1.0 + m2 * 0.35,
      x: (m - 0.5) * 150,
      rotateFrom: -70 + m * 130,
      rotateTo: 20 + m2 * 90,
      blur: m > 0.55 ? 3 + m * 5 : 1,
      opacity: 0.8 + m * 0.15,
      z: 28 + (i % 12),
      tone: TONES[(i + 2) % 3]!,
    });
  }

  // Wave D — far sparkle rain
  for (let i = 0; i < 16; i++) {
    const m = mix(i + 500);
    const m2 = mix(i + 600);
    out.push({
      left: `${(i * 7 + m * 20) % 100}%`,
      size: `${9 + m * 12}vmin`,
      delay: m * 0.4,
      duration: 1.35 + m2 * 0.4,
      x: (m2 - 0.5) * 60,
      rotateFrom: -40 + m * 80,
      rotateTo: -30 + m2 * 90,
      blur: 3 + m * 5,
      opacity: 0.32 + m * 0.28,
      z: 4 + (i % 8),
      tone: TONES[i % 3]!,
    });
  }

  return out;
}

const PETALS = buildPetals();

const BOKEH = [
  { top: "6%", left: "10%", size: 12, opacity: 0.4 },
  { top: "14%", left: "22%", size: 7, opacity: 0.32 },
  { top: "10%", left: "48%", size: 16, opacity: 0.26 },
  { top: "20%", left: "68%", size: 9, opacity: 0.34 },
  { top: "28%", left: "84%", size: 6, opacity: 0.38 },
  { top: "38%", left: "14%", size: 5, opacity: 0.28 },
  { top: "48%", left: "36%", size: 11, opacity: 0.22 },
  { top: "55%", left: "78%", size: 8, opacity: 0.3 },
  { top: "62%", left: "52%", size: 14, opacity: 0.18 },
  { top: "70%", left: "20%", size: 6, opacity: 0.24 },
  { top: "18%", left: "90%", size: 5, opacity: 0.42 },
  { top: "8%", left: "35%", size: 10, opacity: 0.36 },
  { top: "32%", left: "58%", size: 4, opacity: 0.45 },
  { top: "44%", left: "8%", size: 7, opacity: 0.26 },
  { top: "75%", left: "88%", size: 9, opacity: 0.2 },
  { top: "4%", left: "60%", size: 8, opacity: 0.3 },
] as const;

const TONE = {
  deep: { fill: "#8B1520", edge: "#C43A45" },
  bright: { fill: "#C41E2A", edge: "#E85A5A" },
  shadow: { fill: "#5C0E14", edge: "#9A222C" },
} as const;

function RosePetal({
  tone,
  className,
}: {
  tone: PetalSpec["tone"];
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const g = `warmRose-${uid}`;
  const colors = TONE[tone];

  return (
    <svg viewBox="0 0 48 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={g} x1="20%" y1="10%" x2="80%" y2="90%">
          <stop offset="0%" stopColor={colors.edge} />
          <stop offset="45%" stopColor={colors.fill} />
          <stop offset="100%" stopColor="#3A080C" />
        </linearGradient>
      </defs>
      {/* Soft rose petal silhouette */}
      <path
        d="M24 4C16 12 8 22 10 36c1.5 10 12 18 14 8 2-8-1-18-6-28 4 2 10 4 14 2 6-3 10-12 6-22-6 6-10 10-14 18Z"
        fill={`url(#${g})`}
        opacity="0.95"
      />
      <path
        d="M22 10C18 18 14 26 15 34c1 7 8 12 10 6 1-5-1-12-5-20 3 1 7 2 10 1"
        fill={colors.edge}
        opacity="0.35"
      />
    </svg>
  );
}

/**
 * Warm Moments Scene 5 — Letter Transition.
 *
 * Code-built hujan mawar (Bloom-style): gradients + SVG petals + motion.
 * Founder screenshot is design reference only — never a runtime asset.
 */
export function WarmLetterTransitionScene({ onComplete }: MomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
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
    <div className="relative z-30 flex h-full min-h-0 w-full flex-1 overflow-hidden bg-[#3A080C]">
      {/* Atmosphere — coded, not a photo plate */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 100% 80% at 18% 8%, #A8222E 0%, transparent 52%)",
            "radial-gradient(ellipse 90% 70% at 70% 30%, #6B1018 0%, transparent 55%)",
            "radial-gradient(ellipse 120% 100% at 50% 100%, #2A0508 0%, #4A0A10 45%, #6B0F16 100%)",
          ].join(", "),
        }}
      />

      {/* Soft light wash (top-left), matches ref mood */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 15% 5%, rgba(255,120,100,0.28) 0%, transparent 60%)",
        }}
      />

      {/* Bokeh dust */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {BOKEH.map((dot, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              top: dot.top,
              left: dot.left,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
              background:
                "radial-gradient(circle, rgba(255,220,180,0.95) 0%, rgba(255,180,140,0.2) 55%, transparent 70%)",
            }}
          />
        ))}
      </div>

      {/* Dense rose rain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {PETALS.map((petal, i) => (
          <motion.div
            key={i}
            className="absolute top-0"
            style={{
              left: petal.left,
              width: petal.size,
              zIndex: petal.z,
              filter: petal.blur ? `blur(${petal.blur}px)` : undefined,
              willChange: "transform, opacity",
            }}
            initial={
              reduceMotion
                ? {
                    y: "25vh",
                    x: 0,
                    rotate: petal.rotateFrom / 2,
                    opacity: petal.opacity,
                  }
                : {
                    y: "-40vh",
                    x: 0,
                    rotate: petal.rotateFrom,
                    opacity: 0,
                  }
            }
            animate={{
              y: "120vh",
              x: [0, petal.x * 0.55, petal.x],
              rotate: [
                petal.rotateFrom,
                (petal.rotateFrom + petal.rotateTo) / 2,
                petal.rotateTo,
              ],
              opacity: reduceMotion
                ? petal.opacity
                : [0, petal.opacity, petal.opacity, 0.08],
              scale: reduceMotion ? 1 : [0.92, 1.05, 0.98],
            }}
            transition={{
              duration: reduceMotion ? 0.4 : petal.duration,
              delay: reduceMotion ? 0 : petal.delay,
              ease: "linear",
              opacity: {
                duration: reduceMotion ? 0.4 : petal.duration,
                times: [0, 0.06, 0.72, 1],
              },
              x: {
                duration: reduceMotion ? 0.4 : petal.duration,
                times: [0, 0.45, 1],
              },
              rotate: {
                duration: reduceMotion ? 0.4 : petal.duration,
                times: [0, 0.5, 1],
              },
              scale: {
                duration: reduceMotion ? 0.4 : petal.duration,
                times: [0, 0.35, 1],
              },
            }}
          >
            <RosePetal tone={petal.tone} className="h-auto w-full" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
