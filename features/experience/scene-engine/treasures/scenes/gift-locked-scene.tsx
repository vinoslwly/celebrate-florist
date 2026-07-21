"use client";

import { motion } from "framer-motion";

import type { TreasuresSceneProps } from "@/features/experience/scene-engine/treasures/types";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const FALLING_PETALS = [
  { left: "8%", delay: 0.2, duration: 8.2, size: 14, x: 16 },
  { left: "22%", delay: 1.1, duration: 9, size: 11, x: -12 },
  { left: "48%", delay: 0.5, duration: 7.6, size: 15, x: 10 },
  { left: "68%", delay: 1.8, duration: 8.4, size: 12, x: -14 },
  { left: "84%", delay: 0.9, duration: 7.9, size: 13, x: 8 },
] as const;

const BURST_PETALS = [
  { x: -72, y: -28, rotate: -28, delay: 0.18, size: 16 },
  { x: 78, y: -36, rotate: 32, delay: 0.22, size: 14 },
  { x: -48, y: 40, rotate: -18, delay: 0.28, size: 12 },
  { x: 56, y: 48, rotate: 22, delay: 0.32, size: 13 },
  { x: 0, y: -64, rotate: 8, delay: 0.2, size: 15 },
] as const;

const cardContent = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.42 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: EASE_OUT },
  },
};

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

function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <path
        d="M8 40 C8 28 12 20 22 14 C18 22 20 28 28 32 C20 30 14 34 8 40Z"
        fill="#F4B8C8"
        opacity="0.85"
      />
      <path
        d="M10 38 C14 30 22 26 30 24"
        stroke="#E890A8"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="14" cy="34" r="2.2" fill="#F7A8BE" />
      <circle cx="22" cy="28" r="1.6" fill="#F7C4D4" />
    </svg>
  );
}

function SatinBowMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 56" className={className} aria-hidden fill="none">
      <defs>
        <linearGradient id="treasuresBow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFE4EE" />
          <stop offset="45%" stopColor="#F4A8C0" />
          <stop offset="100%" stopColor="#D86088" />
        </linearGradient>
      </defs>
      <ellipse
        cx="32"
        cy="26"
        rx="28"
        ry="16"
        fill="url(#treasuresBow)"
        transform="rotate(-18 32 26)"
      />
      <ellipse
        cx="88"
        cy="26"
        rx="28"
        ry="16"
        fill="url(#treasuresBow)"
        transform="rotate(18 88 26)"
      />
      <ellipse
        cx="32"
        cy="28"
        rx="10"
        ry="5"
        fill="rgba(140,40,70,0.18)"
        transform="rotate(-18 32 28)"
      />
      <ellipse
        cx="88"
        cy="28"
        rx="10"
        ry="5"
        fill="rgba(140,40,70,0.18)"
        transform="rotate(18 88 28)"
      />
      <ellipse cx="60" cy="26" rx="11" ry="9" fill="#E8789A" />
      <ellipse cx="57" cy="23" rx="4" ry="2.5" fill="rgba(255,255,255,0.4)" />
      <path
        d="M54 32 L46 50"
        stroke="#E07090"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M66 32 L74 50"
        stroke="#D06080"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Scene 3 Gift Locked — living recreation of Founder Treasures reference.
 * SPECIAL MESSAGE card · irreversible open warning · YES ♥ → Scene 4.
 */
export function TreasuresGiftLockedScene({ onComplete }: TreasuresSceneProps) {
  return (
    <div className="relative flex min-h-full w-full flex-1 overflow-hidden bg-[#F8E4E7]">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 90% at 30% 8%, rgba(255,255,255,0.75) 0%, transparent 45%), radial-gradient(ellipse 130% 100% at 50% 42%, #FFF9F7 0%, #FCF0F2 30%, #F7E0E6 58%, #F1D0D8 80%, #EBC4CE 100%)",
        }}
        initial={{ opacity: 0.55 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE_OUT }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[28%]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 100%, rgba(244,168,190,0.35) 0%, transparent 70%)",
        }}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {FALLING_PETALS.map((petal, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: petal.left,
              top: "-6%",
              width: petal.size,
              height: petal.size * 1.35,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.85, 0.85, 0],
              y: ["0vh", "110vh"],
              x: [0, petal.x, petal.x * -0.35],
              rotate: [0, 35, -20, 50],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay + 0.6,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Petal className="h-full w-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-full flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8">
        <div className="relative w-full max-w-[20.5rem] sm:max-w-[22rem]">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-72 sm:w-72"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.85) 0%, rgba(247,168,190,0.45) 35%, transparent 68%)",
            }}
            initial={{ opacity: 0, scale: 0.35 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.35, 1.15, 1.45] }}
            transition={{ duration: 0.95, ease: EASE_OUT }}
          />

          <div
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 z-0"
          >
            {BURST_PETALS.map((p, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  width: p.size,
                  height: p.size * 1.35,
                  marginLeft: -p.size / 2,
                  marginTop: -(p.size * 1.35) / 2,
                }}
                initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: p.x,
                  y: p.y,
                  scale: [0.4, 1.05, 0.85],
                  rotate: p.rotate,
                }}
                transition={{
                  duration: 0.85,
                  delay: p.delay,
                  ease: EASE_OUT,
                }}
              >
                <Petal className="h-full w-full" />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="relative z-10 mb-2 flex items-center justify-center gap-2 text-[#E8799A]"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.12,
              type: "spring",
              stiffness: 320,
              damping: 16,
            }}
          >
            <motion.span
              className="h-px w-10 bg-current opacity-60"
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.22, duration: 0.35, ease: EASE_OUT }}
              style={{ originX: 1 }}
            />
            <motion.span
              className="text-sm"
              aria-hidden
              animate={{ scale: [1, 1.25, 1] }}
              transition={{
                delay: 0.35,
                duration: 0.45,
                ease: EASE_OUT,
              }}
            >
              ♡
            </motion.span>
            <motion.span
              className="h-px w-10 bg-current opacity-60"
              aria-hidden
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.22, duration: 0.35, ease: EASE_OUT }}
              style={{ originX: 0 }}
            />
          </motion.div>

          <div className="relative z-10">
            <motion.div
              className="absolute -top-5 left-1/2 z-20 -translate-x-1/2 sm:-top-6"
              initial={{ opacity: 0, y: -28, scale: 0.65, rotate: -8 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.28,
                type: "spring",
                stiffness: 260,
                damping: 14,
              }}
            >
              <SatinBowMark className="h-12 w-28 drop-shadow-md sm:h-14 sm:w-32" />
            </motion.div>

            <motion.article
              className="relative overflow-hidden rounded-2xl border border-[#F0C0D0] bg-[#FFFCFB] px-6 pt-10 pb-6 shadow-[0_22px_50px_-20px_rgba(160,70,100,0.4)] sm:px-8 sm:pt-12 sm:pb-7"
              initial={{ opacity: 0, y: 32, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.18,
                type: "spring",
                stiffness: 220,
                damping: 20,
              }}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute inset-[10px] rounded-xl border border-[#F4D0DC]/80"
              />

              <CornerFlourish className="absolute top-3 left-3 h-9 w-9 opacity-90" />
              <CornerFlourish className="absolute top-3 right-3 h-9 w-9 rotate-90 opacity-90" />
              <CornerFlourish className="absolute bottom-3 left-3 h-9 w-9 -rotate-90 opacity-80" />
              <CornerFlourish className="absolute right-3 bottom-3 h-9 w-9 rotate-180 opacity-80" />

              <motion.div
                variants={cardContent}
                initial="hidden"
                animate="show"
              >
                <motion.p
                  variants={fadeUp}
                  className="relative text-center font-serif text-[10px] font-semibold tracking-[0.28em] text-[#E39AB0] uppercase sm:text-[11px]"
                >
                  Special Message
                </motion.p>

                <motion.h2
                  variants={fadeUp}
                  className="relative mt-5 text-center font-serif text-[1.35rem] leading-[1.45] font-semibold text-[#6B2A38] sm:mt-6 sm:text-[1.5rem]"
                >
                  Once you open it,
                  <br />
                  there&apos;s no turning back.
                  <br />
                  Are you ready?
                </motion.h2>

                <motion.div variants={fadeUp}>
                  <motion.button
                    type="button"
                    onClick={onComplete}
                    className="relative mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-[#E8799A] px-5 py-3.5 text-sm font-bold tracking-[0.18em] text-white uppercase shadow-[0_10px_24px_-10px_rgba(180,60,100,0.55)] focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:ring-offset-2 focus-visible:outline-none sm:text-[15px]"
                    initial={{ scale: 0.94 }}
                    animate={{ scale: [0.94, 1.04, 1] }}
                    transition={{
                      delay: 0.88,
                      duration: 0.55,
                      ease: EASE_OUT,
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Yes"
                  >
                    Yes
                    <motion.span
                      aria-hidden
                      className="text-base leading-none"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        delay: 1.15,
                        duration: 0.4,
                        ease: EASE_OUT,
                      }}
                    >
                      ♥
                    </motion.span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.article>
          </div>
        </div>
      </div>
    </div>
  );
}
