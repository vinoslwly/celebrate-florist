"use client";

import { useEffect, useState, type CSSProperties } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import type { SkyConnectionLabQuestion } from "@/features/theme-lab/config/sky-connection-fixtures";

type SkyConnectionQuizQuestionSceneProps = SkyConnectionSceneProps & {
  question: SkyConnectionLabQuestion;
  questionIndex: number;
  totalQuestions: number;
};

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const GOLD = "#FFE8A0";
const PAPER = "#E8F2FA";
const EASE = [0.22, 1, 0.36, 1] as const;
const SELECT_ADVANCE_MS = 380;

const FALL_STARS = [
  { left: "10%", delay: "0s", duration: "10s", size: 10, drift: "10px" },
  { left: "48%", delay: "2.8s", duration: "9s", size: 8, drift: "-8px" },
  { left: "82%", delay: "1.4s", duration: "10.5s", size: 11, drift: "12px" },
] as const;

const SPARKLES = [
  { top: "18%", left: "20%", size: 4, delay: "0s" },
  { top: "24%", left: "76%", size: 5, delay: "0.7s" },
  { top: "52%", left: "14%", size: 4, delay: "1.2s" },
  { top: "58%", left: "84%", size: 5, delay: "0.35s" },
  { top: "72%", left: "48%", size: 3.5, delay: "0.9s" },
] as const;

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill="none">
      <path
        d="M3.5 8.2 L6.6 11.2 L12.5 4.8"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SoftStar({
  className,
  fill = SKY,
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

function FivePointStar({
  className,
  fill,
}: {
  className?: string;
  fill: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={fill}>
      <path d="M12 2.2 14.6 9.1 22 9.5 16.4 14.2 18.2 21.5 12 17.6 5.8 21.5 7.6 14.2 2 9.5 9.4 9.1Z" />
    </svg>
  );
}

/**
 * Full-bleed sky paper plate — painterly washes + soft cloud banks.
 * CSS/SVG only (no photo, no cartoon stickers) — mobile-light.
 */
function SkyQuizAtmospherePlate({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sqqSkyWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7FBFE" />
          <stop offset="38%" stopColor="#D6EAF6" />
          <stop offset="72%" stopColor="#B8DCF0" />
          <stop offset="100%" stopColor="#9EC9E6" />
        </linearGradient>
        <radialGradient id="sqqSunBloom" cx="12%" cy="8%" r="55%">
          <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#FFE8A0" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFE8A0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sqqMistCenter" cx="50%" cy="36%" r="48%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sqqCloudBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      <rect width="390" height="844" fill="url(#sqqSkyWash)" />
      <rect width="390" height="844" fill="url(#sqqSunBloom)" />
      <rect width="390" height="844" fill="url(#sqqMistCenter)" />

      {/* Soft painterly mid-sky washes */}
      <ellipse
        cx="70"
        cy="210"
        rx="120"
        ry="70"
        fill="#FFFFFF"
        opacity="0.28"
      />
      <ellipse
        cx="320"
        cy="180"
        rx="110"
        ry="64"
        fill="#FFFFFF"
        opacity="0.22"
      />
      <ellipse
        cx="195"
        cy="290"
        rx="160"
        ry="50"
        fill="#E8F4FC"
        opacity="0.45"
      />

      {/* Upper cloud bank — soft layered forms */}
      <g opacity="0.92">
        <ellipse cx="40" cy="90" rx="70" ry="28" fill="#FFFFFF" />
        <ellipse cx="95" cy="78" rx="55" ry="32" fill="#FFFFFF" />
        <ellipse
          cx="150"
          cy="92"
          rx="48"
          ry="24"
          fill="#FFFEFB"
          opacity="0.9"
        />
        <ellipse cx="280" cy="70" rx="65" ry="30" fill="#FFFFFF" />
        <ellipse
          cx="340"
          cy="82"
          rx="58"
          ry="26"
          fill="#FFFEFB"
          opacity="0.88"
        />
        <ellipse
          cx="360"
          cy="100"
          rx="50"
          ry="22"
          fill="#FFFFFF"
          opacity="0.75"
        />
      </g>

      {/* Mid floating cloud wisps */}
      <g opacity="0.55">
        <ellipse cx="50" cy="360" rx="80" ry="22" fill="#FFFFFF" />
        <ellipse cx="110" cy="352" rx="45" ry="18" fill="#FFFFFF" />
        <ellipse cx="300" cy="400" rx="70" ry="20" fill="#FFFFFF" />
        <ellipse cx="350" cy="392" rx="40" ry="16" fill="#FFFFFF" />
      </g>

      {/* Bottom cloud bed — dense, Founder-like horizon */}
      <rect y="620" width="390" height="224" fill="url(#sqqCloudBand)" />
      <g opacity="0.97">
        <ellipse cx="30" cy="700" rx="90" ry="48" fill="#FFFFFF" />
        <ellipse cx="110" cy="680" rx="75" ry="52" fill="#FFFEFB" />
        <ellipse cx="200" cy="710" rx="95" ry="55" fill="#FFFFFF" />
        <ellipse cx="290" cy="685" rx="80" ry="50" fill="#FFFEFB" />
        <ellipse cx="370" cy="705" rx="70" ry="45" fill="#FFFFFF" />
        <ellipse cx="60" cy="760" rx="100" ry="55" fill="#FFFFFF" />
        <ellipse cx="180" cy="780" rx="110" ry="60" fill="#FFFEFB" />
        <ellipse cx="320" cy="770" rx="95" ry="58" fill="#FFFFFF" />
      </g>

      {/* Soft paper edge vignette */}
      <rect
        width="390"
        height="844"
        fill="url(#sqqMistCenter)"
        opacity="0.35"
      />
    </svg>
  );
}

/** Soft torn paper flap — ambient scrapbook depth, not a sticker. */
function PaperFlap({
  className,
  flip,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      className={`${className ?? ""}${flip ? " -scale-x-100" : ""}`}
      style={{
        background:
          "linear-gradient(145deg, rgba(255,254,251,0.95) 0%, rgba(232,244,252,0.75) 55%, rgba(197,220,239,0.35) 100%)",
        clipPath:
          "polygon(0 0, 100% 0, 92% 18%, 100% 38%, 88% 58%, 100% 78%, 70% 100%, 0 100%)",
        boxShadow: "0 12px 28px -16px rgba(30,58,95,0.28)",
      }}
      aria-hidden
    />
  );
}

function GlossyHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 32" className={className} aria-hidden>
      <defs>
        <linearGradient id="sqqGlossHeart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8D8F0" />
          <stop offset="55%" stopColor="#5A9BC4" />
          <stop offset="100%" stopColor="#3D7AAD" />
        </linearGradient>
      </defs>
      <path
        d="M18 29C18 29 3 18 3 11C3 6.5 7 4 11 4C14 4 16.5 5.8 18 8.5C19.5 5.8 22 4 25 4C29 4 33 6.5 33 11C33 18 18 29 18 29Z"
        fill="url(#sqqGlossHeart)"
        stroke="#FFFFFF"
        strokeWidth="1.3"
      />
      <ellipse cx="11.5" cy="10" rx="3.5" ry="2" fill="white" opacity="0.55" />
    </svg>
  );
}

function NotebookClip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 100" className={className} aria-hidden fill="none">
      <rect
        x="10"
        y="18"
        width="64"
        height="74"
        rx="4"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1.3"
        transform="rotate(-6 42 55)"
      />
      {[32, 42, 52, 62, 72].map((y) => (
        <line
          key={y}
          x1="18"
          y1={y}
          x2="64"
          y2={y}
          stroke="#C5DCEF"
          strokeWidth="1"
          transform="rotate(-6 42 55)"
        />
      ))}
      <path
        d="M28 48 C26 42 30 38 36 40 C40 34 48 36 48 44 C52 40 58 44 54 52 C48 60 36 58 28 48Z"
        fill={SKY_DEEP}
        opacity="0.95"
        transform="rotate(-6 42 55)"
      />
      <text
        x="42"
        y="82"
        textAnchor="middle"
        fill={INK_SOFT}
        fontSize="6"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        transform="rotate(-6 42 55)"
      >
        Every moment is
      </text>
      <text
        x="42"
        y="90"
        textAnchor="middle"
        fill={INK_SOFT}
        fontSize="6"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        transform="rotate(-6 42 55)"
      >
        a reason to celebrate.
      </text>
      <path
        d="M48 8 C56 8 60 14 60 22 L60 40 C60 48 54 52 48 52 C42 52 36 48 36 40 L36 18"
        stroke={SKY}
        strokeWidth="3.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function PolaroidMini({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 68 78" className={className} aria-hidden fill="none">
      <rect
        x="6"
        y="10"
        width="50"
        height="58"
        rx="3"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1.3"
        transform="rotate(7 31 39)"
      />
      <rect
        x="11"
        y="15"
        width="40"
        height="36"
        fill="#B8DCF0"
        transform="rotate(7 31 39)"
      />
      <ellipse
        cx="24"
        cy="26"
        rx="10"
        ry="5"
        fill="white"
        opacity="0.88"
        transform="rotate(7 31 39)"
      />
      <ellipse
        cx="38"
        cy="30"
        rx="7"
        ry="3.5"
        fill="white"
        opacity="0.7"
        transform="rotate(7 31 39)"
      />
      {/* Checkered washi */}
      <g transform="rotate(12 31 8)">
        <rect
          x="16"
          y="2"
          width="28"
          height="11"
          rx="1"
          fill="#A8D0E8"
          opacity="0.7"
        />
        <rect
          x="16"
          y="2"
          width="7"
          height="5.5"
          fill="#5A9BC4"
          opacity="0.55"
        />
        <rect
          x="30"
          y="2"
          width="7"
          height="5.5"
          fill="#5A9BC4"
          opacity="0.55"
        />
        <rect
          x="23"
          y="7.5"
          width="7"
          height="5.5"
          fill="#5A9BC4"
          opacity="0.55"
        />
        <rect
          x="37"
          y="7.5"
          width="7"
          height="5.5"
          fill="#5A9BC4"
          opacity="0.55"
        />
      </g>
    </svg>
  );
}

function SilkBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 36" className={className} aria-hidden fill="none">
      <path d="M24 18 C14 6 4 10 8 20 C12 28 20 24 24 18Z" fill={SKY_DEEP} />
      <path d="M24 18 C34 6 44 10 40 20 C36 28 28 24 24 18Z" fill={SKY} />
      <circle
        cx="24"
        cy="18"
        r="4.5"
        fill="#A8D0E8"
        stroke={INK_SOFT}
        strokeWidth="1"
      />
      <path
        d="M22 22 L18 34 M26 22 L30 34"
        stroke={SKY_DEEP}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InstantCamera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 68 52" className={className} aria-hidden fill="none">
      <rect x="6" y="14" width="56" height="32" rx="7" fill={SKY_DEEP} />
      <rect x="10" y="18" width="48" height="24" rx="5" fill="#4A8BB8" />
      <circle
        cx="34"
        cy="30"
        r="11"
        fill="#E8F4FC"
        stroke={INK}
        strokeWidth="1.5"
      />
      <circle cx="34" cy="30" r="6.5" fill={SKY} />
      <circle cx="34" cy="30" r="2.6" fill={INK} />
      <rect x="44" y="8" width="12" height="7" rx="2" fill={SKY} />
      <circle cx="15" cy="22" r="2.2" fill={GOLD} />
    </svg>
  );
}

function SmilingCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 40" className={className} aria-hidden fill="none">
      <ellipse cx="18" cy="24" rx="14" ry="10" fill={SKY} />
      <ellipse cx="32" cy="18" rx="16" ry="12" fill={SKY} />
      <ellipse cx="44" cy="24" rx="12" ry="9" fill={SKY} />
      <circle cx="26" cy="20" r="1.6" fill={INK} />
      <circle cx="36" cy="20" r="1.6" fill={INK} />
      <path
        d="M27 26 Q31 29 35 26"
        stroke={INK}
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function LinedHeartNote({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 56" className={className} aria-hidden fill="none">
      <rect
        x="6"
        y="8"
        width="48"
        height="40"
        rx="3"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1.2"
        transform="rotate(8 30 28)"
      />
      {[18, 26, 34].map((y) => (
        <line
          key={y}
          x1="12"
          y1={y}
          x2="48"
          y2={y}
          stroke="#C5DCEF"
          strokeWidth="1"
          transform="rotate(8 30 28)"
        />
      ))}
      <path
        d="M30 36 C22 30 20 24 23 20 C25 17 29 17 30 20 C31 17 35 17 37 20 C40 24 38 30 30 36Z"
        fill={SKY_DEEP}
        transform="rotate(8 30 28)"
      />
    </svg>
  );
}

/**
 * sky.connection.quiz.question.{n} — living Founder Scene 6 (polished).
 * Premium sky paper atmosphere · star progress · tap-to-advance · mobile-light.
 */
export function SkyConnectionQuizQuestionScene({
  question,
  questionIndex,
  totalQuestions,
  onComplete,
}: SkyConnectionQuizQuestionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Host remounts this scene per question (`AnimatePresence` key = sceneId),
  // so selectedIndex resets without an effect.

  useEffect(() => {
    if (selectedIndex == null) return;
    const t = window.setTimeout(() => onComplete(), SELECT_ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [selectedIndex, onComplete]);

  function handleSelect(index: number) {
    if (selectedIndex != null) return;
    setSelectedIndex(index);
  }

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ backgroundColor: PAPER }}>
      <style>{`
        @keyframes sqq-node-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(61, 122, 173, 0.4), 0 0 0 3px rgba(255,255,255,0.95); }
          50% { box-shadow: 0 0 0 12px rgba(61, 122, 173, 0), 0 0 0 3px rgba(255,255,255,0.95); }
        }
        @keyframes sqq-bob {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--sqq-rot, 0deg)); }
          50% { transform: translate3d(0, -6px, 0) rotate(var(--sqq-rot, 0deg)); }
        }
        @keyframes sqq-sparkle {
          0%, 100% { opacity: 0.2; transform: scale(0.75); }
          50% { opacity: 1; transform: scale(1.3); }
        }
        @keyframes sqq-star-fall {
          0% { transform: translate3d(0, -6%, 0) rotate(0deg); opacity: 0; }
          12% { opacity: 0.85; }
          88% { opacity: 0.75; }
          100% { transform: translate3d(var(--sqq-drift), 110vh, 0) rotate(48deg); opacity: 0; }
        }
        @keyframes sqq-glow-breathe {
          0%, 100% { opacity: 0.45; transform: translate(-50%, -50%) scale(0.96); }
          50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.06); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sqq-node-current, .sqq-anim-bob, .sqq-anim-sparkle, .sqq-anim-fall, .sqq-anim-glow {
            animation: none !important;
          }
        }
      `}</style>

      {/* Premium sky paper plate — painterly washes + cloud banks */}
      <SkyQuizAtmospherePlate className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      {/* Soft linen fiber */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] opacity-[0.045] mix-blend-multiply"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 3px, rgba(30,58,95,0.07) 3px 4px), repeating-linear-gradient(0deg, transparent 0 4px, rgba(30,58,95,0.04) 4px 5px)",
        }}
      />

      {/* Soft torn paper flaps — ambient depth, not stickers */}
      <PaperFlap className="pointer-events-none absolute top-0 left-0 z-[2] h-36 w-28 opacity-90 sm:h-44 sm:w-36" />
      <PaperFlap
        flip
        className="pointer-events-none absolute top-0 right-0 z-[2] h-32 w-24 opacity-80 sm:h-40 sm:w-32"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 z-[2] h-40 w-36 opacity-75 sm:h-48 sm:w-44"
        style={{
          background:
            "linear-gradient(320deg, rgba(255,254,251,0.9) 0%, rgba(214,234,246,0.55) 50%, transparent 78%)",
          clipPath:
            "polygon(100% 20%, 100% 100%, 0 100%, 18% 78%, 8% 55%, 22% 35%)",
        }}
      />

      {/* Soft bloom behind question cluster */}
      <div
        aria-hidden
        className="sqq-anim-glow pointer-events-none absolute top-[36%] left-1/2 z-[3] h-[48vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.88) 0%, rgba(184,220,240,0.35) 42%, transparent 70%)",
          animation: reduceMotion
            ? undefined
            : "sqq-glow-breathe 3.4s ease-in-out infinite",
          willChange: reduceMotion ? undefined : "transform, opacity",
        }}
      />

      {/* Refined corner accents — few, Founder-aligned */}
      <div
        aria-hidden
        className="sqq-anim-bob pointer-events-none absolute top-[7%] left-[1%] z-[5] sm:left-[4%]"
        style={
          {
            ["--sqq-rot"]: "-6deg",
            animation: reduceMotion
              ? undefined
              : "sqq-bob 4.2s ease-in-out infinite",
          } as CSSProperties
        }
      >
        <NotebookClip className="relative h-[5.75rem] w-[5rem] drop-shadow-[0_14px_24px_rgba(30,58,95,0.22)] sm:h-28 sm:w-24" />
        <GlossyHeart className="absolute top-9 left-6 h-8 w-9 drop-shadow-md sm:h-9 sm:w-10" />
      </div>

      <div
        aria-hidden
        className="sqq-anim-bob pointer-events-none absolute top-[7%] right-[1%] z-[5] sm:right-[4%]"
        style={
          {
            ["--sqq-rot"]: "7deg",
            animation: reduceMotion
              ? undefined
              : "sqq-bob 3.8s ease-in-out 0.35s infinite",
          } as CSSProperties
        }
      >
        <PolaroidMini className="h-[4.75rem] w-[4.25rem] drop-shadow-[0_14px_24px_rgba(30,58,95,0.22)] sm:h-24 sm:w-20" />
        <SilkBow className="absolute -bottom-2 left-1 h-7 w-9 drop-shadow-sm sm:h-8 sm:w-10" />
      </div>

      <div
        aria-hidden
        className="sqq-anim-bob pointer-events-none absolute bottom-[8%] left-[3%] z-[5] sm:left-[7%]"
        style={
          {
            ["--sqq-rot"]: "-4deg",
            animation: reduceMotion
              ? undefined
              : "sqq-bob 4.5s ease-in-out 0.5s infinite",
          } as CSSProperties
        }
      >
        <InstantCamera className="relative h-11 w-16 drop-shadow-[0_12px_20px_rgba(30,58,95,0.25)] sm:h-12 sm:w-[4.75rem]" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-[3%] bottom-[7%] z-[5] sm:right-[7%]"
      >
        <LinedHeartNote className="h-14 w-16 rotate-[8deg] drop-shadow-[0_10px_18px_rgba(30,58,95,0.18)] sm:h-16 sm:w-[4.5rem]" />
        <SmilingCloud className="absolute -top-4 right-0 h-9 w-12 drop-shadow-sm sm:h-10 sm:w-14" />
      </div>

      {/* Soft sparkles only */}
      {!reduceMotion ? (
        <div aria-hidden className="pointer-events-none absolute inset-0 z-[4]">
          {SPARKLES.map((s, i) => (
            <span
              key={i}
              className="sqq-anim-sparkle absolute rounded-full bg-white"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 10px rgba(255,255,255,0.95)",
                animation: `sqq-sparkle 2.3s ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
        </div>
      ) : null}

      {/* Falling gold stars — 3 only */}
      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[3] overflow-hidden"
        >
          {FALL_STARS.map((star, i) => (
            <div
              key={i}
              className="sqq-anim-fall absolute"
              style={
                {
                  left: star.left,
                  top: 0,
                  width: star.size,
                  height: star.size,
                  ["--sqq-drift"]: star.drift,
                  animation: `sqq-star-fall ${star.duration} linear ${star.delay} infinite`,
                  willChange: "transform, opacity",
                } as CSSProperties
              }
            >
              <SoftStar className="h-full w-full" fill={GOLD} />
            </div>
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col px-5 pt-10 pb-16 sm:px-8 sm:pt-12 sm:pb-20">
        {/* Progress */}
        <motion.div
          className="mx-auto w-full max-w-sm"
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div className="mb-3 flex flex-col items-center gap-1">
            <p
              className="text-center font-sans text-[11px] font-bold tracking-[0.32em] uppercase"
              style={{ color: INK_SOFT }}
            >
              Progress
            </p>
            <p
              className="font-serif text-[13px] font-semibold tracking-wide"
              style={{ color: "rgba(30,58,95,0.72)" }}
            >
              Question {questionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div
            className="relative flex items-center justify-between px-0.5"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={totalQuestions}
            aria-valuenow={questionIndex + 1}
            aria-label={`Question ${questionIndex + 1} of ${totalQuestions}`}
          >
            <div
              aria-hidden
              className="absolute top-1/2 right-4 left-4 h-[2.5px] -translate-y-1/2 rounded-full"
              style={{ backgroundColor: "rgba(61,122,173,0.28)" }}
            />
            {Array.from({ length: totalQuestions }, (_, i) => {
              const done = i < questionIndex;
              const current = i === questionIndex;
              return (
                <div
                  key={i}
                  className="relative z-10 flex h-11 w-11 items-center justify-center"
                >
                  <div
                    className={
                      current
                        ? "sqq-node-current flex h-10 w-10 items-center justify-center rounded-full"
                        : done
                          ? "flex h-8 w-8 items-center justify-center rounded-full"
                          : "flex h-8 w-8 items-center justify-center rounded-full border-2"
                    }
                    style={
                      current
                        ? {
                            backgroundColor: SKY_DEEP,
                            boxShadow:
                              "0 4px 14px -4px rgba(30,58,95,0.5), 0 0 0 3px rgba(255,255,255,0.95)",
                            animation: reduceMotion
                              ? undefined
                              : "sqq-node-pulse 2.2s ease-in-out infinite",
                          }
                        : done
                          ? {
                              backgroundColor: SKY,
                              boxShadow: "0 2px 8px -3px rgba(30,58,95,0.35)",
                            }
                          : {
                              borderColor: "rgba(61,122,173,0.35)",
                              backgroundColor: "rgba(255,255,255,0.95)",
                            }
                    }
                  >
                    {done ? (
                      <CheckIcon className="h-3.5 w-3.5" />
                    ) : current ? (
                      <FivePointStar className="h-4 w-4" fill="#FFFFFF" />
                    ) : (
                      <span
                        className="font-serif text-[11px] font-semibold"
                        style={{ color: "rgba(61,122,173,0.4)" }}
                      >
                        {i + 1}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Question — soft paper card for emotional weight */}
        <motion.div
          className="mx-auto mt-7 w-full max-w-md text-center sm:mt-9"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: EASE }}
        >
          <div
            className="mx-auto rounded-[1.35rem] px-4 py-4 sm:px-6 sm:py-5"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(247,251,254,0.82) 100%)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.85) inset, 0 14px 32px -18px rgba(30,58,95,0.28)",
              border: "1px solid rgba(126,182,217,0.28)",
            }}
          >
            <h1
              className="font-serif text-[1.55rem] leading-[1.25] font-semibold sm:text-[1.9rem]"
              style={{ color: INK }}
            >
              {question.prompt}
            </h1>
            <div
              className="mt-4 flex items-center justify-center gap-3"
              style={{ color: SKY }}
              aria-hidden
            >
              <span className="h-px w-11 bg-current opacity-60" />
              <SoftStar className="h-3.5 w-3.5" fill={SKY_DEEP} />
              <span className="h-px w-11 bg-current opacity-60" />
            </div>
          </div>
        </motion.div>

        {/* Answers */}
        <ul className="mx-auto mt-6 flex w-full max-w-md flex-col gap-2.5 sm:mt-8 sm:gap-3">
          {question.options.map((option, index) => {
            const selected = selectedIndex === index;
            return (
              <motion.li
                key={`${question.sortOrder}-${option}`}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : 0.12 + index * 0.05,
                  ease: EASE,
                }}
              >
                <motion.button
                  type="button"
                  disabled={selectedIndex != null}
                  onClick={() => handleSelect(index)}
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-[border-color,box-shadow,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6BA3C9]/50 disabled:opacity-90 sm:gap-3.5 sm:px-5 sm:py-[15px]"
                  style={
                    selected
                      ? {
                          backgroundColor: "rgba(214,234,246,0.98)",
                          border: `2px dashed ${SKY_DEEP}`,
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,0.75) inset, 0 10px 24px -10px rgba(30,58,95,0.35)",
                        }
                      : {
                          backgroundColor: "rgba(255,255,255,0.96)",
                          border: "1px solid rgba(126,182,217,0.32)",
                          boxShadow:
                            "0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 18px -14px rgba(30,58,95,0.18)",
                        }
                  }
                  aria-pressed={selected}
                  animate={
                    selected && !reduceMotion ? { scale: 1.02 } : { scale: 1 }
                  }
                  transition={{ duration: 0.22, ease: EASE }}
                  whileTap={
                    selectedIndex == null ? { scale: 0.985 } : undefined
                  }
                >
                  <FivePointStar
                    className="h-[18px] w-[18px] shrink-0"
                    fill={selected ? SKY_DEEP : SKY}
                  />
                  <span
                    className="flex-1 font-serif text-[0.98rem] sm:text-lg"
                    style={{ color: INK }}
                  >
                    {option}
                  </span>
                  {selected ? (
                    <motion.span
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
                      style={{ backgroundColor: SKY_DEEP }}
                      aria-hidden
                      initial={
                        reduceMotion ? false : { scale: 0.6, opacity: 0 }
                      }
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <CheckIcon className="h-3.5 w-3.5" />
                    </motion.span>
                  ) : null}
                </motion.button>
              </motion.li>
            );
          })}
        </ul>

        <motion.p
          className="mx-auto mt-7 flex items-center justify-center gap-2 text-center font-serif text-[13px] italic sm:mt-8 sm:text-sm"
          style={{ color: "rgba(30,58,95,0.68)" }}
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <SoftStar className="h-3.5 w-3.5 shrink-0" fill={SKY_DEEP} />
          Choose the answer you think is right
          <span aria-hidden className="text-[#7EB6D9]">
            ♥
          </span>
        </motion.p>
      </div>
    </div>
  );
}
