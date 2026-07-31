"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import {
  SKY_CONNECTION_LAB_SCORE_RESULT,
  type SkyConnectionLabScoreResult,
} from "@/features/theme-lab/config/sky-connection-fixtures";

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const DENIM = "#4A7BA8";
const GOLD = "#FFE8A0";
const CREAM = "#FFFEFB";
const EASE = [0.22, 1, 0.36, 1] as const;

type SkyConnectionScoreRevealSceneProps = SkyConnectionSceneProps & {
  scoreResult?: SkyConnectionLabScoreResult;
};

const FIELD_STARS = [
  { top: "12%", left: "14%", size: 10, fill: GOLD, rotate: -10 },
  { top: "18%", right: "12%", size: 9, fill: "#FFFFFF", rotate: 16 },
  { top: "34%", left: "6%", size: 8, fill: SKY, rotate: 8 },
  { top: "40%", right: "5%", size: 11, fill: GOLD, rotate: -14 },
  { top: "68%", left: "10%", size: 9, fill: "#FFFFFF", rotate: 12 },
  { top: "72%", right: "11%", size: 10, fill: SKY_DEEP, rotate: -8 },
] as const;

function useCountUp(target: number, enabled: boolean, durationMs = 900) {
  const [value, setValue] = useState(() => (enabled ? 0 : target));

  useEffect(() => {
    if (!enabled) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, enabled, durationMs]);

  return enabled ? value : target;
}

/** Painterly sky — celebratory, not flat. */
function SkyRevealAtmospherePlate({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="ssrSkyWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAF6FD" />
          <stop offset="28%" stopColor="#BFE0F4" />
          <stop offset="62%" stopColor="#8EC4E4" />
          <stop offset="100%" stopColor="#6BA8D0" />
        </linearGradient>
        <radialGradient id="ssrSun" cx="18%" cy="8%" r="45%">
          <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#FFE8A0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFE8A0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ssrCenterLift" cx="50%" cy="42%" r="48%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.72" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <pattern
          id="ssrGrain"
          width="110"
          height="110"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="10" cy="16" r="0.65" fill="#1E3A5F" opacity="0.045" />
          <circle cx="48" cy="40" r="0.5" fill="#1E3A5F" opacity="0.04" />
          <circle cx="82" cy="24" r="0.6" fill="#1E3A5F" opacity="0.04" />
          <circle cx="28" cy="78" r="0.55" fill="#1E3A5F" opacity="0.04" />
          <circle cx="70" cy="92" r="0.5" fill="#1E3A5F" opacity="0.035" />
        </pattern>
      </defs>

      <rect width="390" height="844" fill="url(#ssrSkyWash)" />
      <rect width="390" height="844" fill="url(#ssrSun)" />
      <rect width="390" height="844" fill="url(#ssrCenterLift)" />
      <rect width="390" height="844" fill="url(#ssrGrain)" />

      <ellipse
        cx="50"
        cy="190"
        rx="120"
        ry="70"
        fill="#FFFFFF"
        opacity="0.28"
      />
      <ellipse
        cx="340"
        cy="160"
        rx="110"
        ry="64"
        fill="#FFFFFF"
        opacity="0.22"
      />
      <ellipse
        cx="195"
        cy="280"
        rx="155"
        ry="50"
        fill="#D6EAF6"
        opacity="0.4"
      />

      <g opacity="0.95">
        <ellipse cx="28" cy="80" rx="70" ry="28" fill="#FFFFFF" />
        <ellipse cx="90" cy="68" rx="56" ry="32" fill="#FFFFFF" />
        <ellipse
          cx="155"
          cy="84"
          rx="48"
          ry="24"
          fill="#FFFEFB"
          opacity="0.92"
        />
        <ellipse cx="280" cy="62" rx="66" ry="30" fill="#FFFFFF" />
        <ellipse
          cx="350"
          cy="78"
          rx="56"
          ry="26"
          fill="#FFFEFB"
          opacity="0.9"
        />
      </g>

      <g opacity="0.55">
        <ellipse cx="40" cy="400" rx="80" ry="22" fill="#FFFFFF" />
        <ellipse cx="100" cy="390" rx="44" ry="16" fill="#FFFFFF" />
        <ellipse cx="310" cy="430" rx="72" ry="20" fill="#FFFFFF" />
      </g>

      <g opacity="0.97">
        <ellipse cx="20" cy="760" rx="100" ry="55" fill="#FFFFFF" />
        <ellipse cx="120" cy="740" rx="90" ry="58" fill="#FFFEFB" />
        <ellipse cx="230" cy="770" rx="105" ry="60" fill="#FFFFFF" />
        <ellipse cx="340" cy="750" rx="90" ry="55" fill="#FFFEFB" />
        <ellipse cx="80" cy="820" rx="110" ry="50" fill="#FFFFFF" />
        <ellipse cx="260" cy="830" rx="120" ry="55" fill="#FFFEFB" />
      </g>
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

function SoftCloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 64" className={className} aria-hidden fill="none">
      <ellipse cx="46" cy="40" rx="36" ry="18" fill="white" opacity="0.94" />
      <ellipse cx="84" cy="32" rx="34" ry="24" fill="white" opacity="0.98" />
      <ellipse cx="122" cy="40" rx="30" ry="17" fill="white" opacity="0.92" />
    </svg>
  );
}

function GridPaperScrap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" className={className} aria-hidden fill="none">
      <path
        d="M6 8 C20 2 50 4 78 10 C86 12 88 22 84 34 L76 62 C74 68 64 70 50 68 L12 60 C4 58 2 44 6 8Z"
        fill="#FFFEFB"
        stroke="#C5DCEF"
        strokeWidth="1.1"
      />
      {[18, 28, 38, 48].map((y) => (
        <line
          key={`h${y}`}
          x1="14"
          y1={y}
          x2="74"
          y2={y}
          stroke="#B8D4E8"
          strokeWidth="0.7"
          opacity="0.7"
        />
      ))}
      {[22, 34, 46, 58].map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="14"
          x2={x}
          y2="56"
          stroke="#B8D4E8"
          strokeWidth="0.7"
          opacity="0.55"
        />
      ))}
    </svg>
  );
}

function WashiTape({ className }: { className?: string }) {
  const pid = `ssr-washi-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 120 28" className={className} aria-hidden fill="none">
      <defs>
        <pattern id={pid} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#F4FAFE" />
          <rect width="4" height="4" fill="#6BA3C9" opacity="0.5" />
          <rect x="4" y="4" width="4" height="4" fill="#6BA3C9" opacity="0.5" />
        </pattern>
      </defs>
      <rect x="2" y="4" width="116" height="20" rx="2" fill={`url(#${pid})`} />
      <rect
        x="2"
        y="4"
        width="116"
        height="20"
        rx="2"
        fill="none"
        stroke="#A8C8E0"
        strokeWidth="0.8"
        opacity="0.6"
      />
    </svg>
  );
}

function SoftBlooms({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden fill="none">
      <path
        d="M36 62 C34 48 28 36 22 28"
        stroke="#8FB8D4"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M36 58 C38 46 46 34 54 28"
        stroke="#8FB8D4"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {(
        [
          [20, 24, 5],
          [28, 20, 4.2],
          [36, 18, 5.5],
          [46, 22, 4.5],
          [54, 26, 4],
          [16, 34, 3.5],
          [42, 30, 3.8],
        ] as const
      ).map(([cx, cy, r], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill="#FFFEFB" opacity="0.95" />
          <circle
            cx={cx - r * 0.2}
            cy={cy - r * 0.2}
            r={r * 0.35}
            fill="#E8F4FC"
            opacity="0.8"
          />
        </g>
      ))}
    </svg>
  );
}

/** Denim heart with stitch + button — Founder scrapbook, not clipart. */
function DenimHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 58" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="ssrDenimHeart" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6BA3C9" />
          <stop offset="55%" stopColor="#4A7BA8" />
          <stop offset="100%" stopColor="#3D6A94" />
        </linearGradient>
      </defs>
      <path
        d="M32 52C32 52 6 34 6 18C6 9 14 4 22 4C27 4 30 7 32 11C34 7 37 4 42 4C50 4 58 9 58 18C58 34 32 52 32 52Z"
        fill="url(#ssrDenimHeart)"
      />
      <path
        d="M32 48C32 48 12 33 12 20C12 13 17 10 22 10C26 10 29 12 32 16C35 12 38 10 42 10C47 10 52 13 52 20C52 33 32 48 32 48Z"
        fill="none"
        stroke="#E8F4FC"
        strokeWidth="1.4"
        strokeDasharray="3 2.5"
        opacity="0.85"
      />
      <circle cx="32" cy="24" r="7" fill="#FFFEFB" />
      <circle cx="29.5" cy="21.5" r="1.1" fill={DENIM} />
      <circle cx="34.5" cy="21.5" r="1.1" fill={DENIM} />
      <circle cx="29.5" cy="26.5" r="1.1" fill={DENIM} />
      <circle cx="34.5" cy="26.5" r="1.1" fill={DENIM} />
    </svg>
  );
}

function DenimStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="ssrDenimStar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5A9BC4" />
          <stop offset="100%" stopColor="#3D6A94" />
        </linearGradient>
      </defs>
      <path
        d="M28 4 L33.5 20 L50 20.5 L36.5 30.5 L41.5 46 L28 37 L14.5 46 L19.5 30.5 L6 20.5 L22.5 20 Z"
        fill="url(#ssrDenimStar)"
      />
      <path
        d="M28 10 L32 21 L43 21.5 L34 28.5 L37.5 39 L28 32.5 L18.5 39 L22 28.5 L13 21.5 L24 21 Z"
        fill="none"
        stroke="#E8F4FC"
        strokeWidth="1.2"
        strokeDasharray="2.5 2"
        opacity="0.85"
      />
    </svg>
  );
}

function QuoteScrap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 56" className={className} aria-hidden fill="none">
      <path
        d="M8 10 C24 4 90 6 124 12 C132 14 134 22 130 34 L122 48 C118 54 100 52 72 50 L18 46 C8 44 4 28 8 10Z"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1.1"
      />
      <text
        x="70"
        y="28"
        textAnchor="middle"
        fill={INK_SOFT}
        fontSize="8.5"
        fontFamily="Georgia, serif"
        fontStyle="italic"
      >
        little moments,
      </text>
      <text
        x="70"
        y="40"
        textAnchor="middle"
        fill={INK_SOFT}
        fontSize="8.5"
        fontFamily="Georgia, serif"
        fontStyle="italic"
      >
        big memories ♡
      </text>
    </svg>
  );
}

/** Soft paper plane — refined silhouette, not sticker clipart. */
function SoftPaperPlane({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden fill="none">
      <path
        d="M4 22 L58 6 L28 34 L24 24 Z"
        fill="#E8F4FC"
        stroke="#A8C8E0"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M24 24 L40 16"
        stroke="#7EB6D9"
        strokeWidth="1.1"
        opacity="0.8"
      />
      <path
        d="M4 22 L24 24 L28 34"
        fill="#C5DCEF"
        stroke="#A8C8E0"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HeartBalloon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 72" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="ssrBalloon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#A8D0EA" />
          <stop offset="55%" stopColor="#5A9BC4" />
          <stop offset="100%" stopColor="#3D7AAD" />
        </linearGradient>
      </defs>
      <path
        d="M24 40C24 40 6 28 6 16C6 9 12 4 18 4C21 4 23 6 24 9C25 6 27 4 30 4C36 4 42 9 42 16C42 28 24 40 24 40Z"
        fill="url(#ssrBalloon)"
      />
      <ellipse cx="16" cy="14" rx="4" ry="2.5" fill="white" opacity="0.45" />
      <path
        d="M24 40 Q22 52 26 66"
        stroke="#A8C8E0"
        strokeWidth="1.3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function TinyGiftIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none">
      <rect x="4" y="10" width="16" height="11" rx="1.5" fill="#FFFEFB" />
      <path d="M4 14.5 h16" stroke="#C5DCEF" strokeWidth="1.2" />
      <path d="M12 10 v11" stroke="#C5DCEF" strokeWidth="1.2" />
      <rect x="3.5" y="8" width="17" height="2.8" rx="0.8" fill="#E8F4FC" />
      <path
        d="M12 8 C12 8 9 4 7.2 5 C5.8 5.7 5.8 7.5 7.8 8 C9.6 8.4 12 8 12 8Z"
        fill="#FFFEFB"
      />
      <path
        d="M12 8 C12 8 15 4 16.8 5 C18.2 5.7 18.2 7.5 16.2 8 C14.4 8.4 12 8 12 8Z"
        fill="#FFFEFB"
      />
    </svg>
  );
}

function SilkBow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 20" className={className} aria-hidden fill="none">
      <ellipse
        cx="10"
        cy="10"
        rx="9"
        ry="6"
        fill={SKY}
        transform="rotate(-12 10 10)"
      />
      <ellipse
        cx="26"
        cy="10"
        rx="9"
        ry="6"
        fill={SKY_DEEP}
        transform="rotate(12 26 10)"
      />
      <ellipse cx="18" cy="10" rx="4" ry="3.5" fill={DENIM} />
      <ellipse cx="17" cy="9" rx="1.5" ry="1" fill="white" opacity="0.45" />
    </svg>
  );
}

/**
 * sky.connection.score-reveal — living Founder Scene 8.
 * Bloom celebratory card + Sky scrapbook sky. CTA does not name the letter.
 */
export function SkyConnectionScoreRevealScene({
  scoreResult,
  onComplete,
}: SkyConnectionScoreRevealSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const result = scoreResult ?? SKY_CONNECTION_LAB_SCORE_RESULT;
  const displayPercent = useCountUp(result.percent, !reduceMotion);

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] bg-[#7EB6D9]"
      role="region"
      aria-label="Your score"
    >
      <style>{`
        @keyframes ssr-bob {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--ssr-rot, 0deg)); }
          50% { transform: translate3d(0, -5px, 0) rotate(var(--ssr-rot, 0deg)); }
        }
        @keyframes ssr-twinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ssr-bob, .ssr-twinkle { animation: none !important; }
        }
      `}</style>

      <SkyRevealAtmospherePlate className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      {/* Perimeter scrapbook — refined materials */}
      <GridPaperScrap className="pointer-events-none absolute top-[2%] left-[2%] z-[2] h-20 w-24 -rotate-8 opacity-95 drop-shadow-md sm:left-[6%] sm:h-24 sm:w-28" />
      <WashiTape className="pointer-events-none absolute top-[6%] right-[2%] z-[3] h-6 w-32 rotate-12 opacity-90 drop-shadow-sm sm:right-[8%] sm:w-40" />
      <SoftBlooms className="pointer-events-none absolute top-[4%] right-[10%] z-[2] h-16 w-16 drop-shadow-sm sm:right-[14%] sm:h-20 sm:w-20" />
      <DenimHeart className="pointer-events-none absolute top-[10%] right-[4%] z-[3] h-14 w-16 drop-shadow-md sm:right-[8%] sm:h-16 sm:w-[4.5rem]" />

      <div
        aria-hidden
        className="ssr-bob pointer-events-none absolute top-[36%] left-[1%] z-[2] sm:left-[4%]"
        style={
          {
            ["--ssr-rot"]: "-18deg",
            animation: reduceMotion
              ? undefined
              : "ssr-bob 4s ease-in-out infinite",
          } as CSSProperties
        }
      >
        <SoftPaperPlane className="h-9 w-14 drop-shadow-md sm:h-11 sm:w-16" />
      </div>

      <div
        aria-hidden
        className="ssr-bob pointer-events-none absolute top-[34%] right-[2%] z-[2] sm:right-[5%]"
        style={
          {
            ["--ssr-rot"]: "6deg",
            animation: reduceMotion
              ? undefined
              : "ssr-bob 3.6s ease-in-out 0.4s infinite",
          } as CSSProperties
        }
      >
        <HeartBalloon className="h-20 w-14 drop-shadow-md sm:h-24 sm:w-16" />
      </div>

      <QuoteScrap className="pointer-events-none absolute bottom-[10%] left-[2%] z-[2] h-14 w-36 -rotate-6 drop-shadow-md sm:left-[6%] sm:h-16 sm:w-40" />
      <DenimStar className="pointer-events-none absolute bottom-[14%] left-[28%] z-[2] h-12 w-12 drop-shadow-md sm:left-[32%] sm:h-14 sm:w-14" />
      <SoftCloud className="pointer-events-none absolute right-[-4%] bottom-[2%] z-[2] h-16 w-44 opacity-92 -scale-x-100" />
      <GridPaperScrap className="pointer-events-none absolute right-[4%] bottom-[8%] z-[2] h-14 w-[4.5rem] rotate-8 opacity-90 drop-shadow-md sm:right-[8%] sm:h-16 sm:w-20" />

      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        {FIELD_STARS.map((s, i) => (
          <div
            key={i}
            className="ssr-twinkle absolute"
            style={{
              top: s.top,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              width: s.size,
              height: s.size,
              transform: `rotate(${s.rotate}deg)`,
              animation: reduceMotion
                ? undefined
                : `ssr-twinkle ${2.4 + (i % 3) * 0.35}s ease-in-out ${i * 0.18}s infinite`,
            }}
          >
            <SoftStar className="h-full w-full" fill={s.fill} />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
        <motion.div
          className="relative w-full max-w-[21rem] sm:max-w-md"
          initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {/* Soft sky backing layer */}
          <div
            aria-hidden
            className="absolute inset-x-3 top-5 bottom-2 rounded-2xl sm:inset-x-4"
            style={{
              background: "rgba(90,155,196,0.22)",
              boxShadow: "0 18px 40px -16px rgba(30,58,95,0.35)",
            }}
          />

          {/* Scalloped ornate card — Bloom structure, Sky palette */}
          <div
            className="relative px-6 pt-11 pb-8 sm:px-8 sm:pt-12 sm:pb-10"
            style={{
              background: CREAM,
              borderRadius: "48% 48% 18% 18% / 16% 16% 8% 8%",
              boxShadow:
                "0 24px 52px -18px rgba(30,58,95,0.35), 0 0 0 1.5px rgba(126,182,217,0.45)",
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-4 sm:inset-5"
              style={{
                border: "1.5px solid rgba(90,155,196,0.45)",
                borderRadius: "42% 42% 14% 14% / 12% 12% 6% 6%",
              }}
            />

            {/* Soft corner sparkles */}
            <SoftStar
              className="absolute top-8 left-7 h-3 w-3 opacity-80 sm:top-9 sm:left-8"
              fill={SKY}
            />
            <SoftStar
              className="absolute top-8 right-7 h-3 w-3 opacity-80 sm:top-9 sm:right-8"
              fill={GOLD}
            />

            <div className="relative z-10 flex flex-col items-center text-center">
              <p
                className="font-serif text-[3.5rem] leading-none font-semibold tracking-tight sm:text-[4.35rem]"
                style={{ color: SKY_DEEP }}
                aria-live="polite"
              >
                {displayPercent}%
              </p>

              <div
                className="mt-4 mb-4 flex items-center justify-center gap-3"
                style={{ color: SKY }}
              >
                <span
                  className="h-px w-12 bg-current opacity-70 sm:w-16"
                  aria-hidden
                />
                <span className="text-sm" style={{ color: DENIM }} aria-hidden>
                  ♥
                </span>
                <span
                  className="h-px w-12 bg-current opacity-70 sm:w-16"
                  aria-hidden
                />
              </div>

              <h1
                className="max-w-[16rem] font-serif text-xl leading-snug font-semibold sm:max-w-xs sm:text-2xl"
                style={{ color: INK }}
              >
                {result.headline}
              </h1>

              <SilkBow className="mt-4 h-4 w-8 opacity-90" />

              <p
                className="mt-3 max-w-[17rem] font-serif text-sm leading-relaxed sm:max-w-xs sm:text-base"
                style={{ color: "rgba(30,58,95,0.72)" }}
              >
                {result.message}
                <span className="ml-1 inline-block" aria-hidden>
                  ♡
                </span>
              </p>

              <motion.button
                type="button"
                onClick={onComplete}
                className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-full px-5 py-[0.95rem] font-serif text-[1.05rem] font-semibold text-white focus-visible:ring-2 focus-visible:ring-[#5A9BC4] focus-visible:ring-offset-2 focus-visible:outline-none sm:mt-8 sm:py-4 sm:text-lg"
                style={{
                  background: `linear-gradient(180deg, #7EB6D9 0%, ${SKY_DEEP} 48%, #3D6A94 100%)`,
                  boxShadow:
                    "0 1px 0 rgba(255,255,255,0.35) inset, 0 14px 32px -10px rgba(30,58,95,0.5)",
                }}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                aria-label="Reveal my gift"
              >
                <TinyGiftIcon className="h-5 w-5 shrink-0" />
                Reveal My Gift
                <span aria-hidden className="text-xl leading-none">
                  →
                </span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
