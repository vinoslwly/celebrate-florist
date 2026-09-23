"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";

/** Soft CSS bokeh — no photographic crops (avoids rectangular color blocks). */
const BOKEH = [
  {
    top: "-8%",
    right: "-6%",
    size: "42%",
    color: "rgba(247,168,190,0.42)",
    blur: "28px",
  },
  {
    top: "4%",
    right: "8%",
    size: "18%",
    color: "rgba(255,220,230,0.5)",
    blur: "18px",
  },
  {
    bottom: "-10%",
    left: "-8%",
    size: "40%",
    color: "rgba(242,160,180,0.38)",
    blur: "32px",
  },
  {
    bottom: "-12%",
    right: "-10%",
    size: "48%",
    color: "rgba(247,168,190,0.48)",
    blur: "30px",
  },
  {
    bottom: "6%",
    right: "12%",
    size: "16%",
    color: "rgba(255,200,220,0.42)",
    blur: "16px",
  },
  {
    top: "18%",
    left: "-4%",
    size: "22%",
    color: "rgba(255,230,235,0.32)",
    blur: "24px",
  },
] as const;

type Bubble = {
  side: "left" | "right";
  text: string;
  icon: string;
  top: string;
  delay: number;
  hideOnMobile?: boolean;
};

const BUBBLES: Bubble[] = [
  {
    side: "left",
    icon: "🎁",
    text: "I have a surprise!",
    top: "18%",
    delay: 0.55,
  },
  {
    side: "left",
    icon: "💗",
    text: "Made with love.",
    top: "42%",
    delay: 0.75,
  },
  {
    side: "left",
    icon: "🌸",
    text: "A special gift is waiting...",
    top: "66%",
    delay: 0.95,
    hideOnMobile: true,
  },
  {
    side: "right",
    icon: "✉️",
    text: "I have a surprise for you!",
    top: "22%",
    delay: 0.65,
  },
  {
    side: "right",
    icon: "🌸",
    text: "A sweet surprise for you!",
    top: "46%",
    delay: 0.85,
    hideOnMobile: true,
  },
  { side: "right", icon: "✨", text: "Just for you.", top: "70%", delay: 1.05 },
];

const FALLING_PETALS = [
  { left: "8%", delay: 0.2, duration: 8, size: 16, x: 20 },
  { left: "22%", delay: 1.4, duration: 9, size: 12, x: -14 },
  { left: "48%", delay: 0.6, duration: 7.5, size: 18, x: 12 },
  { left: "68%", delay: 2, duration: 8.4, size: 14, x: -16 },
  { left: "84%", delay: 1.1, duration: 7.8, size: 15, x: 10 },
  { left: "38%", delay: 2.6, duration: 9.2, size: 11, x: -10 },
] as const;

function SakuraMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden fill="none">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse
          key={deg}
          cx="32"
          cy="18"
          rx="9"
          ry="14"
          fill="#F7A8BE"
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="5.5" fill="#FFF8F5" />
      <circle cx="32" cy="32" r="2.2" fill="#F48CA8" />
    </svg>
  );
}

/** Larger tap-target sakura — clean SVG (no cropped screenshot fragments). */
function TapSakura({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden fill="none">
      <defs>
        <radialGradient id="tapSakuraPetal" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFE4EC" />
          <stop offset="45%" stopColor="#F7A8BE" />
          <stop offset="100%" stopColor="#E8799A" />
        </radialGradient>
        <radialGradient id="tapSakuraCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF8E7" />
          <stop offset="55%" stopColor="#F5C16C" />
          <stop offset="100%" stopColor="#E8A23A" />
        </radialGradient>
        <filter
          id="tapSakuraShadow"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feDropShadow
            dx="0"
            dy="4"
            stdDeviation="4"
            floodColor="#C45B7A"
            floodOpacity="0.35"
          />
        </filter>
      </defs>
      <g filter="url(#tapSakuraShadow)">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="60"
            cy="28"
            rx="18"
            ry="30"
            fill="url(#tapSakuraPetal)"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
        <circle cx="60" cy="60" r="14" fill="url(#tapSakuraCenter)" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <circle
            key={deg}
            cx="60"
            cy="48"
            r="2.2"
            fill="#F4B84A"
            transform={`rotate(${deg} 60 60)`}
          />
        ))}
      </g>
    </svg>
  );
}

function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.9"
      />
    </svg>
  );
}

/**
 * moments.gift-box — living recreation of Founder Scene 2 reference.
 * Tap flower advances; copy stays HTML (greeting from payload).
 */
export function GiftBoxScene({ payload, onComplete }: MomentsSceneProps) {
  const name = payload.experience.greeting_name;

  return (
    <div className={cn(SCENE_VIEWPORT_SCROLL, "bg-[#FFF0F3]")}>
      {/* Single smooth plane — no stitched photo panels */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 130% 100% at 50% 38%, #FFF9F7 0%, #FCF0F2 28%, #F8E4EA 55%, #F3D4DE 78%, #EEC8D4 100%)",
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,255,255,0.55) 0%, transparent 70%)",
        }}
        animate={{ opacity: [0.4, 0.75, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Soft floral bokeh (CSS only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {BOKEH.map((blob, i) => (
          <motion.div
            key={i}
            className={
              i > 2
                ? "absolute hidden rounded-full sm:block"
                : "absolute rounded-full"
            }
            style={{
              top: "top" in blob ? blob.top : undefined,
              bottom: "bottom" in blob ? blob.bottom : undefined,
              left: "left" in blob ? blob.left : undefined,
              right: "right" in blob ? blob.right : undefined,
              width: blob.size,
              height: blob.size,
              background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
              filter: `blur(${blob.blur})`,
            }}
            animate={{ opacity: [0.65, 0.95, 0.65], scale: [1, 1.04, 1] }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute top-3 right-3 opacity-65 sm:top-5 sm:right-6"
      >
        <SakuraMark className="h-8 w-8 sm:h-10 sm:w-10" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-6 left-4 opacity-50 sm:bottom-8 sm:left-8"
      >
        <SakuraMark className="h-7 w-7 sm:h-9 sm:w-9" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 bottom-10 opacity-55 sm:right-10 sm:bottom-12"
      >
        <SakuraMark className="h-9 w-9 sm:h-11 sm:w-11" />
      </div>

      {/* Falling petals */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {FALLING_PETALS.map((petal, i) => (
          <motion.div
            key={i}
            className={i > 3 ? "absolute hidden sm:block" : "absolute"}
            style={{
              left: petal.left,
              top: "-6%",
              width: petal.size,
              height: petal.size * 1.35,
            }}
            animate={{
              opacity: [0, 0.8, 0.8, 0],
              y: ["0vh", "110vh"],
              x: [0, petal.x, petal.x * -0.5],
              rotate: [0, 50, -30, 70],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Petal className="h-full w-full" />
          </motion.div>
        ))}
      </div>

      {/* Content — centered as one block on the viewport */}
      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-8">
        <motion.header
          className="mb-5 text-center sm:mb-6"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#C45B7A] sm:text-4xl">
            For {name}
          </h1>
          <div className="mt-3 flex items-center justify-center gap-3 text-[#E8A0B4]">
            <span className="h-px w-12 bg-current sm:w-16" aria-hidden />
            <SakuraMark className="h-4 w-4" />
            <span className="h-px w-12 bg-current sm:w-16" aria-hidden />
          </div>
          <p className="mt-3 font-serif text-sm text-[#D4899E] sm:text-base">
            — a sweet surprise is waiting for you —
          </p>
        </motion.header>

        <div className="relative mx-auto w-full max-w-md">
          {/* Floating bubbles — desktop sides; compact below on mobile */}
          <div
            className="pointer-events-none absolute inset-0 hidden lg:block"
            aria-hidden
          >
            {BUBBLES.map((bubble) => (
              <motion.div
                key={`${bubble.side}-${bubble.text}`}
                className={cn(
                  "absolute rounded-full border border-pink-100/80 bg-white/95 px-3 py-2 text-xs shadow-md shadow-pink-200/40",
                  bubble.side === "left"
                    ? "right-[calc(100%+0.75rem)]"
                    : "left-[calc(100%+0.75rem)]",
                )}
                style={{ top: bubble.top }}
                initial={{ opacity: 0, x: bubble.side === "left" ? -16 : 16 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: [0, -5, 0],
                }}
                transition={{
                  opacity: { delay: bubble.delay, duration: 0.4 },
                  x: { delay: bubble.delay, duration: 0.45 },
                  y: {
                    delay: bubble.delay + 0.5,
                    duration: 4 + bubble.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                <span className="whitespace-nowrap font-serif text-[#7A4A58]">
                  <span className="mr-1.5" aria-hidden>
                    {bubble.icon}
                  </span>
                  {bubble.text}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.article
            className="relative flex min-h-[22rem] flex-col rounded-2xl border border-pink-100 bg-white/95 px-5 pt-6 pb-4 shadow-[0_18px_50px_-18px_rgba(196,91,122,0.45)] sm:min-h-[24rem] sm:px-8 sm:pt-8 sm:pb-5"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.55,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div className="flex flex-1 flex-col items-center justify-center px-1 text-center">
              <SakuraMark className="mb-3 h-7 w-7" />
              <p className="text-[10px] font-semibold tracking-[0.22em] text-[#E39AB0] uppercase">
                A special gift for you
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#C45B7A] sm:text-3xl">
                A Special Surprise!
              </h2>
              <span className="mt-2 text-sm text-[#F0A0B4]" aria-hidden>
                ♥
              </span>
              <p className="mt-3 max-w-xs font-serif text-sm leading-relaxed text-[#9A6B78] italic sm:text-[15px]">
                A beautiful moment captured just for you. Open this envelope to
                reveal a sweet message of warmth and love…
              </p>
            </div>

            {/* Footer: flower right as before; CTA nudged slightly toward center */}
            <div className="mt-2 flex items-center justify-between gap-2 px-1 sm:mt-3 sm:gap-3 sm:px-2">
              <div className="ml-[12%] text-left sm:ml-[14%]">
                <p className="text-[10px] leading-tight font-bold tracking-[0.1em] text-[#C45B7A] uppercase sm:text-[11px]">
                  Tap the flower to
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[10px] leading-tight font-bold tracking-[0.1em] text-[#C45B7A] uppercase sm:text-[11px]">
                  unwrap
                  <motion.span
                    aria-hidden
                    className="text-base leading-none sm:text-lg"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    👉
                  </motion.span>
                </p>
              </div>

              <motion.button
                type="button"
                aria-label="Tap the flower to unwrap"
                onClick={onComplete}
                className="-mr-1 -mb-2 shrink-0 focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:outline-none sm:-mr-2 sm:-mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                transition={{ opacity: { duration: 0.4, delay: 0.35 } }}
              >
                <motion.span
                  className="block"
                  animate={{
                    scale: [1, 1.06, 1],
                    rotate: [0, -3, 3, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    delay: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <TapSakura className="h-[5.25rem] w-[5.25rem] sm:h-28 sm:w-28" />
                </motion.span>
              </motion.button>
            </div>
          </motion.article>
        </div>

        {/* Mobile bubbles — in-flow so short viewports can scroll to them */}
        <div className="mt-4 flex flex-wrap justify-center gap-2 px-1 lg:hidden">
          {BUBBLES.filter((b) => !b.hideOnMobile).map((bubble, i) => (
            <motion.span
              key={bubble.text}
              className="rounded-full border border-pink-100 bg-white/95 px-3 py-1.5 text-[11px] font-serif text-[#7A4A58] shadow-sm"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <span className="mr-1" aria-hidden>
                {bubble.icon}
              </span>
              {bubble.text}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
