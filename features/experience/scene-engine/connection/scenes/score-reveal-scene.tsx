"use client";

import { useEffect, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import type { ConnectionSceneProps } from "@/features/experience/scene-engine/connection/types";
import { BloomGiftBox } from "@/features/experience/scene-engine/shared/bloom-gift-box";
import { BLOOM_CONNECTION_LAB_SCORE_RESULT } from "@/features/theme-lab/config/bloom-connection-fixtures";

const STATIC_PETALS = [
  { top: "8%", left: "12%", size: 16, rotate: -18 },
  { top: "14%", left: "78%", size: 14, rotate: 22 },
  { top: "42%", left: "4%", size: 13, rotate: 8 },
  { top: "48%", left: "90%", size: 15, rotate: -14 },
  { top: "72%", left: "10%", size: 12, rotate: 20 },
  { top: "78%", left: "82%", size: 14, rotate: -10 },
] as const;

function PetalMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden fill="none">
      <path
        d="M12 2C8 8 4 14 6 22c2 5 10 8 12 2 2-7-1-14-6-22Z"
        fill="#F7A8BE"
        opacity="0.88"
      />
    </svg>
  );
}

function FlowerMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden fill="none">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <ellipse
          key={deg}
          cx="14"
          cy="6"
          rx="3.2"
          ry="5.5"
          fill="#E8799A"
          transform={`rotate(${deg} 14 14)`}
        />
      ))}
      <circle cx="14" cy="14" r="3" fill="#FFF4E0" />
    </svg>
  );
}

/** Gold corner filigree — compact SVG, no heavy filters. */
function CornerFiligree({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden fill="none">
      <path
        d="M6 42 C8 28 14 18 28 12 C22 18 20 26 28 34 C20 30 12 34 6 42Z"
        stroke="#C9A24A"
        strokeWidth="1.2"
        opacity="0.85"
      />
      <path
        d="M10 38 C16 30 24 26 34 24"
        stroke="#D4B56A"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="14" cy="34" r="1.4" fill="#C9A24A" />
      <circle cx="22" cy="28" r="1.1" fill="#D4B56A" />
    </svg>
  );
}

function CrestMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden fill="none">
      <path
        d="M20 4 C18 8 14 10 12 12 C16 11 18 14 20 18 C22 14 24 11 28 12 C26 10 22 8 20 4Z"
        fill="#C9A24A"
        opacity="0.9"
      />
      <path
        d="M8 14 C12 12 16 13 20 16 C24 13 28 12 32 14"
        stroke="#D4B56A"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

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

/**
 * connection.score-reveal — living Founder Scene 8.
 * Warm celebratory tone (CF-1). CTA does not name the letter reward.
 */
export function ConnectionScoreRevealScene({
  payload,
  onComplete,
}: ConnectionSceneProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const result = payload.scoreResult ?? BLOOM_CONNECTION_LAB_SCORE_RESULT;
  const displayPercent = useCountUp(result.percent, !reduceMotion);

  return (
    <div className="relative flex min-h-full w-full flex-1 overflow-hidden bg-[#F7F0EA]">
      <style>{`
        @keyframes sr-sparkle {
          0%, 100% { opacity: 0.35; transform: scale(0.85); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @media (prefers-reduced-motion: reduce) {
          .sr-anim-sparkle { animation: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 110% 90% at 50% 40%, #FFFCFA 0%, #F7F0EA 50%, #EDE0D8 100%)",
        }}
      />

      {/* Torn paper / fabric corners */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 h-28 w-32 sm:h-36 sm:w-40"
        style={{
          background:
            "linear-gradient(135deg, rgba(232,210,200,0.95) 0%, transparent 72%)",
          clipPath: "polygon(0 0, 100% 0, 75% 40%, 100% 70%, 0 80%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 bottom-0 h-32 w-36 sm:h-40 sm:w-44"
        style={{
          background:
            "linear-gradient(315deg, rgba(232,210,200,0.9) 0%, transparent 72%)",
          clipPath: "polygon(100% 100%, 0 100%, 25% 60%, 0 30%, 100% 20%)",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0">
        {STATIC_PETALS.map((p, i) => (
          <div
            key={i}
            className="absolute opacity-75"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size * 1.35,
              transform: `rotate(${p.rotate}deg)`,
            }}
          >
            <PetalMark className="h-full w-full" />
          </div>
        ))}
      </div>

      {/* Soft sparkles */}
      {!reduceMotion
        ? [
            { top: "22%", left: "18%", delay: "0s" },
            { top: "28%", left: "78%", delay: "0.5s" },
            { top: "62%", left: "14%", delay: "0.9s" },
            { top: "68%", left: "82%", delay: "0.3s" },
          ].map((s, i) => (
            <span
              key={i}
              aria-hidden
              className="sr-anim-sparkle pointer-events-none absolute text-[10px] text-[#C9A24A]"
              style={{
                top: s.top,
                left: s.left,
                animation: `sr-sparkle 2.6s ease-in-out ${s.delay} infinite`,
              }}
            >
              ✦
            </span>
          ))
        : null}

      <div className="relative z-10 flex min-h-full flex-1 flex-col items-center justify-center px-5 py-10 sm:px-8 sm:py-12">
        <motion.div
          className="relative w-full max-w-[22rem] sm:max-w-md"
          initial={reduceMotion ? false : { opacity: 0, y: 22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: easeOut }}
        >
          {/* Soft pink backing layer */}
          <div
            aria-hidden
            className="absolute inset-x-3 top-4 bottom-2 rounded-2xl bg-[#F5D0DC]/70 sm:inset-x-4"
          />

          {/* Scalloped ornate card */}
          <div
            className="relative px-6 pt-10 pb-8 sm:px-8 sm:pt-12 sm:pb-10"
            style={{
              background: "#FFFCFA",
              borderRadius: "48% 48% 42% 42% / 18% 18% 14% 14%",
              boxShadow:
                "0 22px 50px -18px rgba(140,70,90,0.28), 0 0 0 1px rgba(201,162,74,0.25)",
            }}
          >
            {/* Gold inner frame */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-4 rounded-[40%] sm:inset-5"
              style={{
                border: "1.5px solid rgba(201,162,74,0.55)",
                borderRadius: "40% 40% 36% 36% / 14% 14% 12% 12%",
              }}
            />

            <CrestMark className="absolute top-3 left-1/2 h-5 w-9 -translate-x-1/2 sm:top-4 sm:h-6 sm:w-10" />

            <CornerFiligree className="absolute top-6 left-5 h-9 w-9 sm:top-7 sm:left-6 sm:h-10 sm:w-10" />
            <CornerFiligree className="absolute top-6 right-5 h-9 w-9 scale-x-[-1] sm:top-7 sm:right-6 sm:h-10 sm:w-10" />
            <CornerFiligree className="absolute bottom-6 left-5 h-9 w-9 scale-y-[-1] sm:bottom-7 sm:left-6 sm:h-10 sm:w-10" />
            <CornerFiligree className="absolute right-5 bottom-6 h-9 w-9 -scale-100 sm:right-6 sm:bottom-7 sm:h-10 sm:w-10" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <p
                className="font-serif text-[3.4rem] leading-none font-semibold tracking-tight text-[#C45B7A] sm:text-[4.25rem]"
                aria-live="polite"
              >
                {displayPercent}%
              </p>

              <div className="mt-4 mb-4 flex items-center justify-center gap-3 text-[#C9A24A]">
                <span
                  className="h-px w-12 bg-current opacity-70 sm:w-16"
                  aria-hidden
                />
                <span className="text-sm text-[#E8799A]" aria-hidden>
                  ♥
                </span>
                <span
                  className="h-px w-12 bg-current opacity-70 sm:w-16"
                  aria-hidden
                />
              </div>

              <h1 className="max-w-[16rem] font-serif text-xl leading-snug font-semibold text-[#4A3036] sm:max-w-xs sm:text-2xl">
                {result.headline}
              </h1>

              <FlowerMark className="mt-4 h-6 w-6 opacity-90" />

              <p className="mt-3 max-w-[17rem] font-serif text-sm leading-relaxed text-[#8A6A72] sm:max-w-xs sm:text-base">
                {result.message}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.button
          type="button"
          onClick={onComplete}
          className="mt-8 flex w-full max-w-[22rem] items-center justify-center gap-2.5 rounded-full px-6 py-[1.05rem] font-serif text-lg font-semibold text-white shadow-[0_16px_36px_-10px_rgba(160,50,80,0.5)] focus-visible:ring-2 focus-visible:ring-[#C45B7A] focus-visible:ring-offset-2 focus-visible:outline-none sm:mt-10 sm:max-w-md sm:py-5 sm:text-xl"
          style={{
            background:
              "linear-gradient(180deg, #ED8AA8 0%, #D46888 48%, #C0456E 100%)",
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: easeOut }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          aria-label="Reveal my gift"
        >
          <BloomGiftBox variant="closed" className="h-6 w-6 shrink-0" />
          Reveal My Gift
          <span aria-hidden className="text-xl leading-none">
            →
          </span>
        </motion.button>
      </div>
    </div>
  );
}
