"use client";

import { motion } from "framer-motion";

import type { MomentsSceneProps } from "@/features/experience/scene-engine/moments/types";
import { SCENE_VIEWPORT_LOCK } from "@/features/experience/scene-engine/scene-viewport";

const ASSETS = {
  cornerTl: "/themes/bloom/moments/scene-01-corner-tl.webp",
  cornerTr: "/themes/bloom/moments/scene-01-corner-tr.webp",
  cornerBl: "/themes/bloom/moments/scene-01-corner-bl.webp",
  cornerBr: "/themes/bloom/moments/scene-01-corner-br.webp",
} as const;

const TITLE = "CELEBRATE";
const TAGLINE = "every moment deserves to be celebrated";

/** Soft five-petal sakura mark — matches Scene 1 reference icon. */
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

function Petal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.9"
      />
      <path
        d="M12 6c-1.5 4-3 8-2.2 13"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

const FALLING_PETALS = [
  { left: "12%", delay: 0, duration: 7.5, size: 18, x: 18 },
  { left: "28%", delay: 1.1, duration: 8.2, size: 14, x: -12 },
  { left: "45%", delay: 0.4, duration: 6.8, size: 20, x: 10 },
  { left: "62%", delay: 1.8, duration: 7.9, size: 16, x: -18 },
  { left: "78%", delay: 0.9, duration: 8.5, size: 15, x: 14 },
  { left: "88%", delay: 2.2, duration: 7.1, size: 12, x: -8 },
  { left: "35%", delay: 2.8, duration: 9, size: 13, x: 22 },
  { left: "70%", delay: 3.4, duration: 7.6, size: 17, x: -14 },
] as const;

/**
 * moments.celebrate-loading — living recreation of Founder Scene 1 reference.
 * Real HTML typography + motion; reference art used only as atmosphere/corners.
 */
export function CelebrateLoadingScene(_props: MomentsSceneProps) {
  return (
    <div className={`${SCENE_VIEWPORT_LOCK} bg-[#FFF5F2]`}>
      {/* Warm base + living light — no pasted splash / no baked text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FFF9F5] via-[#FFF2EC] to-[#FFE6DC]"
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 -left-1/4 h-[80%] w-[80%] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, rgba(255,245,242,0) 65%)",
        }}
        animate={{ opacity: [0.45, 0.85, 0.45], rotate: [0, 8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "conic-gradient(from 210deg at 18% 8%, rgba(255,255,255,0.35), transparent 18%, transparent 100%)",
        }}
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Corner blossom clusters — gentle sway */}
      <motion.div
        className="pointer-events-none absolute top-0 left-0 w-[42%] max-w-sm sm:w-[34%]"
        initial={{ opacity: 0, x: -16, y: -12 }}
        animate={{
          opacity: 1,
          x: [0, 4, 0],
          y: [0, 6, 0],
          rotate: [0, 1.2, 0],
        }}
        transition={{
          opacity: { duration: 0.8 },
          x: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.cornerTl}
          alt=""
          className="h-auto w-full object-contain [mask-image:linear-gradient(to_bottom_right,black_45%,transparent_88%)]"
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute top-0 right-0 w-[42%] max-w-sm sm:w-[34%]"
        initial={{ opacity: 0, x: 16, y: -12 }}
        animate={{
          opacity: 1,
          x: [0, -4, 0],
          y: [0, 5, 0],
          rotate: [0, -1.2, 0],
        }}
        transition={{
          opacity: { duration: 0.8, delay: 0.1 },
          x: { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          y: { duration: 7.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 },
          rotate: {
            duration: 7.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.cornerTr}
          alt=""
          className="h-auto w-full object-contain [mask-image:linear-gradient(to_bottom_left,black_45%,transparent_88%)]"
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute bottom-0 left-0 w-[38%] max-w-xs sm:w-[30%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.95, y: [0, -5, 0], rotate: [0, -0.8, 0] }}
        transition={{
          opacity: { duration: 0.9, delay: 0.15 },
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.cornerBl}
          alt=""
          className="h-auto w-full object-contain [mask-image:linear-gradient(to_top_right,black_40%,transparent_88%)]"
        />
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-0 bottom-0 w-[38%] max-w-xs sm:w-[30%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.95, y: [0, -6, 0], rotate: [0, 0.8, 0] }}
        transition={{
          opacity: { duration: 0.9, delay: 0.2 },
          y: { duration: 8.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
          rotate: {
            duration: 8.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          },
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ASSETS.cornerBr}
          alt=""
          className="h-auto w-full object-contain [mask-image:linear-gradient(to_top_left,black_40%,transparent_88%)]"
        />
      </motion.div>

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
              top: "-8%",
              width: petal.size,
              height: petal.size * 1.35,
            }}
            initial={{ opacity: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [0, 0.85, 0.85, 0],
              y: ["0vh", "110vh"],
              x: [0, petal.x, petal.x * -0.4, petal.x],
              rotate: [0, 40, -25, 60],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Petal className="h-full w-full drop-shadow-sm" />
          </motion.div>
        ))}
      </div>

      {/* Brand center — real HTML */}
      <div className="relative z-10 flex min-h-full flex-col items-center justify-center px-6 text-center">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            animate={{ y: [0, -6, 0], rotate: [0, 4, -3, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <SakuraMark className="h-12 w-12 drop-shadow-sm sm:h-14 sm:w-14" />
          </motion.div>

          <h1
            className="mt-5 font-serif text-[2rem] font-semibold tracking-[0.28em] text-[#5D4B46] uppercase sm:text-5xl sm:tracking-[0.32em]"
            aria-label="celebrate"
          >
            {TITLE.split("").map((letter, i) => (
              <motion.span
                key={`${letter}-${i}`}
                className="inline-block"
                initial={{ opacity: 0, y: 14 }}
                animate={{
                  opacity: 1,
                  y: [0, -3, 0],
                }}
                transition={{
                  opacity: { duration: 0.4, delay: 0.2 + i * 0.05 },
                  y: {
                    duration: 3.2,
                    delay: 0.8 + i * 0.08,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </h1>

          <motion.div
            className="mt-5 flex items-center gap-3 text-[#E8A0B4]"
            initial={{ opacity: 0, scaleX: 0.6 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.55, delay: 0.55 }}
          >
            <span className="h-px w-10 bg-current sm:w-14" aria-hidden />
            <span className="text-[10px] tracking-[0.35em]" aria-hidden>
              ❦
            </span>
            <SakuraMark className="h-3.5 w-3.5" />
            <span className="text-[10px] tracking-[0.35em]" aria-hidden>
              ❦
            </span>
            <span className="h-px w-10 bg-current sm:w-14" aria-hidden />
          </motion.div>

          <motion.p
            className="mt-5 max-w-sm font-serif text-sm tracking-[0.06em] text-[#5D4B46]/90 sm:text-base sm:tracking-[0.08em]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: [0.75, 1, 0.75], y: [0, -4, 0] }}
            transition={{
              opacity: {
                duration: 4.5,
                delay: 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              },
              y: {
                duration: 4.5,
                delay: 0.7,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            {TAGLINE}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
