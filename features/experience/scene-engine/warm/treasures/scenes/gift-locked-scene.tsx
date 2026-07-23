"use client";

import { motion, useReducedMotion } from "framer-motion";

import { SCENE_VIEWPORT_SCROLL } from "@/features/experience/scene-engine/scene-viewport";
import type { WarmTreasuresSceneProps } from "@/features/experience/scene-engine/warm/treasures/types";

const BG = "#2A0509";
const CREAM = "#FFF8F0";
const INK = "#3A1A14";
const INK_SOFT = "#5C3428";
const GOLD = "#C9A24A";
const GOLD_SOFT = "#E8D090";
const GOLD_DEEP = "#8B6B28";
const ROSE = "#A51C28";
const ROSE_DEEP = "#6B1018";

const EASE = [0.22, 1, 0.36, 1] as const;

const FALLING = [
  { left: "6%", delay: 0.1, duration: 7.4, size: 13, x: 16 },
  { left: "18%", delay: 1.2, duration: 8.2, size: 11, x: -12 },
  { left: "36%", delay: 0.55, duration: 7.8, size: 14, x: 10 },
  { left: "58%", delay: 1.9, duration: 8.6, size: 12, x: -14 },
  { left: "74%", delay: 0.85, duration: 7.6, size: 15, x: 8 },
  { left: "88%", delay: 1.55, duration: 9.0, size: 10, x: -10 },
] as const;

const BURST = [
  { x: -88, y: -36, rotate: -32, delay: 0.2, size: 15 },
  { x: 92, y: -42, rotate: 28, delay: 0.26, size: 14 },
  { x: -62, y: 48, rotate: -18, delay: 0.32, size: 12 },
  { x: 70, y: 54, rotate: 24, delay: 0.36, size: 13 },
  { x: -28, y: -72, rotate: 10, delay: 0.22, size: 11 },
  { x: 34, y: -68, rotate: -12, delay: 0.28, size: 12 },
  { x: 0, y: 78, rotate: 6, delay: 0.4, size: 14 },
] as const;

const SPARKLES = [
  { top: "12%", left: "16%", delay: 0.2, size: 3 },
  { top: "22%", left: "78%", delay: 0.65, size: 4 },
  { top: "48%", left: "8%", delay: 1.05, size: 3 },
  { top: "68%", left: "86%", delay: 0.45, size: 3.5 },
  { top: "78%", left: "28%", delay: 0.9, size: 2.5 },
] as const;

function SoftPetal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#C42838"
        opacity="0.92"
      />
      <path
        d="M12 6C10 12 8 16 10 22"
        stroke="#F0D0D0"
        strokeWidth="1"
        opacity="0.35"
      />
    </svg>
  );
}

function GoldCorner({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 56 56" className={className} aria-hidden fill="none">
      <path
        d="M8 48 C8 28 14 18 28 10 C22 20 24 28 36 36 C24 32 16 38 8 48Z"
        fill={GOLD}
        opacity="0.88"
      />
      <path
        d="M10 46 C16 34 26 28 38 24"
        stroke={GOLD_SOFT}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <circle cx="14" cy="40" r="2" fill={GOLD_SOFT} />
      <circle cx="22" cy="32" r="1.4" fill={GOLD} opacity="0.7" />
      <path
        d="M6 18 L6 8 L16 8"
        stroke={GOLD}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

/** Crimson wax seal + gold rim + heart — stationery, not a mascot crest. */
function WaxSealMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} aria-hidden fill="none">
      <defs>
        <radialGradient id="wtWaxBody" cx="38%" cy="32%" r="68%">
          <stop offset="0%" stopColor="#C42838" />
          <stop offset="55%" stopColor={ROSE} />
          <stop offset="100%" stopColor={ROSE_DEEP} />
        </radialGradient>
        <linearGradient id="wtWaxRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5E6B8" />
          <stop offset="50%" stopColor={GOLD} />
          <stop offset="100%" stopColor={GOLD_DEEP} />
        </linearGradient>
      </defs>
      <circle cx="36" cy="36" r="30" fill="url(#wtWaxRim)" />
      <circle cx="36" cy="36" r="24.5" fill="url(#wtWaxBody)" />
      <circle
        cx="36"
        cy="36"
        r="21"
        stroke={GOLD_SOFT}
        strokeWidth="1.1"
        opacity="0.55"
      />
      <path
        d="M36 46 C28 40 22 36 22 29.5 C22 25.2 25.2 22 29.2 22 C31.8 22 34 23.6 36 26.2 C38 23.6 40.2 22 42.8 22 C46.8 22 50 25.2 50 29.5 C50 36 44 40 36 46Z"
        fill={GOLD_SOFT}
      />
      <ellipse
        cx="30"
        cy="28"
        rx="5"
        ry="3"
        fill="rgba(255,248,240,0.22)"
        transform="rotate(-28 30 28)"
      />
    </svg>
  );
}

const cardContent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.48 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: EASE },
  },
};

/**
 * warm.treasures.gift-locked — Scene 3.
 * Velvet field · wax seal · cream invitation · YES, I'M READY!
 * Bloom Treasures structure (card + CTA), Warm crimson/gold identity.
 */
export function WarmTreasuresGiftLockedScene({
  onComplete,
}: WarmTreasuresSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div className={SCENE_VIEWPORT_SCROLL} style={{ backgroundColor: BG }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 85% 70% at 28% 38%, rgba(180,40,55,0.5) 0%, transparent 60%)",
            "radial-gradient(ellipse 70% 55% at 78% 55%, rgba(100,20,30,0.45) 0%, transparent 55%)",
            "radial-gradient(ellipse 130% 90% at 50% 118%, #0A0103 0%, transparent 48%)",
            "radial-gradient(ellipse 110% 65% at 50% -10%, rgba(90,18,26,0.55) 0%, transparent 50%)",
            "linear-gradient(165deg, #5A121A 0%, #3A080C 40%, #1A0406 100%)",
          ].join(", "),
        }}
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(232,208,144,0.14) 0%, transparent 42%)",
        }}
        animate={
          reduceMotion ? { opacity: 0.45 } : { opacity: [0.28, 0.62, 0.28] }
        }
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.1] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {!reduceMotion ? (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {FALLING.map((p, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: p.left,
                top: "-8%",
                width: p.size,
                height: p.size * 1.35,
              }}
              animate={{
                opacity: [0, 0.9, 0.9, 0],
                y: ["0vh", "110vh"],
                x: [0, p.x, p.x * -0.4],
                rotate: [0, 40, -25, 55],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <SoftPetal className="h-full w-full" />
            </motion.div>
          ))}
          {SPARKLES.map((s, i) => (
            <motion.span
              key={`s-${i}`}
              className="absolute rounded-full bg-[#F0D878]"
              style={{
                top: s.top,
                left: s.left,
                width: s.size,
                height: s.size,
                boxShadow: "0 0 8px rgba(240,216,120,0.7)",
              }}
              animate={{ opacity: [0.15, 0.95, 0.15], scale: [0.7, 1.25, 0.7] }}
              transition={{
                duration: 2.2,
                delay: s.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-5 py-12 sm:px-8 sm:py-14">
        <div className="relative w-full max-w-[21rem] sm:max-w-[23rem]">
          {/* Entrance bloom */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-80 sm:w-80"
            style={{
              background:
                "radial-gradient(circle, rgba(240,216,120,0.35) 0%, rgba(165,28,40,0.25) 40%, transparent 68%)",
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0], scale: [0.3, 1.2, 1.55] }}
            transition={{ duration: 1.05, ease: EASE }}
          />

          {!reduceMotion ? (
            <div
              aria-hidden
              className="pointer-events-none absolute top-1/2 left-1/2 z-0"
            >
              {BURST.map((p, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    width: p.size,
                    height: p.size * 1.35,
                    marginLeft: -p.size / 2,
                    marginTop: -(p.size * 1.35) / 2,
                  }}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.35, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: p.x,
                    y: p.y,
                    scale: [0.35, 1.1, 0.8],
                    rotate: p.rotate,
                  }}
                  transition={{
                    duration: 0.95,
                    delay: p.delay,
                    ease: EASE,
                  }}
                >
                  <SoftPetal className="h-full w-full" />
                </motion.div>
              ))}
            </div>
          ) : null}

          <motion.div
            className="relative z-20 -mb-6 flex justify-center sm:-mb-7"
            initial={{ opacity: 0, y: -28, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.22,
              type: "spring",
              stiffness: 280,
              damping: 16,
            }}
          >
            <motion.div
              animate={reduceMotion ? undefined : { scale: [1, 1.04, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <WaxSealMark className="h-14 w-14 drop-shadow-[0_10px_18px_rgba(40,8,12,0.5)] sm:h-16 sm:w-16" />
            </motion.div>
          </motion.div>

          <motion.article
            className="relative z-10 overflow-hidden rounded-2xl px-6 pt-10 pb-6 sm:px-8 sm:pt-11 sm:pb-7"
            style={{
              background: `linear-gradient(165deg, ${CREAM} 0%, #F8EDE0 55%, #F2E4D4 100%)`,
              boxShadow:
                "0 28px 56px -18px rgba(20,4,8,0.65), 0 0 0 1px rgba(201,162,74,0.35)",
            }}
            initial={{ opacity: 0, y: 40, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.18,
              type: "spring",
              stiffness: 210,
              damping: 18,
            }}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[11px] rounded-xl border"
              style={{ borderColor: "rgba(201,162,74,0.55)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-[15px] rounded-lg border opacity-50"
              style={{ borderColor: "rgba(201,162,74,0.28)" }}
            />

            <GoldCorner className="absolute top-2.5 left-2.5 h-10 w-10" />
            <GoldCorner className="absolute top-2.5 right-2.5 h-10 w-10 rotate-90" />
            <GoldCorner className="absolute bottom-2.5 left-2.5 h-10 w-10 -rotate-90 opacity-90" />
            <GoldCorner className="absolute right-2.5 bottom-2.5 h-10 w-10 rotate-180 opacity-90" />

            <motion.div variants={cardContent} initial="hidden" animate="show">
              <motion.h2
                variants={fadeUp}
                className="relative text-center font-serif text-[1.28rem] leading-[1.4] font-semibold sm:text-[1.45rem]"
                style={{ color: INK }}
              >
                Open all the treasures
                <br />
                and collect every reward.
              </motion.h2>

              <motion.p
                variants={fadeUp}
                className="relative mt-4 text-center font-serif text-[1.55rem] leading-none italic sm:mt-5 sm:text-[1.75rem]"
                style={{ color: ROSE }}
              >
                Are you ready?
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="relative mt-3 flex items-center justify-center gap-2.5"
                aria-hidden
              >
                <span
                  className="h-px w-10"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${GOLD})`,
                  }}
                />
                <motion.span
                  animate={reduceMotion ? undefined : { scale: [1, 1.28, 1] }}
                  transition={{
                    duration: 1.35,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
                    <path
                      d="M7 11S1.8 7.5.8 4.8C.1 3.2 1.2 1.4 3 1.4c1.1 0 2 .7 2.4 1.5C5.8 2.1 6.7 1.4 7.8 1.4c1.8 0 2.9 1.8 2.2 3.4C9.2 7.5 7 11 7 11Z"
                      fill={GOLD}
                    />
                  </svg>
                </motion.span>
                <span
                  className="h-px w-10"
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, transparent)`,
                  }}
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <motion.button
                  type="button"
                  onClick={onComplete}
                  className="relative mt-6 flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full px-5 py-3.5 text-[13px] font-bold tracking-[0.14em] text-white uppercase focus-visible:ring-2 focus-visible:ring-[#C9A24A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF8F0] focus-visible:outline-none sm:mt-7 sm:py-4 sm:text-sm"
                  style={{
                    background: `linear-gradient(180deg, #C42838 0%, ${ROSE} 45%, ${ROSE_DEEP} 100%)`,
                    boxShadow:
                      "0 12px 28px -10px rgba(100,16,24,0.7), inset 0 1px 0 rgba(255,255,255,0.22)",
                  }}
                  initial={{ scale: 0.92 }}
                  animate={{ scale: [0.92, 1.05, 1] }}
                  transition={{
                    delay: 1.05,
                    duration: 0.55,
                    ease: EASE,
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  aria-label="Yes, I'm ready"
                >
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.28) 50%, transparent 70%)",
                    }}
                    animate={
                      reduceMotion ? undefined : { x: ["-120%", "120%"] }
                    }
                    transition={{
                      duration: 2.4,
                      delay: 1.4,
                      repeat: Infinity,
                      repeatDelay: 1.8,
                      ease: "easeInOut",
                    }}
                  />
                  <span className="relative">Yes, I&apos;m Ready!</span>
                  <motion.span
                    aria-hidden
                    className="relative text-base leading-none"
                    animate={reduceMotion ? undefined : { x: [0, 4, 0] }}
                    transition={{
                      duration: 1.1,
                      delay: 1.3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </motion.div>

              <motion.p
                variants={fadeUp}
                className="relative mt-4 text-center font-serif text-[11px] leading-relaxed italic sm:text-xs"
                style={{ color: INK_SOFT }}
              >
                Once you open it, there&apos;s no turning back.
              </motion.p>
            </motion.div>
          </motion.article>
        </div>
      </div>
    </div>
  );
}
