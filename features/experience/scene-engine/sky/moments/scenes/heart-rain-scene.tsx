"use client";

import { useEffect, useRef } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyMomentsSceneProps } from "@/features/experience/scene-engine/sky/moments/types";

/** Auto-advance after successive rain rows have started falling. */
export const SKY_HEART_RAIN_DURATION_MS = 2000;

/** Sky-only palette — soft light blues + white. */
type HeartTone = "white" | "mist" | "soft" | "sky";

type HeartSpec = {
  left: string;
  sizeVmin: number;
  delay: number;
  duration: number;
  sway: number;
  rotate: number;
  rotateEnd: number;
  startY: number;
  opacity: number;
  z: number;
  tone: HeartTone;
  /** Foreground heroes get richer SVG detail */
  hero: boolean;
};

const HEART_PATH =
  "M32 51.5C32 51.5 7.5 36.5 7.5 21.2 7.5 12.8 14 7 21.2 7c4.6 0 8 2.4 10.8 6.2C34.8 9.4 38.2 7 42.8 7 50 7 56.5 12.8 56.5 21.2 56.5 36.5 32 51.5 32 51.5Z";

function mix(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function pickTone(i: number, salt: number): HeartTone {
  const m = mix(i + salt);
  if (m < 0.3) return "white";
  if (m < 0.55) return "mist";
  if (m < 0.8) return "soft";
  return "sky";
}

/**
 * Abstract rain rows — one horizontal band starts, then the next.
 * Small icons so a row reads as a line, not one overlapping blob.
 */
const HEART_WAVES = 8;
const HEARTS_PER_WAVE = 11;

function buildHearts(): HeartSpec[] {
  const out: HeartSpec[] = [];

  for (let wave = 0; wave < HEART_WAVES; wave++) {
    for (let col = 0; col < HEARTS_PER_WAVE; col++) {
      const i = wave * HEARTS_PER_WAVE + col;
      const m = mix(i + 3);
      const m2 = mix(i + 41);
      const m3 = mix(i * 5 + 17);
      const slot = (col + 0.5) / HEARTS_PER_WAVE;
      const left = slot * 112 - 6 + (m - 0.5) * 6;

      out.push({
        left: `${Number(left.toFixed(2))}%`,
        sizeVmin: Number((6.5 + m * 5 + (wave < 2 ? 1.5 : 0)).toFixed(2)),
        delay: Number((wave * 0.2 + col * 0.012 + m2 * 0.008).toFixed(3)),
        duration: Number((2.12 + m * 0.14).toFixed(3)),
        sway: Number(((m2 - 0.5) * 20 + (m - 0.5) * 8).toFixed(2)),
        rotate: Number((-24 + m * 36 + (m2 - 0.5) * 12).toFixed(2)),
        rotateEnd: Number((-6 + m2 * 28 + (m3 - 0.5) * 12).toFixed(2)),
        startY: Number((-8 - wave * 12 - m * 4).toFixed(2)),
        opacity: Number((0.7 + m * 0.22).toFixed(3)),
        z: 34 - wave * 3 + Math.floor(m2 * 4),
        tone: pickTone(i, 19),
        hero: wave < 2 && m > 0.5,
      });
    }

    for (let col = 0; col < HEARTS_PER_WAVE - 1; col++) {
      const i = 800 + wave * HEARTS_PER_WAVE + col;
      const m = mix(i + 9);
      const m2 = mix(i + 27);
      const m3 = mix(i * 3 + 5);
      const slot = (col + 1) / HEARTS_PER_WAVE;
      const left = slot * 112 - 6 + (m - 0.5) * 5;

      out.push({
        left: `${Number(left.toFixed(2))}%`,
        sizeVmin: Number((5.2 + m * 4).toFixed(2)),
        delay: Number(
          (wave * 0.2 + 0.045 + col * 0.01 + m2 * 0.006).toFixed(3),
        ),
        duration: Number((2.08 + m * 0.12).toFixed(3)),
        sway: Number(((m - 0.5) * 16).toFixed(2)),
        rotate: Number((-20 + m2 * 32).toFixed(2)),
        rotateEnd: Number((-4 + m3 * 24).toFixed(2)),
        startY: Number((-14 - wave * 12 - m * 3).toFixed(2)),
        opacity: Number((0.58 + m * 0.22).toFixed(3)),
        z: 22 - wave * 2,
        tone: pickTone(i, 41),
        hero: false,
      });
    }
  }

  return out;
}

const HEARTS = buildHearts();

const EDGE: Record<HeartTone, string> = {
  white: "#A8D0EA",
  mist: "#8EBFDE",
  soft: "#7EB6D9",
  sky: "#6BA3C9",
};

function HeartDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden>
      <defs>
        <linearGradient id="skyH-white" x1="22%" y1="8%" x2="78%" y2="92%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="45%" stopColor="#F7FBFE" />
          <stop offset="100%" stopColor="#D6EAF8" />
        </linearGradient>
        <linearGradient id="skyH-mist" x1="18%" y1="5%" x2="82%" y2="95%">
          <stop offset="0%" stopColor="#FFFEFB" />
          <stop offset="40%" stopColor="#E8F2FA" />
          <stop offset="100%" stopColor="#B8D4EA" />
        </linearGradient>
        <linearGradient id="skyH-soft" x1="20%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#E8F2FA" />
          <stop offset="35%" stopColor="#C5DCEF" />
          <stop offset="100%" stopColor="#8EBFDE" />
        </linearGradient>
        <linearGradient id="skyH-sky" x1="15%" y1="5%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#D6EAF8" />
          <stop offset="40%" stopColor="#8EBFDE" />
          <stop offset="100%" stopColor="#6BA3C9" />
        </linearGradient>
        <radialGradient id="skyH-sheen" cx="32%" cy="28%" r="45%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="55%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <linearGradient id="skyH-depth" x1="50%" y1="35%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="rgba(30,58,95,0)" />
          <stop offset="100%" stopColor="rgba(61,122,173,0.22)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function LoveHeart({
  tone,
  hero,
  className,
}: {
  tone: HeartTone;
  hero?: boolean;
  className?: string;
}) {
  const fillId = `skyH-${tone}`;
  return (
    <svg
      viewBox="0 0 64 58"
      className={className}
      aria-hidden
      style={{ aspectRatio: "64 / 58" }}
    >
      {/* Soft outer aura — premium depth without harsh cartoon edge */}
      {hero ? (
        <path
          d={HEART_PATH}
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="5"
          strokeLinejoin="round"
          opacity="0.45"
        />
      ) : null}
      <path
        d={HEART_PATH}
        fill={`url(#${fillId})`}
        stroke={EDGE[tone]}
        strokeWidth={hero ? 1.8 : 1.5}
        strokeLinejoin="round"
      />
      {/* Depth wash */}
      <path
        d={HEART_PATH}
        fill="url(#skyH-depth)"
        opacity={hero ? 0.85 : 0.55}
      />
      {/* Glass sheen */}
      <path
        d={HEART_PATH}
        fill="url(#skyH-sheen)"
        opacity={hero ? 0.9 : 0.65}
      />
      {/* Specular glint */}
      <path
        d="M19.5 17.5c2.2-4.2 7.4-5.4 11-2.4"
        fill="none"
        stroke="rgba(255,255,255,0.92)"
        strokeWidth={hero ? 2.6 : 2.1}
        strokeLinecap="round"
      />
      {hero ? (
        <circle cx="24" cy="16" r="1.6" fill="rgba(255,255,255,0.85)" />
      ) : null}
    </svg>
  );
}

/**
 * sky.moments.heart-rain — premium Sky glass love rain.
 */
export function SkyHeartRainScene({ onComplete }: SkyMomentsSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const ms = reduceMotion ? 800 : SKY_HEART_RAIN_DURATION_MS;
    const t = window.setTimeout(() => onCompleteRef.current(), ms);
    return () => window.clearTimeout(t);
  }, [reduceMotion]);

  return (
    <div
      className={`${SCENE_VIEWPORT_LOCK} isolate`}
      style={{
        backgroundColor: "#C5DCEF",
        backgroundImage:
          "linear-gradient(175deg, #F7FBFE 0%, #E4EEF7 38%, #C5DCEF 72%, #A8D0EA 100%)",
      }}
    >
      <HeartDefs />

      <style>{`
        @keyframes sky-heart-fall {
          0% {
            transform: translate3d(0, calc(var(--sy) * 1vh), 0) rotate(var(--hr)) scale(0.86);
            opacity: 0;
          }
          10% {
            opacity: var(--ho);
          }
          100% {
            transform: translate3d(var(--hs), 118vh, 0) rotate(var(--hre)) scale(1);
            opacity: var(--ho);
          }
        }
        @keyframes sky-heart-fall-reduced {
          0%, 100% {
            transform: translate3d(0, 14vh, 0) rotate(var(--hr)) scale(1);
            opacity: var(--ho);
          }
        }
        @keyframes sky-spark {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50% { opacity: 0.95; transform: scale(1.15); }
        }
      `}</style>

      {/* Cinematic sky atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background: `
            radial-gradient(ellipse 90% 55% at 50% 0%, rgba(255,255,255,0.95) 0%, transparent 58%),
            radial-gradient(ellipse 45% 40% at 18% 35%, rgba(255,255,255,0.4) 0%, transparent 55%),
            radial-gradient(ellipse 50% 45% at 82% 55%, rgba(142,191,222,0.35) 0%, transparent 60%)
          `,
        }}
      />

      {/* Sparkle dust */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[3]">
        {[
          { t: "10%", l: "14%", s: 5, d: "0s" },
          { t: "18%", l: "72%", s: 4, d: "0.4s" },
          { t: "28%", l: "48%", s: 6, d: "0.8s" },
          { t: "42%", l: "22%", s: 3, d: "0.2s" },
          { t: "55%", l: "86%", s: 5, d: "1.1s" },
          { t: "68%", l: "38%", s: 4, d: "0.6s" },
          { t: "14%", l: "58%", s: 3, d: "1.4s" },
          { t: "36%", l: "8%", s: 4, d: "0.9s" },
        ].map((sp, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              top: sp.t,
              left: sp.l,
              width: sp.s,
              height: sp.s,
              boxShadow: "0 0 12px 3px rgba(255,255,255,0.75)",
              animation: reduceMotion
                ? undefined
                : `sky-spark ${1.8 + (i % 3) * 0.3}s ease-in-out ${sp.d} infinite`,
              opacity: reduceMotion ? 0.45 : undefined,
            }}
          />
        ))}
      </div>

      {/* Love rain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[5] overflow-hidden"
      >
        {HEARTS.map((heart, i) => (
          <div
            key={i}
            className="absolute top-0"
            style={{
              left: heart.left,
              width: `${heart.sizeVmin}vmin`,
              zIndex: heart.z,
              ["--hr" as string]: `${heart.rotate}deg`,
              ["--hre" as string]: `${heart.rotateEnd}deg`,
              ["--hs" as string]: `${heart.sway}px`,
              ["--ho" as string]: String(heart.opacity),
              ["--sy" as string]: String(heart.startY),
              animationName: reduceMotion
                ? "sky-heart-fall-reduced"
                : "sky-heart-fall",
              animationDuration: reduceMotion ? "0.01s" : `${heart.duration}s`,
              animationDelay: reduceMotion ? "0s" : `${heart.delay}s`,
              animationTimingFunction: reduceMotion
                ? "linear"
                : "cubic-bezier(0.4, 0, 0.65, 0.35)",
              animationFillMode: "both",
            }}
          >
            <LoveHeart
              tone={heart.tone}
              hero={heart.hero}
              className="h-auto w-full"
            />
          </div>
        ))}
      </div>

      {/* Soft bottom mist — hearts feel like they land in cloud */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[6] h-[28%]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(232,242,250,0.45) 45%, rgba(197,220,239,0.75) 100%)",
        }}
      />

      <motion.p
        className="pointer-events-none absolute inset-x-0 bottom-[15%] z-[8] px-6 text-center font-serif text-lg tracking-wide italic sm:text-xl"
        style={{
          color: "#3D7AAD",
          textShadow:
            "0 1px 0 rgba(255,255,255,0.8), 0 8px 24px rgba(126,182,217,0.35)",
        }}
        initial={{ opacity: 0, y: 12, letterSpacing: "0.02em" }}
        animate={
          reduceMotion
            ? { opacity: 0.9, y: 0 }
            : {
                opacity: [0, 0.1, 1, 0.92, 0],
                y: [12, 8, 0, 0, -6],
                letterSpacing: [
                  "0.02em",
                  "0.04em",
                  "0.06em",
                  "0.05em",
                  "0.04em",
                ],
              }
        }
        transition={{
          duration: reduceMotion ? 0.35 : 1.9,
          ease: [0.22, 0.85, 0.28, 1],
        }}
      >
        Love, falling like rain…
      </motion.p>
    </div>
  );
}
