"use client";

import type { CSSProperties } from "react";
import { useId } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { SkyConnectionSceneProps } from "@/features/experience/scene-engine/sky/connection/types";
import { SkyGiftBox } from "@/features/experience/scene-engine/sky/moments/sky-gift-box";

const INK = "#1E3A5F";
const INK_SOFT = "#3D7AAD";
const SKY = "#7EB6D9";
const SKY_DEEP = "#5A9BC4";
const GOLD = "#FFE8A0";
const ROSE = "#E8A0B8";
const EASE = [0.22, 1, 0.36, 1] as const;

const ORBIT = [
  { angle: -42, dist: 118, delay: 0.18, size: 20, kind: "petal" as const },
  { angle: 38, dist: 128, delay: 0.26, size: 22, kind: "heart" as const },
  { angle: 118, dist: 120, delay: 0.34, size: 18, kind: "petal" as const },
  { angle: -128, dist: 132, delay: 0.22, size: 21, kind: "heart" as const },
  { angle: 205, dist: 110, delay: 0.4, size: 16, kind: "spark" as const },
  { angle: -205, dist: 114, delay: 0.44, size: 15, kind: "spark" as const },
  { angle: 75, dist: 108, delay: 0.3, size: 14, kind: "spark" as const },
  { angle: -85, dist: 112, delay: 0.36, size: 14, kind: "spark" as const },
] as const;

const FIELD_STARS = [
  { top: "14%", left: "18%", size: 11, fill: GOLD, rotate: -12 },
  { top: "20%", right: "16%", size: 9, fill: "#FFFFFF", rotate: 18 },
  { top: "36%", left: "8%", size: 10, fill: SKY, rotate: 8 },
  { top: "42%", right: "7%", size: 12, fill: GOLD, rotate: -16 },
  { top: "58%", left: "12%", size: 8, fill: "#FFFFFF", rotate: 14 },
  { top: "62%", right: "14%", size: 10, fill: SKY_DEEP, rotate: -8 },
  { top: "74%", left: "22%", size: 9, fill: GOLD, rotate: 20 },
  { top: "78%", right: "20%", size: 11, fill: SKY, rotate: -10 },
] as const;

function orbitOffset(angleDeg: number, dist: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist };
}

/** Dense painterly + scrapbook plate — luxury atmosphere, not flat wash. */
function SkyScoreAtmospherePlate({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="sscSkyWash" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FBFDFF" />
          <stop offset="22%" stopColor="#DCEFFA" />
          <stop offset="55%" stopColor="#BDDFF2" />
          <stop offset="100%" stopColor="#8FBDD8" />
        </linearGradient>
        <radialGradient id="sscGoldBloom" cx="50%" cy="36%" r="48%">
          <stop offset="0%" stopColor="#FFF8DC" stopOpacity="1" />
          <stop offset="25%" stopColor="#FFE8A0" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#FFFFFF" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sscSunCorner" cx="6%" cy="4%" r="42%">
          <stop offset="0%" stopColor="#FFF8DC" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#FFE8A0" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#FFE8A0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="sscMist" cx="50%" cy="40%" r="44%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.78" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sscCloudBand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.98" />
        </linearGradient>
        <pattern
          id="sscPaperGrain"
          width="120"
          height="120"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="8" cy="14" r="0.7" fill="#1E3A5F" opacity="0.05" />
          <circle cx="42" cy="38" r="0.55" fill="#1E3A5F" opacity="0.04" />
          <circle cx="78" cy="22" r="0.65" fill="#1E3A5F" opacity="0.045" />
          <circle cx="110" cy="56" r="0.5" fill="#1E3A5F" opacity="0.04" />
          <circle cx="24" cy="72" r="0.6" fill="#1E3A5F" opacity="0.05" />
          <circle cx="64" cy="90" r="0.55" fill="#1E3A5F" opacity="0.04" />
          <circle cx="96" cy="78" r="0.7" fill="#1E3A5F" opacity="0.045" />
          <circle cx="16" cy="104" r="0.5" fill="#1E3A5F" opacity="0.035" />
        </pattern>
      </defs>

      <rect width="390" height="844" fill="url(#sscSkyWash)" />
      <rect width="390" height="844" fill="url(#sscSunCorner)" />
      <rect width="390" height="844" fill="url(#sscGoldBloom)" />
      <rect width="390" height="844" fill="url(#sscMist)" />
      <rect width="390" height="844" fill="url(#sscPaperGrain)" />

      {/* Soft painterly mid washes */}
      <ellipse cx="55" cy="210" rx="130" ry="78" fill="#FFFFFF" opacity="0.3" />
      <ellipse
        cx="340"
        cy="175"
        rx="120"
        ry="70"
        fill="#FFFFFF"
        opacity="0.24"
      />
      <ellipse
        cx="195"
        cy="300"
        rx="170"
        ry="58"
        fill="#E8F4FC"
        opacity="0.5"
      />
      <ellipse
        cx="70"
        cy="480"
        rx="100"
        ry="50"
        fill="#D6EAF6"
        opacity="0.35"
      />
      <ellipse
        cx="320"
        cy="520"
        rx="110"
        ry="55"
        fill="#D6EAF6"
        opacity="0.3"
      />

      {/* Upper cloud bank */}
      <g opacity="0.94">
        <ellipse cx="30" cy="85" rx="72" ry="28" fill="#FFFFFF" />
        <ellipse cx="90" cy="72" rx="58" ry="34" fill="#FFFFFF" />
        <ellipse
          cx="155"
          cy="88"
          rx="50"
          ry="24"
          fill="#FFFEFB"
          opacity="0.92"
        />
        <ellipse cx="275" cy="66" rx="68" ry="32" fill="#FFFFFF" />
        <ellipse
          cx="345"
          cy="80"
          rx="58"
          ry="26"
          fill="#FFFEFB"
          opacity="0.9"
        />
        <ellipse
          cx="370"
          cy="105"
          rx="48"
          ry="20"
          fill="#FFFFFF"
          opacity="0.75"
        />
      </g>

      {/* Mid wisps */}
      <g opacity="0.55">
        <ellipse cx="40" cy="370" rx="85" ry="24" fill="#FFFFFF" />
        <ellipse cx="100" cy="360" rx="48" ry="18" fill="#FFFFFF" />
        <ellipse cx="300" cy="410" rx="78" ry="22" fill="#FFFFFF" />
        <ellipse cx="355" cy="400" rx="42" ry="16" fill="#FFFFFF" />
      </g>

      {/* Bottom cloud bed */}
      <rect y="610" width="390" height="234" fill="url(#sscCloudBand)" />
      <g opacity="0.97">
        <ellipse cx="25" cy="700" rx="95" ry="50" fill="#FFFFFF" />
        <ellipse cx="110" cy="678" rx="80" ry="54" fill="#FFFEFB" />
        <ellipse cx="205" cy="712" rx="100" ry="56" fill="#FFFFFF" />
        <ellipse cx="300" cy="685" rx="85" ry="52" fill="#FFFEFB" />
        <ellipse cx="375" cy="708" rx="72" ry="46" fill="#FFFFFF" />
        <ellipse cx="55" cy="768" rx="105" ry="56" fill="#FFFFFF" />
        <ellipse cx="190" cy="790" rx="115" ry="62" fill="#FFFEFB" />
        <ellipse cx="330" cy="778" rx="100" ry="58" fill="#FFFFFF" />
      </g>

      {/* Soft vignette */}
      <rect width="390" height="844" fill="url(#sscMist)" opacity="0.4" />
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

/** Soft torn lined paper — ambient scrap, not a sticker. */
function LinedPaperScrap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 88 100" className={className} aria-hidden fill="none">
      <path
        d="M8 6 C18 2 52 4 72 8 C80 10 84 18 82 28 L76 88 C74 96 64 98 52 96 L14 88 C6 86 4 74 6 62 Z"
        fill="#FFFEFB"
        stroke="#D6E0EA"
        strokeWidth="1.2"
      />
      {[28, 40, 52, 64, 76].map((y) => (
        <line
          key={y}
          x1="16"
          y1={y}
          x2="70"
          y2={y + 2}
          stroke="#C5DCEF"
          strokeWidth="1.1"
        />
      ))}
      <ellipse cx="48" cy="48" rx="14" ry="8" fill="#E8F4FC" opacity="0.85" />
      <ellipse cx="40" cy="50" rx="7" ry="5" fill="#FFFFFF" opacity="0.9" />
      <ellipse cx="56" cy="50" rx="6" ry="4.5" fill="#FFFFFF" opacity="0.9" />
    </svg>
  );
}

/** Soft gingham washi strip. */
function WashiTape({ className }: { className?: string }) {
  const pid = `ssc-washi-${useId().replace(/:/g, "")}`;
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

/** Soft baby's-breath cluster — painterly dots, not clipart. */
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
      <path
        d="M36 54 C32 44 24 40 18 38"
        stroke="#8FB8D4"
        strokeWidth="1.2"
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
          [50, 34, 3.2],
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

/** Soft grid paper flap. */
function GridPaperFlap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" className={className} aria-hidden fill="none">
      <path
        d="M6 8 C20 2 50 4 78 10 C86 12 88 22 84 34 L76 62 C74 68 64 70 50 68 L12 60 C4 58 2 44 6 8Z"
        fill="#EEF6FC"
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

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill={SKY}
        opacity="0.9"
      />
      <path
        d="M12 6C10 12 8 16 9.5 22"
        stroke="#FFFFFF"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}

function SoftHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 24" className={className} aria-hidden>
      <path
        d="M14 22C14 22 2 14 2 8C2 4.5 5 2 8.2 2C10.4 2 12.2 3.2 14 5.2C15.8 3.2 17.6 2 19.8 2C23 2 26 4.5 26 8C26 14 14 22 14 22Z"
        fill={ROSE}
        stroke="#FFFFFF"
        strokeWidth="1.1"
      />
      <ellipse cx="8.5" cy="7" rx="2.8" ry="1.6" fill="white" opacity="0.5" />
    </svg>
  );
}

function SoftSpark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden fill={GOLD}>
      <path d="M8 0.5 9.2 6.8 15.5 8 9.2 9.2 8 15.5 6.8 9.2 0.5 8 6.8 6.8Z" />
    </svg>
  );
}

/**
 * sky.connection.score-calculation — living Founder Scene 7.
 * Bloom anticipation beat (ajar gift + soft wait) + Sky scrapbook atmosphere.
 * Theme Lab auto-advances ~2s; not an admin “calculating” screen.
 */
export function SkyConnectionScoreCalculationScene(
  _props: SkyConnectionSceneProps,
) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className="relative flex h-full min-h-0 w-full flex-1 flex-col overflow-x-clip overflow-y-auto overscroll-y-contain touch-pan-y [-webkit-overflow-scrolling:touch] bg-[#A8C8E0]"
      role="status"
      aria-live="polite"
      aria-label="Almost there"
    >
      <style>{`
        @keyframes ssc-bob {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(var(--ssc-rot, 0deg)); }
          50% { transform: translate3d(0, -5px, 0) rotate(var(--ssc-rot, 0deg)); }
        }
        @keyframes ssc-twinkle {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ssc-bob, .ssc-twinkle { animation: none !important; }
        }
      `}</style>

      <SkyScoreAtmospherePlate className="pointer-events-none absolute inset-0 z-0 h-full w-full" />

      {/* Perimeter scrapbook layers — denser, still refined */}
      <WashiTape className="pointer-events-none absolute top-[5%] left-[-4%] z-[2] h-7 w-36 -rotate-12 opacity-90 drop-shadow-sm sm:left-[2%] sm:w-44" />
      <LinedPaperScrap className="pointer-events-none absolute top-[3%] left-[6%] z-[2] h-24 w-20 -rotate-8 opacity-95 drop-shadow-md sm:left-[10%] sm:h-28 sm:w-24" />
      <SoftCloud className="pointer-events-none absolute top-[2%] right-[-4%] z-[2] h-14 w-40 opacity-90 sm:right-[2%]" />
      <SoftBlooms className="pointer-events-none absolute top-[7%] right-[4%] z-[3] h-16 w-16 drop-shadow-sm sm:right-[8%] sm:h-20 sm:w-20" />

      <div
        aria-hidden
        className="ssc-bob pointer-events-none absolute top-[30%] left-[1%] z-[2] sm:left-[4%]"
        style={
          {
            ["--ssc-rot"]: "-10deg",
            animation: reduceMotion
              ? undefined
              : "ssc-bob 4.2s ease-in-out infinite",
          } as CSSProperties
        }
      >
        <GridPaperFlap className="h-16 w-20 drop-shadow-md sm:h-20 sm:w-24" />
      </div>

      <div
        aria-hidden
        className="ssc-bob pointer-events-none absolute top-[28%] right-[1%] z-[2] sm:right-[4%]"
        style={
          {
            ["--ssc-rot"]: "8deg",
            animation: reduceMotion
              ? undefined
              : "ssc-bob 3.8s ease-in-out 0.5s infinite",
          } as CSSProperties
        }
      >
        <LinedPaperScrap className="h-20 w-[4.5rem] drop-shadow-md sm:h-24 sm:w-20" />
      </div>

      <WashiTape className="pointer-events-none absolute bottom-[16%] left-[-6%] z-[2] h-6 w-32 rotate-[18deg] opacity-85 drop-shadow-sm sm:left-[2%] sm:w-40" />
      <SoftBlooms className="pointer-events-none absolute bottom-[10%] left-[4%] z-[3] h-14 w-14 -scale-x-100 drop-shadow-sm sm:left-[8%] sm:h-[4.5rem] sm:w-[4.5rem]" />
      <GridPaperFlap className="pointer-events-none absolute right-[3%] bottom-[8%] z-[2] h-14 w-[4.5rem] rotate-6 drop-shadow-md sm:right-[8%] sm:h-16 sm:w-20" />
      <SoftCloud className="pointer-events-none absolute right-[-6%] bottom-[2%] z-[2] h-16 w-44 opacity-92 -scale-x-100 sm:right-[0%]" />

      {/* Mid-field stars */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[2]">
        {FIELD_STARS.map((s, i) => (
          <div
            key={i}
            className="ssc-twinkle absolute"
            style={{
              top: s.top,
              left: "left" in s ? s.left : undefined,
              right: "right" in s ? s.right : undefined,
              width: s.size,
              height: s.size,
              transform: `rotate(${s.rotate}deg)`,
              animation: reduceMotion
                ? undefined
                : `ssc-twinkle ${2.4 + (i % 3) * 0.4}s ease-in-out ${i * 0.2}s infinite`,
            }}
          >
            <SoftStar className="h-full w-full" fill={s.fill} />
          </div>
        ))}
      </div>

      {/* Soft gold bloom behind gift */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-[38%] left-1/2 z-[1] h-[80vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[64vmin] sm:w-[64vmin]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,232,160,0.55) 28%, rgba(126,182,217,0.28) 52%, transparent 72%)",
        }}
        initial={
          reduceMotion ? { opacity: 0.7, scale: 1 } : { opacity: 0, scale: 0.5 }
        }
        animate={
          reduceMotion
            ? { opacity: 0.7, scale: 1 }
            : { opacity: [0, 1, 0.6], scale: [0.5, 1.06, 1.14] }
        }
        transition={{ duration: 1.4, ease: EASE }}
      />

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 py-10 sm:px-6 sm:py-12">
        <div className="relative flex flex-col items-center">
          {/* Hero gift — enlarged */}
          <div className="relative mb-0 flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-[46%] left-1/2 h-56 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-64 sm:w-72"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,250,220,1) 0%, rgba(255,220,140,0.6) 34%, transparent 70%)",
              }}
              animate={
                reduceMotion
                  ? { opacity: 0.85, scale: 1 }
                  : { opacity: [0.55, 1, 0.7], scale: [0.94, 1.12, 1] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      duration: 1.6,
                      ease: EASE,
                      repeat: Infinity,
                      repeatType: "mirror",
                    }
              }
            />

            {!reduceMotion
              ? ORBIT.map((o, i) => {
                  const { x, y } = orbitOffset(o.angle, o.dist);
                  const h = o.kind === "petal" ? o.size * 1.35 : o.size;
                  return (
                    <motion.div
                      key={i}
                      aria-hidden
                      className="pointer-events-none absolute top-1/2 left-1/2 flex items-center justify-center"
                      style={{
                        width: o.size,
                        height: h,
                        marginLeft: -o.size / 2,
                        marginTop: -h / 2,
                      }}
                      initial={{ opacity: 0, x: 0, y: 0, scale: 0.4 }}
                      animate={{
                        opacity: [0, 1, 0.88],
                        x: [0, x * 0.85, x],
                        y: [0, y * 0.85, y],
                        scale: [0.4, 1.12, 1],
                        rotate: [0, o.angle > 0 ? 16 : -16],
                      }}
                      transition={{
                        duration: 1.15,
                        delay: o.delay,
                        ease: EASE,
                      }}
                    >
                      {o.kind === "petal" ? (
                        <SoftPetal className="h-full w-full" />
                      ) : o.kind === "heart" ? (
                        <SoftHeart className="h-full w-full" />
                      ) : (
                        <SoftSpark className="h-full w-full" />
                      )}
                    </motion.div>
                  );
                })
              : null}

            <motion.div
              className="relative z-10"
              initial={
                reduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.78, y: 22 }
              }
              animate={
                reduceMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 1, scale: 1, y: [22, 0, -5, 0] }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.4, ease: EASE },
                      scale: {
                        delay: 0.06,
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      },
                      y: { duration: 1.9, ease: EASE },
                    }
              }
            >
              <SkyGiftBox
                variant="ajar"
                className="h-60 w-60 drop-shadow-[0_22px_40px_rgba(30,58,95,0.38)] sm:h-72 sm:w-72"
              />
            </motion.div>
          </div>

          <motion.span
            className="-mt-1 font-serif text-2xl sm:text-3xl"
            style={{ color: ROSE }}
            aria-hidden
            initial={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.6 }
            }
            animate={
              reduceMotion
                ? { opacity: 1, scale: 1 }
                : { opacity: 1, scale: [0.6, 1.18, 1] }
            }
            transition={{ delay: 0.35, duration: 0.55, ease: EASE }}
          >
            ♡
          </motion.span>

          <motion.h1
            className="mt-2 text-center font-serif text-[1.85rem] font-semibold tracking-tight sm:text-[2.35rem]"
            style={{ color: INK }}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.45,
              duration: 0.5,
              ease: EASE,
            }}
          >
            Almost there…
          </motion.h1>

          <motion.div
            className="mt-4 mb-3 flex items-center justify-center gap-3"
            style={{ color: "rgba(126,182,217,0.85)" }}
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{
              delay: reduceMotion ? 0 : 0.6,
              duration: 0.4,
              ease: EASE,
            }}
          >
            <span className="h-px w-12 bg-current sm:w-16" />
            <span
              className="inline-block h-2 w-2 rotate-45"
              style={{ backgroundColor: GOLD, boxShadow: `0 0 10px ${GOLD}` }}
            />
            <span className="h-px w-12 bg-current sm:w-16" />
          </motion.div>

          <motion.p
            className="max-w-[16rem] text-center font-serif text-base leading-relaxed sm:max-w-xs sm:text-lg"
            style={{ color: INK_SOFT }}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: reduceMotion ? 0 : 0.7,
              duration: 0.45,
              ease: EASE,
            }}
          >
            Something sweet is gathering for you…
          </motion.p>

          <motion.div
            className="mt-8 flex items-center gap-3"
            aria-hidden
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: reduceMotion ? 0 : 0.9, duration: 0.35 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="inline-block"
                style={{ color: i === 1 ? ROSE : SKY }}
                animate={
                  reduceMotion
                    ? { opacity: 0.7, scale: 1 }
                    : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.15, 0.9] }
                }
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : {
                        duration: 1.1,
                        delay: i * 0.18,
                        repeat: Infinity,
                        ease: EASE,
                      }
                }
              >
                ♥
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
